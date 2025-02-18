import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SSO',
  description: 'SSO Xura',
};

export default function SSOLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
