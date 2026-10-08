import React from 'react';
import { Home, Calendar, Users, CalendarDays, CheckSquare, Trophy, Bell, Settings } from 'lucide-react';

export default function Sidebar() {
  const mainNav = [
    { icon: Home, label: 'Home', active: true },
    { icon: Calendar, label: 'Events' },
    { icon: Users, label: 'Clubs' },
    { icon: CalendarDays, label: 'Calendar' },
    { icon: CheckSquare, label: 'My Registrations' },
    { icon: Trophy, label: 'Leaderboard' },
  ];

  const exploreNav = [
    { icon: Bell, label: 'Notifications' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-[#0a1128] text-gray-300 flex flex-col justify-between p-4 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white border-2 border-blue-400">
            IMS
          </div>
          <div>
            <h1 className="text-white font-bold text-sm tracking-wide">IMS</h1>
            <p className="text-[10px] text-gray-400 tracking-wider">ENGINEERING COLLEGE</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  item.active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'hover:bg-slate-800/60 text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Explore Section */}
      <div>
        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Explore</p>
        <nav className="space-y-1">
          {exploreNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-slate-800/60 hover:text-white transition-all"
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}