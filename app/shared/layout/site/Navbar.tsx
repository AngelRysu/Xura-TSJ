'use client';

import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  ListItemIcon,
} from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  useState,
  MouseEvent,
  useEffect,
  useCallback,
} from 'react';
import { useAuthContext } from '@/app/context/AuthContext';
import getTokenLocalStorage from '@/app/shared/utils/getToken';

export default function Navbar() {
  const backgroundColor = 'rgb(50, 22, 155)';
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useAuthContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    setAnchorEl(null);
  }, [user]);

  const handleLogoClick = useCallback(() => {
    const storedUser = getTokenLocalStorage();
    if (storedUser && storedUser.token) {
      router.push('/panel');
    } else {
      router.push('/');
    }
  }, [router]);

  const handleLogout = async () => {
    setUser(null);
    localStorage.removeItem('authToken');
    router.push('/');
  };

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const fullName = user?.nombre || '';
  const [firstName, lastName] = fullName.split(' ');

  return (
    <AppBar position='fixed' sx={{ backgroundColor, width: '100%' }}>
      <Toolbar sx={{ minHeight: 64, justifyContent: 'space-between' }}>
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
        {pathname !== '/' && (
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
            <IconButton
              onClick={handleMenuClick}
              sx={{
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <AccountCircleOutlinedIcon />
              <Typography
                variant='body2'
                sx={{
                  ml: 1,
                  fontWeight: '500',
                  color: '#fff',
                }}
              >
                {`${firstName} ${lastName}`}
              </Typography>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              sx={{ mt: 1 }}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <AccountCircleOutlinedIcon fontSize='small' />
                </ListItemIcon>
                Perfil
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <SettingsOutlinedIcon fontSize='small' />
                </ListItemIcon>
                Configuración
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize='small' />
                </ListItemIcon>
                Cerrar sesión
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
