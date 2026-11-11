# API Documentation

Base URL: `http://localhost:5000/api`

## Auth
- POST `/auth/register` — patient registration
- POST `/auth/login` — login; sets httpOnly cookie
- POST `/auth/logout` — clears session cookie
- GET `/auth/me` — current user (protected)

## Public
- GET `/tests?q=&category=&fasting=`
- GET `/tests/:id`
- GET `/packages`
- GET `/branches`
- GET `/posts`
- GET `/faqs`
- POST `/messages`

## Patient
- POST `/bookings` — server-calculated booking; patient role
- GET `/bookings/mine`
- GET `/reports/mine`
- GET `/reports/:id/download` — ownership/role authorization
- GET/POST `/family`

## Staff/Admin
- GET `/bookings`
- PATCH `/bookings/:id/status`
- POST `/reports/:bookingId` — multipart form field `report`, PDF/JPG/PNG, max 5 MB
- GET `/admin/summary` — admin only
- POST/PATCH/DELETE `/admin/tests`
- GET/PATCH `/admin/messages`

## AI
- POST `/ai/chat` — authenticated, rate limited; optional Groq provider.

All protected routes use role middleware. Request bodies are validated on key user-input routes with Zod. More endpoint tests should be added before final delivery.
