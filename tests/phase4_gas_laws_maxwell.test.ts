import { describe, it, expect } from 'vitest';

// Función utilitaria de cálculo de gas ideal: P = (n * R * T) / V
export function calculateIdealPressure(n: number, T: number, V: number, R: number = 0.0821): number {
  if (V <= 0) throw new Error('El volumen debe ser mayor a 0');
  return (n * R * T) / V;
}

// Función de distribución de probabilidad de Maxwell-Boltzmann
export function maxwellBoltzmannPDF(v: number, T: number, M: number = 0.032, R: number = 8.314): number {
  if (T <= 0 || v < 0) return 0;
  const factor = 4 * Math.PI * Math.pow(M / (2 * Math.PI * R * T), 1.5);
  const exponent = (-M * v * v) / (2 * R * T);
  return factor * v * v * Math.exp(exponent);
}

describe('FASE 4: Verificación Matemática de Leyes de Gases y Maxwell-Boltzmann', () => {

  it('[P4-01] Ley de Boyle (D1): P es inversamente proporcional a V', () => {
    const P1 = calculateIdealPressure(1, 300, 10);
    const P2 = calculateIdealPressure(1, 300, 5); // Reducción a la mitad de V
    expect(P2).toBeCloseTo(P1 * 2, 2);
  });

  it('[P4-02] Ley de Gay-Lussac (D2): P es directamente proporcional a T', () => {
    const P1 = calculateIdealPressure(1, 200, 10);
    const P2 = calculateIdealPressure(1, 400, 10); // Duplicación de T
    expect(P2).toBeCloseTo(P1 * 2, 2);
  });

  it('[P4-03] Detección de Gas No Ideal: Umbral de alerta en extremos de P y T', () => {
    const isNotIdeal = (P: number, T: number) => P > 80 || T < 15;
    expect(isNotIdeal(90, 50)).toBe(true);  // Alta presión -> Desviación
    expect(isNotIdeal(50, 10)).toBe(true);  // Muy baja temperatura -> Desviación
    expect(isNotIdeal(50, 50)).toBe(false); // Condiciones intermedias -> Ideal
  });

  it('[P4-04] Maxwell-Boltzmann: El pico de velocidad más probable (v_mp) se desplaza a la derecha con mayor T', () => {
    const T_low = 100;
    const T_high = 600;

    // v_mp = sqrt(2 * R * T / M)
    const v_mp_low = Math.sqrt((2 * 8.314 * T_low) / 0.032);
    const v_mp_high = Math.sqrt((2 * 8.314 * T_high) / 0.032);

    expect(v_mp_high).toBeGreaterThan(v_mp_low);

    // La altura del pico disminuye al aumentar T (se aplana la curva)
    const peakHeight_low = maxwellBoltzmannPDF(v_mp_low, T_low);
    const peakHeight_high = maxwellBoltzmannPDF(v_mp_high, T_high);
    expect(peakHeight_high).toBeLessThan(peakHeight_low);
  });
});
