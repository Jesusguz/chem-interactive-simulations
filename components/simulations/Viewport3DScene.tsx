'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulationStore } from '@/store/useSimulationStore';

// --- C1: SÓLIDO IÓNICO (NaCl) ---
function IonicLattice({ temperature }: { temperature: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const ions = useMemo(() => {
    const list = [];
    const size = 3;
    const spacing = 1.2;
    const offset = (size - 1) * spacing * 0.5;
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          const isNa = (x + y + z) % 2 === 0;
          list.push({
            pos: [x * spacing - offset, y * spacing - offset, z * spacing - offset] as [number, number, number],
            radius: isNa ? 0.25 : 0.4,
            color: isNa ? '#ef4444' : '#3b82f6',
          });
        }
      }
    }
    return list;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const vib = (temperature / 100) * 0.03;
    groupRef.current.position.y = Math.sin(t * 12) * vib;
  });

  return (
    <group ref={groupRef}>
      {ions.map((ion, i) => (
        <mesh key={i} position={ion.pos}>
          <sphereGeometry args={[ion.radius, 24, 24]} />
          <meshStandardMaterial color={ion.color} roughness={0.2} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

// --- C2: SÓLIDO METÁLICO CON MAR DE ELECTRONES E IMÁN ---
function MetallicSolid({ temperature, magnetEngaged }: { temperature: number; magnetEngaged?: boolean }) {
  const electronsRef = useRef<THREE.InstancedMesh>(null);
  const cationPositions = useMemo(() => {
    const list: [number, number, number][] = [];
    const spacing = 1.3;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          list.push([x * spacing, y * spacing, z * spacing]);
        }
      }
    }
    return list;
  }, []);

  const electronCount = 70;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const electronData = useMemo(() => {
    return Array.from({ length: electronCount }, () => ({
      x: (Math.random() - 0.5) * 3.5,
      y: (Math.random() - 0.5) * 3.5,
      z: (Math.random() - 0.5) * 3.5,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.08,
      vz: (Math.random() - 0.5) * 0.08,
    }));
  }, []);

  useFrame(() => {
    if (!electronsRef.current) return;
    const speed = (temperature / 50) + 0.5;

    electronData.forEach((e, i) => {
      if (magnetEngaged) {
        // Desplazamiento hacia el polo positivo del imán (+X)
        e.vx += (1.8 - e.x) * 0.02;
      }
      e.x += e.vx * speed;
      e.y += e.vy * speed;
      e.z += e.vz * speed;

      // Límites de rebote en la nube
      if (Math.abs(e.x) > 2) e.vx *= -1;
      if (Math.abs(e.y) > 2) e.vy *= -1;
      if (Math.abs(e.z) > 2) e.vz *= -1;

      dummy.position.set(e.x, e.y, e.z);
      dummy.scale.set(0.08, 0.08, 0.08);
      dummy.updateMatrix();
      electronsRef.current!.setMatrixAt(i, dummy.matrix);
    });
    electronsRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Cationes metálicos fijos */}
      {cationPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.35, 24, 24]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.6} />
        </mesh>
      ))}

      {/* Mar de electrones móviles instanciados */}
      <instancedMesh ref={electronsRef} args={[undefined, undefined, electronCount]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color="#38bdf8" />
      </instancedMesh>
    </group>
  );
}

// --- C3: SÓLIDO MOLECULAR (Unidades Discretas H2O / I2) ---
function MolecularSolid({ temperature }: { temperature: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const molecules = useMemo(() => {
    const list = [];
    const spacing = 1.4;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          list.push([x * spacing, y * spacing, z * spacing] as [number, number, number]);
        }
      }
    }
    return list;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const vib = (temperature / 100) * 0.04;
    groupRef.current.children.forEach((child, i) => {
      child.position.y = molecules[i][1] + Math.sin(t * 8 + i) * vib;
    });
  });

  return (
    <group ref={groupRef}>
      {molecules.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Átomo Central */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.26, 16, 16]} />
            <meshStandardMaterial color="#ef4444" roughness={0.3} />
          </mesh>
          {/* Átomos Satélites */}
          <mesh position={[0.22, 0.16, 0]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#93c5fd" roughness={0.3} />
          </mesh>
          <mesh position={[-0.22, 0.16, 0]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#93c5fd" roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// --- C4: RED COVALENTE CONTINUA (SiO2 / Diamante con cilindros de enlace) ---
function CovalentNetworkSolid({ temperature }: { temperature: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes, bonds } = useMemo(() => {
    const nodesList: [number, number, number][] = [];
    const bondsList: { start: [number, number, number]; end: [number, number, number] }[] = [];
    const size = 3;
    const spacing = 1.2;
    const offset = (size - 1) * spacing * 0.5;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          const current: [number, number, number] = [x * spacing - offset, y * spacing - offset, z * spacing - offset];
          nodesList.push(current);

          // Conectar con vecinos para formar la red macromolecular continua
          if (x < size - 1) bondsList.push({ start: current, end: [(x + 1) * spacing - offset, y * spacing - offset, z * spacing - offset] });
          if (y < size - 1) bondsList.push({ start: current, end: [x * spacing - offset, (y + 1) * spacing - offset, z * spacing - offset] });
          if (z < size - 1) bondsList.push({ start: current, end: [x * spacing - offset, y * spacing - offset, (z + 1) * spacing - offset] });
        }
      }
    }
    return { nodes: nodesList, bonds: bondsList };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const vib = (temperature / 100) * 0.015; // Red muy rígida
    groupRef.current.position.y = Math.sin(t * 20) * vib;
  });

  return (
    <group ref={groupRef}>
      {/* Nodos atómicos */}
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.22, 20, 20]} />
          <meshStandardMaterial color="#f97316" roughness={0.1} metalness={0.2} />
        </mesh>
      ))}

      {/* Cilindros de enlace covalente continuo */}
      {bonds.map((b, i) => {
        const start = new THREE.Vector3(...b.start);
        const end = new THREE.Vector3(...b.end);
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const distance = start.distanceTo(end);
        const orientation = new THREE.Matrix4();
        orientation.lookAt(start, end, new THREE.Vector3(0, 1, 0));

        return (
          <mesh key={`bond-${i}`} position={mid} quaternion={new THREE.Quaternion().setFromRotationMatrix(orientation)}>
            <cylinderGeometry args={[0.05, 0.05, distance, 12]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.4} metalness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

// --- ESCENA PRINCIPAL ---
export default function Viewport3DScene() {
  const { currentModuleId, params } = useSimulationStore();

  return (
    <div className="relative w-full h-[460px] bg-slate-950 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
      <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 15, 10]} intensity={1.5} />
        <directionalLight position={[-10, -10, -5]} intensity={0.6} />

        {currentModuleId === 'C1' && <IonicLattice temperature={params.temperature} />}
        {currentModuleId === 'C2' && <MetallicSolid magnetEngaged={params.magnetEngaged} temperature={params.temperature} />}
        {currentModuleId === 'C3' && <MolecularSolid temperature={params.temperature} />}
        {currentModuleId === 'C4' && <CovalentNetworkSolid temperature={params.temperature} />}

        <OrbitControls enablePan={false} maxDistance={12} minDistance={3} />
      </Canvas>
    </div>
  );
}
