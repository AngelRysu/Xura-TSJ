import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Grupos',
  description: 'Grupos Xura',
};

export default function GruposLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
