import { ModuleId, ModuleMetadata } from '@/types/simulation';

export const MODULE_REGISTRY: Partial<Record<ModuleId, ModuleMetadata>> = {
  'A1': {
    id: 'A1',
    unitCode: 'Unit 3.1',
    title: 'London Dispersion Forces',
    subtitle: 'Temporary shifts in electron density',
    category: 'IMF',
    renderMode: '2D_CANVAS',
    defaultParams: { temperature: 30, attractionStrength: 0.1, volume: 100, pressure: 1, particleCount: 25 },
    description: 'London dispersion forces come from temporary shifts in electron density.',
    studentExercise: 'Move the attraction strength slider and compare how particles move and cluster.',
    programmerNotes: 'Particles should be most spread out with weak random attractions.',
  },
  'C1': {
    id: 'C1',
    unitCode: 'Unit 3.2',
    title: 'Ionic Solid Lattice',
    subtitle: 'Alternating positive and negative ions',
    category: 'SOLIDS_3D',
    renderMode: '3D_R3F',
    defaultParams: { temperature: 20, attractionStrength: 0.95, volume: 100, pressure: 1, particleCount: 64 },
    description: 'An ionic solid is made of positive and negative ions arranged in a repeating lattice.',
    studentExercise: 'Observe the 3D repeating crystal structure and tiny vibrations around fixed positions.',
    programmerNotes: 'Show alternating charged particles in a 3D ordered grid.',
  },
  'D1': {
    id: 'D1',
    unitCode: 'Unit 3.5',
    title: 'Ideal Gas: Changes in P & V',
    subtitle: 'Boyle\'s Law Behavior',
    category: 'GAS_LAWS',
    renderMode: '2D_CANVAS',
    defaultParams: { temperature: 50, attractionStrength: 0, volume: 80, pressure: 1.2, particleCount: 35 },
    description: 'Inverse relationship between pressure and volume at constant temperature and moles.',
    studentExercise: 'Drag the volume control and observe the resulting pressure changes.',
    programmerNotes: 'Particles bounce elastically. Wall collisions calculate pressure.',
  }
};
