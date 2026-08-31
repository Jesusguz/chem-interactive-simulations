export type ModuleCategory = 'IMF' | 'STATES_OF_MATTER' | 'SOLIDS_3D' | 'GAS_LAWS' | 'KMT_MAXWELL';

export type ModuleId =
  | 'A1' | 'A2' | 'A3' | 'A4' | 'A6'
  | 'B1.1' | 'B1.2' | 'B1.3' | 'B2.1' | 'B2.2' | 'B2.3'
  | 'B3.1' | 'B3.2' | 'B3.3' | 'B4.1' | 'B4.2' | 'B4.3'
  | 'B5.1' | 'B5.2' | 'B5.3' | 'B6.1' | 'B6.2' | 'B6.3'
  | 'C1' | 'C2' | 'C3' | 'C4'
  | 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6'
  | 'E1'
  | 'F1' | 'F2' | 'F3' | 'F4' | 'F5';

export interface SimulationParams {
  temperature: number;        // Escala normalizada [0 - 100]
  attractionStrength: number; // Factor de atracción [0 - 1]
  volume: number;             // Volumen [0 - 100]
  pressure: number;           // Presión calculada o fija
  particleCount: number;
  magnetEngaged?: boolean;
}

export interface ModuleMetadata {
  id: ModuleId;
  unitCode: string;
  title: string;
  subtitle: string;
  category: ModuleCategory;
  renderMode: '2D_CANVAS' | '3D_R3F';
  defaultParams: SimulationParams;
  description: string;
  studentExercise: string;
  programmerNotes: string;
}
