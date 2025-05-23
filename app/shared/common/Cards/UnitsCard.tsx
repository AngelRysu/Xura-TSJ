'use client';

import {
  Grid,
  Card,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface UnitsCardProps {
  grupos: Array<{ idGrupo: number; nombre: string }>;
  gruposUsuario: string[];
}

export default function UnitsCard({ grupos, gruposUsuario }: UnitsCardProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [key, setKey] = useState(0);

  const unidadesFiltradas = grupos.filter((grupo) => gruposUsuario
    .includes(grupo.idGrupo.toString()));

  const cardsPerPage = 6;
  const totalPages = Math.ceil(unidadesFiltradas.length / cardsPerPage);

  const currentCards = unidadesFiltradas.slice(
    currentPage * cardsPerPage,
    (currentPage + 1) * cardsPerPage,
  );

  const triggerAnimation = (direction: 'left' | 'right') => {
    setSlideDirection(direction);
    setKey((prev) => prev + 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    } else {
      setCurrentPage(0);
    }
    triggerAnimation('left');
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    } else {
      setCurrentPage(totalPages - 1);
    }
    triggerAnimation('right');
  };

  const handleRedirect = (nombre: string) => {
    const nombreRuta = encodeURIComponent(nombre.toUpperCase());
    router.push(`/data/matricula/unidad/${nombreRuta}`);
  };

  const getGridProps = (length: number) => {
    if (length === 1) return { md: 4 };
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
              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
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
        {currentCards.map((grupo) => {
          const { xs, sm, md } = getGridProps(currentCards.length);
          return (
            <Grid item key={grupo.idGrupo} xs={xs} sm={sm} md={md}>
              <Card
                elevation={3}
                onClick={() => handleRedirect(grupo.nombre)}
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 40px rgba(0, 0, 0, 0.15)',
                  },
                  backgroundColor: 'rgb(50, 22, 155)',
                  color: '#fff',
                  overflow: 'hidden',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 3,
                }}
              >
                <Typography
                  variant='h6'
                  sx={{
                    width: '100%',
                    height: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '500',
                    textAlign: 'center',
                    px: 2,
                  }}
                >
                  {grupo.nombre.toUpperCase()}
                </Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
