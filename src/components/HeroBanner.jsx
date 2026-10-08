import React from 'react';
import { Calendar, MapPin, Users, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white p-8 shadow-xl min-h-[220px] flex flex-col justify-between">
      {/* Background Overlay image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-25 mix-blend-overlay"></div>

      <div className="relative z-10 max-w-lg">
        <h2 className="text-3xl font-extrabold tracking-tight mb-2">TECHFEST 2026</h2>
        <p className="text-gray-300 text-sm mb-6">India's next generation engineers</p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 mb-6">
          <span className="flex items-center gap-1.5"><Calendar size={14} /> 18 - 20 Oct 2026</span>
          <span className="flex items-center gap-1.5"><MapPin size={14} /> Main Auditorium</span>
          <span className="flex items-center gap-1.5"><Users size={14} /> 250+ Participants</span>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/30">
          Explore Event <ArrowRight size={14} />
        </button>
      </div>

      {/* Pagination Controls */}
      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 mt-4">
        <div className="flex gap-1.5">
          <span className="w-6 h-1.5 bg-white rounded-full"></span>
          <span className="w-1.5 h-1.5 bg-white/40 rounded-full"></span>
          <span className="w-1.5 h-1.5 bg-white/40 rounded-full"></span>
          <span className="w-1.5 h-1.5 bg-white/40 rounded-full"></span>
        </div>
        <div className="flex gap-2 text-white/80">
          <button className="p-1 rounded-full hover:bg-white/10"><ChevronLeft size={16} /></button>
          <button className="p-1 rounded-full hover:bg-white/10"><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}