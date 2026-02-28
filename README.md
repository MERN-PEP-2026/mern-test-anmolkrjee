# MERN Task Management App

A full-stack MERN application for user authentication and task management with subtasks, status tracking, and priority/due-date organization.

## About This Project (6 Points)

1. **Secure user flow** – Users can register and log in, and are redirected to the dashboard on successful authentication.
2. **Task lifecycle management** – Create, update, and delete tasks with title, description, due date, and priority.
3. **Subtask support** – Add subtasks to tasks and track subtask completion status.
4. **Progress visibility** – Dashboard shows summary stats such as total, completed, blocked, and in-progress tasks.
5. **Sorting and prioritization** – Tasks are organized by due date and priority for faster planning.
6. **RESTful backend design** – Express + MongoDB API handles auth and task operations through modular controllers and routes.

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios
- Vite
- CSS Modules
- Lucide React (icons)

### Backend
- Node.js
- Express 5
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Bcrypt (`bcrypt`)
- CORS, Dotenv, Cookie Parser
- Nodemon (development)

## Project Structure

```text
mern-test-anmolkrjee/
├── Backend/
│   ├── controllers/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── TaskAdd.js
│   │   ├── TaskUpdate.js
│   │   ├── TaskDelete.js
│   │   ├── TaskWithId.js
│   │   ├── GetAllTask.js
│   │   └── AddSubTasks.js
│   ├── models/
│   │   ├── UserModel.js
│   │   └── TasksModel.js
│   ├── routes/
│   │   └── route.js
│   ├── index.js
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Register.jsx
│   │   │   └── TaskDashboard.jsx
│   │   ├── CSS/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## API Overview

### Auth
- `POST /api/auth/register` – Register a user
- `POST /api/auth/login` – Login user

### Tasks
- `POST /api/addtasks` – Create a task
- `POST /api/tasks` – Fetch all tasks for a user
- `GET /api/tasks/:id` – Get task by Task_ID
- `PUT /api/tasks/:id` – Update task / status
- `DELETE /api/tasks/:id` – Delete task
- `POST /api/tasks/:id/subtasks` – Add subtask

## Run Locally

### 1) Clone and open project
```bash
git clone <your-repo-url>
cd mern-test-anmolkrjee
```

### 2) Install dependencies
```bash
cd Backend
npm install

cd ..\Frontend
npm install
```

### 3) Create environment files

Create `Backend/.env`:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN=your_jwt_secret
```

Create `Frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:3000
```

### 4) Start backend
```bash
cd Backend
npm start
```

### 5) Start frontend (new terminal)
```bash
cd Frontend
npm run dev
```

### 6) Open app
- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:3000/`

## Notes

- Ensure MongoDB is running (local or Atlas URI).
- Backend is configured with CORS credentials, so keep frontend URL aligned with `CORS_ORIGIN`.
- If login/register succeeds but dashboard fails to load tasks, verify `VITE_API_BASE_URL` and backend port.