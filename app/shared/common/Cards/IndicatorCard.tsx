import React from 'react';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import CardTemplateClient from './CardTemplateClient';

interface IndicatorCardProps {
  title: string;
  icon?: React.ReactNode;
  value?: number | string;
  description?: string;
  items?: Array<{ label: string; value: number | string; icon?: React.ReactNode }>;
  colors?: {
    iconColor?: string;
    valueColor?: string;
    hoverBackgroundColor?: string;
  };
  layout?: 'vertical' | 'horizontal'; // Define la orientación
  sx?: object; // Estilos adicionales para personalizar
  link?: string; // Enlace para la tarjeta
  total?: number;
}

function IndicatorCard({
  title,
  icon,
  value,
  description,
  items,
  colors = {},
  layout = 'vertical',
  sx = {},
  link,
  total,
}: IndicatorCardProps) {
  const isVertical = layout === 'vertical';
  const cardContent = (
    <CardTemplateClient
      title={title}
      description={(
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: isVertical ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            {icon && (
              <Box
                sx={{
                  color: colors.iconColor || '#308fff',
                  ...(isVertical ? {} : { marginRight: 2 }),
                }}
              >
                {icon}
              </Box>
            )}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isVertical ? 'center' : 'flex-start',
              }}
            >
              <Typography
                color={colors.valueColor || 'text.primary'}
                component='div'
                variant='h1'
                sx={{ textAlign: 'center' }}
              >
                {typeof value === 'number'
                  ? new Intl.NumberFormat('es-MX').format(value)
                  : value}
              </Typography>
              {description && (
                <Typography
                  sx={{
                    textAlign: isVertical ? 'center' : 'left',
                    mt: 1,
                  }}
                >
                  {description}
                </Typography>
              )}
              {items && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: isVertical ? 'column' : 'row',
                    gap: 1,
                  }}
                >
                  {items.map((item) => (
                    <Box
                      component='span'
                      key={item.label}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      {item.icon && (
                        <Box
                          sx={{
                            color: colors.iconColor || '#308fff',
                          }}
                        >
                          {item.icon}
                        </Box>
                      )}
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          textAlign: 'center',
                          fontSize: '0.8rem',
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant='body1'
                        sx={{
                          color: colors.valueColor || 'text.primary',
                        }}
                      >
                        {
                          new Intl.NumberFormat('es-MX').format(Number(item.value))
                        }
                      </Typography>
                      {total && (
                        <Typography
                          variant='body2'
                          sx={{
                            color: colors.valueColor || 'text.primary',
                            fontWeight: 'bold',
                          }}
                        >
                          {new Intl.NumberFormat('es-MX', { style: 'percent' }).format(
                            Number(item.value) / total,
                          )}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}
      sx={{
        width: '100%',
        padding: 2,
        '&:hover': {
          backgroundColor: colors.hoverBackgroundColor || 'background.paper',
        },
        ...sx,
      }}
    />
  );

  return link ? (
    <Link href={link} passHref>
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
}

export default IndicatorCard;
