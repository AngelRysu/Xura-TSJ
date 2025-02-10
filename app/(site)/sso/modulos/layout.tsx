import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Modulos',
  description: 'Modulos Xura',
};

export default function ModulosLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
