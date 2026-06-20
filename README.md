# MealMitra

MealMitra is a MERN tiffin ordering application. This build covers the Week 1 foundation and approximately 90% of the Week 2 ordering milestone.

## Implemented

- Registration, login, JWT authentication, and role-based routes
- Breakfast, lunch, and dinner plans with daily, weekly, or monthly durations
- Admin plan creation, editing, deletion, and listing
- Authenticated order placement with server-side plan verification
- User dashboard split into active orders and order history
- Admin order list and status updates
- Client and server validation for authentication and plan inputs

## Intentionally remaining for the final Week 2 pass

- Automated API integration tests against a disposable MongoDB database
- A final end-to-end browser acceptance pass with seeded user/admin accounts

Payment processing, email notifications, and advanced tracking belong to Week 3 and are not included.

## Setup

1. Copy `backend/.env.example` to `backend/.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Copy `frontend/.env.example` to `frontend/.env` if the API is not at `http://localhost:5000/api`.
3. Run `npm install` in both `backend` and `frontend`.
4. Run `npm run dev` in each directory.

New accounts receive the `user` role. To use the admin dashboard, set a trusted account's `role` to `admin` directly in MongoDB.
