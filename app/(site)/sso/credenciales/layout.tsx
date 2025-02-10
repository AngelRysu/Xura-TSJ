import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Credenciales',
  description: 'Credenciales Xura',
};

export default function CredencialesLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
