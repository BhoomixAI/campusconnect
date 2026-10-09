import React from 'react';
import { Crown, Gift, CalendarCheck, Trophy, Medal, UserCheck, Shield, Sparkles, Award } from 'lucide-react';

export default function Leaderboard() {
  const topThree = [
    {
      rank: 2,
      name: 'Devang Dixit',
      points: '720 XP',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      crownColor: 'text-slate-300',
      bgGradient: 'from-slate-50 to-white border-slate-200',
      badge: '🥈',
    },
    {
      rank: 1,
      name: 'Rahul Sharma',
      points: '840 XP',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      crownColor: 'text-amber-400 fill-amber-400',
      bgGradient: 'from-amber-50/80 to-white border-amber-200',
      badge: '👑',
    },
    {
      rank: 3,
      name: 'Ankit Kumar',
      points: '600 XP',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      crownColor: 'text-amber-600',
      bgGradient: 'from-orange-50/60 to-white border-orange-200',
      badge: '🥉',
    },
  ];

  const leaderboardList = [
    { rank: 4, name: 'Priya Singh', branch: 'CSE - 3rd Year', points: '640 XP', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
    { rank: 5, name: 'Aditya Verma', branch: 'ECE - 3rd Year', points: '610 XP', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' },
    { rank: 6, name: 'Sneha Gupta', branch: 'ME - 3rd Year', points: '580 XP', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' },
    { rank: 7, name: 'Rohan Kapoor', branch: 'CE - 3rd Year', points: '540 XP', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100' },
    { rank: 8, name: 'Karan Malhotra', branch: 'IT - 3rd Year', points: '510 XP', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100' },
  ];

  const earnPointsList = [
    { activity: 'Register for an event', points: '+10', icon: Gift, color: 'text-blue-500 bg-blue-50' },
    { activity: 'Attend an event', points: '+20', icon: CalendarCheck, color: 'text-purple-500 bg-purple-50' },
    { activity: 'Participate in competition', points: '+50', icon: Trophy, color: 'text-pink-500 bg-pink-50' },
    { activity: 'Win a competition', points: '+100', icon: Medal, color: 'text-amber-500 bg-amber-50' },
    { activity: 'Volunteer for events', points: '+30', icon: UserCheck, color: 'text-emerald-500 bg-emerald-50' },
  ];

  const badges = [
    { title: 'Event Champion', icon: Shield, bg: 'bg-amber-100 text-amber-600' },
    { title: 'Active Participant', icon: Sparkles, bg: 'bg-blue-100 text-blue-600' },
    { title: 'Tech Enthusiast', icon: Shield, bg: 'bg-orange-100 text-orange-600' },
    { title: 'Cultural Star', icon: Award, bg: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Campus Leaderboard</h1>
        <p className="text-xs text-slate-500 mt-1">
          Top students, active participants and event champions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column - Podiums & Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-3 gap-4 items-end">
            {topThree.map((user) => (
              <div
                key={user.rank}
                className={`bg-gradient-to-b ${user.bgGradient} rounded-2xl p-4 border text-center shadow-sm relative flex flex-col items-center ${
                  user.rank === 1 ? 'py-6 -mt-3' : 'py-4'
                }`}
              >
                <div className="relative mb-2">
                  <Crown className={`w-6 h-6 absolute -top-5 left-1/2 -translate-x-1/2 ${user.crownColor}`} />
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className={`rounded-full object-cover border-2 border-white shadow-md ${
                      user.rank === 1 ? 'w-16 h-16' : 'w-12 h-12'
                    }`}
                  />
                </div>
                <h3 className="font-bold text-slate-800 text-sm leading-tight mt-1">{user.name}</h3>
                <p className="text-xs font-bold text-slate-500 mt-1">{user.points}</p>
              </div>
            ))}
          </div>

          {/* Ranking Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500">
              <span className="col-span-2">#</span>
              <span className="col-span-5">Name</span>
              <span className="col-span-3">Year / Branch</span>
              <span className="col-span-2 text-right">Points</span>
            </div>

            <div className="divide-y divide-slate-100">
              {leaderboardList.map((item) => (
                <div key={item.rank} className="grid grid-cols-12 px-6 py-3.5 items-center text-xs hover:bg-slate-50/80 transition-colors">
                  <span className="col-span-2 font-bold text-slate-400">{item.rank}</span>
                  <div className="col-span-5 flex items-center gap-3">
                    <img src={item.avatar} alt={item.name} className="w-8 h-8 rounded-full object-cover" />
                    <span className="font-bold text-slate-800">{item.name}</span>
                  </div>
                  <span className="col-span-3 text-slate-500 font-medium">{item.branch}</span>
                  <span className="col-span-2 text-right font-bold text-slate-600">{item.points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Earn Points & Badges */}
        <div className="lg:col-span-4 space-y-6">
          {/* Earn Points Panel */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-800 text-sm">Earn Points</h2>
            <div className="space-y-3">
              {earnPointsList.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${item.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-slate-600 font-medium">{item.activity}</span>
                    </div>
                    <span className="font-bold text-slate-800">{item.points}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges Panel */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-800 text-sm">Badges</h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              {badges.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${b.bg} shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700 leading-tight">{b.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}