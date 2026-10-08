import React, { useState } from 'react';
import { Search } from 'lucide-react';
import EventCard from '../components/EventCard';

const CATEGORIES = [
  'All',
  'Technical',
  'Cultural',
  'Sports',
  'Workshop',
  'Hackathon',
  'Seminar',
  'Competition',
];

const EVENTS_DATA = [
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
  {
    id: 5,
    title: 'Hackathon 2026',
    description: '36 hours of non-stop coding, problem solving, and product building.',
    tag: 'Hackathon',
    tagColor: 'bg-indigo-600',
    date: '28 Oct 2026 • 9:00 AM',
    location: 'IT Block',
    registered: 110,
    capacity: 200,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 6,
    title: 'Career Guidance Seminar',
    description: 'Interact with industry leaders and alumni on career growth and placement strategy.',
    tag: 'Seminar',
    tagColor: 'bg-sky-600',
    date: '02 Nov 2026 • 11:00 AM',
    location: 'Auditorium 2',
    registered: 95,
    capacity: 150,
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600',
  },
];

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = EVENTS_DATA.filter((evt) => {
    const matchesCategory =
      selectedCategory === 'All' || evt.tag.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Title Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Discover Campus Events</h1>
        <p className="text-xs text-slate-500 mt-1">
          Find and join exciting events, workshops, competitions and more at IMS.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, workshops, clubs..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {filteredEvents.map((evt) => (
          <EventCard key={evt.id} event={evt} />
        ))}
      </div>
    </div>
  );
}