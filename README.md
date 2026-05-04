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

