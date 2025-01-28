import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panel',
  description: 'Panel Xura',
};

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
