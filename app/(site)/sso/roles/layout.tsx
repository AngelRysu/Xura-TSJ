import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Roles',
  description: 'Roles Xura',
};

export default function RolesLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
