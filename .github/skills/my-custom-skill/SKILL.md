---
name: My Custom Skill
description: New joiner guide generator for this repo (setup, architecture, and contribution checklist)
---

# New Joiner Guide (NBA Sports Application)

This skill helps new joiners quickly understand how this repository works and how to contribute safely and effectively.

## What This Repo Is

- A workshop-style NBA companion app with a separated architecture:
	- **Frontend**: Next.js 14 + TypeScript + Tailwind + shadcn/ui
	- **Backend**: Python Flask REST API serving JSON-backed data
- Primary local URLs:
	- Frontend: `http://localhost:3000`
	- Backend API: `http://localhost:9090`

## Architecture (How It Works)

### High-level flow

1. Browser loads the UI from Next.js (`localhost:3000`).
2. Pages/components fetch data from Flask using `NEXT_PUBLIC_API_URL`.
3. Flask reads JSON files from `backend/data/` and responds via `/api/*`.
4. UI renders cards/lists based on API results.

### Backend (Flask)

- Entrypoint: `backend/app.py`
- Data source: `backend/data/*.json`
- Notable endpoints:
	- `GET /api/nba-results` → NBA game results
	- `GET /api/stadiums` → stadium data
	- `GET /api/player-info` → filtered player info
	- `GET /api/health` → health check
- CORS is enabled for the frontend origin(s), so the browser can call the API.

### Frontend (Next.js)

- App Router lives in `frontend/src/app/`
- Dashboard routes are grouped under `frontend/src/app/(dashboard)/`
	- `nba-scores` and `stadiums` are good examples of data-driven pages
- Shared UI:
	- Components: `frontend/src/components/`
	- shadcn/ui primitives: `frontend/src/components/ui/`
- Navigation entries are configured in `frontend/src/components/navigation.tsx`

## Quick Start (Windows)

### 1) Backend

From the repo root:

1. `cd backend`
2. `python -m venv venv`
3. `venv\Scripts\activate`
4. `pip install -r requirements.txt`
5. `python app.py`

Verify: open `http://localhost:9090/api/health`

### 2) Frontend

From the repo root (new terminal):

1. `cd frontend`
2. `npm install`
3. Create `frontend/.env.local` with:
	 - `NEXT_PUBLIC_API_URL=http://localhost:9090`
4. `npm run dev`

Verify: open `http://localhost:3000`

## Environment & Configuration

- `NEXT_PUBLIC_API_URL`
	- Controls where the UI fetches data from
	- Local default used in code paths is typically `http://localhost:9090`

## Testing

### Frontend unit tests (Jest)

- From `frontend/`: `npm test`

### End-to-end smoke flow (Playwright MCP)

This repo also supports automated UI flow testing via the Playwright MCP tooling.

- Report: `playwright-flow-report.json`
- Screenshot artifacts folder: `.playwright-mcp/`

## How To Contribute

### Common contributions

- **Frontend pages**
	- Add a new route: create `page.tsx` under `frontend/src/app/(dashboard)/your-route/`
	- Add it to the sidebar: update `frontend/src/components/navigation.tsx`
	- Use shadcn/ui primitives from `frontend/src/components/ui/` for consistency

- **Backend endpoints**
	- Add a new route in `backend/app.py` under `/api/...`
	- If you need new seed data, add a JSON file in `backend/data/`
	- Keep responses JSON-friendly and consistent (HTTP status codes + `{ error: ... }` on failures)

- **Data changes**
	- Update `backend/data/*.json` and verify pages that consume it still render correctly

### Contribution workflow (recommended)

1. Create a small, focused change
2. Run quick checks:
	 - UI still loads (`localhost:3000`)
	 - Relevant page still renders
	 - `npm test` (if you touched frontend logic)
3. Submit PR with:
	 - What changed
	 - How to test
	 - Screenshots (if UI changes)

## Code Style & Practices

- Prefer TypeScript types/interfaces for API responses.
- Use robust error handling and user-friendly UI fallbacks.
- Keep components small and reusable; avoid mixing unrelated responsibilities.
- Maintain existing patterns (App Router pages, shadcn/ui components, etc.).

## Troubleshooting

- **Frontend loads, but data is empty**
	- Confirm backend is running at `http://localhost:9090`
	- Confirm `NEXT_PUBLIC_API_URL` points to the backend
	- Hit `http://localhost:9090/api/health` directly

- **CORS errors in the browser console**
	- Ensure you are using `http://localhost:3000` (not a different port)
	- Verify backend CORS origins include your frontend origin

- **Port conflicts**
	- Backend runs on `9090`; if something else uses it, change the port in `backend/app.py` and update `NEXT_PUBLIC_API_URL`

## Prompt Template (How to Use This Skill)

Copy/paste into Copilot Chat to generate onboarding guidance for a specific change:

"Using my-custom-skill, explain how a new joiner can implement <feature> end-to-end in this repo. Include: relevant files, which endpoints/pages to touch, how to test locally, and a PR checklist."