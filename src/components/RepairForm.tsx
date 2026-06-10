import React, { useState } from 'react';
import { Die } from '../types';
import { Wrench, Calendar, Truck, Loader2 } from 'lucide-react';

interface RepairFormProps {
  die: Die;
  onSubmit: (data: { vendor: string; notes: string; sentDate: string }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const RepairForm: React.FC<RepairFormProps> = ({ die, onSubmit, onCancel, isSubmitting }) => {
  const [vendor, setVendor] = useState('');
  const [sentDate, setSentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    onSubmit({ vendor, notes, sentDate });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sending Out</p>
        <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">
          {die.id}
        </h3>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {die.diameter} • Station {die.station} • {die.position}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Vendor Name</label>
          <div className="relative">
            <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <select
              required
              disabled={isSubmitting}
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-xl text-slate-900 focus:ring-2 focus:ring-slate-900 transition-all font-medium appearance-none disabled:opacity-50"
            >
              <option value="" disabled>Select Vendor</option>
              <option value="J&J Tooling">J&J Tooling</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Sent Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="date"
              required
              disabled={isSubmitting}
              value={sentDate}
              onChange={(e) => setSentDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 transition-all font-medium disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Repair Notes</label>
          <div className="relative">
            <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <select
              required
              disabled={isSubmitting}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-xl text-slate-900 focus:ring-2 focus:ring-slate-900 transition-all font-medium appearance-none disabled:opacity-50"
            >
              <option value="" disabled>Select Reason</option>
              <option value="chipped">chipped</option>
              <option value="worn">worn</option>
              <option value="broke">broke</option>
              <option value="routine">routine</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 py-3 px-4 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all uppercase tracking-wider disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 px-4 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all uppercase tracking-wider shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Confirm Send'
          )}
        </button>
      </div>
    </form>
  );
};
