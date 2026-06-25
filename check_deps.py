try:
    import passlib
    from passlib.context import CryptContext
    import bcrypt
    from jose import jwt
    print("SUCCESS: All auth dependencies (passlib, bcrypt, jose) are installed.")
except ImportError as e:
    print(f"ERROR: Missing dependency: {e}")
except Exception as e:
    print(f"ERROR: {e}")
