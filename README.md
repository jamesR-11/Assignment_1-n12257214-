Attendance & Time Tracking System (MERN)

A full-stack web app for recording staff/student login/logout times, managing tasks, and providing an admin panel to oversee users and attendance records. The app supports secure authentication, profile management, input validation, and CRUD flows for tasks and time entries.

Default admin (demo)
Email: admin@example.com
Password: 12345
Admin can view/update/delete users and attendance records.

✨ Features

Auth: Sign up, log in, log out (JWT), protected routes
Time tracking: Automatically record timestamps on login & logout
Dashboard: User can view all of their attendance records
Tasks: Create, read, update, delete tasks

Admin panel:
Manage users (view/update/delete)
Manage attendance records (view/update/delete)
Validation: Email + input validation on client & server
Testing: Jest + React Testing Library (frontend), backend tests
CI: GitHub Actions workflow using npm (no Yarn)

🧱 Tech Stack

Frontend: React, React Router, Context API, Axios, Tailwind CSS (utility classes)

Backend: Node.js, Express, MongoDB (Mongoose), JWT

Testing: Jest, @testing-library/react, Supertest (if used on backend)

Tooling: ESLint, Prettier, GitHub Actions

📁 Project Structure
time_and_tracking_system/
├── backend/
│   ├── src/…                 
│   ├── package.json
│   └── .env                 
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── axiosConfig.jsx   
│   │   ├── context/AuthContext.js
│   │   ├── components/…
│   │   └── pages/…           
│   ├── package.json
│   └── .env                  
└── .github/workflows/backend-ci.yml
