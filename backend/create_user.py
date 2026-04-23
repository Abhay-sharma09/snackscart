from app.db.database import SessionLocal
from app.models.user import User
from app.core import security

def create_test_user():
    db = SessionLocal()
    
    # Credentials
    email = "user@snackscart.com"
    password = "user123"
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        print(f"User {email} already exists.")
        db.close()
        return

    test_user = User(
        email=email,
        password_hash=security.get_password_hash(password),
        role="user",
        is_active=True,
    )
    
    db.add(test_user)
    db.commit()
    print(f"Successfully created test user!")
    print(f"Email: {email}")
    print(f"Password: {password}")
    db.close()

if __name__ == "__main__":
    create_test_user()
