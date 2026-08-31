'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulationStore } from '@/store/useSimulationStore';

function IonicLattice() {
  const groupRef = useRef<THREE.Group>(null);
  const { isPlaying, params } = useSimulationStore();

  // Generar cuadrícula 3D de 4x4x4 iones alternados Na+ (rojo/pequeño) y Cl- (azul/grande)
  const ions = useMemo(() => {
    const list = [];
    const size = 3;
    const spacing = 1.1;
    const offset = (size - 1) * spacing * 0.5;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          const isNa = (x + y + z) % 2 === 0;
          list.push({
            pos: [x * spacing - offset, y * spacing - offset, z * spacing - offset] as [number, number, number],
            isNa,
            radius: isNa ? 0.28 : 0.42,
            color: isNa ? '#ef4444' : '#3b82f6',
            label: isNa ? 'Na+' : 'Cl-',
          });
        }
      }
    }
    return list;
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !isPlaying) return;
    const t = state.clock.getElapsedTime();
    const vib = (params.temperature / 100) * 0.04;

    // Rotación suave y vibración térmica en los sitios de la red
    groupRef.current.rotation.y = t * 0.25;
    groupRef.current.position.y = Math.sin(t * 15) * vib;
  });

  return (
    <group ref={groupRef}>
      {ions.map((ion, idx) => (
        <mesh key={idx} position={ion.pos}>
          <sphereGeometry args={[ion.radius, 32, 32]} />
          <meshStandardMaterial
            color={ion.color}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Viewport3DScene() {
  return (
    <div className="relative w-full h-[460px] bg-slate-950 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
      <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 15, 10]} intensity={1.5} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <IonicLattice/>
        <OrbitControls enablePan={false} maxDistance={10} minDistance={3}/>
      </Canvas>
    </div>
  );
}
