# CampusBite

HRPG Campus Bite is a campus canteen ordering app with a React/Vite frontend and an
Express/MongoDB API.

## Run in normal mode

1. Copy the example environment files and add your own values:

   ```sh
   cd backend
   copy .env.example .env

   cd ../CanteenManagementSystem
   copy .env.example .env
   ```

2. Install dependencies and start the API:

   ```sh
   cd ../backend
   npm install
   npm run dev
   ```

3. In a second terminal, start the frontend:

   ```sh
   cd ../CanteenManagementSystem
   npm install
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`

Default admin account:

- Email: `admin@campus.edu`
- Password: `Admin@123`

Use this account to sign in and add menu items from the admin dashboard.

The frontend uses `http://localhost:5000/api` by default. To use another API
address, set `VITE_API_URL` in the frontend environment (for example,
`http://localhost:5000/api`).

## API features

- Register, sign in, and restore the current user.
- Browse and manage menu items.
- Place orders, view a student's order history, and update order status as an
  administrator.
- Load administrator dashboard statistics.

Public registration creates student accounts. Administrator accounts must be
provisioned by the campus administrator.
