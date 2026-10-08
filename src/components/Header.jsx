import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center justify-between py-4 px-8 bg-slate-50/50 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100">
      {/* Search Bar */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search events, clubs, workshops..."
          className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
        />
      </div>

      {/* Right User Controls */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Devang Dixit"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
          />
          <div className="text-left leading-tight">
            <p className="text-sm font-bold text-gray-800">Devang Dixit</p>
            <p className="text-xs text-gray-400">CSE • 2nd Year</p>
          </div>
        </div>
      </div>
    </header>
  );
}