import React from 'react';
import { Die } from '../types';
import { StatusBadge } from './StatusBadge';
import { Settings, Wrench, History, CheckCircle2 } from 'lucide-react';

interface DieCardProps {
  die: Die;
  onRepair: (die: Die) => void;
  onReceive: (die: Die) => void;
  onHistory: (die: Die) => void;
}

export const DieCard: React.FC<DieCardProps> = ({ die, onRepair, onReceive, onHistory }) => {
  const isRepair = die.status === 'Repair';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">{die.id}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>{die.diameter}</span>
            <span>•</span>
            <span>STA: {die.station}</span>
            <span>•</span>
            <span>POS: {die.position}</span>
          </div>
        </div>
        <StatusBadge status={die.status} />
      </div>

      {/* Middle Section Data */}
      <div className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
         <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity</span>
            <span className="text-lg font-black text-slate-800">{die.quantity}</span>
         </div>
         <div className="flex flex-col text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               {die.lastUsed ? 'Last Used' : 'Received'}
            </span>
            <span className="text-sm font-bold text-slate-600 truncate max-w-[120px]">
               {die.lastUsed || die.receivedDate || 'N/A'}
            </span>
         </div>
      </div>

      {die.notes && (
         <p className="text-sm text-slate-500 italic bg-amber-50 p-3 rounded-lg border border-amber-100/50">
            "{die.notes}"
         </p>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-2">
        {!isRepair ? (
          <button
            onClick={() => onRepair(die)}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-4 min-h-[48px] rounded-xl text-sm font-black hover:bg-slate-800 active:scale-95 transition-all uppercase tracking-widest shadow-xl shadow-slate-300"
          >
            <Wrench className="w-5 h-5" />
            Send to Repair
          </button>
        ) : (
          <button
            onClick={() => onReceive(die)}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 min-h-[48px] rounded-xl text-sm font-black hover:bg-emerald-700 active:scale-95 transition-all uppercase tracking-widest shadow-xl shadow-emerald-200"
          >
            <CheckCircle2 className="w-5 h-5" />
            Receive Tool
          </button>
        )}
        <button
          onClick={() => onHistory(die)}
          className="flex-shrink-0 flex items-center justify-center bg-slate-100 text-slate-600 w-16 min-h-[48px] rounded-xl hover:bg-slate-200 active:scale-95 transition-all shadow-sm"
          title="History"
        >
          <History className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
