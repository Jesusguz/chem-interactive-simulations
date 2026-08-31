import { create } from 'zustand';
import { ModuleId, ModuleMetadata, SimulationParams } from '@/types/simulation';
import { MODULE_REGISTRY } from '@/lib/constants/modules';

interface SimulationState {
  currentModuleId: ModuleId;
  currentModule: ModuleMetadata;
  params: SimulationParams;
  isPlaying: boolean;
  setModule: (id: ModuleId) => void;
  updateParams: (partialParams: Partial<SimulationParams>) => void;
  togglePlay: () => void;
  resetSimulation: () => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  currentModuleId: 'A1',
  currentModule: MODULE_REGISTRY['A1']!,
  params: MODULE_REGISTRY['A1']!.defaultParams,
  isPlaying: true,

  setModule: (id: ModuleId) => {
    const target = MODULE_REGISTRY[id] || MODULE_REGISTRY['A1']!;
    set({
      currentModuleId: id,
      currentModule: target,
      params: { ...target.defaultParams },
      isPlaying: true,
    });
  },

  updateParams: (partialParams) =>
    set((state) => ({
      params: { ...state.params, ...partialParams },
    })),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  resetSimulation: () => {
    const { currentModule } = get();
    set({ params: { ...currentModule.defaultParams }, isPlaying: true });
  },
}));
