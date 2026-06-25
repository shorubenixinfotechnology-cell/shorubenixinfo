import sys
import os
import pymongo
import datetime

# Add backend folder to path
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'backend'))

# Load environment variables (ensure .env path is correctly resolved)
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), '.env'))

from config.database import init_database, db, get_next_sequence_value
from middleware.auth import hash_password, verify_password, create_access_token, decode_token
from utils.email import generate_otp

def run_tests():
    print("=== STARTING MONGODB VERIFICATION TESTS ===")
    
    # Clear existing admin to test fresh seed
    db.admin_users.delete_one({"email": "admin@shorubenix.com"})

    # 1. Running init_database
    print("1. Running init_database()...")
    init_database()
    print("Database initialized successfully!")

    # 2. Check admin user seeding
    print("2. Verifying seeded admin user...")
    admin = db.admin_users.find_one({"email": "admin@shorubenix.com"})
    if admin:
        print(f"Seeded admin found: {admin['username']} ({admin['email']})")
        assert admin["role"] == "admin"
        assert verify_password("admin123", admin["password_hash"])
        print("Admin user verified successfully!")
    else:
        print("ERROR: Admin user not found!")
        return

    # 3. Test Auto-Increment Sequences
    print("3. Testing sequence number generation...")
    val1 = get_next_sequence_value("test_seq")
    val2 = get_next_sequence_value("test_seq")
    print(f"Generated sequence numbers: {val1}, {val2}")
    assert val2 == val1 + 1
    print("Sequence ID generation verified successfully!")

    # 4. Simulate User Registration
    print("4. Testing User Registration flow...")
    test_email = "testuser@shorubenix.com"
    # Clean up existing test user
    db.users.delete_one({"email": test_email})
    db.otps.delete_many({"email": test_email})

    user_id = get_next_sequence_value("users_id")
    pwd_hash = hash_password("testpassword123")
    
    db.users.insert_one({
        "id": user_id,
        "name": "Test User",
        "email": test_email,
        "password_hash": pwd_hash,
        "phone": "+91 99999 88888",
        "role": "user",
        "is_active": True,
        "created_at": datetime.datetime.now(datetime.timezone.utc),
        "updated_at": datetime.datetime.now(datetime.timezone.utc)
    })
    
    user = db.users.find_one({"email": test_email})
    assert user is not None
    assert user["id"] == user_id
    assert verify_password("testpassword123", user["password_hash"])
    print(f"User registration and password verification successful! ID: {user['id']}")

    # 5. Simulate User Login OTP Generation
    print("5. Testing Login OTP generation...")
    otp = generate_otp()
    otp_hash = hash_password(otp)
    expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=5)

    db.otps.update_one(
        {"email": test_email, "purpose": "login"},
        {"$set": {"otp_hash": otp_hash, "expires_at": expires_at, "created_at": datetime.datetime.now(datetime.timezone.utc)}},
        upsert=True
    )
    
    otp_doc = db.otps.find_one({"email": test_email, "purpose": "login"})
    assert otp_doc is not None
    assert verify_password(otp, otp_doc["otp_hash"])
    print(f"Generated OTP: {otp}. Stored and verified OTP hash successfully!")

    # 6. Simulate Login OTP Verification
    print("6. Testing Login OTP verification...")
    # Decode verification
    assert verify_password(otp, otp_doc["otp_hash"])
    db.otps.delete_one({"_id": otp_doc["_id"]})
    print("OTP verification and cleanup successful!")

    # 7. Simulate Forgot Password and Reset Password
    print("7. Testing Forgot Password OTP and Reset Password flow...")
    reset_otp = generate_otp()
    reset_otp_hash = hash_password(reset_otp)
    reset_expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=5)

    db.otps.update_one(
        {"email": test_email, "purpose": "reset_password"},
        {"$set": {"otp_hash": reset_otp_hash, "expires_at": reset_expires_at, "created_at": datetime.datetime.now(datetime.timezone.utc)}},
        upsert=True
    )
    
    # Reset password
    otp_doc = db.otps.find_one({"email": test_email, "purpose": "reset_password"})
    assert otp_doc is not None
    assert verify_password(reset_otp, otp_doc["otp_hash"])
    
    new_pwd_hash = hash_password("newsecurepass123")
    db.users.update_one(
        {"email": test_email},
        {"$set": {"password_hash": new_pwd_hash, "updated_at": datetime.datetime.now(datetime.timezone.utc)}}
    )
    db.otps.delete_one({"_id": otp_doc["_id"]})
    
    updated_user = db.users.find_one({"email": test_email})
    assert verify_password("newsecurepass123", updated_user["password_hash"])
    assert not verify_password("testpassword123", updated_user["password_hash"])
    print("Forgot Password and Reset Password flow verified successfully!")

    # Cleanup test data
    db.users.delete_one({"email": test_email})
    print("=== ALL TESTS PASSED SUCCESSFULLY ===")

if __name__ == "__main__":
    run_tests()
