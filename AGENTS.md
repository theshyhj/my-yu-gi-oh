# Repository Guidelines

## Project Structure & Module Organization
- `frontend/` is the Vue 3 + Vite app. `src/` contains `views/` (route pages), `components/`, `router/`, `stores/`, `api/`, and `assets/`.
- Public static files live in `frontend/public/`, and card images are stored in `frontend/public/img/`.
- `backend/` is the Express server. Routes are in `backend/routes/`, middleware in `backend/middleware/`, data files in `backend/data/`, and uploads in `backend/uploads/`.
- Entry points are `backend/server.js` and `backend/store.js`. MongoDB models are in `backend/models/`, and the seeding script is `backend/seed.js`.

## Build, Test, and Development Commands
- Install dependencies:
  - `cd backend && npm install`
  - `cd frontend && npm install`
- Run backend:
  - `npm run dev` (watch mode)
  - `npm start` (normal start)
- Run frontend:
  - `npm run dev` (Vite dev server)
  - `npm run build` (production build)
  - `npm run preview` (serve built assets)
- Seed data (MongoDB): `cd backend && node seed.js` (uses `MONGODB_URI`, default `mongodb://localhost:27017/yugioh`).

## Coding Style & Naming Conventions
- JavaScript uses ES modules (`type: module`). Keep 2-space indentation, single quotes, and omit semicolons to match existing code.
- Vue components and views use PascalCase filenames (e.g., `CardDetail.vue`, `Home.vue`).
- Backend route files are lowercase (e.g., `backend/routes/auth.js`).
- Keep API wrappers in `frontend/src/api/` and shared UI in `frontend/src/components/`.

## Testing Guidelines
- No test framework or test scripts are configured in the current `package.json` files.
- If you add tests, either colocate them near the module or add `backend/tests/` and `frontend/src/__tests__/`, and document the runner in `package.json`.

## Commit & Pull Request Guidelines
- This workspace does not include Git history, so there is no established commit message convention.
- Recommended format: `type(scope): summary` (e.g., `feat(frontend): add deck filter`).
- PRs should include a short description, testing notes, and UI screenshots or GIFs for frontend changes.

## Security & Configuration Tips
- Runtime data is read and written under `backend/data/`; treat these files as the local source of truth.
- The seed script connects to MongoDB using `MONGODB_URI` (default `mongodb://localhost:27017/yugioh`).
- User-uploaded files are served from `/uploads`; validate file types when changing upload logic.
