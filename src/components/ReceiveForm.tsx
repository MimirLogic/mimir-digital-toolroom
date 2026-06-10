import React, { useState, useRef, useEffect } from 'react';
import { Die } from '../types';
import { Settings, CheckCircle2, AlertCircle, Camera, X, FileText, Loader2, ScanSearch } from 'lucide-react';

interface ReceiveFormProps {
  die: Die;
  onSubmit: (data: { notes: string; paperworkFile?: File }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ReceiveForm: React.FC<ReceiveFormProps> = ({ die, onSubmit, onCancel, isSubmitting }) => {
  const [notes, setNotes] = useState('');
  const [paperworkFile, setPaperworkFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaperworkFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Simulate AI OCR Workflow
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        setNotes((prevNotes) => {
          const newNote = 'Tolerance ±0.002 verified';
          return prevNotes ? `${prevNotes}\n${newNote}` : newNote;
        });
      }, 2000);
    }
  };

  const removePhoto = () => {
    setPaperworkFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setIsScanning(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isScanning) return;
    onSubmit({ notes, paperworkFile: paperworkFile || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 mb-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Receiving From Repair</p>
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-black text-emerald-900 tracking-tight italic uppercase">{die.id}</h3>
        </div>
        <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">
          {die.diameter} • Station {die.station} • {die.position}
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-slate-400" />
            <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">Previous Repair Info</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-500 font-medium whitespace-pre-wrap">
              <span className="font-bold text-slate-400 uppercase tracking-widest block mb-1">Repair Notes:</span>
              {die.notes || 'No notes provided.'}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Paperwork Photo (Optional)</label>
          {!previewUrl ? (
            <button
              type="button"
              disabled={isSubmitting || isScanning}
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-8 bg-slate-100 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all disabled:opacity-50"
            >
              <Camera className="w-8 h-8" />
              <span className="text-xs font-bold uppercase tracking-widest">Snap Paperwork</span>
            </button>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
              <img src={previewUrl} alt="Paperwork preview" className={`w-full h-48 object-cover transition-opacity duration-300 ${isScanning ? 'opacity-50 filter grayscale' : 'opacity-100'}`} />
              
              {isScanning ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-[#2EC5FF]/10 z-10 backdrop-blur-[2px]">
                   <div className="relative mb-3">
                      <ScanSearch className="w-12 h-12 text-[#2EC5FF] animate-pulse" />
                      <div className="absolute inset-0 border-t-2 border-[#2EC5FF] animate-spin rounded-full"></div>
                   </div>
                   <span className="text-xs font-black text-[#2EC5FF] uppercase tracking-widest text-center shadow-sm">AI Vision Extracting Tolerances...</span>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={removePhoto}
                  className="absolute top-2 right-2 p-2 bg-rose-600 text-white rounded-full shadow-lg hover:bg-rose-700 transition-colors disabled:opacity-50 z-20"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              
              {!isScanning && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 backdrop-blur-sm flex items-center gap-2 z-20">
                  <FileText className="w-4 h-4 text-white" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Paperwork Captured</span>
                </div>
              )}
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
            disabled={isSubmitting || isScanning}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Return Notes</label>
          <textarea
            required
            disabled={isSubmitting || isScanning}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe the condition upon return or any work performed..."
            rows={4}
            className={`w-full p-4 bg-slate-100 border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#2EC5FF] transition-all font-medium resize-none disabled:opacity-50 ${isScanning ? 'animate-pulse bg-slate-200' : ''}`}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting || isScanning}
          className="flex-1 py-3 px-4 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all uppercase tracking-wider disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isScanning}
          className="flex-1 py-3 px-4 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all uppercase tracking-wider shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Receiving...
            </>
          ) : isScanning ? (
            <>
              <ScanSearch className="w-4 h-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Confirm Receive
            </>
          )}
        </button>
      </div>
    </form>
  );
};
