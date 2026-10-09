import React, { useState } from 'react';
import { Users, Check } from 'lucide-react';

export default function ClubCard({ club }) {
  const [joined, setJoined] = useState(club.isJoined || false);
  const [membersCount, setMembersCount] = useState(club.members);

  const handleJoinToggle = () => {
    if (joined) {
      setJoined(false);
      setMembersCount((prev) => prev - 1);
    } else {
      setJoined(true);
      setMembersCount((prev) => prev + 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-4">
      {/* Left Avatar & Details */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200 flex items-center justify-center">
          <img
            src={club.logo}
            alt={club.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-800 text-base leading-tight truncate">
            {club.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1 truncate font-normal">
            {club.tagline}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-medium">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{membersCount} Members</span>
          </div>
        </div>
      </div>

      {/* Join Action Button */}
      <button
        onClick={handleJoinToggle}
        className={`px-5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
          joined
            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 flex items-center gap-1'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
        }`}
      >
        {joined ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" /> Joined
          </>
        ) : (
          'Join Club'
        )}
      </button>
    </div>
  );
}