import React from 'react';
import { Calendar, MapPin, ArrowRight, Award, Zap, Bookmark } from 'lucide-react';

export default function SidebarRight() {
  const stats = [
    { label: 'Events', value: '12', icon: Calendar, color: 'text-blue-600 bg-blue-50' },
    { label: 'Certificates', value: '4', icon: Award, color: 'text-amber-600 bg-amber-50' },
    { label: 'Points', value: '320', icon: Zap, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Upcoming', value: '3', icon: Bookmark, color: 'text-indigo-600 bg-indigo-50' },
  ];

  return (
    <aside className="w-80 space-y-6">
      {/* Featured Upcoming Event Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg relative overflow-hidden">
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Upcoming Event</span>
        <h4 className="font-bold text-lg mt-1 mb-3">AI & ML Workshop</h4>
        
        <div className="space-y-1.5 text-xs text-indigo-100 mb-4">
          <div className="flex items-center gap-2"><Calendar size={14} /> 18 Oct 2026 • 10:00 AM</div>
          <div className="flex items-center gap-2"><MapPin size={14} /> Seminar Hall</div>
        </div>

        <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all ml-auto">
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Your Stats */}
      <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
        <h4 className="font-bold text-gray-800 text-sm mb-4">Your Stats</h4>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-800 leading-tight">{stat.value}</p>
                  <p className="text-[10px] text-gray-400">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}