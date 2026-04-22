import pymysql
from app.core.config import settings

def create_database():
    # Parse the DATABASE_URL: mysql+pymysql://root:password@localhost/snackscart
    url = settings.DATABASE_URL
    if not url.startswith("mysql+pymysql://"):
        print("Database URL is not mysql+pymysql, skipping automatic DB creation.")
        return

    # Extract connection details
    # e.g., root:@localhost:3306/snackscart
    creds_part = url.split("://")[1]
    
    # Check if there is an '@'
    if "@" not in creds_part:
        return
        
    user_pass, host_db = creds_part.split("@")
    host_port, db_name = host_db.split("/")
    
    if ":" in user_pass:
        user, password = user_pass.split(":")
    else:
        user = user_pass
        password = ""
        
    if ":" in host_port:
        host, port = host_port.split(":")
        port = int(port)
    else:
        host = host_port
        port = 3306

    print(f"Connecting to MySQL at {host}:{port} with user {user} to ensure database '{db_name}' exists...")
    try:
        conn = pymysql.connect(host=host, port=port, user=user, password=password)
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
        conn.commit()
        conn.close()
        print(f"Database '{db_name}' is ready.")
    except Exception as e:
        print(f"Failed to create database: {e}")

if __name__ == "__main__":
    create_database()
