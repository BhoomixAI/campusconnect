-- Campus Connect seed data (Step 1).
-- Run AFTER schema.sql in the Supabase SQL editor.
-- Sample venues, users (one per role), and timetable rows.

-- Venues (Bangalore-area coordinates for geofence testing).
insert into venues (name, capacity, latitude, longitude) values
  ('Main Auditorium', 500, 12.9716, 77.5946),
  ('Seminar Hall B', 120, 12.9720, 77.5950),
  ('Open Air Theatre', 1000, 12.9705, 77.5935)
on conflict do nothing;

-- Users: student, organizer, faculty, hod, dean.
insert into users (name, email, role, department, year) values
  ('Aarav Sharma', 'aarav.student@example.com', 'student', 'CSE', 2),
  ('Priya Nair', 'priya.organizer@example.com', 'organizer', 'CSE', 3),
  ('Dr. Mehta', 'mehta.faculty@example.com', 'faculty', 'CSE', null),
  ('Dr. Rao', 'rao.hod@example.com', 'hod', 'CSE', null),
  ('Dr. Iyer', 'iyer.dean@example.com', 'dean', 'CSE', null)
on conflict (email) do nothing;

-- Timetable: CSE Year 2, Monday (0) + Tuesday (1), 09:00-16:00 blocks.
-- weekday convention: 0=Monday .. 6=Sunday.
insert into timetable (department, year, weekday, start_time, end_time) values
  ('CSE', 2, 0, '09:00', '10:00'),
  ('CSE', 2, 0, '10:00', '11:00'),
  ('CSE', 2, 0, '11:15', '12:15'),
  ('CSE', 2, 0, '14:00', '16:00'),
  ('CSE', 2, 1, '09:00', '10:00'),
  ('CSE', 2, 1, '10:00', '11:00'),
  ('CSE', 2, 1, '14:00', '15:00');
