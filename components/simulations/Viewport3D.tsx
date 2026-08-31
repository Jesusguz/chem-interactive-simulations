'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Viewport3DScene = dynamic(() => import('./Viewport3DScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[420px] bg-slate-950 rounded-xl flex items-center justify-center text-slate-400 font-mono text-sm">
      Initializing WebGL 3D Canvas...
    </div>
  ),
});

export const Viewport3D: React.FC = () => {
  return <Viewport3DScene />;
};
