# Ragavi's RecipeHub

A full-stack recipe sharing community built with React, Node.js, Express.js, MongoDB, and JWT authentication.

## Features

- JWT signup and login
- User and admin roles
- Community recipe feed with search and filters
- Create, edit, and delete recipes with ownership checks
- Favorite recipes page
- Comments and 1-5 star ratings
- Admin dashboard for full recipe management
- Responsive UI with dark mode toggle

## Project Structure

- `client/` React frontend built with Vite
- `server/` Express API with MongoDB models and JWT middleware

## Setup

1. Install dependencies from the repository root:

   ```bash
   npm install
   ```

2. Create environment files:

   `server/.env`

   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/recipe_sharing_app
   JWT_SECRET=replace_with_a_long_random_secret
   CLIENT_URL=http://localhost:5173
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=change_me
   ADMIN_NAME=Admin User
   ADMIN_USERNAME=admin
   ```

   `client/.env`

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. Start both apps:

   ```bash
   npm run dev
   ```

## Backend Deployment On Render

This project uses a monorepo. If you want to deploy only the backend on Render, point the service to the repository root and use the server workspace scripts.

### 1. Create a new Render Web Service

- Connect your GitHub repository.
- Choose the repository root as the service root.
- Select the branch you want to deploy.

### 2. Set the build and start commands

- Build command:

   ```bash
   npm install
   ```

- Start command:

   ```bash
   npm start --workspace server
   ```

If you set the service root to `server/` instead of the repo root, you can use `npm start` as the start command.

### 3. Add environment variables in Render

Add these variables in the Render dashboard:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=https://recipe-hub-client.vercel.app
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
ADMIN_NAME=Admin User
ADMIN_USERNAME=admin
ADMIN_PROFILE_PIC=https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80
```

Notes:

- Do not set `PORT` manually on Render. Render provides the port automatically.
- `CLIENT_URL` should be the deployed frontend URL, such as your Vercel URL.
- `MONGODB_URI` should be your MongoDB Atlas connection string.

### 4. Deploy

- Click **Create Web Service** or **Deploy** in Render.
- Wait for the build to complete.
- Open the Render service URL and verify the backend is live.

### 5. Test the backend

After deployment, test these endpoints:

```bash
GET /api/health
POST /api/register
POST /api/login
GET /api/recipes
```

Example full URL:

```bash
https://your-render-service.onrender.com/api/health
```

## Frontend Deployment

If you deploy the frontend separately, build it with Vite and point it to the Render backend API URL.

- Build command:

   ```bash
   npm install
   npm run build --workspace client
   ```

- Output folder:

   ```bash
   client/dist
   ```

- Set the frontend API base URL to your Render backend API base URL, for example `https://recipehub-lr3g.onrender.com/api`.
- After changing `VITE_API_URL` in Vercel, redeploy the frontend so the new value is baked into the build.

## API

- `POST /api/register`
- `POST /api/login`
- `GET /api/recipes`
- `GET /api/recipes/:id`
- `POST /api/recipes`
- `PUT /api/recipes/:id`
- `DELETE /api/recipes/:id`
- `POST /api/recipes/:id/comment`
- `POST /api/recipes/:id/rate`
- `POST /api/favorites/:recipeId`
- `GET /api/favorites`
- `GET /api/admin/users`

