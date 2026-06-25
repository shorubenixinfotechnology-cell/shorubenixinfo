from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone
from config.database import db, get_next_sequence_value
from middleware.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    decode_token
)
from utils.email import generate_otp, send_otp_email

router = APIRouter(prefix="/auth", tags=["Authentication"])


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    phone: str | None = None


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginOtpVerifyRequest(BaseModel):
    temp_token: str
    otp: str


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    email: str
    otp: str
    new_password: str


class UpdateProfileRequest(BaseModel):
    name: str | None = None
    phone: str | None = None


@router.post("/register")
async def register(data: RegisterRequest):
    # Check if email exists
    existing = db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user
    password_hash = hash_password(data.password)
    user_id = get_next_sequence_value("users_id")
    
    new_user = {
        "id": user_id,
        "name": data.name,
        "email": data.email,
        "password_hash": password_hash,
        "phone": data.phone,
        "avatar_url": None,
        "role": "user",
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    db.users.insert_one(new_user)

    token = create_access_token({"sub": str(user_id), "email": data.email, "role": "user"})

    return {
        "message": "Registration successful",
        "token": token,
        "user": {
            "id": user_id,
            "name": data.name,
            "email": data.email,
            "phone": data.phone,
            "role": "user",
        }
    }


@router.post("/login")
async def login(data: LoginRequest):
    user = db.users.find_one({"email": data.email, "is_active": True})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # On-the-fly migration for legacy users missing "id"
    if "id" not in user:
        user_id = get_next_sequence_value("users_id")
        db.users.update_one({"_id": user["_id"]}, {"$set": {"id": user_id}})
        user["id"] = user_id

    # Generate 6-digit OTP
    otp = generate_otp()
    otp_hash = hash_password(otp)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)

    # Store OTP in database
    db.otps.update_one(
        {"email": user["email"], "purpose": "login"},
        {
            "$set": {
                "otp_hash": otp_hash,
                "expires_at": expires_at,
                "created_at": datetime.now(timezone.utc)
            }
        },
        upsert=True
    )

    # Send OTP email
    send_otp_email(user["email"], otp, purpose="login")

    # Create short-lived temporary token for OTP verification stage (5 minutes expiry)
    temp_token = create_access_token(
        {"sub": str(user["id"]), "email": user["email"], "scope": "login_otp"},
        expires_delta=timedelta(minutes=5)
    )

    return {
        "otp_required": True,
        "temp_token": temp_token,
        "email": user["email"]
    }


@router.post("/verify-login-otp")
async def verify_login_otp(data: LoginOtpVerifyRequest):
    try:
        # Decode and validate the temporary token
        payload = decode_token(data.temp_token)
        if payload.get("scope") != "login_otp":
            raise HTTPException(status_code=401, detail="Invalid token scope")
        
        user_id = int(payload.get("sub"))
        email = payload.get("email")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired temporary session")

    # Check OTP in database
    otp_doc = db.otps.find_one({"email": email, "purpose": "login"})
    if not otp_doc:
        raise HTTPException(status_code=400, detail="No active OTP verification request found")

    # Check expiration (fallback if MongoDB TTL index has not deleted yet)
    expires_at = otp_doc["expires_at"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if datetime.now(timezone.utc) > expires_at:
        db.otps.delete_one({"_id": otp_doc["_id"]})
        raise HTTPException(status_code=400, detail="OTP code has expired")

    # Verify the code
    if not verify_password(data.otp, otp_doc["otp_hash"]):
        raise HTTPException(status_code=400, detail="Invalid OTP code")

    # Delete OTP after successful verification
    db.otps.delete_one({"_id": otp_doc["_id"]})

    # Retrieve full user profile
    user = db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate permanent access token
    token = create_access_token({"sub": str(user["id"]), "email": user["email"], "role": user["role"]})

    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "phone": user.get("phone"),
            "role": user.get("role", "user"),
        }
    }


@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    # Check if user exists
    user = db.users.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User with this email does not exist")

    # Generate 6-digit OTP
    otp = generate_otp()
    otp_hash = hash_password(otp)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)

    # Store OTP in database
    db.otps.update_one(
        {"email": data.email, "purpose": "reset_password"},
        {
            "$set": {
                "otp_hash": otp_hash,
                "expires_at": expires_at,
                "created_at": datetime.now(timezone.utc)
            }
        },
        upsert=True
    )

    # Send OTP email
    send_otp_email(data.email, otp, purpose="reset_password")

    return {"message": "Verification OTP sent to your email"}


@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest):
    # Find OTP
    otp_doc = db.otps.find_one({"email": data.email, "purpose": "reset_password"})
    if not otp_doc:
        raise HTTPException(status_code=400, detail="No active password reset OTP found for this email")

    # Check expiration
    expires_at = otp_doc["expires_at"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if datetime.now(timezone.utc) > expires_at:
        db.otps.delete_one({"_id": otp_doc["_id"]})
        raise HTTPException(status_code=400, detail="OTP code has expired")

    # Verify OTP
    if not verify_password(data.otp, otp_doc["otp_hash"]):
        raise HTTPException(status_code=400, detail="Invalid OTP code")

    # Find User
    user = db.users.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update Password and delete OTP
    new_password_hash = hash_password(data.new_password)
    db.users.update_one(
        {"email": data.email},
        {"$set": {"password_hash": new_password_hash, "updated_at": datetime.now(timezone.utc)}}
    )
    db.otps.delete_one({"_id": otp_doc["_id"]})

    return {"message": "Password reset successful"}


@router.post("/admin-login")
async def admin_login(data: LoginRequest):
    # Check admin_users collection
    admin = db.admin_users.find_one({"email": data.email, "is_active": True})
    if not admin:
        # Check users collection with role='admin'
        admin = db.users.find_one({"email": data.email, "role": "admin", "is_active": True})
        
    if not admin or not verify_password(data.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    # On-the-fly migration for legacy admins missing "id"
    if "id" not in admin:
        admin_id = get_next_sequence_value("admin_users_id" if "username" in admin else "users_id")
        coll = db.admin_users if "username" in admin else db.users
        coll.update_one({"_id": admin["_id"]}, {"$set": {"id": admin_id}})
        admin["id"] = admin_id

    token = create_access_token({"sub": str(admin["id"]), "email": admin["email"], "role": "admin"})

    return {
        "message": "Admin login successful",
        "token": token,
        "user": {
            "id": admin["id"],
            "name": admin.get("username") or admin.get("name") or "Admin",
            "email": admin["email"],
            "role": "admin",
        }
    }


@router.post("/setup-admin")
async def setup_admin(data: RegisterRequest):
    """Create an admin user (first-time setup only)."""
    existing_count = db.admin_users.count_documents({})
    if existing_count > 0:
        raise HTTPException(status_code=400, detail="Admin already exists. Use admin-login.")

    password_hash = hash_password(data.password)
    admin_id = get_next_sequence_value("admin_users_id")
    
    new_admin = {
        "id": admin_id,
        "username": data.name,
        "email": data.email,
        "password_hash": password_hash,
        "role": "admin",
        "is_active": True,
        "created_at": datetime.now(timezone.utc)
    }
    db.admin_users.insert_one(new_admin)

    token = create_access_token({"sub": str(admin_id), "email": data.email, "role": "admin"})

    return {
        "message": "Admin account created",
        "token": token,
        "user": {
            "id": admin_id,
            "name": data.name,
            "email": data.email,
            "role": "admin",
        }
    }


@router.get("/profile")
async def get_profile(current_user=Depends(get_current_user)):
    # Check users collection
    user = db.users.find_one({"id": current_user["id"]})
    if not user:
        # Check admin_users collection
        admin = db.admin_users.find_one({"id": current_user["id"]})
        if not admin:
            raise HTTPException(status_code=404, detail="User or Admin not found")
        # Remove fields that aren't JSON serializable or shouldn't be exposed
        admin_dict = dict(admin)
        if "_id" in admin_dict:
            del admin_dict["_id"]
        if "password_hash" in admin_dict:
            del admin_dict["password_hash"]
        return {"user": admin_dict}

    user_dict = dict(user)
    if "_id" in user_dict:
        del user_dict["_id"]
    if "password_hash" in user_dict:
        del user_dict["password_hash"]
    return {"user": user_dict}


@router.put("/profile")
async def update_profile(data: UpdateProfileRequest, current_user=Depends(get_current_user)):
    updates = {}
    if data.name is not None:
        updates["name"] = data.name
    if data.phone is not None:
        updates["phone"] = data.phone

    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    updates["updated_at"] = datetime.now(timezone.utc)

    # Check if user exists
    user = db.users.find_one_and_update(
        {"id": current_user["id"]},
        {"$set": updates},
        return_document=True
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_dict = dict(user)
    if "_id" in user_dict:
        del user_dict["_id"]
    if "password_hash" in user_dict:
        del user_dict["password_hash"]

    return {"message": "Profile updated", "user": user_dict}
