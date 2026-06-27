# SnacksCart

## Overview

SnacksCart is a Full Stack snack ordering web application built with FastAPI and React. It enables users to browse products, manage shopping carts, place orders, and view order history through a modern and responsive interface. The platform also includes an admin dashboard for inventory and product management, secured with JWT-based authentication to ensure safe access to protected resources.

## Features

- User Registration & Login
- JWT Authentication
- Product Browsing & Filtering
- Shopping Cart Management
- Order Placement & History
- Admin Dashboard
- Inventory Management
- Protected APIs & Routes
- Responsive UI

## Tech Stack

**Frontend:** React, Vite, JavaScript, React Router, CSS  
**Backend:** Python, FastAPI, SQLAlchemy, SQLite, Uvicorn  
**Authentication:** JWT, Passlib, Bcrypt

## Installation & Run

```bash
git clone <repository-url>
cd snackscart

# Backend
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd ../frontend
npm install
npm run dev
```

**Backend:** `http://localhost:8000`  
**Frontend:** `http://localhost:5173`

## Future Improvements

- Razorpay Payment Integration
- User Profile Management
- Improved Mobile Responsiveness
- Cloud Deployment
- Automated Testing




