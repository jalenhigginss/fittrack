# FitTrack: Personal Workout Tracker

FitTrack is a full-stack fitness web app that lets you:

- Register and log in with your own account
- Log workouts with exercises, sets, reps, weight, and date
- Organize workouts by category (Push, Pull, Legs, Abs, etc.)
- View your past workouts in a timeline
- See a motivational quote on each visit

The app is built with a React frontend, a Node/Express backend, and a PostgreSQL database deployed on Render.

---

**Setup Instructions**
1. Clone the repo
git clone https://github.com/jalenhigginss/fittrack.git
cd fittrack

2. Install dependencies

Install backend deps:

cd server
npm install


Install frontend deps:

cd ../client
npm install
---

Environment Variables

In /server/.env include:

PORT=5000
DATABASE_URL=postgresql://fittrack_db_kwcu_user:6StftFrhNxlZxhftOdVZnDMDjBwKeRk5@dpg-d4s7b68gjchc7388bj50-a/fittrack_db_kwcu
JWT_SECRET=established2003aura67
MOTIVATION_API_URL=https://type.fit/api/quotes

Database Setup

Run PostgreSQL schema:

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  exercise VARCHAR(255),
  duration INT,
  date DATE DEFAULT CURRENT_DATE
);

Deployed App URL
(https://fittrack-1-rooa.onrender.com/)

This project taught me how to bring together every part of a full-stack application — frontend, backend, database, authentication, and deployment — into one working system. I learned how each component communicates and how important it is to structure code clearly so everything integrates smoothly. This was my first time deploying a full-stack app, so I gained experience with real-world environments, build pipelines, and debugging deployment failures.

Design Choices
Frontend Framework (React + Vite)

I chose React because:
It allows fast development with reusable components.
Hooks make state management easier and cleaner.

Backend Structure (Node.js + Express)
I used Express because:
My API includes GET, POST, PUT, and DELETE routes, proper status codes, and JSON responses.
Database Schema (PostgreSQL)
PostgreSQL was chosen because:
It handles structured relational data well.
It supports relationships, which I needed for users and their workouts.

Challenges
1. Deployment Issues on Render

## Features

- **User Authentication**
  - Register with email + password
  - Login, logout, and protected API routes using JWT

- **Workout Logging**
  - Select category and exercise
  - Enter sets, reps, weight, and optional workout name
  - Saves to your user account in PostgreSQL

- **Exercise Categories & Preset Exercises**
  - Default categories: Push, Pull, Legs, Abs, Shoulders, Arms, Full Body, etc.
  - Default exercises seeded per category (e.g., Bench Press, Lat Pulldown)

- **Workout History**
  - List of previous workouts grouped by date
  - Shows exercise, sets, reps, and weight

- **Motivational Quotes**
  - Fetches a motivational quote from an external API and displays it at the top

---

