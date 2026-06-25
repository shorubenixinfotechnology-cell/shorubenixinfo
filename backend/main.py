import logging
import sys
import os

# Ensure backend directory is in path
sys.path.insert(0, os.path.dirname(__file__))

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from config.settings import settings
from config.database import init_database
from routes.auth import router as auth_router
from routes.projects import router as projects_router
from routes.payments import router as payments_router
from routes.contacts import router as contacts_router
from routes.blog import router as blog_router
from routes.services import router as services_router
from routes.admin import router as admin_router


# Rate limiter
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("ShoRubenix Backend Starting...")
    try:
        init_database()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization error: {e}")
        logger.warning("Server will continue without database. Some features may be limited.")
    yield
    # Shutdown
    logger.info("ShoRubenix Backend Shutting Down...")


app = FastAPI(
    title="ShoRubenix Infotech API",
    description="Backend API for ShoRubenix Freelancer IT Website",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for production flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limit error handler
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests. Please slow down."}
    )

app.state.limiter = limiter


# Global error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import traceback
    logger.error(f"Internal server error: {exc}")
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc), "traceback": traceback.format_exc()}
    )


# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(projects_router, prefix="/api")
app.include_router(payments_router, prefix="/api")
app.include_router(contacts_router, prefix="/api")
app.include_router(blog_router, prefix="/api")
app.include_router(services_router, prefix="/api")
app.include_router(admin_router, prefix="/api")


@app.get("/")
async def root():
    return {
        "name": "ShoRubenix Infotech API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "ShoRubenix Backend"}


# Analytics tracking endpoint
@app.post("/api/analytics/track")
async def track_event(request: Request):
    try:
        body = await request.json()
        from config.database import db, get_next_sequence_value
        from datetime import datetime, timezone
        
        analytics_id = get_next_sequence_value("analytics_id")
        db.analytics.insert_one({
            "id": analytics_id,
            "event_type": body.get("event_type", "page_view"),
            "page": body.get("page", "/"),
            "ip_address": request.client.host if request.client else None,
            "user_agent": request.headers.get("user-agent"),
            "metadata": body.get("metadata", {}),
            "created_at": datetime.now(timezone.utc)
        })
        return {"message": "Event tracked"}
    except Exception:
        return {"message": "Tracking skipped"}


# Newsletter subscription
@app.post("/api/newsletter/subscribe")
async def subscribe_newsletter(request: Request):
    try:
        body = await request.json()
        email = body.get("email")
        name = body.get("name", "")
        if not email:
            return JSONResponse(status_code=400, content={"detail": "Email is required"})

        from config.database import db, get_next_sequence_value
        # Check if exists
        existing = db.newsletter_subscribers.find_one({"email": email})
        if existing:
            db.newsletter_subscribers.update_one(
                {"email": email},
                {"$set": {"name": name, "is_active": True}}
            )
        else:
            sub_id = get_next_sequence_value("newsletter_subscribers_id")
            db.newsletter_subscribers.insert_one({
                "id": sub_id,
                "email": email,
                "name": name,
                "is_active": True,
                "subscribed_at": datetime.now(timezone.utc)
            })
        return {"message": "Subscribed successfully"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})


if __name__ == "__main__":
    import uvicorn
    # Use 0.0.0.0 for containerized environments like Railway
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
