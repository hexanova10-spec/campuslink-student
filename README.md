# CampusLink

CampusLink monorepo with one shared API backend and three role-specific frontends.

| Service | Port | Purpose |
|---|---:|---|
| Backend API | 5000 | Shared Express API |
| Student frontend | 3001 | Student portal |
| Recruiter frontend | 3002 | Recruiter portal |
| TPO frontend | 3003 | TPO portal |

All three frontends proxy `/api/*` to `http://localhost:5000`.

## Layout

    campuslink/
    ├── backend/
    │   ├── server.ts
    │   ├── server/db/
    │   ├── server/services/
    │   ├── package.json
    │   └── .env.example
    ├── frontend-student/
    ├── frontend-recruiter/
    └── frontend-tpo/

## Run

Install root dependencies, configure `backend/.env`, then run `npm run dev`.

Backend health check: `GET http://localhost:5000/api/health`.

The three original repositories remain intact and are referenced as Git submodules. Frontend proxy/port changes are maintained in their respective repositories.