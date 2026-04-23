from app.db.database import SessionLocal
from app.models.user import User
from app.core import security

def create_admin_user():
    db = SessionLocal()
    
    # Credentials
    email = "admin@snackscart.com"
    password = "admin123"
    
    # Check if admin already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        print(f"User {email} already exists.")
        db.close()
        return

    admin_user = User(
        email=email,
        password_hash=security.get_password_hash(password),
        role="admin",
        is_active=True,
    )
    
    db.add(admin_user)
    db.commit()
    print(f"Successfully created Admin user!")
    print(f"Email: {email}")
    print(f"Password: {password}")
    db.close()

if __name__ == "__main__":
    create_admin_user()
