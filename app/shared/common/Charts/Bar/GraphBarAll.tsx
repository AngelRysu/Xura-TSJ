'use client';

import { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { useRouter } from 'next/navigation';
import { unidadesAcademicas } from '@/app/mocks/unidadesAcademicas';

interface GraphBarAllProps {
  title: string;
  description?: string;
  image?: string;
  chartData: {
    clave: string;
    nombre: string;
    cantidad?: number;
    aspirantes?: number;
    examenPagado?: number;
  }[];
  // eslint-disable-next-line no-unused-vars
  onBarClick?: (clave: string) => void;
  dataType: 'unidad' | 'captacion';
}

export default function GraphBarAll({
  title,
  description,
  image,
  chartData,
  onBarClick,
  dataType,
}: GraphBarAllProps) {
  const [chartDimensions, setChartDimensions] = useState({
    width: 300,
    height: 500,
  });
  const router = useRouter();

  const claves = chartData.map((item, index) => `${item.clave}-${index}`);
  const names = chartData.map((item) => item.nombre);

  const getColorByClave = (clave: string) => {
    const originalClave = clave.split('-')[0];
    const unidad = unidadesAcademicas.find((u) => u.clave === originalClave);
    return unidad ? unidad.color : '#000000';
  };
  const colors = claves.map((clave) => getColorByClave(clave));

  const handleBarClick = (clave: string) => {
    if (onBarClick) {
      onBarClick(clave);
    } else if (dataType === 'unidad') {
      router.push(`matricula/unidad/${clave}`);
    } else {
      router.push(`captacion/detalle/${clave}`);
    }
  };

  const getUnidad = (nombre: string) => {
    const unidad = unidadesAcademicas.find((u) => u.nombre === nombre);
    return unidad?.label || nombre;
  };

  const abbreviateName = (name: string) => {
    const nombre = getUnidad(name);
    return nombre.length > 12 ? `${nombre.slice(0, 11)}...` : nombre;
  };

  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(window.innerWidth * 0.9, 430);
      const height = Math.min(window.innerHeight * 0.5, 800);
      setChartDimensions({ width, height });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const MIN_HEIGHT = 4;

  const series = dataType === 'unidad'
    ? [
      {
        data: chartData.map((item) => Math.max(item.cantidad || 0, MIN_HEIGHT)),
        colorMap: claves.reduce((acc, clave, index) => {
          const newMap = { ...acc };
          newMap[clave] = colors[index];
          return newMap;
        }, {} as Record<string, string>),
        label: 'Cantidad',
      },
    ]
    : [
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

  return (
    <Box sx={{ width: '100%', padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 2, height: '100%', minHeight: chartDimensions.height }}>
        {image && (
          <Box
            component='img'
            sx={{
              height: 300,
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
        <Box sx={{ position: 'relative', height: chartDimensions.height }}>
          <BarChart
            barLabel={(item) => {
              const valor = (item.value || 0);
              return valor.toString();
            }}
            xAxis={[
              {
                scaleType: 'band',
                data: claves,
                valueFormatter: (clave) => abbreviateName(names[claves.indexOf(clave)]),
              },
            ]}
            yAxis={[
              {
                max: Math.max(
                  ...chartData.map((item) => (dataType === 'unidad'
                    ? item.cantidad || 0
                    : Math.max(item.aspirantes || 0, item.examenPagado || 0))),
                ),
              },
            ]}
            series={series}
            onItemClick={(event, { dataIndex }) => {
              const clave = claves[dataIndex].split('-')[0];
              handleBarClick(clave);
            }}
            height={chartDimensions.height}
            sx={{
              [`.MuiBarLabel-root`]: {
                fontSize: '16px',
                fill: '#000',
                fontWeight: 'bold',
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
