import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

try:
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME", "shorubenix_website"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "shobi@2003")
    )
    print("SUCCESS: Connected to database")
    
    cur = conn.cursor()
    cur.execute("SELECT version();")
    record = cur.fetchone()
    print("Version: ", record)
    
    # Check if users table exists
    cur.execute("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users');")
    exists = cur.fetchone()[0]
    print(f"Table 'users' exists: {exists}")
    
    cur.close()
    conn.close()
except Exception as e:
    print(f"ERROR: {e}")
