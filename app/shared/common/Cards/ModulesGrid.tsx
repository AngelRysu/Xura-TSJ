'use client';

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import Image from 'next/image';
import { usePermissions } from '@/app/context/PermissionsContext';
import { useAuthContext } from '@/app/context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getData } from '@/app/shared/utils/apiUtils';

export default function ModulesGrid() {
  const { permissions } = usePermissions();
  const { user, setNoti } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();
  const [grupos, setGrupos] = useState<any[]>([]);

  const currentPermission = permissions.find(
    (permission) => permission.link === pathname,
  );

  const modules = currentPermission?.modulos || [];

  const accessibleModules = modules.map((module: any) => ({
    id: module.idModulo.toString(),
    img: module.moduloImagen,
    title: module.moduloClave,
    link: `${currentPermission?.link}/${module.moduloClave.toLowerCase()}`,
  }));

  const [currentPage, setCurrentPage] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [key, setKey] = useState(0);
  const cardsPerPage = 6;
  const routeImage = process.env.IMAGES_ROUTE_URL;
  const totalPages = Math.ceil(accessibleModules.length / cardsPerPage);

  const gruposUsuario = useMemo(() => user?.grupos?.split(',') || [], [user]);

  useEffect(() => {
    if (!pathname.startsWith('/data')) return;

    const fetchGrupos = async () => {
      try {
        const { data } = await getData({ endpoint: '/grupos' });
        setGrupos(data);
      } catch (error) {
        setNoti({
          open: true,
          type: 'error',
          message: 'Error al cargar los grupos.',
        });
      }
    };

    fetchGrupos();
  }, [pathname, setNoti]);

  const handleModuleClick = async (link: string) => {
    if (link === '/data/matricula') {
      if (gruposUsuario.includes('1')) {
        router.push('/data/matricula');
        return;
      }

      const gruposDelUsuario = grupos.filter((grupo) => gruposUsuario
        .includes(grupo.idGrupo.toString()));

      if (gruposDelUsuario.length === 1) {
        const grupoUnico = gruposDelUsuario[0];
        const claveBase = grupoUnico.clave?.split('_')[0];
        const tieneExtensiones = grupos.some((g) => g.clave?.startsWith(`${claveBase}_EX`));

        if (!tieneExtensiones) {
          const nombreRuta = encodeURIComponent(grupoUnico.nombre.toUpperCase());
          router.push(`/data/matricula/unidad/${nombreRuta}`);
          return;
        }
      }
    }
    router.push(link);
  };

  const triggerAnimation = (newDirection: 'left' | 'right') => {
    setSlideDirection(newDirection);
    setKey((prevKey) => prevKey + 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
      setSlideDirection('left');
    } else {
      setCurrentPage(0);
      setSlideDirection('left');
    }
    triggerAnimation('left');
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      setSlideDirection('right');
    } else {
      setCurrentPage(totalPages - 1);
      setSlideDirection('right');
    }
    triggerAnimation('right');
  };

  const currentModules = accessibleModules.slice(
    currentPage * cardsPerPage,
    (currentPage + 1) * cardsPerPage,
  );

  const getGridProps = (length: number) => {
    if (length === 1) return { md: 4 };
    if (length === 2 || length === 3) return { xs: 12, sm: 6, md: 4 };
    if (length === 4) return { xs: 12, sm: 6, md: 4 };
    return { xs: 12, sm: 6, md: 4 };
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        width: '100%',
        position: 'relative',
      }}
    >
      {totalPages > 1 && (
        <>
          <IconButton
            onClick={handlePreviousPage}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: 60,
              height: 60,
              backgroundColor: '#f9f9f9',
              '&:hover': { backgroundColor: '#f0f0f0' },
            }}
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: '2rem' }} />
          </IconButton>
          <IconButton
            onClick={handleNextPage}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: 60,
              height: 60,
              backgroundColor: '#f9f9f9',
              '&:hover': { backgroundColor: '#f0f0f0' },
            }}
          >
            <ArrowForwardOutlinedIcon sx={{ fontSize: '2rem' }} />
          </IconButton>
        </>
      )}
      <Grid
        container
        spacing={3}
        justifyContent='center'
        sx={{
          maxWidth: 900,
          display: 'flex',
          animation: `${slideDirection === 'left' ? 'slideLeft' : 'slideRight'} 0.5s ease-in-out`,
          '@keyframes slideLeft': {
            from: { transform: 'translateX(100%)', opacity: 0 },
            to: { transform: 'translateX(0)', opacity: 1 },
          },
          '@keyframes slideRight': {
            from: { transform: 'translateX(-100%)', opacity: 0 },
            to: { transform: 'translateX(0)', opacity: 1 },
          },
        }}
        key={key}
      >
        {currentModules.map((module) => {
          const { xs, sm, md } = getGridProps(currentModules.length);
          return (
            <Grid item key={module.id} xs={xs} sm={sm} md={md}>
              <Card
                elevation={3}
                onClick={() => handleModuleClick(module.link)}
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  },
                  overflow: 'hidden',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 3,
                }}
              >
                {module.img !== `${routeImage}/null` ? (
                  <Image
                    src={module.img}
                    alt={module.title}
                    width={300}
                    height={200}
                    priority
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                ) : (
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      height: '100%',
                    }}
                  >
                    <Typography variant='h6' sx={{ fontWeight: '500' }}>
                      {module.title}
                    </Typography>
                  </CardContent>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
