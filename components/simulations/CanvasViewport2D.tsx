'use client';

import React, { useRef, useEffect } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export const CanvasViewport2D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const { isPlaying, params } = useSimulationStore();

  // Inicializar partículas
  useEffect(() => {
    const particles: Particle[] = [];
    const count = 30;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: 100 + Math.random() * 300,
        y: 100 + Math.random() * 250,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: 12,
        color: '#3b82f6',
      });
    }
    particlesRef.current = particles;
  }, []);

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

      // Fondo Cuadrícula
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      const step = 24;
      for (let x = 0; x < rect.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, rect.height);
        ctx.stroke();
      }
      for (let y = 0; y < rect.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
        ctx.stroke();
      }

      // Vaso de Precipitados (Beaker)
      const beakerWidth = Math.min(380, rect.width * 0.7);
      const beakerHeight = Math.min(380, rect.height * 0.75);
      const beakerX = (rect.width - beakerWidth) / 2;
      const beakerY = (rect.height - beakerHeight) / 2 + 20;

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      // Labio izquierdo
      ctx.moveTo(beakerX - 10, beakerY);
      ctx.lineTo(beakerX, beakerY);
      ctx.lineTo(beakerX, beakerY + beakerHeight - 20);
      ctx.arcTo(beakerX, beakerY + beakerHeight, beakerX + 20, beakerY + beakerHeight, 20);
      ctx.lineTo(beakerX + beakerWidth - 20, beakerY + beakerHeight);
      ctx.arcTo(beakerX + beakerWidth, beakerY + beakerHeight, beakerX + beakerWidth, beakerY + beakerHeight - 20, 20);
      ctx.lineTo(beakerX + beakerWidth, beakerY);
      // Pico vertedor
      ctx.lineTo(beakerX + beakerWidth + 14, beakerY - 8);
      ctx.stroke();

      const particles = particlesRef.current;
      const speedMultiplier = (params.temperature / 35) + 0.2;
      const attraction = params.attractionStrength;

      if (isPlaying) {
        // Actualizar física
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Atracción intermolecular hacia el centro del vaso
          if (attraction > 0.3) {
            const targetX = beakerX + beakerWidth / 2;
            const targetY = beakerY + beakerHeight - 60;
            p.vx += (targetX - p.x) * 0.0005 * attraction;
            p.vy += (targetY - p.y) * 0.0008 * attraction;
          }

          p.x += p.vx * speedMultiplier;
          p.y += p.vy * speedMultiplier;

          // Colisión con paredes del vaso
          if (p.x - p.radius < beakerX + 6) {
            p.x = beakerX + 6 + p.radius;
            p.vx *= -1;
          } else if (p.x + p.radius > beakerX + beakerWidth - 6) {
            p.x = beakerX + beakerWidth - 6 - p.radius;
            p.vx *= -1;
          }

          if (p.y - p.radius < beakerY + 10) {
            p.y = beakerY + 10 + p.radius;
            p.vy *= -1;
          } else if (p.y + p.radius > beakerY + beakerHeight - 6) {
            p.y = beakerY + beakerHeight - 6 - p.radius;
            p.vy *= -1;
          }
        }
      }

      // Dibujar partículas con halo de atracción
      particles.forEach((p) => {
        // Halo exterior
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.fill();

        // Partícula principal
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, params]);

  return (
    <div className="relative w-full h-[460px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
