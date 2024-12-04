# Smart Meal Planner

**Smart Meal Planner** is a full-stack application designed to simplify meal planning, inventory management, and recipe exploration. Users can track their inventory, plan meals, explore recipes, and manage dietary preferences efficiently.

## Features

- **User Authentication**: Secure login, registration, and password management.
- **Recipes**: Explore recipes, filter by cuisine, view details, and mark favorites.
- **Inventory Management**: Add, edit, and manage ingredients with quantity, unit, and expiry tracking.
- **Meal Plans**: Create meal plans and associate recipes with specific dates and meals.
- **Profiles**: Support for multiple profiles with dietary preferences.
- **Shopping Lists**: Generate shopping lists based on meal plans.

## Tech Stack

- **Frontend**: Angular with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)

## Setup Instructions

### Prerequisites
- Node.js and npm
- PostgreSQL
- Angular CLI

### Backend Setup
1. Clone the repository and navigate to the backend folder:
   ```
   git clone <repository-url>
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Configure `.env` file:
   ```env
   DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
   JWT_SECRET=your_jwt_secret
   ```
4. Run database migrations:
   ```
   node migrations.js
   ```
5. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend server:
   ```
   ng serve
   ```

### Running the Application
- Frontend: [http://localhost:4200](http://localhost:4200)
- Backend: [http://localhost:3000](http://localhost:3000)


## Environment Variables
Ensure the following environment variables are set:
- `DATABASE_URL`: Connection string for PostgreSQL
- `JWT_SECRET`: Secret key for JWT authentication


## Folder Structure
```
- backend/
  - migrations.js       # Database setup script
  - routes/             # API routes
  - models/             # Database models
  - controllers/        # Business logic
- frontend/
  - src/
    - app/              # Angular components
    - assets/           # Static assets
    - environments/     # Environment configs
```
