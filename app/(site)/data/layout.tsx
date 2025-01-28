import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Indicadores',
  description: 'Indicadores Xura',
};

export default function IndicadoresLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
