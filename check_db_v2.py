import psycopg2
import sys
import os

# Add backend to path to import settings
sys.path.append(os.path.join(os.getcwd(), 'backend'))
from config.settings import settings

log_file = os.path.join(os.getcwd(), 'db_check.log')

with open(log_file, 'w') as f:
    f.write(f"Testing connection to {settings.DB_HOST}:{settings.DB_PORT} db={settings.DB_NAME}\n")
    try:
        conn = psycopg2.connect(
            host=settings.DB_HOST,
            port=settings.DB_PORT,
            dbname=settings.DB_NAME,
            user=settings.DB_USER,
            password="",
            connect_timeout=5
        )
        f.write("SUCCESS: Database connection established with EMPTY password\n")
        conn.close()
    except Exception as e2:
        f.write(f"FAILURE with empty password: {str(e2)}\n")
