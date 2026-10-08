import React from 'react';
import EventCard from './EventCard';

const UPCOMING_EVENTS = [
  {
    id: 1,
    title: 'AI & ML Workshop',
    description: 'Learn the fundamentals of Machine Learning and build your first ML model.',
    tag: 'Technical',
    tagColor: 'bg-blue-600',
    date: '18 Oct 2026 • 10:00 AM',
    location: 'Seminar Hall',
    registered: 82,
    capacity: 150,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 2,
    title: 'Cultural Fest - Antarang',
    description: 'Show your talent, be a part of the biggest cultural fest of IMS.',
    tag: 'Cultural',
    tagColor: 'bg-purple-600',
    date: '20 Oct 2026 • 4:00 PM',
    location: 'Main Auditorium',
    registered: 120,
    capacity: 300,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 3,
    title: 'Basketball Trials',
    description: 'Show your skills and be a part of the IMS Basketball Team.',
    tag: 'Sports',
    tagColor: 'bg-emerald-600',
    date: '22 Oct 2026 • 2:00 PM',
    location: 'Basketball Court',
    registered: 44,
    capacity: 60,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 4,
    title: 'Web Development Workshop',
    description: 'Master full-stack development with React, Node.js, and modern tools.',
    tag: 'Workshop',
    tagColor: 'bg-amber-500',
    date: '25 Oct 2026 • 10:00 AM',
    location: 'Computer Lab 1',
    registered: 34,
    capacity: 60,
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600',
  },
];

export default function UpcomingEvents() {
  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Upcoming Events</h3>
        <button className="text-xs font-semibold text-blue-600 hover:underline">View All →</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {UPCOMING_EVENTS.map((evt) => (
          <EventCard key={evt.id} event={evt} />
        ))}
      </div>
    </section>
  );
}