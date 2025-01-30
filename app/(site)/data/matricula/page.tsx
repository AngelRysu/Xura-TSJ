import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  AccountBalanceOutlined, Cast, JoinInner, RemoveCircle, Report,
  PauseCircle, CheckCircle, Woman, Man, FlagCircle, Groups,
} from '@mui/icons-material';
import { GraphBarAll, CardTemplateClient, LineChartPeriods } from '@/app/shared/common';
import { TableUnidades } from '@/app/components/dashboard';
import { madaniArabicBold } from '@/public/assets/fonts';

const fetchData = async (url: any) => {
  try {
    const response = await fetch(`${process.env.HOST}${url}`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Error fetching ${url}: ${response.statusText}`);
    }
    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error) {
    return [];
  }
};

const fetchString = async (url: any) => {
  try {
    const response = await fetch(`${process.env.HOST}${url}`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Error fetching ${url}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    return '';
  }
};

const periodoActivo = () => fetchString('/periodo');

const getPeriodos = () => fetchData('/matricula/periodo');

const matriculaTotal = () => fetchData('/matricula/total');

const generoTotal = () => fetchData('/estudiantes/genero');

const modalidadTotal = () => fetchData('/modalidades');

const estatusTotal = () => fetchData('/matricula/estatus');

const matriculaClase = (clase: string) => fetchData(`/matricula/clase/${clase}`);

// const procedenciaTotal = () => fetchData('/procedencias');

const getVariacion = () => fetchData('/matricula/variacion');

const capitalizeWords = (str: string) => str
  .toLowerCase()
  .replace(/\b\w/g, (char) => char.toUpperCase());

function getIconEstatus(estatus: string) {
  switch (estatus) {
    case 'Vigente':
      return <CheckCircle sx={{ color: '#308fff', fontSize: '2.5rem' }} />;
    case 'Cursos Especiales':
      return <FlagCircle sx={{ color: '#54c98f', fontSize: '2.5rem' }} />;
    case 'Baja Definitiva':
      return <RemoveCircle sx={{ color: '#ff4d63', fontSize: '2.5rem' }} />;
    case 'Baja Temporal':
      return <PauseCircle sx={{ color: '#ffae31', fontSize: '2.5rem' }} />;
    case 'Baja Especial':
      return <Report sx={{ color: '#d8d8d8', fontSize: '2.5rem' }} />;
    default:
      return null;
  }
}

function getIcon(modalidad: string) {
  switch (modalidad) {
    case 'A DISTANCIA':
      return <Cast sx={{ color: '#308fff', fontSize: '4rem' }} />;
    case 'ESCOLARIZADA':
      return <AccountBalanceOutlined sx={{ color: '#54c98f', fontSize: '4rem' }} />;
    case 'MIXTA':
      return <JoinInner sx={{ color: '#ff4d63', fontSize: '4rem' }} />;
    default:
      return null;
  }
}
interface GeneroData {
  genero: string;
  cantidad: number;
}
interface ModalidadData {
  modalidad: string;
  cantidad: number;
}
interface EstatusData {
  modalidad: string;
  cantidad: number;
  estatus: string,
}

interface EstatusIndicatorProps {
  estatusData: EstatusData[];
}
interface ModalidadIndicatorProps {
  modalidadData: ModalidadData[];
}
interface GeneroIndicatorProps {
  generoData: GeneroData[];
}
interface MatriculaIndicatorProps {
  estudiantes: string;
}

function MatriculaIndicator({ estudiantes }: MatriculaIndicatorProps) {
  return (
    <CardTemplateClient
      title='Matrícula'
      description={(
        <Box
          component='span'
          sx={{
            fontWeight: 'bold',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
          }}
        >
          <Groups sx={{ fontSize: '10rem', color: '#308fff' }} />
          <Typography
            variant='h4'
            sx={{ textAlign: 'center' }}
            className={madaniArabicBold.className}
          >
            {estudiantes || 0}
          </Typography>
        </Box>
      )}
    />
  );
}

function GeneroIndicator({ generoData, total }: GeneroIndicatorProps & { total: number }) {
  return (
    <CardTemplateClient
      title='Género'
      description={(
        <Box
          sx={{
            display: 'flex',
            gap: 0.5,
            width: '100%',
            justifyContent: 'center',
          }}
        >
          {generoData.map((genero) => (
            <Box
              component='span'
              key={genero.genero}
              sx={{
                fontWeight: 'bold',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              {genero.genero === 'F' ? (
                <Woman sx={{ fontSize: '8rem', color: '#ff4d63' }} />
              ) : (
                <Man sx={{ fontSize: '8rem', color: '#308fff' }} />
              )}
              <Typography variant='h4' component='div' className={madaniArabicBold.className}>
                {new Intl.NumberFormat('es-MX', { style: 'percent' }).format(
                  genero.cantidad / total,
                )}
              </Typography>
              <Typography variant='h5' component='span'>
                {new Intl.NumberFormat('es-MX').format(genero.cantidad)}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    />
  );
}

function ModalidadIndicator({ modalidadData, total }: ModalidadIndicatorProps & { total: number }) {
  return (
    <CardTemplateClient
      title='Modalidad'
      description={(
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            width: '100%',
          }}
        >
          {modalidadData.map((modalidad) => (
            <Box
              key={modalidad.modalidad}
              sx={{
                fontWeight: 'bold',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography component='div' sx={{ fontWeight: 'bold' }}>
                {capitalizeWords(modalidad.modalidad)}
              </Typography>
              <Typography variant='h4' component='div' sx={{ fontWeight: 'bold' }}>
                {new Intl.NumberFormat('es-MX', { style: 'percent' }).format(
                  modalidad.cantidad / total,
                )}
              </Typography>
              {getIcon(modalidad.modalidad)}
              <Typography component='span'>
                {new Intl.NumberFormat('es-MX').format(modalidad.cantidad)}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    />
  );
}

function EstatusIndicator({ estatusData, total }: EstatusIndicatorProps & { total: number }) {
  return (
    <CardTemplateClient
      title='Estatus'
      description={(
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            width: '100%',
          }}
        >
          {estatusData.map((estatus) => (
            <Box
              key={estatus.estatus}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                paddingY: 0.5,
              }}
            >
              <Typography component='span' sx={{ fontWeight: 'bold', flex: 2 }}>
                {capitalizeWords(estatus.estatus)}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2rem',
                }}
              >
                {getIconEstatus(estatus.estatus)}
              </Box>
              <Typography
                component='span'
                sx={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}
              >
                {new Intl.NumberFormat('es-MX').format(estatus.cantidad)}
              </Typography>
              <Typography
                component='span'
                sx={{
                  flex: 1,
                  textAlign: 'center',
                  color: '#32129a',
                  fontWeight: 'bold',
                }}
              >
                {new Intl.NumberFormat(
                  'es-MX',
                  { style: 'percent', maximumFractionDigits: 2 },
                ).format(estatus.cantidad / total)}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    />
  );
}

export default async function DashboardPage() {
  const totalData = await matriculaTotal();
  const total = totalData[0]?.estudiantes || 0;
  const numEstudiantes = new Intl.NumberFormat('es-MX').format(total);

  const generoDatos = await generoTotal();
  const modalidadData = await modalidadTotal();
  const estatusData = await estatusTotal();
  const periodo = await periodoActivo();
  const estPeriodos = await getPeriodos();
  // const procedencias = await procedenciaTotal();

  const periodos = {
    xAxis: [0, ...estPeriodos.map((item) => item.periodo)],
    yAxis: [null, ...estPeriodos.map((item) => item.estudiantes)],
    max: Math.max(...estPeriodos.map((item) => item.estudiantes)),
    min: Math.min(...estPeriodos.map((item) => item.estudiantes)),
  };

  const matriculaVariacion = await getVariacion();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        width: '100%',
        padding: 1,
      }}
    >
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        paddingLeft: { xs: 2, md: 10 },
        marginTop: 1,
        flexDirection: { xs: 'column', md: 'row' },
      }}
      >
        <Typography
          variant='h4'
          sx={{ whiteSpace: 'nowrap' }}
          className={madaniArabicBold.className}
        >
          {`Matrícula ${periodo}`}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)',
          },
          width: '100%',
        }}
      >
        <MatriculaIndicator estudiantes={numEstudiantes} />
        <GeneroIndicator generoData={generoDatos} total={total} />
        <ModalidadIndicator modalidadData={modalidadData} total={total} />
        <EstatusIndicator estatusData={estatusData} total={total} />
      </Box>
      <Box
        sx={{
          gridTemplateRows: 'auto',
          gap: 1,
          padding: { xs: 1, xl: 3 },
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              md: 'repeat(1, 1fr)',
              lg: 'repeat(2, 1fr)',
              xl: 'repeat(3, 1fr)',
            },
            gridTemplateRows: 'auto',
            gap: 1,
            width: '100%',
          }}
        >
          <GraphBarAll title='Clase D' chartData={await matriculaClase('D')} dataType='unidad' />
          <GraphBarAll title='Clase C' chartData={await matriculaClase('C')} dataType='unidad' />
          <GraphBarAll title='Clase B' chartData={await matriculaClase('B')} dataType='unidad' />
          <GraphBarAll title='Clase A' chartData={await matriculaClase('A')} dataType='unidad' />
          <GraphBarAll
            title='Nuevas Unidades Académicas'
            chartData={await matriculaClase('N')}
            dataType='unidad'
          />
          <GraphBarAll
            title='Extensiones'
            chartData={await matriculaClase('E')}
            dataType='unidad'
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
          gridTemplateRows: 'auto',
          gap: 2,
          width: '100%',
          padding: { xs: 1, xl: 3 },
        }}
      >
        <TableUnidades datos={matriculaVariacion} />
        <Box>
          <LineChartPeriods
            xAxisData={periodos.xAxis}
            yAxisData={periodos.yAxis}
            label='Estudiantes'
            color='#3f8ef8'
            yAxisRange={{ min: periodos.min - 2000, max: periodos.max }}
          />
          {/* <MapaJalisco topojson={topojal} entidad={14} data={procedencias} /> */}
        </Box>
      </Box>
    </Box>
  );
}
