import { describe, it, expect, beforeEach } from 'vitest';
import { MODULE_REGISTRY } from '@/lib/constants/modules';
import { useSimulationStore } from '@/store/useSimulationStore';
import { ModuleId } from '@/types/simulation';

describe('FASE 1: Arquitectura Core, Registro y Zustand Store', () => {
  beforeEach(() => {
    useSimulationStore.getState().resetSimulation();
  });

  it('[P1-01] Registro de Módulos: Debe contener todos los submódulos de la Unidad 3', () => {
    const requiredModules: ModuleId[] = [
      'A1', 'A2', 'A3', 'A4', 'A6',
      'B1.1', 'B1.2', 'B1.3', 'B2.1', 'B2.2', 'B2.3',
      'B3.1', 'B3.2', 'B3.3', 'B4.1', 'B4.2', 'B4.3',
      'B5.1', 'B5.2', 'B5.3', 'B6.1', 'B6.2', 'B6.3',
      'C1', 'C2', 'C3', 'C4',
      'D1', 'D2', 'D3', 'D4', 'D5', 'D6',
      'E1', 'F1', 'F2', 'F3', 'F4', 'F5'
    ];

    requiredModules.forEach((id) => {
      const mod = MODULE_REGISTRY[id];
      expect(mod, `El módulo ${id} no está definido en el registro`).toBeDefined();
      expect(mod!.id).toBe(id);
      expect(mod!.title.length).toBeGreaterThan(3);
      expect(mod!.unitCode).toMatch(/^Unit 3\.\d+$/);
      expect(mod!.defaultParams).toBeDefined();
    });
  });

  it('[P1-02] Zustand Store: Conmutación atómica de módulo sin mutación sucia', () => {
    const store = useSimulationStore.getState();
    store.setModule('A2');

    expect(useSimulationStore.getState().currentModuleId).toBe('A2');
    expect(useSimulationStore.getState().currentModule.category).toBe('IMF');
    expect(useSimulationStore.getState().isPlaying).toBe(true);
  });

  it('[P1-03] Zustand Store: Actualización reactiva de parámetros físicos', () => {
    const store = useSimulationStore.getState();
    store.updateParams({ temperature: 75, attractionStrength: 0.85 });

    const state = useSimulationStore.getState();
    expect(state.params.temperature).toBe(75);
    expect(state.params.attractionStrength).toBe(0.85);
  });

  it('[P1-04] Asignación correcta de motor de renderizado (2D vs 3D)', () => {
    const mod3D: ModuleId[] = ['C1', 'C2', 'C3', 'C4'];
    mod3D.forEach((id) => {
      expect(MODULE_REGISTRY[id]!.renderMode).toBe('3D_R3F');
    });

    const mod2D: ModuleId[] = ['A1', 'A2', 'B1.1', 'D1', 'E1', 'F1'];
    mod2D.forEach((id) => {
      expect(MODULE_REGISTRY[id]!.renderMode).toBe('2D_CANVAS');
    });
  });
});
