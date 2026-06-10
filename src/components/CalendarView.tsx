import React, { useState, useMemo } from 'react';
import { Die, DieHistory } from '../types';
import { Calendar, Clock, List, Search, Filter, ChevronDown, LayoutGrid, Wrench, Settings } from 'lucide-react';

interface CalendarViewProps {
  inventory: Die[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ inventory }) => {
  const repairDies = useMemo(() => {
    return inventory
      .filter(d => d.status === 'Repair')
      .sort((a, b) => a.id.localeCompare(b.id));
  }, [inventory]);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic mb-1">Repair View</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tools Currently in Repair</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {repairDies.length > 0 ? (
          <div className="space-y-4">
            {repairDies.map((die) => (
              <div key={die.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex">
                <div className="w-20 bg-rose-50 flex flex-col items-center justify-center border-r border-rose-100 p-2">
                  <Wrench className="w-8 h-8 text-rose-400 mb-1" />
                  <span className="text-[10px] font-black text-rose-900 uppercase tracking-widest text-center">
                    Repair
                  </span>
                </div>
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        {die.id}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {die.diameter} • Station {die.station} • {die.position}
                      </p>
                    </div>
                    <div className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-rose-200">
                      IN REPAIR
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-start gap-1.5 flex-1">
                      <Settings className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-xs font-bold text-slate-600 tracking-tight leading-snug line-clamp-2">
                        {die.notes || 'No notes provided.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Calendar className="w-12 h-12 mb-2 opacity-20" />
            <p className="text-sm font-bold uppercase tracking-widest">No tools currently in repair</p>
          </div>
        )}
      </div>
    </div>
  );
};
