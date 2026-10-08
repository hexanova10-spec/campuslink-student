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

## Unified backend architecture

- `backend/src/index.ts` — unified API entrypoint on port 5000
- `backend/src/config/db.ts` — PostgreSQL pool via `DATABASE_URL`
- `backend/src/middleware/auth.ts` — shared JWT identity extraction
- `backend/src/middleware/role.ts` — STUDENT / RECRUITER / TPO RBAC
- `backend/src/routes/recruiter.ts` — recruiter API contract
- `backend/src/routes/tpo.ts` — TPO placement-management API
- `backend/src/routes/ai.ts` — shared AI extension point
- `backend/server/db/unified-schema.sql` — shared recruitment/TPO PostgreSQL schema

The recruiter and TPO endpoints are now served by the same process as the student API. PostgreSQL is introduced as the shared persistence boundary; current route implementations retain seeded in-memory compatibility while database migration is rolled out incrementally.


### Database migration order
1. Run `backend/server/db/schema.sql`.
2. Run `backend/server/db/unified-schema.sql`.
3. For development/demo data, run `backend/server/db/seed-unified.sql`.
4. Set `DATABASE_URL` and start the backend with `npm run dev:backend`.

Recruiter and TPO route modules now call PostgreSQL repositories; route-local seeded arrays have been removed from the unified backend.
