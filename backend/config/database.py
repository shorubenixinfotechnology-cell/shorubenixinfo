import pymongo
import logging
from contextlib import contextmanager
from config.settings import settings
from middleware.auth import hash_password

logger = logging.getLogger(__name__)

# Initialize pymongo client
client = pymongo.MongoClient(settings.MONGODB_URI)
db = client[settings.MONGODB_DB]

@contextmanager
def get_db():
    """Context manager for MongoDB database access."""
    # PyMongo client handles connection pooling automatically,
    # so we just yield the database instance.
    yield db

def get_next_sequence_value(sequence_name: str) -> int:
    """Generate an auto-incrementing integer ID for a collection."""
    counter = db["counters"].find_one_and_update(
        {"_id": sequence_name},
        {"$inc": {"sequence_value": 1}},
        upsert=True,
        return_document=pymongo.ReturnDocument.AFTER
    )
    return counter["sequence_value"]

def init_database():
    """Create collections, set up indexes, and seed default data."""
    try:
        # Create unique indexes
        db.users.create_index("email", unique=True)
        db.admin_users.create_index("email", unique=True)
        db.admin_users.create_index("username", unique=True)
        db.newsletter_subscribers.create_index("email", unique=True)
        db.blog_posts.create_index("slug", unique=True)
        db.user_projects.create_index([("user_id", 1), ("project_id", 1)], unique=True)
        db.otps.create_index([("email", 1), ("purpose", 1)], unique=False)
        db.otps.create_index("expires_at", expireAfterSeconds=0) # TTL index for auto-deletion of expired OTPs!

        logger.info("MongoDB indexes initialized successfully!")

        # Seed default admin if none exists
        admin_count = db.admin_users.count_documents({})
        if admin_count == 0:
            logger.info("Seeding default admin...")
            pwd_hash = hash_password("admin123")
            admin_id = get_next_sequence_value("admin_users_id")
            from datetime import datetime, timezone
            db.admin_users.insert_one({
                "id": admin_id,
                "username": "Admin",
                "email": "admin@shorubenix.com",
                "password_hash": pwd_hash,
                "role": "admin",
                "is_active": True,
                "created_at": datetime.now(timezone.utc)
            })
            logger.info("Default admin created: admin@shorubenix.com / admin123")

    except Exception as e:
        logger.error(f"Error initializing MongoDB database: {e}")
        raise

def execute_query(query, params=None, fetch_one=False, fetch_all=False):
    """Fallback function for deprecated SQL queries."""
    raise NotImplementedError("This application has been migrated to MongoDB. Use PyMongo collections directly instead of execute_query.")
