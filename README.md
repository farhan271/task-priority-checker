# ⚡ TaskFlow — Task Priority Checker

A full-stack MERN application that lets users manage tasks with priority-based sorting.
Built for the Full Stack Developer Assessment (Dyna Mass Tech).

---

## 🚀 Live Demo

> **Frontend:** `https://task-priority-frontend.vercel.app`  
> **Backend API:** `https://task-priority-backend.vercel.app`

---

## ✨ Features

- ✅ Add tasks with title, description, due date & priority (Low / Medium / High)
- ✅ Auto-sorted: **High priority first → Earlier due date first**
- ✅ Mark tasks as **completed** (bonus)
- ✅ Edit and delete tasks
- ✅ Overdue detection with visual indicators
- ✅ Filter tabs: All / High / Medium / Low / Completed
- ✅ Stats bar: total, done, high-priority, overdue, completion %
- ✅ Fully responsive (mobile-friendly)
- ✅ Loading skeletons & toast notifications

---

## 🛠 Tech Stack

| Layer     | Tech                                         |
|-----------|----------------------------------------------|
| Frontend  | React 18, Vite, Context API, react-hot-toast |
| Backend   | Node.js, Express 4, express-validator         |
| Database  | MongoDB Atlas + Mongoose                     |
| Hosting   | Vercel (both frontend & backend)              |

---

## 📁 Project Structure

```
task-priority-app/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── validateTask.js    # express-validator rules
│   ├── models/
│   │   └── Task.js            # Mongoose schema
│   ├── routes/
│   │   └── tasks.js           # CRUD + toggle endpoints
│   ├── server.js              # Express app entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx   # Add/edit form
│   │   │   ├── TaskCard.jsx   # Single task card
│   │   │   ├── TaskList.jsx   # List + filter tabs
│   │   │   └── StatsBar.jsx   # Summary statistics
│   │   ├── context/
│   │   │   └── TaskContext.jsx  # Global state (useReducer)
│   │   ├── pages/
│   │   │   └── HomePage.jsx
│   │   ├── services/
│   │   │   └── taskService.js  # Axios API calls
│   │   ├── styles/
│   │   │   └── global.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
├── vercel.json                # Backend Vercel deployment
├── .gitignore
└── README.md
```

---

## ⚙️ Running Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Git

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/task-priority-app.git
cd task-priority-app
```

### 2. Set up the Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/task-priority
NODE_ENV=development
```

Start the backend:
```bash
npm run dev        # uses nodemon (hot reload)
# or
npm start          # production
```

Backend runs at: `http://localhost:5000`

### 3. Set up the Frontend

```bash
cd ../frontend
npm install
```

No `.env` needed for local dev — Vite proxies `/tasks` to `localhost:5000`.

Start the frontend:
```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔌 API Endpoints

Base URL: `http://localhost:5000`

| Method | Endpoint           | Description              | Body Required              |
|--------|--------------------|--------------------------|----------------------------|
| GET    | `/tasks`           | Get all tasks (sorted)   | —                          |
| POST   | `/tasks`           | Create a task            | title, dueDate (required)  |
| PUT    | `/tasks/:id`       | Update a task fully      | title, dueDate (required)  |
| PATCH  | `/tasks/:id/toggle`| Toggle completed status  | —                          |
| DELETE | `/tasks/:id`       | Delete a task            | —                          |
| GET    | `/health`          | Health check             | —                          |

### Example POST body
```json
{
  "title": "Submit assessment",
  "description": "Push to GitHub and record Loom",
  "dueDate": "2025-01-20",
  "priority": "High"
}
```

### Example response
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "title": "Submit assessment",
    "description": "Push to GitHub and record Loom",
    "dueDate": "2025-01-20T00:00:00.000Z",
    "priority": "High",
    "completed": false,
    "createdAt": "2025-01-18T10:30:00.000Z",
    "updatedAt": "2025-01-18T10:30:00.000Z"
  }
}
```

---

## 🧠 Sorting Logic

Tasks are sorted server-side with this algorithm:

```javascript
const PRIORITY_ORDER = { High: 3, Medium: 2, Low: 1 };

tasks.sort((a, b) => {
  // 1. Higher priority comes first
  const priorityDiff =
    PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
  if (priorityDiff !== 0) return priorityDiff;

  // 2. If same priority, earlier due date comes first
  return new Date(a.dueDate) - new Date(b.dueDate);
});
```

---

## 🚢 Deployment (Vercel)

### Backend

1. Import the repo into Vercel
2. Set **Root Directory** to `backend`
3. Add environment variables:
   - `MONGODB_URI` = your Atlas connection string
   - `NODE_ENV` = `production`
   - `CLIENT_URL` = your frontend Vercel URL
4. Deploy

### Frontend

1. Create a **second** Vercel project
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   - `VITE_API_URL` = `https://your-backend.vercel.app/tasks`
4. Deploy

---

## 🗃 MongoDB Schema

```
Task {
  title:       String  (required, max 100)
  description: String  (optional, max 500)
  dueDate:     Date    (required)
  priority:    Enum    [Low, Medium, High] (default: Medium)
  completed:   Boolean (default: false)
  createdAt:   Date    (auto)
  updatedAt:   Date    (auto)
}
```

---

## 📹 Loom Video

> [Watch the walkthrough →](#)  _(replace with your Loom link)_

Covers: app demo · code structure · sorting logic explanation

---

## 👤 Author

Built by **[Your Name]** for the Dyna Mass Tech Full Stack Developer Assessment.
