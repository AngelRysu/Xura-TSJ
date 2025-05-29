import React, { useMemo } from 'react';
import {
  Box, Typography, SxProps, Theme,
} from '@mui/material';
import Link from 'next/link';
import {
  AssignmentTurnedIn,
  Payment,
  School,
  Cancel,
  HelpOutline,
} from '@mui/icons-material';
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
  type?: string;
}

function IndicatorCardEstatus({
  title,
  items = [],
  colors = {},
  value = 1,
  sx = {},
  link,
  type = '',
}: IndicatorCardEStatusProps) {
  const correctedItems = useMemo(() => {
    const mapping: Record<string, string> = {
      'Inscripcion Pagada': 'Inscripción Pagada',
      'Presento Examen': 'Examen Aplicado',
      'Registrado Sin Validar': 'Registro No Validado',
      'Registrado Validado': 'Registro Validado',
    };

    const iconMap: Record<string, React.ReactNode> = {
      Inscrito: <AssignmentTurnedIn sx={{ color: '#4caf50' }} />,
      'Inscripción Pagada': <Payment sx={{ color: '#03a9f4' }} />,
      'Examen Aplicado': <School sx={{ color: '#08d7ff' }} />,
      'Examen Pagado': <Payment sx={{ color: '#4caf50' }} />,
      'Registro Validado': <AssignmentTurnedIn sx={{ color: '#03a9f4' }} />,
      'Registro No Validado': <HelpOutline sx={{ color: '#ff9800' }} />,
      Vigente: <AssignmentTurnedIn sx={{ color: '#4caf50' }} />,
      'Cursos Especiales': <School sx={{ color: '#3f51b5' }} />,
      'Baja Definitiva': <Cancel sx={{ color: '#f44336' }} />,
      'Baja Temporal': <Cancel sx={{ color: '#ff5722' }} />,
    };

    return items.map((item) => {
      const correctedLabel = mapping[item.label] || item.label;
      return {
        ...item,
        label: correctedLabel,
        icon: item.icon || iconMap[correctedLabel],
      };
    });
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
      grupo4: correctedItems.filter(
        ({ label }) => ['Vigente', 'Cursos Especiales', 'Baja Definitiva', 'Baja Temporal']
          .includes(label),
      ),
    }),
    [correctedItems],
  );

  function renderGroup(group: {
    label: string; value: number | string; icon?: React.ReactNode
  }[]) {
    if (group.length === 0) return null;

    return (
      <>
        {group.map((item) => (
          <Box
            key={item.label}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              py: 0.2,
            }}
          >
            <Typography variant='body2' sx={{ fontWeight: 'bold', flex: 3 }}>
              {item.label}
            </Typography>
            <Box sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', width: '4rem',
            }}
            >
              {item.icon}
            </Box>
            <Typography variant='body2' sx={{ flex: 1, textAlign: 'center' }}>
              {typeof item.value === 'number'
                ? new Intl.NumberFormat('es-MX').format(item.value)
                : new Intl.NumberFormat('es-MX').format(Number(item.value))}
            </Typography>
            {typeof value === 'number' && (
              <Typography
                variant='body2'
                sx={{ flex: 2, textAlign: 'center' }}
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
          {type !== '' ? (
            renderGroup(groups.grupo4)
          ) : (
            <>
              {groups.grupo1.length > 0 && renderGroup(groups.grupo1)}
              {groups.grupo2.length > 0 && renderGroup(groups.grupo2)}
              {groups.grupo3.length > 0 && renderGroup(groups.grupo3)}
            </>
          )}
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
