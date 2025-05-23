'use client';

import {
  ReactNode,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { Box } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import { getData } from '@/app/shared/utils/apiUtils';
import { UnitsCard } from '@/app/shared/common';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLay({ children }: MainLayoutProps) {
  const { user, setNoti } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();
  const gruposUsuario = useMemo(() => user?.grupos?.split(',') || [], [user]);

  const [grupos, setGrupos] = useState<any[]>([]);

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const { data } = await getData({ endpoint: '/grupos' });
        setGrupos(data);
      } catch (error) {
        setNoti({
          open: true,
          type: 'error',
          message: 'Error al cargar los datos.',
        });
      }
    };

    fetchGrupos();
  }, [setNoti]);

  useEffect(() => {
    if (pathname !== '/data/matricula' || grupos.length === 0) return;

    if (gruposUsuario.includes('1')) {
      router.push('/data/matricula');
      return;
    }

    const gruposDelUsuario = grupos.filter((grupo) => gruposUsuario
      .includes(grupo.idGrupo.toString()));

    if (gruposDelUsuario.length === 1) {
      const nombreRuta = encodeURIComponent(gruposDelUsuario[0].nombre.toUpperCase());
      router.push(`/data/matricula/unidad/${nombreRuta}`);
    }
  }, [pathname, gruposUsuario, grupos, router]);

  const hideSidebar = (
    pathname === '/'
    || (pathname === '/data/matricula' && !gruposUsuario.includes('1'))
    || pathname === '/panel'
    || pathname === '/data'
    || pathname === '/sso'
  );

  const showUnitsCard = pathname === '/data/matricula'
    && gruposUsuario.length > 1
    && !gruposUsuario.includes('1');

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', textTransform: 'none' }}>
      {!hideSidebar && <Sidebar />}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            padding: 3,
            marginTop: '64px',
            marginLeft: hideSidebar ? '0' : '70px',
            transition: 'margin-left 0.3s ease',
            backgroundColor: '#f9f9f9',
            overflow: 'auto',
          }}
        >
          {showUnitsCard ? <UnitsCard grupos={grupos} gruposUsuario={gruposUsuario} /> : children}
        </Box>
      </Box>
    </Box>
  );
}
