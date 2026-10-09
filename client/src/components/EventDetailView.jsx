import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  CalendarPlus,
  Building2,
  FileText
} from 'lucide-react';

export default function EventDetailView({ event, onBack }) {
  const [activeTab, setActiveTab] = useState('About');

  if (!event) return null;

  const tabs = ['About', "What You'll Learn", 'Schedule', 'Organizers', 'FAQs'];

  const scheduleItems = [
    { time: '10:00 AM', title: 'Registration & Check-in' },
    { time: '10:30 AM', title: 'Opening Ceremony' },
    { time: '11:00 AM', title: 'Workshop Session 1' },
    { time: '1:00 PM', title: 'Lunch Break' },
    { time: '2:00 PM', title: 'Hands-on Session' },
    { time: '4:00 PM', title: 'Certificate Distribution' },
  ];

  const learningPoints = [
    'Machine Learning fundamentals & core principles',
    'Real-world AI applications and industry usage',
    'Building and training your first ML model from scratch',
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </button>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col lg:flex-row justify-between gap-6">
        <div className="flex flex-col md:flex-row gap-6 flex-1">
          {/* Event Image Banner */}
          <div className="w-full md:w-80 h-48 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Event Quick Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-800">{event.title}</h1>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full text-emerald-700 bg-emerald-100`}>
                {event.tag}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{event.date}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{event.location}, IMS Engineering College</span>
              </p>
              <p className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>Organized by: <strong>CSI Club</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span>{event.registered}/{event.capacity} Registered</span>
              </p>
            </div>

            {/* Action Badges */}
            <div className="flex items-center gap-3 pt-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> You're Registered
              </span>
              <button className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-white px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors">
                <FileText className="w-4 h-4" /> View Certificate
              </button>
            </div>
          </div>
        </div>

        {/* Pricing / CTA Sidebar Card */}
        <div className="w-full lg:w-64 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800">FREE</h2>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {event.registered}/{event.capacity} Registered
            </p>
          </div>

          <div className="space-y-2 mt-4">
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm">
              <CheckCircle className="w-4 h-4" /> Registered
            </button>
            <button className="w-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
              <CalendarPlus className="w-3.5 h-3.5" /> Add to Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="border-b border-slate-200 flex gap-6 text-sm font-medium">
        {tabs.map((tab) => (
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

      {/* Tab Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-2">About the Event</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {event.description} Join us for an interactive session where you'll get hands-on experience and learn from industry experts. This event is perfect for beginners and anyone who wants to dive deeper into the field.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-800 mb-3">What You'll Learn</h3>
            <ul className="space-y-2">
              {learningPoints.map((pt, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column - Event Schedule Timeline */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-base font-bold text-slate-800 mb-4">Event Schedule</h3>
          <div className="space-y-4">
            {scheduleItems.map((item, idx) => (
              <div key={idx} className="flex items-center text-xs">
                <span className="w-20 font-medium text-slate-500">{item.time}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-3 shrink-0"></span>
                <span className="text-slate-700 font-medium">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}