'use client';

import { useState, ReactElement } from 'react';
import { Box, Typography } from '@mui/material';
import { usePermissions } from '@/app/context/PermissionsContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import getMuiIcon from '@/app/mocks/iconsMap';

type MenuItem = {
  icon: ReactElement;
  label: string;
  link: string;
};

export default function Sidebar() {
  const { permissions } = usePermissions();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  // Obtener clave de aplicación desde la ruta
  const appClave = pathname.split('/')[1];

  // Filtrar módulos según la aplicación correspondiente
  const currentMenuItems: MenuItem[] = [
    {
      icon: <HomeIcon />,
      label: 'Panel',
      link: '/panel',
    },
    ...permissions
      .filter((app) => app.aplicacionClave.toLowerCase() === appClave.toLowerCase())
      .flatMap((app) => app.modulos.map((mod) => ({
        icon: getMuiIcon(mod.moduloIcon),
        label: mod.moduloClave,
        link: `${app.link}/${mod.moduloClave.toLowerCase()}`,
      }))),
  ];

  return (
    <Box
      sx={{
        width: isOpen ? 200 : 70,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        bgcolor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        borderRight: '1px solid #ddd',
        zIndex: 1,
        paddingTop: 8,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {currentMenuItems.map((item) => (
        <Link href={item.link} key={item.label} style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2,
              py: 2,
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              '&:hover': { bgcolor: '#e0e0e0' },
            }}
          >
            <Box
              sx={{
                minWidth: 40,
                color: '#444',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </Box>
            {isOpen && (
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#444',
                  ml: 2,
                }}
              >
                {item.label}
              </Typography>
            )}
          </Box>
        </Link>
      ))}
    </Box>
  );
}
