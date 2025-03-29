import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GP Mate - Quick BNF Lookup',
  description: 'Quick access to BNF medication information for UK GPs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 