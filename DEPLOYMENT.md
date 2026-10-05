# Hush Lush Deployment Guide

This project has two deployable parts:

- `backend`: Node/Express API. Host this on Render.
- `frontend`: React/Vite app. Host this on Vercel.

The current assignment version uses mock data from JavaScript files, so a database is not required to deploy it. If you want real registered users, saved menu data, orders, or cart history, use PostgreSQL.

## 1. Push The Project To GitHub

Render and Vercel work best when connected to a GitHub repository.

```bash
git add .
git commit -m "Prepare deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

If the remote already exists, only run:

```bash
git push
```

## 2. Deploy Backend On Render

1. Open Render.
2. Click **New +**.
3. Choose **Web Service**.
4. Connect your GitHub repository.
5. Select this project repository.
6. Use these settings:

| Setting | Value |
| --- | --- |
| Name | `hush-lush-api` |
| Root Directory | `backend` |
| Runtime | `Node` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | Free or paid |

7. Add environment variables:

| Key | Value |
| --- | --- |
| `FRONTEND_ORIGIN` | Temporary value: `http://localhost:5173` |
| `JWT_SECRET` | A long random secret string |

Example `JWT_SECRET`:

```text
hush-lush-prod-change-this-to-a-long-random-value-2026
```

8. Click **Create Web Service**.
9. Wait for deployment to finish.
10. Copy your Render backend URL.

It will look like this:

```text
https://hush-lush-api.onrender.com
```

11. Test the backend health URL in the browser:

```text
https://hush-lush-api.onrender.com/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "hush-lush-api"
}
```

## 3. Deploy Frontend On Vercel

1. Open Vercel.
2. Click **Add New Project**.
3. Import the same GitHub repository.
4. Configure the project:

| Setting | Value |
| --- | --- |
| Framework Preset | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

5. Add this environment variable:

| Key | Value |
| --- | --- |
| `VITE_API_BASE_URL` | Your Render backend URL |

Example:

```text
VITE_API_BASE_URL=https://hush-lush-api.onrender.com
```

6. Click **Deploy**.
7. After deployment, copy your Vercel frontend URL.

It will look like this:

```text
https://hush-lush.vercel.app
```

## 4. Update Render CORS Setting

After Vercel gives you the final frontend URL, go back to Render.

1. Open the `hush-lush-api` service.
2. Go to **Environment**.
3. Update `FRONTEND_ORIGIN`.
4. Set it to your Vercel URL.

Example:

```text
FRONTEND_ORIGIN=https://hush-lush.vercel.app
```

5. Save changes.
6. Render will redeploy automatically.

This step is required because the backend only accepts browser requests from the configured frontend domain.

## 5. Final Test

Open your Vercel frontend URL and test:

1. Login page loads.
2. Login works with:

```text
Email: irfad@example.com
Password: Password@123
```

3. Guest login works.
4. Menu screen loads.
5. Search and category filters work.
6. Browser console has no CORS errors.

## 6. Database Recommendation

For the current submitted assignment, do not add a database unless your document specifically requires persistent users or orders. The README already states that authentication is mocked and does not use a real database.

If you need a real database, use PostgreSQL.

Recommended options:

| Option | Best For |
| --- | --- |
| Render PostgreSQL | Simple because backend is already on Render |
| Supabase PostgreSQL | Best if you also want an admin dashboard, auth, storage, or easy table editing |
| Neon PostgreSQL | Good serverless PostgreSQL option |

For this project, the easiest choice is **Render PostgreSQL** because the backend is already deployed on Render.

## 7. What To Add If You Use PostgreSQL

You need to add these backend pieces:

1. PostgreSQL database service.
2. `DATABASE_URL` environment variable in Render.
3. Database client package.
4. Tables for users, menu items, and optionally orders.
5. Password hashing with `bcrypt`.
6. Auth service changes so login checks the database instead of `src/data/users.js`.
7. Menu route changes so menu items come from the database instead of `src/data/menu.js`.
8. Seed script to insert the test user and menu items.

Suggested backend packages:

```bash
cd backend
npm install pg bcrypt
```

Suggested tables:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  category TEXT NOT NULL,
  rating NUMERIC(2, 1) NOT NULL,
  badge TEXT,
  image TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending',
  total NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id TEXT NOT NULL REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL
);
```

Minimum environment variables with a database:

| App | Key | Example |
| --- | --- | --- |
| Render backend | `DATABASE_URL` | Render PostgreSQL internal database URL |
| Render backend | `JWT_SECRET` | Long random secret |
| Render backend | `FRONTEND_ORIGIN` | Vercel frontend URL |
| Vercel frontend | `VITE_API_BASE_URL` | Render backend URL |

## 8. Current Project Environment Variables

Backend on Render:

```text
FRONTEND_ORIGIN=https://your-vercel-domain.vercel.app
JWT_SECRET=your-long-random-secret
```

Frontend on Vercel:

```text
VITE_API_BASE_URL=https://your-render-service.onrender.com
```

Local frontend:

```text
VITE_API_BASE_URL=http://localhost:4000
```

## 9. Common Issues

### CORS Error

Problem:

```text
Not allowed by CORS
```

Fix:

Set Render `FRONTEND_ORIGIN` exactly to the Vercel URL. Do not add a trailing slash.

Correct:

```text
https://hush-lush.vercel.app
```

Wrong:

```text
https://hush-lush.vercel.app/
```

### Frontend Still Calls Localhost

Problem:

The deployed frontend tries to call `http://localhost:4000`.

Fix:

Add `VITE_API_BASE_URL` in Vercel and redeploy the frontend.

### Render Backend Sleeps

Free Render services can sleep when inactive. The first request after sleeping may be slow. This is normal on the free plan.

### Login Fails After Deployment

Check:

1. Backend `/health` URL works.
2. Vercel has `VITE_API_BASE_URL`.
3. Render has `FRONTEND_ORIGIN`.
4. Render has `JWT_SECRET`.
5. You are using the correct test credentials.

