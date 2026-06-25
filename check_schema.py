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
        password=os.getenv("DB_PASSWORD", "")
    )
    cur = conn.cursor()
    
    # Check columns in users table
    cur.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users';
    """)
    columns = cur.fetchall()
    print("Schema for 'users' table:")
    for col in columns:
        print(f" - {col[0]}: {col[1]}")
    
    cur.close()
    conn.close()
except Exception as e:
    print(f"ERROR: {e}")
