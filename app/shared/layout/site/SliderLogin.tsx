'use client';

import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';

interface SliderLoginProps {
  active: 'ingresa' | 'registrate';
  // eslint-disable-next-line no-unused-vars
  onChange: (value: 'ingresa' | 'registrate') => void;
}

export default function SliderLogin({ active, onChange }: SliderLoginProps) {
  const [currentActive, setCurrentActive] = useState<'ingresa' | 'registrate'>(active);

  useEffect(() => {
    setCurrentActive(active);
  }, [active]);

  const handleToggle = (value: 'ingresa' | 'registrate') => {
    setCurrentActive(value);
    onChange(value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#32169b',
        borderRadius: '15px',
        overflow: 'hidden',
        width: '100%',
        height: '32px',
        padding: '3px',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: currentActive === 'ingresa' ? '3px' : 'calc(50% + 3px)',
          transform: 'translateY(-50%)',
          width: 'calc(50% - 6px)',
          height: '80%',
          backgroundColor: 'white',
          borderRadius: '12px',
          transition: 'left 0.3s ease',
        }}
      />
      <Button
        onClick={() => handleToggle('ingresa')}
        sx={{
          position: 'relative',
          zIndex: 1,
          backgroundColor: 'transparent',
          color: currentActive === 'ingresa' ? 'black' : 'white',
          width: '50%',
          height: '100%',
          fontSize: '13px',
          textTransform: 'capitalize',
          borderRadius: '10px',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}
      >
        Ingresa
      </Button>
      <Button
        onClick={() => handleToggle('registrate')}
        sx={{
          position: 'relative',
          zIndex: 1,
          backgroundColor: 'transparent',
          color: currentActive === 'registrate' ? 'black' : 'white',
          width: '50%',
          height: '100%',
          fontSize: '13px',
          textTransform: 'capitalize',
          borderRadius: '10px',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}
      >
        Regístrate
      </Button>
    </Box>
  );
}
