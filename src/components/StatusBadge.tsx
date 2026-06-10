import React from 'react';

interface StatusBadgeProps {
  status: "Ready" | "In Use" | "Repair" | "Scrapped";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let colors = '';
  let dotFormat = '';

  switch (status) {
    case 'Ready':
      colors = 'bg-emerald-100 text-emerald-800 border-emerald-200';
      dotFormat = 'bg-emerald-500';
      break;
    case 'Repair':
      colors = 'bg-rose-100 text-rose-800 border-rose-200';
      dotFormat = 'bg-rose-500';
      break;
    case 'In Use':
      colors = 'bg-amber-100 text-amber-800 border-amber-200';
      dotFormat = 'bg-amber-500';
      break;
    case 'Scrapped':
      colors = 'bg-slate-200 text-slate-800 border-slate-300';
      dotFormat = 'bg-slate-500';
      break;
  }

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${colors}`}>
      <span className={`w-2 h-2 mr-1.5 rounded-full ${dotFormat}`}></span>
      {status}
    </div>
  );
};
