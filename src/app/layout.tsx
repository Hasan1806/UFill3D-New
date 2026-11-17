import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';

export const metadata: Metadata = {
  title: 'UFill3D — Make it Real | Premium 3D Printing Filament',
  description: 'UFill3D is the premier manufacturer of precision 3D printing filaments. Dual-axis laser calibrated to ±0.02mm, 100% virgin polymer, robotically wound for zero clogs.',
  keywords: [
    'UFill3D',
    '3D printing filament',
    'PLA Ultra',
    'PLA+',
    'PETG Pro',
    'Carbon Fiber PLA',
    'TPU 95A',
    'High Speed 3D printing',
    'CoreXY filament',
    'Bambu Lab filament',
  ],
  authors: [{ name: 'UFill3D Technologies' }],
  openGraph: {
    title: 'UFill3D — Make it Real',
    description: 'Precision Additive Manufacturing Filaments calibrated to ±0.02mm.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen flex flex-col bg-ufill-background text-ufill-primary selection:bg-ufill-secondary selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
