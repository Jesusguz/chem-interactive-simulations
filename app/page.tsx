'use client';

import React from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { Sidebar } from '@/components/ui/Sidebar';
import { CanvasViewport2D } from '@/components/simulations/CanvasViewport2D';
import { Viewport3D } from '@/components/simulations/Viewport3D';
import { Play, Pause, RotateCcw, Sliders } from 'lucide-react';

export default function SimulationApp() {
  const { currentModule, params, isPlaying, updateParams, togglePlay, resetSimulation } = useSimulationStore();

  return (
    <div className="flex h-screen w-screen bg-slate-100 text-slate-900 overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                {currentModule.unitCode}
              </span>
              <h1 className="text-lg font-bold text-slate-800">{currentModule.title}</h1>
            </div>
            <p className="text-xs text-slate-500">{currentModule.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={resetSimulation}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Layout */}
        <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
          {/* Main Visualizer Area */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {currentModule.renderMode === '3D_R3F' ? <Viewport3D /> : <CanvasViewport2D />}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Student Exploration Goal</h3>
              <p className="text-sm text-slate-700">{currentModule.studentExercise}</p>
            </div>
          </div>

          {/* Controls & Science Cards */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-800">Parameters</h2>
              </div>

              <div className="space-y-3">
                {currentModule.id === 'C2' && (
                  <div className="pt-2">
                    <button
                      onClick={() => updateParams({ magnetEngaged: !params.magnetEngaged })}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                        params.magnetEngaged
                          ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                          : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      🧲 {params.magnetEngaged ? 'Magnet Engaged (Electrons Attracted)' : 'Engage Magnet'}
                    </button>
                  </div>
                )}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>Temperature (Kinetic Energy)</span>
                    <span>{params.temperature} K</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={params.temperature}
                    onChange={(e) => updateParams({ temperature: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>Attraction Strength (IMF)</span>
                    <span>{params.attractionStrength.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={params.attractionStrength}
                    onChange={(e) => updateParams({ attractionStrength: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50/70 border border-blue-200/60 p-4 rounded-xl">
              <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Core Scientific Concept</h3>
              <p className="text-xs text-blue-900/80 leading-relaxed">{currentModule.description}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
