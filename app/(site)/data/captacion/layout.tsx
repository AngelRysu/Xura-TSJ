import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Captacion',
  description: 'Captacion Xura',
};

export default function CaptacionLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
