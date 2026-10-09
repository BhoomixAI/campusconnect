import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, ArrowRight } from 'lucide-react';

// Sample events dictionary keyed by "YYYY-MM-DD"
const SAMPLE_EVENTS = {
  '2026-10-18': [
    {
      id: 1,
      title: 'AI & ML Workshop',
      tag: 'Technical',
      tagBg: 'bg-blue-100 text-blue-700',
      time: '10:00 AM - 4:00 PM',
      location: 'Seminar Hall',
      accentColor: 'bg-blue-600',
      dots: ['bg-blue-600'],
    },
    {
      id: 2,
      title: 'Basketball Trials',
      tag: 'Sports',
      tagBg: 'bg-emerald-100 text-emerald-700',
      time: '2:00 PM - 4:00 PM',
      location: 'Basketball Court',
      accentColor: 'bg-pink-500',
      dots: ['bg-pink-500'],
    },
    {
      id: 3,
      title: 'Cultural Club Auditions',
      tag: 'Cultural',
      tagBg: 'bg-rose-100 text-rose-700',
      time: '4:00 PM - 7:00 PM',
      location: 'Open Stage',
      accentColor: 'bg-amber-500',
      dots: ['bg-amber-500'],
    },
  ],
  '2026-10-06': [{ id: 4, title: 'Code Review Session', tag: 'Tech', tagBg: 'bg-emerald-100 text-emerald-700', time: '11:00 AM', location: 'Lab 2', accentColor: 'bg-emerald-500', dots: ['bg-emerald-500'] }],
  '2026-10-08': [{ id: 5, title: 'Hackathon Prep Meeting', tag: 'Workshop', tagBg: 'bg-blue-100 text-blue-700', time: '3:00 PM', location: 'Room 301', accentColor: 'bg-blue-600', dots: ['bg-blue-600', 'bg-rose-500'] }],
  '2026-11-05': [{ id: 6, title: 'Tech Fest Kickoff', tag: 'Technical', tagBg: 'bg-purple-100 text-purple-700', time: '10:00 AM', location: 'Auditorium', accentColor: 'bg-purple-600', dots: ['bg-purple-600'] }],
  '2026-11-14': [{ id: 7, title: 'Diwali Celebration & Cultural Night', tag: 'Cultural', tagBg: 'bg-rose-100 text-rose-700', time: '5:00 PM', location: 'Grounds', accentColor: 'bg-rose-500', dots: ['bg-rose-500'] }],
  '2026-11-20': [{ id: 8, title: 'Robotics Showcase', tag: 'Tech', tagBg: 'bg-blue-100 text-blue-700', time: '1:00 PM', location: 'Robotics Lab', accentColor: 'bg-blue-600', dots: ['bg-blue-600'] }],
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // October 2026 (Month index 9)
  const [selectedDay, setSelectedDay] = useState(18);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigate Months
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(1);
  };

  // Generate Calendar Grid Matrix
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  let startingDayOfWeek = firstDayOfMonth.getDay() - 1; // Align to Monday (0)
  if (startingDayOfWeek === -1) startingDayOfWeek = 6; // Sunday

  const totalDaysInMonth = lastDayOfMonth.getDate();
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const gridCells = [];

  // Previous Month Padding Days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    gridCells.push({
      day: prevMonthLastDay - i,
      isCurrentMonth: false,
    });
  }

  // Current Month Days
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const formattedDateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = SAMPLE_EVENTS[formattedDateKey] || [];

    gridCells.push({
      day,
      isCurrentMonth: true,
      events: dayEvents,
      dateKey: formattedDateKey,
    });
  }

  // Next Month Padding Days
  const remainingCells = 35 - gridCells.length > 0 ? 35 - gridCells.length : 42 - gridCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    gridCells.push({
      day: i,
      isCurrentMonth: false,
    });
  }

  const selectedDateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  const selectedDayEvents = SAMPLE_EVENTS[selectedDateKey] || [];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Campus Calendar</h1>
        <p className="text-xs text-slate-500 mt-1">
          View all upcoming events and never miss out!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Calendar Grid */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          {/* Header Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Titles */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-500 mb-4">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-2 text-center">
            {gridCells.map((cell, index) => {
              const isSelected = cell.isCurrentMonth && cell.day === selectedDay;

              return (
                <div key={index} className="flex flex-col items-center justify-center min-h-[48px]">
                  <button
                    onClick={() => {
                      if (cell.isCurrentMonth) {
                        setSelectedDay(cell.day);
                      }
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all relative ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : !cell.isCurrentMonth
                        ? 'text-slate-300 cursor-default'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cell.day}
                  </button>

                  {/* Indicator Dots */}
                  <div className="flex items-center gap-1 mt-1 h-1.5">
                    {cell.isCurrentMonth &&
                      cell.events &&
                      cell.events.map((evt, i) => (
                        <span
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? 'bg-white' : evt.accentColor
                          }`}
                        ></span>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Events Feed Panel */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between min-h-[440px]">
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-5">
              Events on {selectedDay} {monthNames[month]} {year}
            </h2>

            {selectedDayEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 relative overflow-hidden"
                  >
                    <div className={`w-1.5 absolute left-0 top-0 bottom-0 ${evt.accentColor}`}></div>

                    <div className="pl-2 flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-slate-800 text-sm">{evt.title}</h3>
                        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${evt.tagBg}`}>
                          {evt.tag}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-slate-500">
                        <p className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{evt.time}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{evt.location}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs">
                No scheduled events on this date.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              View All Events <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}