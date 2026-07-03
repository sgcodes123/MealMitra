# MealMitra

MealMitra is a full-stack MERN application for managing healthy tiffin subscriptions. Customers can browse meal plans, place and track orders, complete payments, and use an AI meal-plan assistant. Administrators can manage plans and customer orders from a dedicated dashboard.

## Features

### Customer

- Registration and JWT-based authentication
- Breakfast, lunch, and dinner subscriptions
- Daily, weekly, and monthly plans
- Razorpay payment flow
- Active-order tracking and order history
- Responsive light and dark themes
- Streaming AI meal-plan assistant
- Fullscreen chatbot mode
- Markdown-formatted chatbot responses
- Conversation memory and preference handling

### Administrator

- Role-protected admin dashboard
- Create, edit, and delete meal plans
- Search published meal plans
- Search customer orders
- Separate ongoing and completed order sections
- Update order statuses
- Review customer and payment information
- Admin-specific navbar and footer
- Customer chatbot hidden for administrator accounts

## Technology Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- React Markdown
- Remark GFM

### Backend

- Node.js
- Express
- MongoDB and Mongoose
- JWT authentication
- bcryptjs
- Razorpay
- Nodemailer
- Google Gemini API
- Server-Sent Events for chatbot streaming

## Project Structure

```text
MealMitra/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── test/
│   ├── utils/
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── vite.config.js
└── README.md
```

## Requirements

- Node.js 20 or newer
- npm
- MongoDB database
- Google Gemini API key
- Razorpay test credentials for payments
- Gmail app password for email notifications

## Environment Configuration

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret

CLIENT_URL=http://localhost:5173

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

EMAIL_USER=your_email_address
EMAIL_APP_PASS=your_email_app_password

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

Create `frontend/.env`:

```env
VITE_API_URL=/api
```

The Vite development server proxies `/api` requests to `http://localhost:5000`.

For production, set `VITE_API_URL` to the deployed backend API URL when the frontend and backend use different domains.

## Installation

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Running Locally

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

## Tests

Run backend tests:

```bash
cd backend
npm test
```

Run frontend tests:

```bash
cd frontend
npm test
```

Run frontend linting:

```bash
cd frontend
npm run lint
```

Create a production frontend build:

```bash
cd frontend
npm run build
```

## Administrator Access

New accounts receive the `user` role by default.

To grant administrator access, update the trusted user's role in MongoDB:

```json
{
  "role": "admin"
}
```

Valid roles are:

- `user`
- `admin`

Administrator routes are protected on both the frontend and backend.

## Order Statuses

Supported order statuses:

- `Placed`
- `Preparing`
- `OutForDelivery`
- `Delivered`
- `Cancelled`

Delivered and cancelled orders appear in the completed-orders section. Other statuses appear under ongoing orders.

## Chatbot

The MealMitra assistant:

- Uses Google Gemini
- Streams responses using Server-Sent Events
- Recommends available meal plans
- Uses current plan information from MongoDB
- Handles connection and stream timeouts
- Supports stopping and regenerating responses
- Supports fullscreen mode
- Is hidden for administrator accounts

## Security

Never commit the following files:

```text
backend/.env
frontend/.env
rzp-test-key.csv
```

If credentials were previously committed, remove them from tracking and rotate all exposed MongoDB, Gemini, Razorpay, email, and JWT credentials.

## License

This project is intended for educational and internship purposes.