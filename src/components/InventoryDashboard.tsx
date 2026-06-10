import React, { useState, useMemo } from 'react';
import { Die } from '../types';
import { DieCard } from './DieCard';
import { Search, Filter, ChevronDown, List, Wrench, CheckCircle2, Activity, Package, Trash2 } from 'lucide-react';

interface InventoryDashboardProps {
  inventory: Die[];
  onRepair: (die: Die) => void;
  onReceive: (die: Die) => void;
  onHistory: (die: Die) => void;
}

export const InventoryDashboard: React.FC<InventoryDashboardProps> = ({ inventory, onRepair, onReceive, onHistory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [diameterFilter, setDiameterFilter] = useState<string>('All');
  const [positionFilter, setPositionFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const diameterOrder = ['1/4"', '1/2"', '5/8"', '3/4"', '7/8"', '1"'];
  const sortDiameters = (a: string, b: string) => {
    return diameterOrder.indexOf(a) - diameterOrder.indexOf(b);
  };

  const diameters = (['All', ...new Set(inventory.map(d => d.diameter))] as string[]).sort((a, b) => {
    if (a === 'All') return -1;
    if (b === 'All') return 1;
    return sortDiameters(a, b);
  });
  const stations = (['All', ...new Set(inventory.map(d => d.station))] as string[]).sort();
  const statuses = ['All', 'Ready', 'In Use', 'Repair', 'Scrapped'];

  const summaryCounts = useMemo(() => {
    return inventory.reduce(
      (acc, die) => {
        acc.total++;
        if (die.status === 'Ready') acc.ready++;
        if (die.status === 'Repair') acc.repair++;
        if (die.status === 'Scrapped') acc.scrapped++;
        return acc;
      },
      { total: 0, ready: 0, repair: 0, scrapped: 0 }
    );
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory
      .filter(die => {
        const searchLower = searchQuery.toLowerCase();
        // Smart Filter Logic: Tokenize search and check if ALL keywords exist anywhere in the die's data
        const searchTerms = searchLower.split(' ').filter(Boolean);
        const searchableText = `${die.id} ${die.diameter} station ${die.station} position ${die.position} status ${die.status} ${die.notes || ''}`.toLowerCase();
        
        const matchesSmartSearch = searchTerms.length === 0 || searchTerms.every(term => searchableText.includes(term));
        
        const matchesDiameter = diameterFilter === 'All' || die.diameter === diameterFilter;
        const matchesStation = positionFilter === 'All' || die.station === positionFilter;
        const matchesStatus = statusFilter === 'All' || die.status === statusFilter;
        return matchesSmartSearch && matchesDiameter && matchesStation && matchesStatus;
      })
      .sort((a, b) => {
        const dSort = sortDiameters(a.diameter, b.diameter);
        if (dSort !== 0) return dSort;
        return a.id.localeCompare(b.id);
      });
  }, [inventory, searchQuery, diameterFilter, positionFilter, statusFilter]);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Dark Industrial Header & Analytics */}
      <div className="bg-slate-950 pt-6 pb-4 px-6 relative z-20 shadow-xl border-b-[3px] border-[#2EC5FF]/30">
        <h2 className="text-white text-lg font-black uppercase tracking-widest mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#2EC5FF]" />
          Operations Hub
        </h2>
        
        {/* Operational Analytics Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div 
            onClick={() => setStatusFilter('All')}
            className={`bg-slate-900 rounded-xl p-3 border border-slate-800 border-l-2 border-l-[#2EC5FF] flex flex-col justify-between shadow-inner cursor-pointer hover:scale-105 hover:border-[#2EC5FF] transition-all ${statusFilter === 'All' ? 'ring-2 ring-[#2EC5FF]/50 scale-105' : ''}`}
          >
            <p className="text-[9px] font-black uppercase tracking-widest text-[#2EC5FF] opacity-90 mb-1 flex items-center gap-1">
              <Package className="w-3 h-3" /> Total
            </p>
            <div className="text-2xl font-black text-white tracking-tighter leading-none">{summaryCounts.total}</div>
          </div>
          <div 
            onClick={() => setStatusFilter('Repair')}
            className={`bg-slate-900 rounded-xl p-3 border border-slate-800 border-l-2 border-l-rose-500 flex flex-col justify-between shadow-inner cursor-pointer hover:scale-105 hover:border-rose-500 transition-all ${statusFilter === 'Repair' ? 'ring-2 ring-rose-500/50 scale-105 border-rose-500' : ''}`}
          >
            <p className="text-[9px] font-black uppercase tracking-widest text-rose-500 opacity-90 mb-1 flex items-center gap-1">
              <Wrench className="w-3 h-3" /> Repair
            </p>
            <div className="text-2xl font-black text-white tracking-tighter leading-none">{summaryCounts.repair}</div>
          </div>
          <div 
            onClick={() => setStatusFilter('Scrapped')}
            className={`bg-slate-900 rounded-xl p-3 border border-slate-800 border-l-2 border-l-slate-400 flex flex-col justify-between shadow-inner cursor-pointer hover:scale-105 hover:border-slate-400 transition-all ${statusFilter === 'Scrapped' ? 'ring-2 ring-slate-400/50 scale-105 border-slate-400' : ''}`}
          >
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 opacity-90 mb-1 flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> Scrapped
            </p>
            <div className="text-2xl font-black text-slate-200 tracking-tighter leading-none">{summaryCounts.scrapped}</div>
          </div>
        </div>
        
        {/* Smart Filter Input */}
        <div className="relative mb-4 group">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#2EC5FF] transition-colors" />
          <input
            type="text"
            placeholder="SMART FILTER (e.g. '3/8 repair')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#2EC5FF] border border-slate-800 focus:border-transparent font-mono tracking-wider transition-all placeholder:text-slate-600 shadow-inner"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
          <FilterSelect 
            label="SIZE" 
            value={diameterFilter} 
            onChange={setDiameterFilter} 
            options={diameters} 
          />
          <FilterSelect 
            label="STATION" 
            value={positionFilter} 
            onChange={setPositionFilter} 
            options={stations} 
          />
          <FilterSelect 
            label="STATE" 
            value={statusFilter} 
            onChange={setStatusFilter} 
            options={statuses} 
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 relative z-10">
        <div className="flex flex-col gap-3 pb-20">
          {filteredInventory.map(die => (
            <DieCard 
              key={die.id}
              die={die}
              onRepair={onRepair}
              onReceive={onReceive}
              onHistory={onHistory}
            />
          ))}
          {filteredInventory.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Wrench className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-bold uppercase tracking-widest text-center">No tools found matching criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FilterSelect = ({ label, value, onChange, options }: { label: string, value: string, onChange: (v: string) => void, options: string[] }) => (
  <div className="relative group shrink-0 snap-start">
    <div className="absolute inset-0 bg-[#2EC5FF] opacity-0 group-hover:opacity-10 rounded-xl transition-opacity pointer-events-none" />
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-slate-900 border border-slate-800 text-white rounded-xl py-3 pl-4 pr-10 font-bold tracking-widest uppercase text-xs focus:outline-none focus:ring-2 focus:ring-[#2EC5FF] cursor-pointer shadow-lg shadow-black/20 hover:border-slate-700 transition-colors"
    >
      <optgroup label={label}>
        {options.map(o => (
          <option key={o} value={o}>{o === 'All' ? `${label}: ALL` : o}</option>
        ))}
      </optgroup>
    </select>
    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#2EC5FF] pointer-events-none" />
  </div>
);

