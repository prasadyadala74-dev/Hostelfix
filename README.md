# HostelFix 🏠

A full-stack hostel complaint and maintenance management system built with React, Tailwind CSS, Express, MongoDB Atlas, and JWT authentication.

## Features
- Student registration and login
- JWT authentication
- Password hashing with bcryptjs
- Student dashboard
- Create hostel maintenance complaints
- Upload a complaint image (optional URL)
- Track complaint status
- Complaint history
- Admin dashboard
- Admin can update complaint status and assign staff
- Responsive Tailwind UI

## Project structure
- `frontend/` React + Vite + Tailwind
- `backend/` Express + MongoDB/Mongoose + JWT

## Local setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Add your MongoDB Atlas URI and JWT secret to .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend expects the API at `VITE_API_URL` (default `http://localhost:5000/api`).

## Demo admin
Register a normal user first. To make an account an admin, set its `role` to `admin` in MongoDB Atlas.

## Deployment
Frontend can be deployed to Vercel. Backend can be deployed to Render/Railway. Set the environment variables shown in each `.env.example`.
