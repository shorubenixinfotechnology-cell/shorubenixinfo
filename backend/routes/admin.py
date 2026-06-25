from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime, timezone
from config.database import db, get_next_sequence_value
from middleware.auth import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/analytics")
async def get_analytics(current_user=Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    # Get user count
    user_count = db.users.count_documents({})
    
    # Get payment stats using aggregation
    payment_stats = list(db.payments.aggregate([
        {"$match": {"status": "completed"}},
        {"$group": {"_id": None, "count": {"$sum": 1}, "total": {"$sum": "$amount"}}}
    ]))
    
    total_payments = payment_stats[0]["count"] if payment_stats else 0
    total_revenue = float(payment_stats[0]["total"]) if payment_stats else 0.0

    # Get contact count
    contact_count = db.contacts.count_documents({})
    
    # Get project count
    project_count = db.projects.count_documents({"status": "active"})
    
    # Recent analytics events
    recent_events_cursor = db.analytics.find({}).sort("created_at", -1).limit(20)
    recent_events = []
    for doc in recent_events_cursor:
        doc_dict = dict(doc)
        if "_id" in doc_dict:
            del doc_dict["_id"]
        recent_events.append(doc_dict)

    return {
        "analytics": {
            "total_users": user_count,
            "total_revenue": total_revenue,
            "total_payments": total_payments,
            "total_contacts": contact_count,
            "total_projects": project_count,
            "recent_events": recent_events,
        }
    }


@router.get("/users")
async def get_users(current_user=Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    users_cursor = db.users.find({}).sort("created_at", -1)
    users = []
    for doc in users_cursor:
        doc_dict = dict(doc)
        if "_id" in doc_dict:
            del doc_dict["_id"]
        if "password_hash" in doc_dict:
            del doc_dict["password_hash"]
        users.append(doc_dict)
    return {"users": users}


@router.get("/user-projects")
async def get_all_user_projects(current_user=Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    users = list(db.users.find({}))
    results = []
    
    # Cache projects for mapping
    all_projects = {p["id"]: p for p in db.projects.find({})}
    
    for u in users:
        # Find last session
        last_sess = db.user_sessions.find_one(
            {"user_id": u["id"]},
            sort=[("created_at", -1)]
        )
        last_login = last_sess["created_at"] if last_sess else None
        
        # Find user projects
        ups = list(db.user_projects.find({"user_id": u["id"]}))
        if not ups:
            results.append({
                "user_id": u["id"],
                "user_name": u["name"],
                "user_email": u["email"],
                "user_phone": u.get("phone"),
                "project_id": None,
                "project_title": None,
                "project_category": None,
                "purchased_at": None,
                "last_login": last_login,
                "created_at": u["created_at"]
            })
        else:
            for up in ups:
                proj = all_projects.get(up["project_id"])
                results.append({
                    "user_id": u["id"],
                    "user_name": u["name"],
                    "user_email": u["email"],
                    "user_phone": u.get("phone"),
                    "project_id": up["project_id"],
                    "project_title": proj["title"] if proj else None,
                    "project_category": proj["category"] if proj else None,
                    "purchased_at": up.get("purchased_at"),
                    "last_login": last_login,
                    "created_at": u["created_at"]
                })
                
    # Sort results: by last_login DESC (nulls last), then created_at DESC
    def sort_key(item):
        login_val = item["last_login"] or datetime.min
        created_val = item["created_at"] or datetime.min
        has_login = 1 if item["last_login"] is not None else 0
        return (has_login, login_val, created_val)
        
    results.sort(key=sort_key, reverse=True)
    
    # Clean output
    for r in results:
        if "created_at" in r:
            del r["created_at"]
            
    return {"user_projects": results}


class NotificationCreate(BaseModel):
    user_id: int | None = None
    title: str
    message: str | None = None
    type: str = "info"


@router.post("/notifications")
async def send_notification(data: NotificationCreate, current_user=Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    if data.user_id:
        n_id = get_next_sequence_value("notifications_id")
        db.notifications.insert_one({
            "id": n_id,
            "user_id": data.user_id,
            "title": data.title,
            "message": data.message,
            "type": data.type,
            "is_read": False,
            "created_at": datetime.now(timezone.utc)
        })
    else:
        # Send to all active users
        users = list(db.users.find({"is_active": True}, {"id": 1}))
        notifications = []
        for u in users:
            n_id = get_next_sequence_value("notifications_id")
            notifications.append({
                "id": n_id,
                "user_id": u["id"],
                "title": data.title,
                "message": data.message,
                "type": data.type,
                "is_read": False,
                "created_at": datetime.now(timezone.utc)
            })
        if notifications:
            db.notifications.insert_many(notifications)
            
    return {"message": "Notification sent successfully"}


@router.get("/complaints")
async def get_complaints(current_user=Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    complaints_cursor = db.complaints.find({}).sort("created_at", -1)
    complaints = []
    for doc in complaints_cursor:
        doc_dict = dict(doc)
        if "_id" in doc_dict:
            del doc_dict["_id"]
        complaints.append(doc_dict)
    return {"complaints": complaints}


@router.get("/logs")
async def get_system_logs(current_user=Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    logs_cursor = db.system_logs.find({}).sort("created_at", -1).limit(100)
    logs = []
    for doc in logs_cursor:
        doc_dict = dict(doc)
        if "_id" in doc_dict:
            del doc_dict["_id"]
        logs.append(doc_dict)
    return {"logs": logs}


@router.get("/newsletter")
async def get_subscribers(current_user=Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    subscribers_cursor = db.newsletter_subscribers.find({"is_active": True}).sort("subscribed_at", -1)
    subscribers = []
    for doc in subscribers_cursor:
        doc_dict = dict(doc)
        if "_id" in doc_dict:
            del doc_dict["_id"]
        subscribers.append(doc_dict)
    return {"subscribers": subscribers}


@router.put("/users/{user_id}/status")
async def toggle_user_status(user_id: int, current_user=Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    user = db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    new_status = not user.get("is_active", True)
    db.users.update_one({"id": user_id}, {"$set": {"is_active": new_status, "updated_at": datetime.now(timezone.utc)}})
    
    return {"message": "User status updated", "is_active": new_status}


@router.delete("/users/{user_id}")
async def delete_user(user_id: int, current_user=Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
        
    user = db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    db.users.delete_one({"id": user_id})
    db.user_projects.delete_many({"user_id": user_id})
    db.user_sessions.delete_many({"user_id": user_id})
    
    return {"message": "User deleted successfully"}


class RoleUpdateRequest(BaseModel):
    role: str


@router.put("/users/{user_id}/role")
async def update_user_role(user_id: int, data: RoleUpdateRequest, current_user=Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
        
    if data.role not in ("admin", "user"):
        raise HTTPException(status_code=400, detail="Invalid role")
        
    user = db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    db.users.update_one({"id": user_id}, {"$set": {"role": data.role, "updated_at": datetime.now(timezone.utc)}})
    return {"message": "User role updated successfully", "role": data.role}
