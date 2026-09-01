import { describe, it, expect } from 'vitest';
import { MODULE_REGISTRY } from '@/lib/constants/modules';

describe('FASE 2: Invariantes Físicas de Fuerzas Intermoleculares y Estados (2D)', () => {

  it('[P2-01] Módulo A1 (London): Es la interacción más débil del set IMF', () => {
    const a1 = MODULE_REGISTRY['A1']!;
    const a2 = MODULE_REGISTRY['A2']!;
    const a6 = MODULE_REGISTRY['A6']!;

    expect(a1.defaultParams.attractionStrength).toBeLessThan(a2.defaultParams.attractionStrength);
    expect(a1.defaultParams.attractionStrength).toBeLessThan(a6.defaultParams.attractionStrength);
  });

  it('[P2-02] Módulo A2 (Dipolo-Dipolo): Configuración de partículas dipolares bicolor', () => {
    const a2 = MODULE_REGISTRY['A2']!;
    expect(a2.programmerNotes.toLowerCase()).toContain('bicolor');
    expect(a2.defaultParams.attractionStrength).toBeGreaterThanOrEqual(0.4);
  });

  it('[P2-03] Módulo A3 (Ion-Dipolo): Solvatación con atracción asimétrica superior a dipolo ordinario', () => {
    const a2 = MODULE_REGISTRY['A2']!;
    const a3 = MODULE_REGISTRY['A3']!;
    expect(a3.defaultParams.attractionStrength).toBeGreaterThan(a2.defaultParams.attractionStrength);
    expect(a3.programmerNotes.toLowerCase()).toContain('central');
  });

  it('[P2-04] Módulo A4 (Puentes de Hidrógeno): Mayor empaquetamiento que dipolo estándar', () => {
    const a2 = MODULE_REGISTRY['A2']!;
    const a4 = MODULE_REGISTRY['A4']!;
    expect(a4.defaultParams.attractionStrength).toBeGreaterThan(a2.defaultParams.attractionStrength);
    expect(a4.defaultParams.particleCount).toBeGreaterThanOrEqual(a2.defaultParams.particleCount);
  });

  it('[P2-05] Módulo A6 (Red Iónica): Rigidez electrostática máxima', () => {
    const a6 = MODULE_REGISTRY['A6']!;
    expect(a6.defaultParams.attractionStrength).toBeGreaterThanOrEqual(0.95);
    expect(a6.defaultParams.particleCount).toBe(36); // Grid 6x6
  });

  it('[P2-06] Módulos B1 a B2: Progresión de energía cinética con temperatura', () => {
    const b1_low = MODULE_REGISTRY['B1.1']!;
    const b1_high = MODULE_REGISTRY['B1.3']!;
    expect(b1_high.defaultParams.temperature).toBeGreaterThan(b1_low.defaultParams.temperature);
  });
});
