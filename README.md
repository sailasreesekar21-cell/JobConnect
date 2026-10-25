# JobConnect – Online Job Portal

JobConnect is a beginner-friendly **BCA final-year** website. It is an online job portal where **job seekers** search and apply for jobs, **recruiters** post and manage vacancies, and an **administrator** reviews activity on the platform.

This project uses the **MERN stack**: MongoDB, Express.js, React.js, and Node.js.

## Project objectives

- Let job seekers create a profile, search jobs, and apply with a resume URL.
- Let recruiters post jobs, edit or delete their own listings, and update application status.
- Protect private pages with login tokens (JWT) and role checks on the server.
- Give students a complete, runnable academic demonstration.

## User roles

| Role | What they can do |
| --- | --- |
| Job seeker | Register, log in, update profile, search jobs, apply, view application status |
| Recruiter | Register, log in, post/edit/delete own jobs, view applicants, update status |
| Administrator | View users, recruiters, jobs, applications, summary numbers, and delete a listing |

Administrator accounts **cannot** be created from the registration pages. Use the `create-admin` script with your own email and password stored in `backend/.env`.

## Technologies

- Frontend: React.js, Vite, HTML5, CSS3, React Router, Fetch API
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Auth: JSON Web Tokens (JWT), bcryptjs password hashing
- Tools: npm, Cursor or VS Code, Git and GitHub

## Folder structure

```
JobConnect/
  frontend/          React website (Vite)
  backend/           Express API
  README.md
  .gitignore
```

Frontend and backend have **separate** `package.json` files. Install dependencies in each folder.

## Software you need (Windows)

1. **Node.js** (version 18 or newer) from https://nodejs.org  
   This also installs **npm**.
2. **MongoDB** in one of these two ways:
   - MongoDB Community Server on your PC, or
   - a free **MongoDB Atlas** cloud cluster
3. **Git** from https://git-scm.com (needed to upload the project to GitHub)

Check Node.js in **Command Prompt** or **PowerShell**:

```bat
node -v
npm -v
```

## 1. Copy environment files

### Backend

1. Open `backend`.
2. Copy `.env.example` and rename the copy to `.env`.
3. Fill in your own values. Do not share this file.

Important variables:

- `MONGODB_URI` – your database connection string
- `JWT_SECRET` – a long random string used to sign login tokens (not a password for logging into the website)
- `CLIENT_ORIGIN` – usually `http://localhost:5173`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` – used only when you run `npm run create-admin`
- `DEMO_SEED_PASSWORD` – used only when you run `npm run seed`

### Frontend

Copy `frontend/.env.example` to `frontend/.env`.

```
VITE_API_URL=http://localhost:5000/api
```

This is the public backend address. **Do not** put JWT secrets or database passwords in frontend environment variables.

## 2. Connect MongoDB

### Option A – MongoDB on your computer

1. Install MongoDB Community Server.
2. Start the MongoDB service (it often starts automatically).
3. Use this in `backend/.env`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/jobconnect
```

### Option B – MongoDB Atlas (cloud)

1. Create a free account at https://www.mongodb.com/atlas
2. Create a cluster.
3. Create a database user.
4. Allow your IP address (or `0.0.0.0/0` for a short classroom demo only).
5. Click **Connect** → **Drivers** and copy the connection string.
6. Replace `<password>` with your database user password.
7. Put the database name `jobconnect` in the path.
8. Paste the string into `MONGODB_URI`.

Never commit real Atlas usernames or passwords to GitHub.

## 3. Install and run the backend

Open **PowerShell**, then:

```bat
cd C:\Users\saila\Projects\JobConnect\backend
npm install
npm run dev
```

You should see:

```
MongoDB connected successfully.
JobConnect API listening on http://localhost:5000
```

If MongoDB is not running, the terminal will print a clear connection error. Start MongoDB or fix `MONGODB_URI`, then run `npm run dev` again.

Keep this window open.

## 4. Install and run the frontend

Open a **second** PowerShell window:

```bat
cd C:\Users\saila\Projects\JobConnect\frontend
npm install
npm run dev
```

Open the URL shown in the terminal, usually http://localhost:5173

## 5. Optional demonstration jobs

Sample jobs are labelled **Demonstration listing**. They are not real vacancies.

```bat
cd C:\Users\saila\Projects\JobConnect\backend
npm run seed
```

This creates a labelled demo recruiter `demo.recruiter@jobconnect.local` using `DEMO_SEED_PASSWORD` from `.env`.

## 6. Create an administrator (optional)

```bat
cd C:\Users\saila\Projects\JobConnect\backend
npm run create-admin
```

Then log in on the website with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set. Choose a strong password. Do not hard-code admin passwords in source files.

## 7. How to test the website

1. Open Home. You should see the heading **Find Your Dream Job**.
2. Register as a job seeker and complete the profile (name, phone, skills, education, experience).
3. In another browser or after logout, register as a recruiter and post a job.
4. Log in as the job seeker, open the job, apply with a resume URL such as a Google Drive link.
5. Try applying again to the same job. The API should reject the duplicate.
6. Log in as the recruiter, open **Manage jobs** → **Applicants**, and change status to Reviewed, Shortlisted, or Rejected.
7. Confirm the job seeker sees the new status under **My applications**.
8. Visit a private URL such as `/admin` while logged in as a job seeker. The app should send you away. The API also returns 401/403 without a valid admin token.

Backend checks:

```bat
cd C:\Users\saila\Projects\JobConnect\backend
npm test
```

## Common errors and solutions

| Problem | What to try |
| --- | --- |
| `Missing required environment variable: MONGODB_URI` | Create `backend/.env` from `.env.example`. |
| `MongoDB connection failed` | Start local MongoDB, or fix the Atlas string, password, and IP allow list. |
| `Cannot reach the JobConnect API` | Start the backend on port 5000. Check `VITE_API_URL`. |
| Frontend port already used | Close the other Vite app, or let Vite pick the next port and keep `CLIENT_ORIGIN` matching the browser URL. |
| `An account with this email already exists` | Log in instead, or use another email. |
| Git is not recognized | Install Git for Windows and reopen the terminal. |

## GitHub upload instructions

1. Install Git if it is missing.
2. Open PowerShell in the project folder.

```bat
cd C:\Users\saila\Projects\JobConnect
git init
git add .
git commit -m "Add JobConnect online job portal"
```

3. Create a **private or public** GitHub repository (do not upload `.env` files).
4. Connect and push:

```bat
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/JobConnect.git
git branch -M main
git push -u origin main
```

Replace `YOUR_GITHUB_USERNAME` with your GitHub username.

## Security notes for students

- Passwords are hashed with bcryptjs. The API never returns password hashes.
- Private routes need a JWT. Recruiters can only manage jobs they posted.
- Registration only allows `jobseeker` and `recruiter` roles.

## Academic honesty

Use this project as your own work only if your college rules allow it. Be ready to explain every page and API route during a viva.
