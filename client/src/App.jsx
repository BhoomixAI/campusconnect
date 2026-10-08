import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Events from './pages/Events';

export default function App() {
  const [currentTab, setCurrentTab] = useState('Events'); // Default set to 'Events' page

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
        </main>
      </div>
    </div>
  );
}