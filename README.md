# CampusLink

CampusLink monorepo with one shared backend and three role-specific frontends.

- Backend: :5000
- Student frontend: :3001
- Recruiter frontend: :3002
- TPO frontend: :3003

## Layout
```
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
```

The three original repositories remain intact and are referenced as Git submodules.