-- Campus Connect schema (Step 1).
-- Run this once in the Supabase SQL editor.
-- UUID primary keys, timestamps in UTC (timestamptz defaults to now()).

create extension if not exists "pgcrypto";

-- Users: students, club organizers, faculty advisors, HODs, deans.
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  role text not null check (role in ('student', 'organizer', 'faculty', 'hod', 'dean')),
  department text,
  year int,
  created_at timestamptz not null default now()
);

-- Venues with geolocation for the 100 m check-in geofence.
create table if not exists venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  capacity int not null check (capacity > 0),
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now()
);

-- Events: pending until all 3 approval steps pass.
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  club text,
  organizer_id uuid references users (id) on delete set null,
  venue_id uuid references venues (id) on delete set null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  target_dept text,
  target_year int,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);

-- Multi-level approvals: faculty (1) -> hod (2) -> dean (3).
create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id) on delete cascade,
  approver_role text not null check (approver_role in ('faculty', 'hod', 'dean')),
  step_order int not null check (step_order in (1, 2, 3)),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  comment text,
  updated_at timestamptz not null default now(),
  unique (event_id, step_order)
);

-- One registration per (event, user).
create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id) on delete cascade,
  user_id uuid not null references users (id) on delete cascade,
  registered_at timestamptz not null default now(),
  unique (event_id, user_id)
);

-- Proxy-proof attendance: one check-in per (event, user).
create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id) on delete cascade,
  user_id uuid not null references users (id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  lat double precision,
  lng double precision,
  unique (event_id, user_id)
);

-- Verifiable certificates: one per attendee per event.
create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id) on delete cascade,
  user_id uuid not null references users (id) on delete cascade,
  issued_at timestamptz not null default now(),
  unique (event_id, user_id)
);

-- Post-event feedback (rating 1-5).
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id) on delete cascade,
  user_id uuid not null references users (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

-- Class timetable for clash detection. weekday: 0=Monday .. 6=Sunday.
create table if not exists timetable (
  id uuid primary key default gen_random_uuid(),
  department text not null,
  year int not null,
  weekday int not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  check (end_time > start_time)
);

-- Helpful indexes.
create index if not exists idx_events_status on events (status);
create index if not exists idx_events_venue_time on events (venue_id, start_time, end_time);
create index if not exists idx_events_audience on events (target_dept, target_year);
create index if not exists idx_approvals_event on approvals (event_id);
create index if not exists idx_registrations_event on registrations (event_id);
create index if not exists idx_attendance_event on attendance (event_id);
create index if not exists idx_timetable_dept_year_day on timetable (department, year, weekday);
