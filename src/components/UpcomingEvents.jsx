import React from 'react';
import EventCard from './EventCard';
import { ArrowRight } from 'lucide-react';

export default function UpcomingEvents() {
  const events = [
    {
      title: 'AI & ML Workshop',
      category: 'Techno',
      date: '18 Oct 2026 • 10:00 AM',
      location: 'Seminar Hall',
      registered: 82,
      capacity: 150,
      badgeColor: 'bg-blue-600',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80',
    },
    {
      title: 'Cultural Fest - Antarang',
      category: 'Cultural',
      date: '20 Oct 2026 • 4:00 PM',
      location: 'Main Auditorium',
      registered: 120,
      capacity: 300,
      badgeColor: 'bg-pink-600',
      buttonColor: 'bg-pink-600 hover:bg-pink-700',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80',
    },
    {
      title: 'Basketball Trials',
      category: 'Sports',
      date: '22 Oct 2026 • 2:00 PM',
      location: 'Basketball Court',
      registered: 44,
      capacity: 60,
      badgeColor: 'bg-emerald-600',
      buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&auto=format&fit=crop&q=80',
    },
    {
      title: 'Web Development Workshop',
      category: 'Workshop',
      date: '25 Oct 2026 • 10:00 AM',
      location: 'Computer Lab 1',
      registered: 34,
      capacity: 60,
      badgeColor: 'bg-amber-500',
      buttonColor: 'bg-amber-500 hover:bg-amber-600',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Upcoming Events</h3>
        <button className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
          View All <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {events.map((evt, idx) => (
          <EventCard key={idx} {...evt} />
        ))}
      </div>
    </section>
  );
}