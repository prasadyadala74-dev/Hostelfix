# HostelFix 🏠

A full-stack hostel complaint and maintenance management system built with React, Tailwind CSS, Express, MongoDB Atlas, and JWT authentication.

## Features
- Student registration and login
- JWT authentication & password hashing with bcryptjs
- Student dashboard with categorized complaint submission & live image preview
- Real-time complaint tracking with status badges
- Admin / Warden management dashboard with instant status updates
- Responsive modern UI with Tailwind CSS

## Project Structure
- `frontend/` React + Vite + Tailwind CSS
- `backend/` Express + MongoDB/Mongoose + JWT
- `package.json` Root workspace runner (concurrent backend & frontend execution)

## Quick Start (Single Command)

From the project root:

1. **Install dependencies**:
   ```bash
   npm run install:all
   ```

2. **Configure environment variables**:
   - Ensure `backend/.env` has your `MONGODB_URI` and `JWT_SECRET`.
   - Ensure `frontend/.env` has `VITE_API_URL=http://localhost:5000/api`.

3. **Run both backend and frontend together**:
   ```bash
   npm run dev
   ```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

---

## Individual Service Scripts

If you want to run services individually:

- **Run only backend**: `npm run dev:backend` (or `cd backend && npm run dev`)
- **Run only frontend**: `npm run dev:frontend` (or `cd frontend && npm run dev`)
- **Create Admin User**: `cd backend && npm run create-admin`
