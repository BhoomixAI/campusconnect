import React from 'react';
import ClubCard from '../components/ClubCard';

const CLUBS_DATA = [
  {
    id: 1,
    name: 'CSI Club',
    tagline: 'Computer Society of India',
    members: 124,
    logo: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=200',
    isJoined: false,
  },
  {
    id: 2,
    name: 'Fine Arts Club',
    tagline: 'Unleash your creativity',
    members: 86,
    logo: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=200',
    isJoined: false,
  },
  {
    id: 3,
    name: 'Music Club',
    tagline: 'Music brings us together',
    members: 72,
    logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=200',
    isJoined: false,
  },
  {
    id: 4,
    name: 'Sports Club',
    tagline: 'Play • Compete • Grow',
    members: 98,
    logo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=200',
    isJoined: false,
  },
  {
    id: 5,
    name: 'Robotics Club',
    tagline: 'Build • Innovate • Create',
    members: 63,
    logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=200',
    isJoined: false,
  },
  {
    id: 6,
    name: 'Literary Club',
    tagline: 'Read • Write • Express',
    members: 41,
    logo: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=200',
  },
];

export default function Clubs() {
  return (
    <div className="p-8 space-y-6">
      {/* Title Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Clubs & Societies</h1>
        <p className="text-xs text-slate-500 mt-1">
          Join clubs, meet like-minded people and explore your interests.
        </p>
      </div>

      {/* Clubs Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {CLUBS_DATA.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
    </div>
  );
}