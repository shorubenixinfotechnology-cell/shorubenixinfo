from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timezone
from config.database import db, get_next_sequence_value

router = APIRouter(prefix="/contacts", tags=["Contacts"])


class ContactCreate(BaseModel):
    name: str
    email: str
    phone: str | None = None
    subject: str | None = None
    message: str


@router.post("")
async def submit_contact(data: ContactCreate):
    contact_id = get_next_sequence_value("contacts_id")
    new_contact = {
        "id": contact_id,
        "name": data.name,
        "email": data.email,
        "phone": data.phone,
        "subject": data.subject,
        "message": data.message,
        "status": "unread",
        "created_at": datetime.now(timezone.utc)
    }
    db.contacts.insert_one(new_contact)

    # Log the contact
    log_id = get_next_sequence_value("system_logs_id")
    db.system_logs.insert_one({
        "id": log_id,
        "level": "info",
        "message": f"New contact from {data.name} ({data.email})",
        "source": "contact",
        "created_at": datetime.now(timezone.utc)
    })

    return {
        "message": "Message sent successfully",
        "contact": {
            "id": contact_id,
            "name": data.name,
            "email": data.email,
            "created_at": new_contact["created_at"]
        }
    }


@router.get("")
async def get_contacts():
    contacts_cursor = db.contacts.find({}).sort("created_at", -1)
    contacts = []
    for doc in contacts_cursor:
        doc_dict = dict(doc)
        if "_id" in doc_dict:
            del doc_dict["_id"]
        contacts.append(doc_dict)
    return {"contacts": contacts}
