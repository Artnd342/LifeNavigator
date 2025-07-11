# LifeNavigator

LifeNavigator is a full-stack AI-powered productivity web app built to help users manage tasks, get intelligent suggestions, and plan their daily routines efficiently. The app integrates modern frontend and backend stacks with intelligent task prioritization based on estimated time

# 1. Tools and Components Used

# Backend
- **Node.js + Express.js** — REST API server
- **TypeScript** — Strong typing and clean backend logic
- **Prisma ORM** — Type-safe PostgreSQL database ORM
- **PostgreSQL** — Primary database
- **JWT** — JSON Web Tokens for secure authentication
- **bcryptjs** — Password hashing

# Frontend
- **React.js** with **TypeScript** — Component-based frontend
- **Tailwind CSS** — Utility-first responsive design
- **Axios** — For HTTP requests
- **React Router DOM** — Page navigation and protected routes

# Deployment & Testing
- **Vercel** — Frontend deployment
- **Render / Railway** — Backend deployment (Express + PostgreSQL)
- **Postman** — API testing
- **CORS & Environment Variables** — API integration and cross-origin handling

# 2. Development Issues Faced

1. **HTTP Request Validation Errors**:  
   - Backend sometimes responded with 500 or 404 due to incorrect body structure or missing headers.
   - Fixed by debugging routes and using Postman effectively.

2. **Frontend-Backend API Integration**:  
   - Axios calls from React occasionally failed due to CORS issues or wrong API endpoint.
   - Resolved by setting proper CORS middleware on the backend and matching base URLs via `.env` files.

3. **JWT Handling Issues**:  
   - Token expiration, incorrect decoding, and missing headers in protected routes.
   - Fixed by ensuring correct headers and consistent token storage on the client.

4. **Database Migration Conflicts**:  
   - Prisma schema changes led to migration clashes.
   - Solved by resetting migrations and using `prisma migrate dev` and `prisma generate` properly.

# 3. Project Capabilities (Till Deployment & Testing)

# Authentication System
- User registration and login with encrypted passwords.
- JWT-based secure access control.

# Task Management
- CRUD operations for tasks (Create, Read, Update, Delete).
- Tasks have title, estimated time, completion status.

# AI Suggestion Engine
- Suggests optimized task order based on estimated_time using a custom `/ai/suggest` route.

# Testing
- Full backend API tested with Postman (including auth + task logic).
- Frontend integrated and tested with live deployed backend.
- Tested with various edge cases (empty tasks, incorrect tokens, etc.).

# Deployment
- **Frontend**: Deployed on [Vercel](https://vercel.com)
- **Backend**: Deployed on [Render](https://render.com) / Railway with PostgreSQL cloud DB.
- Environment variables set correctly in both platforms.

# 4. Key Considerations for Further Development

1. **Error Handling Improvements**  
   Add proper error boundaries and user-friendly messages on frontend (for auth failures, missing fields, etc.).

2. **Role-based Features**  
   Implement admin or premium users with special permissions or task limits for better scalability.



# Folder Structure

LifeNavigator/
├── client/ # React frontend with TypeScript + Tailwind
├── server/ # Express backend with TypeScript + Prisma
├── prisma/ # Prisma schema and migration files
├── .env # Environment variables
├── README.md # Project documentation

