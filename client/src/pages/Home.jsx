import React from 'react';
import HeroBanner from '../components/HeroBanner';
import UpcomingEvents from '../components/UpcomingEvents';
import SidebarRight from '../components/SidebarRight';

export default function Home() {
  return (
    <div className="p-8 flex gap-6">
      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Good Morning, Devang 👋</h2>
          <p className="text-xs text-slate-500 mt-1">Discover what's happening on your campus.</p>
        </div>
        <HeroBanner />
        <UpcomingEvents />
      </div>
      <SidebarRight />
    </div>
  );
}