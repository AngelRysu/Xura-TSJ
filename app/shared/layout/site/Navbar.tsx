'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Box } from '@mui/material';
import { useCallback } from 'react';
import getTokenLocalStorage from '@/app/shared/utils/getToken';

export default function Navbar() {
  const backgroundColor = 'rgb(50, 22, 155)';
  const router = useRouter();

  const handleLogoClick = useCallback(() => {
    const storedUser = getTokenLocalStorage();
    if (storedUser && storedUser.token) {
      router.push('/panel');
    } else {
      router.push('/');
    }
  }, [router]);

  return (
    <AppBar position='fixed' sx={{ backgroundColor, width: '100%' }}>
      <Toolbar sx={{ minHeight: 64 }}>
        <Box
          onClick={handleLogoClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <Image
            src='/logo-blanco.svg'
            alt='Logo'
            width={100}
            height={50}
            priority
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
