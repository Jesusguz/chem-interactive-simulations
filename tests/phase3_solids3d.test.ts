import { describe, it, expect } from 'vitest';
import { MODULE_REGISTRY } from '@/lib/constants/modules';

describe('FASE 3: Validación de Parámetros y Modelos de Sólidos 3D', () => {

  it('[P3-01] C1 (Iónico): Cristal de red con alta cohesión y modo 3D', () => {
    const c1 = MODULE_REGISTRY['C1']!;
    expect(c1.renderMode).toBe('3D_R3F');
    expect(c1.defaultParams.attractionStrength).toBeGreaterThanOrEqual(0.9);
  });

  it('[P3-02] C2 (Metálico): Soporte para toggle magnético de electrones deslocalizados', () => {
    const c2 = MODULE_REGISTRY['C2']!;
    expect(c2.defaultParams.magnetEngaged).toBeDefined();
    expect(typeof c2.defaultParams.magnetEngaged).toBe('boolean');
  });

  it('[P3-03] C3 vs C4: Sólido Molecular (discreto) vs Red Covalente (continua)', () => {
    const c3 = MODULE_REGISTRY['C3']!;
    const c4 = MODULE_REGISTRY['C4']!;
    expect(c4.defaultParams.attractionStrength).toBeGreaterThan(c3.defaultParams.attractionStrength);
  });
});
