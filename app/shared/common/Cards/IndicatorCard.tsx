import React from 'react';
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
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
  layout?: 'vertical' | 'horizontal';
  sx?: object;
  link?: string;
  total?: number;
}

function IndicatorCard({
  title,
  icon,
  value,
  description,
  items = [],
  colors = {},
  layout = 'vertical',
  sx = {},
  link,
  total,
}: IndicatorCardProps) {
  const isGenero = title.toLowerCase() === 'genero' || title.toLowerCase() === 'género';
  const isModalidad = title.toLowerCase() === 'modalidad';
  const isVertical = layout === 'vertical';
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // eslint-disable-next-line no-nested-ternary
  const columns = isGenero
    ? 'repeat(4, 1fr)'
    // eslint-disable-next-line no-nested-ternary
    : isModalidad
      ? isSmallScreen
        ? `repeat(${items.length * 2}, 1fr)`
        : 'repeat(2, 1fr)'
      : 'repeat(2, 1fr)';

  const cardContent = (
    <CardTemplateClient
      title={title}
      description={(
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            flex: 1,
            ...(isGenero && { mt: 4 }),
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: isVertical ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            {icon && !isGenero && (
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
              {value !== undefined && (
                <Typography
                  color={colors.valueColor || 'text.primary'}
                  component='div'
                  variant='h4'
                  sx={{ textAlign: 'center' }}
                >
                  {typeof value === 'number'
                    ? new Intl.NumberFormat('es-MX').format(value)
                    : value}
                </Typography>
              )}

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

              {items.length > 0 && (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: columns,
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                  }}
                >
                  {items.map((item) => (
                    <React.Fragment key={item.label}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        {React.isValidElement(item.icon) && isGenero
                          ? React.cloneElement(item.icon as React.ReactElement, {
                            sx: {
                              ...(item.icon.props?.sx || {}),
                              fontSize: '2.5rem',
                            },
                          })
                          : item.icon}
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant='body1'
                          sx={{
                            color: colors.valueColor || 'text.primary',
                            fontWeight: 'bold',
                            fontSize: isGenero ? '1.5rem' : '1.2rem',
                          }}
                        >
                          {new Intl.NumberFormat('es-MX').format(Number(item.value))}
                        </Typography>
                        {total && (
                          <Typography
                            variant='body2'
                            sx={{
                              color: colors.valueColor || 'text.primary',
                              fontWeight: 'bold',
                              fontSize: isGenero ? '1.2rem' : '0.875rem',
                            }}
                          >
                            {new Intl.NumberFormat('es-MX', { style: 'percent' })
                              .format(Number(item.value) / total)}
                          </Typography>
                        )}
                      </Box>
                    </React.Fragment>

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
