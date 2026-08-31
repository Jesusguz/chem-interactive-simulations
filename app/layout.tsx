import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AP Chemistry Interactive Simulations (Unit 3.1 - 3.6)',
  description: 'Interactive 2D/3D simulations for intermolecular forces and states of matter',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen w-screen overflow-hidden bg-slate-100">
        {children}
      </body>
    </html>
  );
}
