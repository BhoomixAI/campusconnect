import React, { useState } from 'react';
import { CheckCircle2, Clock, BellRing, ArrowRight, UserCheck, AlertCircle, FileText } from 'lucide-react';

export default function ApprovalTracker({ proposal, onUpdateStatus }) {
  const [reminderSent, setReminderSent] = useState(false);

  const steps = [
    { key: 'coordinator', label: 'Club Coordinator', role: 'Student Lead' },
    { key: 'advisor', label: 'Faculty Advisor', role: 'Faculty' },
    { key: 'hod', label: 'HOD (CSE)', role: 'Department Head' },
    { key: 'dean', label: 'Dean Student Affairs', role: 'Administration' },
  ];

  const getStepStatus = (index) => {
    if (index < proposal.currentStep) return 'approved';
    if (index === proposal.currentStep) return 'pending';
    return 'upcoming';
  };

  const handleSendReminder = () => {
    setReminderSent(true);
    setTimeout(() => setReminderSent(false), 4000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
      {/* Proposal Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">{proposal.title}</h3>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {proposal.category}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Submitted on {proposal.submittedDate} • Target Venue: <strong>{proposal.venue}</strong>
          </p>
        </div>

        {/* Send Auto-Reminder Action */}
        <button
          onClick={handleSendReminder}
          disabled={reminderSent || proposal.currentStep >= steps.length}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            reminderSent
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <BellRing className={`w-3.5 h-3.5 ${reminderSent ? 'animate-bounce text-amber-600' : ''}`} />
          {reminderSent ? 'Nudge Reminder Sent!' : 'Send Nudge Reminder'}
        </button>
      </div>

      {/* Approval Chain Stepper Visual */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => {
          const status = getStepStatus(idx);

          return (
            <div
              key={step.key}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                status === 'approved'
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                  : status === 'pending'
                  ? 'bg-blue-50/50 border-blue-300 shadow-sm ring-2 ring-blue-500/10'
                  : 'bg-slate-50/60 border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Step 0{idx + 1}
                </span>
                {status === 'approved' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
                {status === 'pending' && (
                  <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
                )}
                {status === 'upcoming' && (
                  <AlertCircle className="w-5 h-5 text-slate-300" />
                )}
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-800">{step.label}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{step.role}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-medium">
                {status === 'approved' && (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" /> Approved
                  </span>
                )}
                {status === 'pending' && (
                  <span className="text-blue-600 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Awaiting Review
                  </span>
                )}
                {status === 'upcoming' && (
                  <span className="text-slate-400">Pending Prior Steps</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* One-Tap Simulation Approval Bar */}
      {proposal.currentStep < steps.length && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Action Required by: {steps[proposal.currentStep].label}
              </p>
              <p className="text-[11px] text-slate-500">
                Simulate one-tap authorization for live demo
              </p>
            </div>
          </div>

          <button
            onClick={() => onUpdateStatus(proposal.id)}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            Approve Request <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}