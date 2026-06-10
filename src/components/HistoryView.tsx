import React, { useState } from 'react';
import { Die, DieHistory } from '../types';
import { History, User, Clock, MessageSquare, FileText, X, Maximize2 } from 'lucide-react';

interface HistoryViewProps {
  die: Die;
  history: DieHistory[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ die, history }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Die History</p>
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">{die.id}</h3>
        </div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {die.diameter} • Station {die.station} • {die.position}
        </p>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
        {history.length > 0 ? (
          history.map((item, index) => (
            <div key={item.id} className="relative flex items-start group">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm ring-8 ring-white group-hover:border-slate-300 transition-colors">
                <Clock className="h-5 w-5 text-slate-400" />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{item.action}</h4>
                  <time className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</time>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-3 h-3 text-slate-400" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.user}</p>
                </div>
                {item.notes && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2 mb-2">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.notes}</p>
                  </div>
                )}
                {item.paperworkUrl && (
                  <button
                    onClick={() => setSelectedPhoto(item.paperworkUrl!)}
                    className="relative w-full h-24 rounded-lg overflow-hidden border border-slate-200 group/photo"
                  >
                    <img src={item.paperworkUrl} alt="Paperwork" className="w-full h-full object-cover opacity-80 group-hover/photo:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-lg">
                        <Maximize2 className="w-3 h-3" />
                        View Paperwork
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <History className="w-12 h-12 mb-2 opacity-20" />
            <p className="text-sm font-bold uppercase tracking-widest">No history recorded</p>
          </div>
        )}
      </div>

      {/* Full Screen Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedPhoto}
            alt="Full size paperwork"
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />
          <div className="mt-6 flex items-center gap-3 text-white">
            <FileText className="w-5 h-5 opacity-60" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Vendor Paperwork Log</span>
          </div>
        </div>
      )}
    </div>
  );
};
