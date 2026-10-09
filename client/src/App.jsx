import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Events from './pages/Events';
import Clubs from './pages/Clubs';
import Calendar from './pages/Calendar';
import MyRegistrations from './pages/MyRegistrations';

export default function App() {
  const [currentTab, setCurrentTab] = useState('My Registrations');

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Sidebar */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 overflow-y-auto">
          {currentTab === 'Home' && <Home />}
          {currentTab === 'Events' && <Events />}
          {currentTab === 'Clubs' && <Clubs />}
          {currentTab === 'Calendar' && <Calendar />}
          {currentTab === 'My Registrations' && <MyRegistrations />}
        </main>
      </div>
    </div>
  );
}