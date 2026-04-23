# Aksraya Health Care ERP

Next.js 14 + Supabase ERP scaffold for Aksraya Health Care.

## Setup
1. Copy `.env.example` to `.env.local`.
2. Install dependencies: `npm install`.
3. Run dev server: `npm run dev`.
4. Apply SQL files in `supabase/migrations` in sequence.
5. Run `supabase/seed.sql` to seed sample data.

## Environment variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Included modules
- Auth and middleware guard
- Admin layout and pages (dashboard, leads, patients, cases, staff, schedule, visits, billing, reports)
- Nurse mobile layout and visit pages
- Supabase migrations with RLS policies
- Seed data
