import React from 'react';
import { Box, Typography } from '@mui/material';
import CardTemplateClient from './CardTemplateClient';

interface IndicatorCardModalidadProps {
  title: string;
  items: Array<{ label: string; value: number; icon?: React.ReactNode }>;
  total: number;
}

export default function IndicatorCardModalidad({ title, items, total }:
    IndicatorCardModalidadProps) {
  const modalidadMap: Record<string, string> = {
    'A DISTANCIA': 'A distancia',
    ESCOLARIZADA: 'Escolarizada',
    MIXTA: 'Mixta',
  };

  const modalidadItems = items
    .filter(({ label }) => Object.keys(modalidadMap).includes(label.toUpperCase()))
    .map((item) => ({
      label: modalidadMap[item.label.toUpperCase()] || item.label,
      value: item.value,
      icon: item.icon,
    }));

  const renderRow = (item: typeof modalidadItems[0]) => (
    <Box
      key={item.label}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 0.5,
      }}
    >
      <Typography variant='body2' sx={{ fontWeight: 'bold', flex: 2 }}>
        {item.label}
      </Typography>
      <Box sx={{ width: '2rem', display: 'flex', justifyContent: 'center' }}>
        {item.icon}
      </Box>
      <Typography variant='body2' sx={{ flex: 1, textAlign: 'center' }}>
        {new Intl.NumberFormat('es-MX').format(item.value)}
      </Typography>
      <Typography variant='body2' sx={{ flex: 1, textAlign: 'center' }}>
        {new Intl.NumberFormat('es-MX', { style: 'percent', maximumFractionDigits: 0 })
          .format(item.value / total)}
      </Typography>
    </Box>
  );

  return (
    <CardTemplateClient
      title={title}
      description={(
        <Box sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
        >
          {modalidadItems.map(renderRow)}
        </Box>
      )}
      sx={{ width: '100%', p: 2 }}
    />
  );
}
