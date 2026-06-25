import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = ""
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "shorubenix_website"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = ""

    # MongoDB
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB: str = "shorubenix"

    # SMTP Settings
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_EMAIL: str = "shorubenixinfotechnology@gmail.com"
    SMTP_PASSWORD: str = ""

    # Server
    PORT: int = 3001
    NODE_ENV: str = "development"

    # JWT
    JWT_SECRET: str = "shorubenix_jwt_secret_key_2024_secure"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24

    # Razorpay
    RAZORPAY_KEY_ID: str = "rzp_live_SSKuly2gksJCuu"
    RAZORPAY_KEY_SECRET: str = "dfq1J437AyIG3TjzvXfA15A5"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Prefer DATABASE_URL for production (Railway)
# If provided as an environment variable, use it. Otherwise construct it.
_database_url = os.getenv("DATABASE_URL")
if _database_url and _database_url.startswith("postgres://"):
    # Railway's DATABASE_URL often starts with postgres://, but psycopg2 needs postgresql://
    _database_url = _database_url.replace("postgres://", "postgresql://", 1)

DATABASE_URL = _database_url or f"postgresql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
