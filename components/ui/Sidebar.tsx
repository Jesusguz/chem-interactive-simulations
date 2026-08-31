'use client';

import React from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { ModuleId } from '@/types/simulation';
import { MODULE_REGISTRY } from '@/lib/constants/modules';
import { PlayCircle, Box, Wind } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentModuleId, setModule } = useSimulationStore();

  const getIcon = (category: string) => {
    switch (category) {
      case 'IMF': return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'SOLIDS_3D': return <Box className="w-4 h-4 text-indigo-500" />;
      case 'GAS_LAWS': return <Wind className="w-4 h-4 text-emerald-500" />;
      default: return null;
    }
  };

  return (
    <aside className="w-72 border-r border-slate-200 bg-slate-50 flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">AP Chem Modules</h2>
      </div>
      <div className="p-3 space-y-1">
        {(Object.keys(MODULE_REGISTRY) as ModuleId[]).map((id) => {
          const mod = MODULE_REGISTRY[id];
          if (!mod) return null;
          const isActive = currentModuleId === id;
          return (
            <button
              key={id}
              onClick={() => setModule(id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors ${
                isActive
                  ? 'bg-white border border-slate-300 shadow-sm text-slate-900 font-medium'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {getIcon(mod.category)}
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-500">{mod.unitCode} • {mod.id}</div>
                <div className="text-sm truncate">{mod.title}</div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
