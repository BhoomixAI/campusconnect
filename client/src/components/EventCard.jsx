import React from 'react';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

export default function EventCard({ event, onViewDetails }) {
  if (!event) return null;

  const {
    title = '',
    description = '',
    tag = '',
    tagColor = 'bg-blue-600',
    date = '',
    location = '',
    registered = 0,
    capacity = 0,
    image = ''
  } = event;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div className="relative h-40 bg-slate-900 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-300"
        />
        {tag && (
          <span className={`absolute top-3 left-3 ${tagColor} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm`}>
            {tag}
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-slate-800 text-lg leading-snug">{title}</h3>
          {description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="space-y-2 text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{location}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Users className="w-4 h-4 text-slate-400" />
            <span>{registered}/{capacity} Registered</span>
          </div>

          <button
            onClick={() => onViewDetails?.(event)}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}