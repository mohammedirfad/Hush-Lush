# Hush Lush Restaurant Assignment

Responsive full-stack restaurant ordering demo built from the provided login and menu references.

## Completed Features

- Responsive React login screen based on the supplied Hush Lush UI.
- Email/password validation with clear inline errors.
- Password visibility toggle, submit loading state, success state, and API error state.
- Mock authentication flow through an Express backend.
- Guest sign-in flow.
- Restaurant menu screen with promo banner, category filters, search, empty state, cart interactions, and bottom navigation.
- Subtle micro-interactions for form fields, buttons, category tabs, cards, and cart updates.
- Reusable frontend components and separated auth/data services.
- Basic tests for validation and auth behavior.

## Test Credentials

- Email: `irfad@example.com`
- Password: `Password@123`

Guest access is available from the login screen.

## Local Setup

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env` when running against the backend locally:

```bash
VITE_API_BASE_URL=http://localhost:4000
```

## Deployment

### Backend on Render

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variable: `FRONTEND_ORIGIN=https://your-vercel-domain.vercel.app`

### Frontend on Vercel

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://your-render-service.onrender.com`

## Known Limitations

- Authentication is mocked for the assignment and does not use a real database.
- Social login buttons are visual only.
- Cart state is stored in memory for the current browser session.
