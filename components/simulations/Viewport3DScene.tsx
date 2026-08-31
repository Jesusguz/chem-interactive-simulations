'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulationStore } from '@/store/useSimulationStore';

function LatticeMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { isPlaying, params } = useSimulationStore();

  useFrame((_, delta) => {
    if (!meshRef.current || !isPlaying) return;
    meshRef.current.rotation.x += delta * 0.4;
    meshRef.current.rotation.y += delta * (params.temperature / 25);
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2.2, 2.2, 2.2]} />
      <meshStandardMaterial color="#6366f1" roughness={0.3} metalness={0.6} wireframe />
    </mesh>
  );
}

export default function Viewport3DScene() {
  return (
    <div className="relative w-full h-full min-h-[420px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-inner">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <LatticeMesh />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
