# GoAvo Mini Event Management Platform

Built as part of the GoAvo.ai engineering assignment.

## Stack
- **Frontend** — React + TypeScript + Vite
- **Backend** — Node.js + Express
- **Database** — MongoDB Atlas
- **Email** — Resend
- **Extension** — Google Calendar (Extension F)

## Live Demo
- Frontend: `https://assingment-lime-two.vercel.app/`
- Backend: `https://assingment-ss1u.vercel.app/`

## Local Setup

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

Add your environment variables to `.env` before running.
MONGODB_URL= VALUE
RESEND_API_KEY=VALUE
RESEND_FROM_EMAIL=onboarding@resend.dev
JWT_SECRET=VALUE
GOOGLE_CLIENT_ID=VALUE
GOOGLE_CLIENT_SECRET=VALUE
GOOGLE_REDIRECT_URI=VALUE
FRONTEND_URL=VALUE

## How it works
Organizers sign up, create events, and share a public URL. Attendees register via that URL. Two RSVP modes — Open (instant confirmation) and Shortlisted (manual approval). Emails fire on every status change via Resend. Google Calendar syncs automatically on publish, edit, and cancellation — failures never break core flows.

## Author
Shreya Shaw
