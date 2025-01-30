import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { CssBaseline } from '@mui/material';
import AuthProvider from '@/app/context/AuthProvider';
import { MainLay } from '@/app/shared/layout';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/app/shared/themes/fontTheme';
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: 'Xura',
  description: 'Control Escolar Xura TSJ',
  keywords: ['login, tsj'],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <SessionProvider>
        <AuthProvider>
          <CssBaseline />
          <ThemeProvider theme={theme}>
            <MainLay>
              {children}
            </MainLay>
          </ThemeProvider>
        </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
