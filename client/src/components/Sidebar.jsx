import React from 'react';
import {
  Home,
  Calendar,
  Users,
  CalendarDays,
  CheckSquare,
  Award,
  QrCode,
  FileCheck,
  Bell,
  Settings,
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab }) {
  const mainNav = [
    { name: 'Home', icon: Home },
    { name: 'Events', icon: Calendar },
    { name: 'Clubs', icon: Users },
    { name: 'Calendar', icon: CalendarDays },
    { name: 'My Registrations', icon: CheckSquare },
    { name: 'Leaderboard', icon: Award },
    { name: 'Attendance', icon: QrCode },
    { name: 'Approvals', icon: FileCheck }, // NEW
  ];

  const exploreNav = [
    { name: 'Notifications', icon: Bell },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0a0f1d] text-slate-300 flex flex-col justify-between p-4 min-h-screen border-r border-slate-800 shrink-0">
      <div>
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
            IMS
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-tight">IMS</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
              ENGINEERING COLLEGE
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setCurrentTab?.(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      <div>
        <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Explore
        </p>
        <nav className="space-y-1">
          {exploreNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800/60 text-slate-400 hover:text-white transition-all"
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}