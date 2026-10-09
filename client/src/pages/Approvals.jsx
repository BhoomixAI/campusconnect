import React, { useState } from 'react';
import ApprovalTracker from '../components/ApprovalTracker';
import { Plus, ShieldCheck } from 'lucide-react';

const INITIAL_PROPOSALS = [
  {
    id: 101,
    title: 'Hackathon 2026 - National Level Coding Challenge',
    category: 'Technical',
    submittedDate: '12 Oct 2026',
    venue: 'IT Block Auditorium',
    currentStep: 1, // Currently at Faculty Advisor
  },
  {
    id: 102,
    title: 'Antarang Cultural Night & Music Fest',
    category: 'Cultural',
    submittedDate: '14 Oct 2026',
    venue: 'Main Campus Grounds',
    currentStep: 2, // Currently at HOD
  },
];

export default function Approvals() {
  const [proposals, setProposals] = useState(INITIAL_PROPOSALS);

  const handleApproveStep = (id) => {
    setProposals((prev) =>
      prev.map((prop) => {
        if (prop.id === id) {
          return { ...prop, currentStep: prop.currentStep + 1 };
        }
        return prop;
      })
    );
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Digital Approval Workflow</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track event letter approvals across Club Coordinator → Faculty Advisor → HOD → Dean.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> New Event Proposal
        </button>
      </div>

      {/* Trust Banner */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <p className="text-xs text-emerald-800 font-medium leading-relaxed">
          <strong>No Paper Runaround:</strong> Every tap records an immutable timestamp. Stalled approvals trigger automated SMS and email reminders to faculty.
        </p>
      </div>

      {/* Proposals Stream */}
      <div className="space-y-6">
        {proposals.map((item) => (
          <ApprovalTracker
            key={item.id}
            proposal={item}
            onUpdateStatus={handleApproveStep}
          />
        ))}
      </div>
    </div>
  );
}