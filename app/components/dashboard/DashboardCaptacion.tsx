'use client';

/* eslint-disable no-unused-vars */

import { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import {
  Woman, Man, Groups2, Cast, AccountBalanceOutlined, CheckCircle, FlagCircle, PauseCircle,
  AssignmentTurnedIn, Cancel,
  MonetizationOn,
  School
} from '@mui/icons-material';
import { GraphBarAll, LineChartPeriods, IndicatorCard } from '@/app/shared/common';
// import { MapaJalisco } from '@/app/shared/common';
// import topojal from '@/app/mocks/json/jal_topojson.json';
import { madaniArabicBold } from '@/public/assets/fonts';

interface DataState {
  total: number;
  generoData: Array<any>;
  modalidadData: Array<any>;
  estatusData: Array<any>;
  periodo: string;
  fechas: {
    xAxis: Array<any>;
    yAxis: Array<any>;
    min: number;
    max: number;
  };
  procedencias: Array<any>;
  captacionData: Array<any>;
  captacionExamen: Array<any>;
  ultimaFecha: string;
}

interface DashboardPageProps {
  data: DataState;
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
  estatus: string;
  cantidad: number;
}

interface IndicatorCardItem {
  label: string;
  value: string;
  icon: ReactNode;
}

const getIcon = (type: string, category: string) => {
  switch (category) {
    case 'genero':
      return type === 'M'
        ? <Woman sx={{ fontSize: '10rem', color: '#ff4d63' }} />
        : <Man sx={{ fontSize: '10rem', color: '#308fff' }} />;
    case 'modalidad':
      return type === 'NO ESCOLARIZADA'
        ? <Cast sx={{ color: '#308fff', fontSize: '6rem' }} />
        : <AccountBalanceOutlined sx={{ color: '#54c98f', fontSize: '6rem' }} />;
    case 'estatus':
      switch (type) {
        case 'REGISTRADO SIN VALIDAR':
          return <Cancel sx={{ color: '#ff4d63', fontSize: '1.5rem' }} />; // Representa un estado inicial, es adecuado.
        case 'REGISTRADO VALIDADO':
          return <CheckCircle sx={{ color: '#ffae31', fontSize: '1.5rem' }} />; // Validación completa: el check es muy claro.
        case 'EXAMEN PAGADO':
          return <MonetizationOn sx={{ color: '#54c98f', fontSize: '1.75rem' }} />; // Dinero pagado: el ícono de moneda es muy adecuado.
        case 'PRESENTO EXAMEN':
          return <AssignmentTurnedIn sx={{ color: '#54c98f', fontSize: '1.75rem' }} />; // "TurnedIn" representa una acción completada.
        case 'INSCRIPCION PAGADA':
          return <MonetizationOn sx={{ color: '#308fff', fontSize: '2rem' }} />; // Similar a "EXAMEN PAGADO", pero puedes cambiar el color para diferenciar.
        case 'INSCRITO':
          return <School sx={{ color: '#308fff', fontSize: '2rem' }} />; // Representa claramente que alguien ya está inscrito.
        default: return <></>;
      }
    default:
      return <></>;
  }
};

const capitalizeWords = (str: string) => str.toLowerCase()
  .replace(/\b\w/g, (char) => char.toUpperCase());

const mapDataToItems = (
  data: any[],
  category: string,
  total?: number,
): IndicatorCardItem[] => data.map((item) => ({
  label: capitalizeWords(item[category]),
  value: total ? new Intl.NumberFormat('es-MX').format(item.cantidad) : item.cantidad,
  icon: getIcon(item[category], category),
}));

function CaptacionTotalIndicator({ captacionTotal, estatusData }: { captacionTotal: number, estatusData: EstatusData[] }) {
  const registradosSinValidar = estatusData.find((data) => data.estatus === 'REGISTRADO SIN VALIDAR')?.cantidad || 0;
  const registradosValidados = estatusData.find((data) => data.estatus === 'REGISTRADO VALIDADO')?.cantidad || 0;
  const candidatosAvanzados = captacionTotal - registradosSinValidar - registradosValidados;
  const porcentajeAvanzados = (candidatosAvanzados / captacionTotal) || 0;
  return (
    <IndicatorCard
      title="Registros totales"
      description={new Intl.NumberFormat('es-MX').format(candidatosAvanzados) + ` - ${new Intl.NumberFormat('es-MX', { style: 'percent', maximumFractionDigits: 0 }).format(porcentajeAvanzados)} con exámen pagado`}
      value={new Intl.NumberFormat('es-MX').format(captacionTotal)}
      icon={<Groups2 sx={{ fontSize: '7rem', color: '#308fff' }} />}
      colors={{
        iconColor: `#308fff`,
      }}
    />
  );
}

function GeneroIndicator({ generoData, captacionTotal }:
  { generoData: GeneroData[]; captacionTotal: number }) {
  return (
    <IndicatorCard
      title='Genero'
      items={mapDataToItems(generoData, 'genero')}
      layout='horizontal'
    />
  );
}

function ModalidadIndicator({ modalidadData, captacionTotal }:
  { modalidadData: ModalidadData[]; captacionTotal: number }) {
  return (
    <IndicatorCard
      title='Modalidad'
      items={mapDataToItems(modalidadData, 'modalidad')}
      layout='horizontal'
    />
  );
}

function EstatusIndicator({ estatusData, captacionTotal }:
  { estatusData: EstatusData[]; captacionTotal: number }) {
  return (
    <IndicatorCard
      title="Estatus"
      value={captacionTotal}
      items={mapDataToItems(estatusData, 'estatus')}
    />
  );
}

export default function DashboardCaptacion({ data }: DashboardPageProps) {
  return (
    <Box sx={{
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
          variant='h1'
          sx={{ whiteSpace: 'nowrap', maxWidth: { xs: '100%', md: '60%' } }}
          className={madaniArabicBold.className}
        >
          Captación
          {' '}
          {data.periodo}
        </Typography>
        <Typography
          variant='h5'
          sx={{ whiteSpace: 'nowrap', maxWidth: { xs: '100%', md: '60%' } }}
        >
          Última actualización
          {' '}
          {data.ultimaFecha}
        </Typography>
      </Box>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        width: '100%',
      }}
      >
        <CaptacionTotalIndicator captacionTotal={data.total} estatusData={data.estatusData} />
        <GeneroIndicator generoData={data.generoData} captacionTotal={data.total} />
        <ModalidadIndicator modalidadData={data.modalidadData} captacionTotal={data.total} />
        <EstatusIndicator estatusData={data.estatusData} captacionTotal={data.total} />
      </Box>
      <Box sx={{ padding: { xs: 1, xl: 1 }, alignItems: 'center', width: '100%' }}>
        <Box sx={{
          display: 'grid',
          alignItems: 'center',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', lg: 'repeat(1, 1fr)' },
          width: '100%',
        }}
        >
          <GraphBarAll title='Unidades' chartData={data.captacionExamen} dataType='captacion' />
          <LineChartPeriods
            xAxisData={data.fechas.xAxis}
            yAxisData={data.fechas.yAxis}
            label='Aspirantes'
            color='#3f8ef8'
            yAxisRange={{ min: data.fechas.min - 10, max: data.fechas.max }}
          />
          {/* <MapaJalisco topojson={topojal} entidad={14} data={data.procedencias} /> */}
        </Box>
      </Box>
    </Box>
  );
}
