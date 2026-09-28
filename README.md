# HostelFix 🏠

A full-stack hostel complaint and maintenance management system built with React, Tailwind CSS, Express, MongoDB Atlas, and JWT authentication. Configured for single-deployment on **Vercel** serverless as well as standard local development.

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
- `api/index.js` Vercel Serverless Function entry point
- `vercel.json` Vercel deployment routing and configuration
- `package.json` Root scripts for building and concurrent local development

## Quick Start (Local Development)

From the project root:

1. **Install dependencies**:
   ```bash
   npm run install:all
   ```

2. **Configure environment variables**:
   - In `backend/.env`:
     ```env
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_jwt_secret_key
     PORT=5000
     ```
   - In `frontend/.env` (optional for local dev):
     ```env
     VITE_API_URL=http://localhost:5000/api
     ```

3. **Run both backend and frontend together**:
   ```bash
   npm run dev
   ```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

---

## Deploying to Vercel

1. **Import the repository into Vercel**:
   - Framework Preset: **Vite** (or Other)
   - Root Directory: `./` (leave default root)
   - Build Command: `npm run build`
   - Output Directory: `frontend/dist`

2. **Set Environment Variables on Vercel**:
   Under **Project Settings > Environment Variables**, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection URI (make sure IP `0.0.0.0/0` is allowed in MongoDB Network Access)
   - `JWT_SECRET`: A secure secret string for JWT token signing
   - `CLIENT_URL` *(optional)*: Your Vercel production domain (e.g., `https://your-app.vercel.app`)

3. **Deploy**:
   - Vercel will automatically build the frontend into `frontend/dist` and serve the backend serverless function at `/api/*`.

---

## Individual Service Scripts

If you want to run services individually:

- **Run only backend**: `npm run dev:backend` (or `cd backend && npm run dev`)
- **Run only frontend**: `npm run dev:frontend` (or `cd frontend && npm run dev`)
- **Create Admin User**: `cd backend && npm run create-admin`
