# SnacksCart

## About The Project

SnacksCart is a Full Stack snack ordering web application built using FastAPI and React. The platform allows users to browse snacks, manage carts, place orders, and track order history through a modern and responsive interface.

The project also includes admin functionalities for inventory management, order handling, and product updates with secure JWT authentication.

---

# Features

- User Signup and Login
- JWT Authentication System
- Product Browsing and Filtering
- Shopping Cart Management
- Order Placement and Tracking
- Admin Dashboard
- Inventory Management
- Protected Routes and APIs
- Responsive UI Design
- SQLite Database Integration

---

# Tech Stack

## Frontend
- React
- Vite
- JavaScript
- React Router
- CSS

## Backend
- Python
- FastAPI
- SQLAlchemy
- SQLite
- Uvicorn

## Authentication
- JWT Authentication
- Passlib
- Bcrypt

---

# Installation

```bash
git clone <your-repository-link>
cd snackscart
```

## Backend Setup

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at:

```text
http://localhost:8000
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

# Future Improvements

- Razorpay Payment Integration
- Better Mobile Responsiveness
- User Profile Management
- Deployment Support
- Automated Testing




