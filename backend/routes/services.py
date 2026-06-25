from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime, timezone
from config.database import db, get_next_sequence_value
from middleware.auth import get_current_user

router = APIRouter(prefix="/services", tags=["Services"])


@router.get("")
async def get_services():
    # Find active services and sort by sort_order ASC, then created_at DESC
    services_cursor = db.services.find({"is_active": True}).sort([("sort_order", 1), ("created_at", -1)])
    services = []
    for doc in services_cursor:
        doc_dict = dict(doc)
        if "_id" in doc_dict:
            del doc_dict["_id"]
        services.append(doc_dict)
    return {"services": services}


class ServiceCreate(BaseModel):
    title: str
    description: str | None = None
    icon: str | None = None
    price: float | None = None
    category: str | None = None
    features: list[str] = []


@router.post("")
async def create_service(data: ServiceCreate, current_user=Depends(get_current_user)):
    service_id = get_next_sequence_value("services_id")
    new_service = {
        "id": service_id,
        "title": data.title,
        "description": data.description,
        "icon": data.icon,
        "price": data.price,
        "category": data.category,
        "features": data.features,
        "is_active": True,
        "sort_order": 0,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    db.services.insert_one(new_service)
    
    return {
        "message": "Service created",
        "service": {
            "id": service_id,
            "title": data.title,
            "created_at": new_service["created_at"]
        }
    }
