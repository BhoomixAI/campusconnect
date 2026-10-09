import React, { useState } from 'react';
import QRGenerator from '../components/QRGenerator';
import AttendanceScanner from '../components/AttendanceScanner';
import { QrCode, ScanLine } from 'lucide-react';

export default function Attendance() {
  const [role, setRole] = useState('organizer'); // 'organizer' | 'student'

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Smart Attendance</h1>
        <p className="text-xs text-slate-500 mt-1">
          Anti-proxy rotating QR verification with location geofencing.
        </p>
      </div>

      {/* Role Switcher Toggle */}
      <div className="flex justify-center">
        <div className="bg-slate-200/70 p-1 rounded-2xl flex gap-1">
          <button
            onClick={() => setRole('organizer')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              role === 'organizer'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4" /> Organizer View (Display QR)
          </button>
          <button
            onClick={() => setRole('student')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              role === 'student'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ScanLine className="w-4 h-4" /> Student View (Scan QR)
          </button>
        </div>
      </div>

      {/* View Rendering */}
      <div className="pt-4">
        {role === 'organizer' ? <QRGenerator /> : <AttendanceScanner />}
      </div>
    </div>
  );
}