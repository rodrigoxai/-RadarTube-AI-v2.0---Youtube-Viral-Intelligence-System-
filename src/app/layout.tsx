import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RadarTube AI | YouTube Viral Radar',
  description:
    'Real-time YouTube trend analysis with AI-powered content generation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
