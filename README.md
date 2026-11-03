# Anmol Lab Website

A full-stack diagnostic laboratory website prototype built for the Codesaviours E-Training team project (2–14 November 2026).

## Technology
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT in httpOnly cookie + bcrypt + role middleware
- Uploads: Multer (private server storage)
- AI: Optional Groq API integration (server-side only)

## Project structure
- `client/` React application
- `server/` Express API, models, controllers, middleware and private file storage
- `docs/` planning, architecture, API, brand and handover documentation
- `docs/postman/` Postman collection

## Requirements
Node.js 20+ and MongoDB 6+.

## Setup
1. Copy `.env.example` to `server/.env` and update `MONGODB_URI` and `JWT_SECRET`.
2. Install dependencies:
   ```bash
   npm install
   npm install --prefix server
   npm install --prefix client
   ```
3. Seed sample data:
   ```bash
   npm run seed --prefix server
   ```
4. Start both applications:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173`. API health check: `http://localhost:5000/api/health`.

## Seed demo accounts
After seeding, use the following accounts (change passwords before any real use):
- Admin: `admin@anmol.test` / `Admin123!`
- Staff: `staff@anmol.test` / `Staff123!`
- Doctor: `doctor@anmol.test` / `Doctor123!`
- Patient: `patient@anmol.test` / `Patient123!`

These are fake development accounts and must never be used with real patient data.

## Important implementation notes
- Test catalog seed prices are clearly marked as sample prices. Confirm all prices and lab information with Anmol Lab.
- Reports are stored under `server/storage/`, outside the public frontend folder. The API checks ownership/role before download.
- No real patient data is included.
- AI is optional. Add `GROQ_API_KEY` to the server environment to enable it. The assistant is restricted to general lab information and must not diagnose.
- Email configuration is optional for local development; configure SMTP to send actual messages.
- This is an internship project prototype, not a certified clinical information system. Conduct security, privacy, legal and clinical review before real-world deployment.

## Git branch layout
The repository includes:
- `main`: project skeleton and shared documentation
- `feature/backend`: backend implementation
- `feature/frontend`: frontend implementation
- `integration/anmol-lab-complete`: combined runnable project

The feature branches are separate so they can be reviewed independently. The integration branch contains both parts for local testing. Push each branch separately and create PRs according to the team's agreed review/base-branch process.

## Client information still needed
See `docs/content-needed.md` for the complete checklist.
