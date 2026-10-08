import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';

export default function EventCard({ title, category, date, location, registered, capacity, image, badgeColor, buttonColor }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="relative h-32 overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider ${badgeColor}`}>
            {category}
          </span>
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{title}</h3>
          
          <div className="space-y-1 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-gray-400" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-gray-400" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={13} className="text-gray-400" />
              <span>{registered}/{capacity} Registered</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <button className={`w-full py-2 rounded-xl text-white text-xs font-semibold transition-all ${buttonColor}`}>
          Register
        </button>
      </div>
    </div>
  );
}