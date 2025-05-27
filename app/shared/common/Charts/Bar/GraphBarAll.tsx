'use client';

import { useEffect, useState, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { useRouter } from 'next/navigation';
import { unidadesAcademicas, carreras } from '@/app/mocks/unidadesAcademicas';

interface GraphBarAllProps {
  title: string;
  description?: string;
  image?: string;
  chartData: {
    clave: string;
    nombre: string;
    programa?: string;
    estudiantes?: number;
    cantidad?: number;
    aspirantes?: number;
    examenPagado?: number;
  }[];
  // eslint-disable-next-line no-unused-vars
  onBarClick?: (clave: string) => void;
  dataType: 'unidad' | 'captacion' | 'carrera';
  unidad?: string;
}

export default function GraphBarAll({
  title,
  description,
  image,
  chartData,
  onBarClick,
  dataType,
  unidad,
}: GraphBarAllProps) {
  const [chartDimensions, setChartDimensions] = useState({
    width: 200,
    height: 250,
  });
  const router = useRouter();

  const chartRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!chartRef.current) return undefined;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]; // Obtiene el primer elemento observado
      if (entry) {
        const { width, height } = entry.contentRect;
        setChartSize({ width, height });
      }
    });

    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const claves = chartData.map((item, index) => `${item.clave}-${index}`);
  const names = (dataType === 'carrera')
    ? chartData.map((item) => item.programa ?? '')
    : chartData.map((item) => item.nombre ?? '');

  const getColorByClave = (clave: string, index: number) => {
    if (dataType === 'unidad') {
      const unidadC = unidadesAcademicas.find((u) => u.nombre === clave);
      return unidadC ? unidadC.color : '#000000';
    }
    if (dataType === 'carrera') {
      const color = index < 5 ? carreras[index].color : carreras[index - 5].color;
      return color;
    }
    return '#000000';
  };

  const colors = names.map((name, index) => getColorByClave(name, index));

  const handleBarClick = (clave: string) => {
    if (onBarClick) {
      onBarClick(clave);
    } else if (dataType === 'unidad') {
      router.push(`matricula/unidad/${clave}`);
    } else if (dataType === 'carrera') {
      router.push(`/matricula/unidad/${unidad}/carrera/${clave}`);
    } /* else {
      router.push(`captacion/detalle/${clave}`);
    } */
  };

  const getUnidad = (nombre: string) => {
    const unidadL = unidadesAcademicas.find((u) => u.nombre === nombre);
    return unidadL?.label || nombre;
  };

  const abbreviateName = (name: string, barras: number) => {
    const pxPorCaracter = 9;
    const minCaracteres = 3;
    const maxCaracteres = 15;
    const anchoPorBarra = (chartSize.width - 130) / barras;
    let caracteresPermitidos = Math.floor(anchoPorBarra / pxPorCaracter);
    caracteresPermitidos = Math.max(minCaracteres, Math.min(caracteresPermitidos, maxCaracteres));
    const nombre = getUnidad(name);
    if (dataType === 'carrera') {
      const obj = chartData.find(({ programa }) => programa === nombre);
      return obj ? obj.clave : nombre;
    }
    return nombre.length > caracteresPermitidos
      ? `${nombre.slice(0, caracteresPermitidos - 1)}...`
      : nombre;
  };

  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(window.innerWidth * 0.9, 430);
      const height = Math.min(window.innerHeight * 0.33, 864 / 3);
      setChartDimensions({ width, height });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const MIN_HEIGHT = 0;
  let series;
  switch (dataType) {
    case 'unidad':
      series = [
        {
          data: chartData.map((item) => Math.max(item.cantidad || 0, MIN_HEIGHT)),
        },
      ];
      break;
    case 'carrera':
      series = [
        {
          data: chartData.map((item) => Math.max(item.estudiantes || 0, MIN_HEIGHT)),
        },
      ];
      break;
    case 'captacion':
      series = [
        {
          data: chartData.map((item) => (item.aspirantes || 0) + MIN_HEIGHT),
          color: '#308fff',
          label: 'Aspirantes',
        },
        {
          data: chartData.map((item) => (item.examenPagado || 0) + MIN_HEIGHT),
          color: '#54c98f',
          label: 'Examen Pagado',
        },
      ];
      break;
    default:
      series = [{ data: [] }];
  }

  return (
    <Box sx={{
      width: '100%', padding: 2, height: chartDimensions.height, marginTop: 1,
    }}
    >
      <Paper elevation={3} sx={{ padding: 2, height: '100%', minHeight: chartDimensions.height }}>
        {image && (
          <Box
            component='img'
            sx={{
              height: chartDimensions.height,
              width: '100%',
              objectFit: 'cover',
              mb: 2,
            }}
            alt={title}
            src={image}
          />
        )}
        <Typography gutterBottom variant='h5' component='div'>
          {title}
        </Typography>
        {description && (
          <Typography variant='body2'>
            {description}
          </Typography>
        )}
        <Box ref={chartRef} sx={{ position: 'relative', height: chartDimensions.height }}>
          <BarChart
            barLabel={(item) => {
              const valor = (item.value || 0);
              return new Intl.NumberFormat('es-MX').format(valor);
            }}
            xAxis={[
              {
                scaleType: 'band',
                data: claves,
                ...(dataType !== 'captacion' && {
                  colorMap: { type: 'ordinal', values: claves, colors },
                }),
                valueFormatter: (clave) => abbreviateName(
                  names[claves.indexOf(clave)],
                  claves.length,
                ),
              },
            ]}
            yAxis={[
              {
                max: Math.max(
                  ...chartData.map((item) => {
                    if (dataType === 'unidad') {
                      return item.cantidad || 0;
                    } if (dataType === 'carrera') {
                      return item.estudiantes || 0;
                    } return Math.max(item.aspirantes || 0, item.examenPagado || 0);
                  }),
                ),
              },
            ]}
            series={series}
            onItemClick={(event, { dataIndex }) => {
              handleBarClick(names[dataIndex]);
            }}
            height={chartDimensions.height - chartDimensions.height * 0.1}
            sx={{
              [`.MuiBarLabel-root`]: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
