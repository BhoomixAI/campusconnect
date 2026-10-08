import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import UpcomingEvents from './components/UpcomingEvents';
import SidebarRight from './components/SidebarRight';

export default function App() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-8 flex-1 overflow-y-auto">
          {/* Welcome Greeting */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Good Morning, Devang 👋</h2>
            <p className="text-gray-500 text-sm">Discover what's happening on your campus.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Center Feed */}
            <div className="flex-1 min-w-0">
              <HeroBanner />
              <UpcomingEvents />
            </div>

            {/* Right Widget Column */}
            <SidebarRight />
          </div>
        </main>
      </div>
    </div>
  );
}