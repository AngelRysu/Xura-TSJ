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
import Image from 'next/image';
import { usePermissions } from '@/app/context/PermissionsContext';
import { useState } from 'react';

export default function PanelCard() {
  const { permissions } = usePermissions();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [key, setKey] = useState(0);
  const cardsPerPage = 6;

  const accessibleCards = permissions.map((permission) => ({
    id: permission.idAplicacion.toString(),
    img: permission.aplicacionImagen,
    title: permission.aplicacionClave.toUpperCase(),
    link: permission.link,
  }));

  const totalPages = Math.ceil(accessibleCards.length / cardsPerPage);

  const handleNavigation = (link: string) => {
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

  const currentCards = accessibleCards.slice(
    currentPage * cardsPerPage,
    (currentPage + 1) * cardsPerPage,
  );

  const getGridProps = (length: number, index: number) => {
    if (length === 1) return { md: 4 };
    if (length === 2 || length === 3) return { xs: 12, sm: 6 };
    if (length === 4) return { xs: 12, sm: 6, md: 6 };
    if (length === 5) return index < 3 ? { xs: 12, sm: 6, md: 4 } : { xs: 12, sm: 6 };
    if (length === 6) return { xs: 12, sm: 6, md: 4 };
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
        {currentCards.map((card, index) => {
          const { xs, sm, md } = getGridProps(currentCards.length, index);
          return (
            <Grid item key={card.id} xs={xs} sm={sm} md={md}>
              <Card
                elevation={3}
                onClick={() => handleNavigation(card.link)}
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
                {card.img !== 'https://developer.tecmm.mx/img/null' ? (
                  <Image
                    src={card.img}
                    alt={card.title}
                    width={300}
                    height={200}
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                ) : (
                  <Typography
                    variant='h6'
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      fontWeight: '500',
                      textAlign: 'center',
                    }}
                  >
                    {card.title}
                  </Typography>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
