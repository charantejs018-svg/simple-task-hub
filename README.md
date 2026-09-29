# TaskFlow — Task Management App

A simple task manager with login/registration. All data is stored in your browser (localStorage) — no database, API keys or backend setup needed.

## Local setup

1. Download the project
2. Open the project folder in VS Code or Antigravity
3. Open Terminal
4. Run: npm install
5. Run: npm run dev
6. Open the localhost URL shown in the terminal

## Where things live

- `src/routes/` — pages (login, register, dashboard)
- `src/components/` — Navbar, Sidebar, TaskCard, TaskForm, ProtectedRoute, Modal
- `src/utils/storage.ts` — localStorage helpers (`users`, `currentUser`, `tasks_<userId>`)
