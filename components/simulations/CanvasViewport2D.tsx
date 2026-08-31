'use client';

import React, { useRef, useEffect } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';

interface BaseParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  angle: number;       // Orientación angular para dipolos
  angularVelocity: number;
  charge?: number;     // Para iones
  type?: 'dipole' | 'cation' | 'anion' | 'monopole' | 'solvent';
}

export const CanvasViewport2D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<BaseParticle[]>([]);
  const { isPlaying, params, currentModuleId } = useSimulationStore();

  // Inicialización de partículas según el módulo activo
  useEffect(() => {
    const particles: BaseParticle[] = [];
    const count = 26;

    if (currentModuleId === 'A3') {
      // Ion central grande + solventes dipolares alrededor
      particles.push({
        x: 200,
        y: 200,
        vx: 0,
        vy: 0,
        radius: 24,
        angle: 0,
        angularVelocity: 0,
        charge: 1, // Catión Na+ central
        type: 'cation',
      });

      for (let i = 0; i < 18; i++) {
        const rad = 70 + Math.random() * 80;
        const ang = (i / 18) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        particles.push({
          x: 200 + Math.cos(ang) * rad,
          y: 200 + Math.sin(ang) * rad,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          radius: 12,
          angle: ang + Math.PI, // Orientado hacia el centro
          angularVelocity: (Math.random() - 0.5) * 0.05,
          type: 'dipole',
        });
      }
    } else if (currentModuleId === 'A6') {
      // Red iónica rígida 6x6
      const cols = 6;
      const rows = 6;
      const spacing = 32;
      const startX = 110;
      const startY = 110;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isCation = (r + c) % 2 === 0;
          particles.push({
            x: startX + c * spacing,
            y: startY + r * spacing,
            vx: 0,
            vy: 0,
            radius: isCation ? 10 : 13,
            angle: 0,
            angularVelocity: 0,
            charge: isCation ? 1 : -1,
            type: isCation ? 'cation' : 'anion',
          });
        }
      }
    } else {
      // A1, A2, A4 y otros
      for (let i = 0; i < count; i++) {
        particles.push({
          x: 90 + Math.random() * 220,
          y: 90 + Math.random() * 220,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: currentModuleId === 'A4' ? 11 : 13,
          angle: Math.random() * Math.PI * 2,
          angularVelocity: (Math.random() - 0.5) * 0.08,
          type: currentModuleId === 'A2' || currentModuleId === 'A4' ? 'dipole' : 'monopole',
        });
      }
    }

    particlesRef.current = particles;
  }, [currentModuleId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Dibujar cuadrícula tenue
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let x = 0; x < rect.width; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, rect.height);
        ctx.stroke();
      }
      for (let y = 0; y < rect.height; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
        ctx.stroke();
      }

      // Vaso de Precipitados (Beaker)
      const bW = Math.min(380, rect.width * 0.75);
      const bH = Math.min(380, rect.height * 0.8);
      const bX = (rect.width - bW) / 2;
      const bY = (rect.height - bH) / 2 + 15;

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(bX - 10, bY);
      ctx.lineTo(bX, bY);
      ctx.lineTo(bX, bY + bH - 16);
      ctx.arcTo(bX, bY + bH, bX + 16, bY + bH, 16);
      ctx.lineTo(bX + bW - 16, bY + bH);
      ctx.arcTo(bX + bW, bY + bH, bX + bW, bY + bH - 16, 16);
      ctx.lineTo(bX + bW, bY);
      ctx.lineTo(bX + bW + 12, bY - 8);
      ctx.stroke();

      const particles = particlesRef.current;
      const speedMult = (params.temperature / 40) + 0.15;
      const attraction = params.attractionStrength;

      if (isPlaying) {
        if (currentModuleId === 'A6') {
          // A6: Vibración térmica en red iónica sin desplazamiento de nodos
          const vibAmp = (params.temperature / 100) * 2.2;
          particles.forEach((p, idx) => {
            const cols = 6;
            const r = Math.floor(idx / cols);
            const c = idx % cols;
            const originX = bX + 60 + c * 38;
            const originY = bY + 60 + r * 38;
            p.x = originX + (Math.random() - 0.5) * vibAmp;
            p.y = originY + (Math.random() - 0.5) * vibAmp;
          });
        } else if (currentModuleId === 'A3') {
          // A3: Ion-Dipolo: Orientación electrostática radial hacia el ion central
          const centralIon = particles[0];
          centralIon.x = bX + bW / 2;
          centralIon.y = bY + bH / 2;

          for (let i = 1; i < particles.length; i++) {
            const p = particles[i];
            const dx = centralIon.x - p.x;
            const dy = centralIon.y - p.y;
            const dist = Math.sqrt(dx * dy + dy * dy) || 1;

            // Torque de orientación: el extremo negativo (azul) apunta hacia el catión positivo
            const targetAngle = Math.atan2(dy, dx);
            let angleDiff = targetAngle - p.angle;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            p.angle += angleDiff * 0.08 * attraction;

            // Atracción hacia el ion central
            if (dist > 50) {
              p.vx += (dx / dist) * 0.12 * attraction;
              p.vy += (dy / dist) * 0.12 * attraction;
            }

            p.x += p.vx * speedMult;
            p.y += p.vy * speedMult;
            p.vx *= 0.95;
            p.vy *= 0.95;

            // Contención en vaso
            if (p.x - p.radius < bX + 10) { p.x = bX + 10 + p.radius; p.vx *= -1; }
            if (p.x + p.radius > bX + bW - 10) { p.x = bX + bW - 10 - p.radius; p.vx *= -1; }
            if (p.y - p.radius < bY + 10) { p.y = bY + 10 + p.radius; p.vy *= -1; }
            if (p.y + p.radius > bY + bH - 10) { p.y = bY + bH - 10 - p.radius; p.vy *= -1; }
          }
        } else {
          // A1, A2, A4: Dinámica con Fuerzas Intermoleculares y torque
          for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];

            for (let j = i + 1; j < particles.length; j++) {
              const p2 = particles[j];
              const dx = p2.x - p1.x;
              const dy = p2.y - p1.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < 80 && dist > 0) {
                // Fuerzas atractivas IMF
                const force = (attraction * 0.25) / Math.max(dist, 20);
                p1.vx += (dx / dist) * force;
                p1.vy += (dy / dist) * force;
                p2.vx -= (dx / dist) * force;
                p2.vy -= (dy / dist) * force;

                // Si es A2 o A4 (Dipolo-Dipolo / H-Bond): Torque para alinear polos opuestos
                if (currentModuleId === 'A2' || currentModuleId === 'A4') {
                  const bondAngle = Math.atan2(dy, dx);
                  // P1 orienta su extremo positivo (0 rad) hacia el polo negativo de P2 (PI rad)
                  p1.angle += Math.sin(bondAngle - p1.angle) * 0.05 * attraction;
                  p2.angle += Math.sin(bondAngle + Math.PI - p2.angle) * 0.05 * attraction;

                  // En A4 (H-Bond), dibujar enlace punteado si están alineados y cercanos
                  if (currentModuleId === 'A4' && dist < 45) {
                    ctx.save();
                    ctx.setLineDash([3, 3]);
                    ctx.strokeStyle = '#6366f1';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                    ctx.restore();
                  }
                }
              }

              // Colisión elástica entre partículas
              if (dist < p1.radius + p2.radius) {
                const overlap = (p1.radius + p2.radius) - dist;
                p1.x -= (dx / dist) * overlap * 0.5;
                p1.y -= (dy / dist) * overlap * 0.5;
                p2.x += (dx / dist) * overlap * 0.5;
                p2.y += (dy / dist) * overlap * 0.5;
                const tempVx = p1.vx; const tempVy = p1.vy;
                p1.vx = p2.vx; p1.vy = p2.vy;
                p2.vx = tempVx; p2.vy = tempVy;
              }
            }

            p1.x += p1.vx * speedMult;
            p1.y += p1.vy * speedMult;
            p1.angle += p1.angularVelocity * speedMult;

            // Colisiones con paredes
            if (p1.x - p1.radius < bX + 8) { p1.x = bX + 8 + p1.radius; p1.vx *= -1; }
            if (p1.x + p1.radius > bX + bW - 8) { p1.x = bX + bW - 8 - p1.radius; p1.vx *= -1; }
            if (p1.y - p1.radius < bY + 10) { p1.y = bY + 10 + p1.radius; p1.vy *= -1; }
            if (p1.y + p1.radius > bY + bH - 8) { p1.y = bY + bH - 8 - p1.radius; p1.vy *= -1; }
          }
        }
      }

      // --- RENDERIZADO VISUAL SEGÚN EL TIPO DE PARTÍCULA ---
      particles.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);

        if (p.type === 'cation') {
          // Ion positivo (Rojo con +)
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#ef4444';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('+', 0, 1);
        } else if (p.type === 'anion') {
          // Ion negativo (Azul con -)
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#3b82f6';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('-', 0, -1);
        } else if (p.type === 'dipole') {
          // Partícula Bicolor Dipolar (Mitad Roja δ+, Mitad Azul δ-)
          ctx.rotate(p.angle);

          // Hemisferio Positivo (Rojo δ+)
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, -Math.PI / 2, Math.PI / 2, false);
          ctx.fillStyle = '#ef4444';
          ctx.fill();

          // Hemisferio Negativo (Azul δ-)
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, Math.PI / 2, (3 * Math.PI) / 2, false);
          ctx.fillStyle = '#3b82f6';
          ctx.fill();

          // Borde blanco y línea divisoria
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.moveTo(0, -p.radius);
          ctx.lineTo(0, p.radius);
          ctx.stroke();

          // Etiquetas de carga parcial
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('+', p.radius * 0.45, 0);
          ctx.fillText('-', -p.radius * 0.45, 0);
        } else {
          // Monopolo / LDF (Partícula Azul uniforme con halo)
          ctx.beginPath();
          ctx.arc(0, 0, p.radius + 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#3b82f6';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, params, currentModuleId]);

  return (
    <div className="relative w-full h-[460px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
