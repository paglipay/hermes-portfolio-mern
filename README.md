# MERN Portfolio

A modern, professional portfolio web application built with the MERN stack.

## Project Structure
```
portfolio-mern/
├─ backend/
│  ├─ models/          # Mongoose schemas (Experience, Skill, Project)
│  ├─ routes/          # Express REST API routes
│  ├─ server.js        # Entry point, connects to MongoDB
│  └─ package.json
└─ frontend/
   ├─ src/
   │   ├─ components/   # Reusable UI components (Navbar, Footer, Section)
   │   ├─ pages/        # Page components (About, Skills, Experience, Projects, Resume, Contact)
   │   ├─ api.js        # Axios instance for API calls
   │   └─ App.js
   └─ package.json
```

## Getting Started
1. **Clone repo** (or copy this folder).
2. **Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env   # set MONGODB_URI
   npm start
   ```
3. **Frontend**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```
4. Open http://localhost:3000 in your browser.

## Development Tips
- Use `npm run dev` in each folder for hot‑reloading (requires `nodemon` and `react-scripts`).
- Add your actual data via the API or directly in MongoDB.
- Deploy backend to Heroku/Vercel, frontend to Netlify or Vercel.
