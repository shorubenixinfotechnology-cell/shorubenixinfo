import razorpay
import hmac
import hashlib
import pymongo
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime, timezone
from config.database import db, get_next_sequence_value
from config.settings import settings
from middleware.auth import get_current_user, get_optional_user

router = APIRouter(prefix="/payments", tags=["Payments"])

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


class CreateOrderRequest(BaseModel):
    amount: float
    description: str | None = "Service Payment"
    project_id: int | None = None


class VerifyPaymentRequest(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: str | None = None
    razorpay_signature: str | None = None
    amount: float | None = None


@router.post("/create-order")
async def create_order(data: CreateOrderRequest, current_user=Depends(get_optional_user)):
    try:
        # Create Razorpay order
        amount_paise = int(data.amount * 100)
        receipt = f"rcpt_{int(__import__('time').time())}"

        order_data = {
            "amount": amount_paise,
            "currency": "INR",
            "receipt": receipt,
            "notes": {
                "description": data.description,
                "user_id": str(current_user["id"]) if current_user else "guest",
                "project_id": str(data.project_id) if data.project_id else None
            }
        }

        order = razorpay_client.order.create(data=order_data)

        # Store payment record
        user_id = current_user["id"] if current_user else None
        payment_id = get_next_sequence_value("payments_id")
        
        db.payments.insert_one({
            "id": payment_id,
            "user_id": user_id,
            "project_id": data.project_id,
            "razorpay_order_id": order["id"],
            "razorpay_payment_id": None,
            "razorpay_signature": None,
            "amount": data.amount,
            "currency": "INR",
            "status": "created",
            "description": data.description,
            "receipt": receipt,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        })

        return {
            "order_id": order["id"],
            "amount": amount_paise,
            "currency": "INR",
            "key_id": settings.RAZORPAY_KEY_ID,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")


@router.post("/verify")
async def verify_payment(data: VerifyPaymentRequest, current_user=Depends(get_optional_user)):
    try:
        # Verify signature if provided
        if data.razorpay_order_id and data.razorpay_signature:
            generated_signature = hmac.new(
                settings.RAZORPAY_KEY_SECRET.encode(),
                f"{data.razorpay_order_id}|{data.razorpay_payment_id}".encode(),
                hashlib.sha256
            ).hexdigest()

            if generated_signature != data.razorpay_signature:
                # Update payment status to failed
                db.payments.update_one(
                    {"razorpay_order_id": data.razorpay_order_id},
                    {"$set": {"status": "failed", "updated_at": datetime.now(timezone.utc)}}
                )
                raise HTTPException(status_code=400, detail="Payment verification failed")

        # Update payment record
        if data.razorpay_order_id:
            db.payments.update_one(
                {"razorpay_order_id": data.razorpay_order_id},
                {
                    "$set": {
                        "razorpay_payment_id": data.razorpay_payment_id,
                        "razorpay_signature": data.razorpay_signature,
                        "status": "completed",
                        "updated_at": datetime.now(timezone.utc)
                    }
                }
            )
        else:
            # Direct payment without order
            user_id = current_user["id"] if current_user else None
            payment_id = get_next_sequence_value("payments_id")
            db.payments.insert_one({
                "id": payment_id,
                "user_id": user_id,
                "razorpay_payment_id": data.razorpay_payment_id,
                "amount": data.amount or 0,
                "status": "completed",
                "description": "Direct Payment",
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc)
            })

        # If it was a project purchase, record ownership
        if data.razorpay_order_id:
            payment = db.payments.find_one({"razorpay_order_id": data.razorpay_order_id})
            if payment and payment.get("project_id") and payment.get("user_id"):
                try:
                    up_id = get_next_sequence_value("user_projects_id")
                    db.user_projects.insert_one({
                        "id": up_id,
                        "user_id": payment["user_id"],
                        "project_id": payment["project_id"],
                        "payment_id": payment["id"],
                        "purchased_at": datetime.now(timezone.utc)
                    })
                except pymongo.errors.DuplicateKeyError:
                    pass

        return {"message": "Payment verified successfully", "payment_id": data.razorpay_payment_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification error: {str(e)}")


@router.get("")
async def get_payments(current_user=Depends(get_current_user)):
    payments_cursor = db.payments.find({"user_id": current_user["id"]}).sort("created_at", -1)
    payments = []
    for doc in payments_cursor:
        doc_dict = dict(doc)
        if "_id" in doc_dict:
            del doc_dict["_id"]
        payments.append(doc_dict)
    return {"payments": payments}


@router.put("/{payment_id}")
async def update_payment_status(payment_id: int, current_user=Depends(get_current_user)):
    payment = db.payments.find_one_and_update(
        {"id": payment_id},
        {"$set": {"status": "completed", "updated_at": datetime.now(timezone.utc)}},
        return_document=True
    )
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
        
    payment_dict = dict(payment)
    if "_id" in payment_dict:
        del payment_dict["_id"]
    return {"message": "Payment status updated", "payment": payment_dict}
