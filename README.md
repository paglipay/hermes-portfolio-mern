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

## Docker Deployment
Run these commands from the repository root:

```bash
cd D:/Documents/Projects/hermes-portfolio-mern
docker compose up -d --build
docker compose ps
```

The Docker frontend is available at http://localhost:4000 and the backend API is available at http://localhost:5000.

### Hermes chat configuration
The `/chat` page uses the Hermes Responses API through the backend. The API key must stay in `backend/.env`; never put it in frontend code or a `REACT_APP_*` variable.

Add these values to `backend/.env`:

```env
HERMES_API_KEY=your-hermes-api-key
HERMES_API_URL=http://192.168.1.84:8642
HERMES_MODEL=hermes-agent
HERMES_SESSION_KEY=hermes-portfolio-web
```

Then rebuild and restart the backend:

```bash
docker compose build backend
docker compose up -d backend
curl http://localhost:5000/api/health
```

Open http://localhost:4000/chat to use the agent.

### Frontend-only redeploy
After frontend source changes:

```bash
cd D:/Documents/Projects/hermes-portfolio-mern
docker compose build frontend
docker compose up -d frontend
curl -I http://localhost:4000
```

If `package.json`, `package-lock.json`, or the Dockerfile changed, force a clean image build:

```bash
docker compose build --no-cache frontend
docker compose up -d frontend
```

### Backend-only redeploy
After backend source changes:

```bash
cd D:/Documents/Projects/hermes-portfolio-mern
docker compose build backend
docker compose up -d backend
curl http://localhost:5000/api/health
```

### Troubleshooting
View service status and recent logs:

```bash
docker compose ps -a
docker compose logs --tail=100 frontend
docker compose logs --tail=100 backend
```

If a route such as `/chat` or `/community` is opened directly, the frontend image must be rebuilt so nginx serves the latest React bundle and SPA fallback configuration.

## Development Tips
- Use `npm run dev` in each folder for hot‑reloading (requires `nodemon` and `react-scripts`).
- Add your actual data via the API or directly in MongoDB.
- Deploy backend to Heroku/Vercel, frontend to Netlify or Vercel.
