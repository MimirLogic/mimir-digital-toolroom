import React, { useState, useMemo, useEffect } from 'react';
import { Die, DieHistory } from './types';
import { subscribeToInventory, updateDie, uploadPaperworkPhoto } from './lib/firebase';
import { InventoryDashboard } from './components/InventoryDashboard';
import { CalendarView } from './components/CalendarView';
import { Modal } from './components/Modal';
import { RepairForm } from './components/RepairForm';
import { ReceiveForm } from './components/ReceiveForm';
import { HistoryView } from './components/HistoryView';
import { LayoutGrid, Calendar, Loader2 } from 'lucide-react';
import { compressImage } from './lib/imageUtils';
import { Toaster, toast } from 'sonner';

const App: React.FC = () => {
  const [inventory, setInventory] = useState<Die[]>([]);
  const [history, setHistory] = useState<DieHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeInventory = subscribeToInventory((dies) => {
      setInventory(dies);
      setLoading(false);
    });

    const storedHistory = localStorage.getItem('mimir_toolroom_history');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }

    return () => unsubscribeInventory();
  }, []);

  const saveHistory = (newHistoryItem: DieHistory) => {
    const updatedHistory = [newHistoryItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('mimir_toolroom_history', JSON.stringify(updatedHistory));
  };

  const updateHistoryPaperwork = (historyId: string, url: string) => {
    const updated = history.map(h => h.id === historyId ? { ...h, paperworkUrl: url } : h);
    setHistory(updated);
    localStorage.setItem('mimir_toolroom_history', JSON.stringify(updated));
  };

  const [activeTab, setActiveTab] = useState<'inventory' | 'calendar'>('inventory');
  const [selectedDie, setSelectedDie] = useState<Die | null>(null);
  const [modalType, setModalType] = useState<'repair' | 'receive' | 'history' | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRepair = (die: Die) => {
    setSelectedDie(die);
    setModalType('repair');
  };

  const handleReceive = (die: Die) => {
    setSelectedDie(die);
    setModalType('receive');
  };

  const handleHistory = (die: Die) => {
    setSelectedDie(die);
    setModalType('history');
  };

  const submitRepair = async (data: { vendor: string; notes: string; sentDate: string }) => {
    if (!selectedDie) return;
    setIsSubmitting(true);

    try {
      await updateDie(selectedDie.id, {
        status: 'Repair',
        notes: `Sent to ${data.vendor}. Notes: ${data.notes}`
      });

      const newHistory: DieHistory = {
        id: Date.now().toString(),
        dieId: selectedDie.id,
        date: data.sentDate,
        action: 'SENT TO REPAIR',
        notes: `Sent to ${data.vendor}. Notes: ${data.notes}`,
        user: 'Local User'
      };
      
      saveHistory(newHistory);
      setModalType(null);
      toast.success('Tool sent to repair');
    } catch (error) {
      console.error("Repair submission failed:", error);
      toast.error("Failed to send tool to repair.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitReceive = async (data: { notes: string; paperworkFile?: File }) => {
    if (!selectedDie) return;
    setIsSubmitting(true);

    try {
      await updateDie(selectedDie.id, {
        status: 'Ready',
        notes: data.notes
      });

      const newHistoryId = Date.now().toString();
      const newHistory: DieHistory = {
        id: newHistoryId,
        dieId: selectedDie.id,
        date: new Date().toISOString().split('T')[0],
        action: 'RECEIVED FROM REPAIR',
        notes: data.notes,
        user: 'Local User',
        paperworkUrl: null
      };

      saveHistory(newHistory);
      
      setModalType(null);
      setIsSubmitting(false);
      toast.success('Tool marked as Ready');

      if (data.paperworkFile) {
        (async () => {
          try {
            const compressedBlob = await compressImage(data.paperworkFile!);
            const paperworkFileItem = new File([compressedBlob], 'paperwork.jpg', { type: 'image/jpeg' });
            
            const uploadPromise = uploadPaperworkPhoto(selectedDie.id, paperworkFileItem);
            const timeoutPromise = new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Upload timed out')), 5000)
            );

            const paperworkUrl = await Promise.race([uploadPromise, timeoutPromise]);
            updateHistoryPaperwork(newHistoryId, paperworkUrl);
            toast.success('Paperwork photo uploaded');
          } catch (uploadError: any) {
            console.error("Background photo upload failed:", uploadError);
            toast.error('Die updated. Paperwork photo upload skipped/failed.');
          }
        })();
      }
    } catch (error) {
      console.error("Receive submission failed:", error);
      toast.error("Failed to update tool.");
      setIsSubmitting(false);
    }
  };

  const dieHistory = useMemo(() => {
    return history.filter(h => h.dieId === selectedDie?.id);
  }, [history, selectedDie]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 shadow-2xl overflow-hidden border-x border-slate-200">
      <Toaster position="top-center" richColors />
      <div className="flex-1 overflow-hidden">
        {activeTab === 'inventory' ? (
          <InventoryDashboard 
            inventory={inventory} 
            onRepair={handleRepair}
            onReceive={handleReceive}
            onHistory={handleHistory}
          />
        ) : (
          <CalendarView inventory={inventory} />
        )}
      </div>

      <nav className="bg-white border-t border-slate-200 px-6 py-3 flex justify-around items-center shadow-lg hover:shadow-none transition-shadow z-50">
        <NavButton 
          active={activeTab === 'inventory'} 
          onClick={() => setActiveTab('inventory')}
          icon={<LayoutGrid className="w-6 h-6" />}
          label="Inventory"
        />
        <NavButton 
          active={activeTab === 'calendar'} 
          onClick={() => setActiveTab('calendar')}
          icon={<Calendar className="w-6 h-6" />}
          label="Calendar"
        />
      </nav>

      <Modal 
        isOpen={modalType === 'repair'} 
        onClose={() => setModalType(null)} 
        title="Send to Repair"
      >
        {selectedDie && (
          <RepairForm 
            die={selectedDie} 
            onSubmit={submitRepair} 
            onCancel={() => setModalType(null)} 
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>

      <Modal 
        isOpen={modalType === 'receive'} 
        onClose={() => setModalType(null)} 
        title="Receive Tool"
      >
        {selectedDie && (
          <ReceiveForm 
            die={selectedDie} 
            onSubmit={submitReceive} 
            onCancel={() => setModalType(null)} 
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>

      <Modal 
        isOpen={modalType === 'history'} 
        onClose={() => setModalType(null)} 
        title="Maintenance History"
      >
        {selectedDie && (
          <HistoryView 
            die={selectedDie} 
            history={dieHistory} 
          />
        )}
      </Modal>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all rounded-xl p-2
      ${active ? 'text-slate-900 bg-slate-100 scale-105' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
  >
    {icon}
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default App;
