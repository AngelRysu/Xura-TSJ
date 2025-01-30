import React, { useMemo } from 'react';
import {
  Box, Typography, SxProps, Theme,
} from '@mui/material';
import Link from 'next/link';
import CardTemplateClient from './CardTemplateClient';

interface IndicatorCardEStatusProps {
    title: string;
    items?: Array<{ label: string; value: number | string; icon?: React.ReactNode }>;
    colors?: {
        iconColor?: string;
        valueColor?: string;
        hoverBackgroundColor?: string;
    };
    value: number;
    sx?: SxProps<Theme>;
    link?: string;
}

function IndicatorCardEstatus({
  title,
  items = [],
  colors = {},
  value = 1,
  sx = {},
  link,
}: IndicatorCardEStatusProps) {
  const correctedItems = useMemo(() => {
    const mapping: Record<string, string> = {
      'Inscripcion Pagada': 'Inscripción Pagada',
      'Presento Examen': 'Examen Aplicado',
      'Registrado Sin Validar': 'Registro No Validado',
      'Registrado Validado': 'Registro Validado',
    };
    return items.map((item) => ({
      ...item,
      label: mapping[item.label] || item.label,
    }));
  }, [items]);

  const groups = useMemo(
    () => ({
      grupo1: correctedItems.filter(
        ({ label }) => ['Inscrito', 'Inscripción Pagada'].includes(label),
      ),
      grupo2: correctedItems.filter(
        ({ label }) => ['Examen Aplicado', 'Examen Pagado'].includes(label),
      ),
      grupo3: correctedItems.filter(
        ({ label }) => ['Registro Validado', 'Registro No Validado'].includes(label),
      ),
    }),
    [correctedItems],
  );

  function renderGroup(groupTitle: string, group: {
    label: string; value: number | string; icon?: React.ReactNode }[]) {
    return (
      <>
        <Typography variant='h4' sx={{ textAlign: 'left', mt: 2 }}>
          {groupTitle}
        </Typography>
        {group.map((item) => (
          <Box
            key={item.label}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              py: 0.5,
            }}
          >
            <Typography variant='body1' sx={{ fontWeight: 'bold', flex: 2 }}>
              {item.label}
            </Typography>
            <Box sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2rem',
            }}
            >
              {item.icon}
            </Box>
            <Typography variant='h4' sx={{ flex: 1, textAlign: 'center' }}>
              {typeof item.value === 'number'
                ? new Intl.NumberFormat('es-MX').format(item.value)
                : new Intl.NumberFormat('es-MX').format(Number(item.value))}
            </Typography>
            {typeof value === 'number' && (
              <Typography
                variant='h4'
                sx={{ flex: 1, textAlign: 'center' }}
              >
                {
                  new Intl.NumberFormat('es-MX', { style: 'percent', maximumFractionDigits: 0 })
                    .format(
                      typeof item.value === 'number'
                        ? item.value / value
                        : Number(item.value) / value,
                    )
                }
              </Typography>
            )}
          </Box>
        ))}
      </>
    );
  }

  const cardContent = (
    <CardTemplateClient
      title={title}
      description={(
        <Box sx={{
          display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%',
        }}
        >
          {renderGroup('Inscripción', groups.grupo1)}
          {renderGroup('Examen', groups.grupo2)}
          {renderGroup('Registros', groups.grupo3)}
        </Box>
      )}
      sx={{
        width: '100%',
        p: 2,
        '&:hover': {
          backgroundColor: colors.hoverBackgroundColor || 'background.paper',
        },
        ...sx,
      }}
    />
  );

  return link ? <Link href={link}>{cardContent}</Link> : cardContent;
}

export default IndicatorCardEstatus;
