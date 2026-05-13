# SnacksCart

SnacksCart is a full-stack snack ordering web application built with a FastAPI backend and a React + Vite frontend. It supports customer authentication, product browsing, cart management, checkout, order tracking, and an admin dashboard for order and inventory management.

## Features

- User signup and login with JWT authentication
- Role-based access for normal users and admins
- Public product menu with category filtering
- Product cards with images, prices, stock state, and add-to-cart actions
- Persistent shopping cart using browser local storage
- Protected checkout flow for logged-in users
- Order creation with stock validation and automatic inventory reduction
- User dashboard for viewing personal orders
- Admin dashboard for viewing all orders and updating order status
- Admin inventory view for updating product stock quantity
- SQLite database support through environment configuration
- Seed scripts for sample snack products and product images

## Tech Stack

### Backend

- FastAPI
- SQLAlchemy
- Pydantic
- SQLite
- JWT authentication with `python-jose`
- Password hashing with `passlib` and `bcrypt`
- Uvicorn development server

### Frontend

- React
- Vite
- React Router
- Lucide React icons
- CSS modules/files for page and component styling
- Browser `localStorage` for auth token and cart persistence

## Project Structure

```text
snackscart/
+-- backend/
|   +-- app/
|   |   +-- api/              # API route handlers
|   |   +-- core/             # App settings and security helpers
|   |   +-- db/               # Database engine/session setup
|   |   +-- models/           # SQLAlchemy database models
|   |   +-- schemas/          # Pydantic request/response schemas
|   |   +-- main.py           # FastAPI app entry point
|   +-- create_admin.py       # Creates a test admin account
|   +-- create_user.py        # Creates a test user account
|   +-- init_db.py            # MySQL helper, optional
|   +-- seed_data.py          # Adds sample snack products
|   +-- update_images.py      # Maps category images
|   +-- update_specific_images.py
|   +-- requirements.txt
+-- frontend/
|   +-- public/               # Static files and product images
|   +-- src/
|   |   +-- api/              # Frontend API client
|   |   +-- components/       # Reusable UI components
|   |   +-- context/          # Auth and cart contexts
|   |   +-- pages/            # App pages
|   |   +-- App.jsx           # Routes and providers
|   |   +-- main.jsx          # React entry point
|   +-- package.json
|   +-- vite.config.js
+-- .gitignore
+-- README.md
```

## Requirements

- Python 3.10 or newer
- Node.js 18 or newer
- npm

## Backend Setup

Open a terminal in the project root, then run:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` folder:

```env
DATABASE_URL="sqlite:///./snackscart.db"
SECRET_KEY="replace-this-with-a-secure-secret"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Start the backend:

```powershell
uvicorn app.main:app --reload
```

The API will run at:

```text
http://localhost:8000
```

Interactive API documentation is available at:

```text
http://localhost:8000/docs
```

## Database Setup

Tables are created automatically when the FastAPI app starts because `main.py` runs:

```python
Base.metadata.create_all(bind=engine)
```

To add sample products:

```powershell
cd backend
.\venv\Scripts\activate
python seed_data.py
python update_specific_images.py
```

To create test users:

```powershell
python create_admin.py
python create_user.py
```

Default script-created credentials:

```text
Admin: admin@snackscart.com / admin123
User:  user@snackscart.com / user123
```

## Frontend Setup

Open another terminal in the project root:

```powershell
cd frontend
npm install
npm run dev
```

The frontend will usually run at:

```text
http://localhost:5173
```

The frontend API client expects the backend at:

```text
http://localhost:8000/api
```

This value is currently defined in:

```text
frontend/src/api/apiClient.js
```

## Main Routes

### Frontend Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page |
| `/auth` | Login and signup page |
| `/menu` | Product menu |
| `/checkout` | Protected checkout page |
| `/dashboard` | Protected user order dashboard |
| `/admin` | Protected admin dashboard |

### Backend API Routes

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/signup` | Public | Register a user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT token |
| `GET` | `/api/auth/me` | User | Get logged-in user profile |
| `GET` | `/api/products/` | Public | List products |
| `GET` | `/api/products/{product_id}` | Public | Get product details |
| `POST` | `/api/products/` | Admin | Create product |
| `PUT` | `/api/products/{product_id}` | Admin | Update product |
| `DELETE` | `/api/products/{product_id}` | Admin | Delete product |
| `POST` | `/api/orders/` | User | Create order |
| `GET` | `/api/orders/me` | User | Get current user's orders |
| `GET` | `/api/orders/` | Admin | Get all orders |
| `GET` | `/api/orders/{order_id}` | User/Admin | Get one order |
| `PATCH` | `/api/orders/{order_id}/status` | Admin | Update order status |

## Authentication Flow

1. User signs up or logs in from the frontend.
2. Backend validates credentials.
3. Backend returns a JWT access token.
4. Frontend stores the token in `localStorage` as `access_token`.
5. Protected API calls include the token in the `Authorization` header.
6. Backend decodes the token and loads the current user.
7. Admin-only routes check that `user.role` is `admin`.

## Cart and Checkout Flow

1. Products are loaded from `/api/products/`.
2. User adds products to the cart.
3. Cart data is stored in `localStorage`.
4. Checkout requires login through `ProtectedRoute`.
5. Frontend sends product IDs and quantities to `/api/orders/`.
6. Backend checks product stock.
7. Backend reduces stock quantity.
8. Backend creates the order with status `pending`.
9. User can track the order from the dashboard.

## Admin Flow

Admins can:

- view all orders
- approve orders
- reject orders
- view product inventory
- update stock quantity

The backend also supports product create, update, and delete APIs. The current frontend admin UI focuses mainly on order status and inventory stock updates.

## Useful Commands

Backend:

```powershell
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload
```

Frontend:

```powershell
cd frontend
npm run dev
```

Build frontend:

```powershell
cd frontend
npm run build
```

Lint frontend:

```powershell
cd frontend
npm run lint
```

## Notes

- Payment is currently simulated in the checkout page.
- `razorpay` is listed in backend dependencies, but real Razorpay integration is not yet connected.
- The first user registered through `/api/auth/signup` becomes an admin automatically.
- `.env`, local databases, virtual environments, `node_modules`, and build output are ignored by Git.
- Product images are served from `frontend/public/images`.

## Future Improvements

- Add real Razorpay payment integration
- Add product create/delete controls to the admin frontend
- Add user profile management
- Add order delivery status controls
- Add better mobile navigation
- Add automated backend and frontend tests
- Add deployment configuration
