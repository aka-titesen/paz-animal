import Providers from '@/components/providers/Providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Plataforma Paz Animal',
  description: 'Fundación protectora de animales - Corrientes, Argentina',
  keywords: ['animales', 'protección', 'rescate', 'ONG', 'Corrientes', 'Argentina'],
  authors: [{ name: 'Fundación Paz Animal' }],
  openGraph: {
    title: 'Plataforma Paz Animal',
    description: 'Fundación protectora de animales - Corrientes, Argentina',
    type: 'website',
    locale: 'es_AR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
