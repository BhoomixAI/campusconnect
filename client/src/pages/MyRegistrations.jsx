import React, { useState } from 'react';
import { Calendar, MapPin, Award, Zap, CheckSquare, Clock } from 'lucide-react';

export default function MyRegistrations() {
  const [activeTab, setActiveTab] = useState('Upcoming Events');

  const stats = [
    { label: 'Events', value: 12, icon: CheckSquare, color: 'text-blue-600 bg-blue-50' },
    { label: 'Certificates', value: 4, icon: Award, color: 'text-purple-600 bg-purple-50' },
    { label: 'Points', value: 320, icon: Zap, color: 'text-blue-600 bg-blue-50' },
    { label: 'Upcoming', value: 3, icon: Clock, color: 'text-emerald-600 bg-emerald-50' },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'AI & ML Workshop',
      date: '18 Oct 2026 • 10:00 AM',
      location: 'Seminar Hall',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200',
    },
    {
      id: 2,
      title: 'Cultural Fest - Antarang',
      date: '20 Oct 2026 • 4:00 PM',
      location: 'Main Auditorium',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=200',
    },
    {
      id: 3,
      title: 'Basketball Trials',
      date: '22 Oct 2026 • 2:00 PM',
      location: 'Basketball Court',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=200',
    },
  ];

  const subTabs = ['Upcoming Events', 'Event History', 'Certificates', 'Saved Events'];

  return (
    <div className="p-8 space-y-6">
      {/* Top Profile Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white p-6 shadow-md flex items-center gap-6 bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.7)), url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200")' }}>
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
          alt="Devang Dixit"
          className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 shadow-lg"
        />
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Devang Dixit</h1>
          <p className="text-xs text-blue-300 font-medium">CSE • 2nd Year</p>
          <p className="text-xs text-slate-300">IMS Engineering College</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800 leading-tight">{item.value}</p>
                <p className="text-xs text-slate-500 font-medium">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Sub-tabs */}
      <div className="border-b border-slate-200 flex gap-6 text-sm font-medium pt-2">
        {subTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Registered Events List */}
      {activeTab === 'Upcoming Events' && (
        <div className="space-y-3">
          {upcomingEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 text-base leading-tight truncate">
                    {evt.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {evt.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {evt.location}
                    </span>
                  </div>
                </div>
              </div>

              <button className="px-5 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-semibold rounded-xl transition-colors shrink-0">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab !== 'Upcoming Events' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          No records found under {activeTab}.
        </div>
      )}
    </div>
  );
}