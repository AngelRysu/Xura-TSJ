'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Groups2 } from '@mui/icons-material';
import {
  GraphBarAll, LineChartPeriods, IndicatorCard, IndicatorCardEstatus,
} from '@/app/shared/common';
// import { MapaJalisco } from '@/src/app/shared/common';
// import topojal from '../../../jal_topojson.json';
import { capitalizeWords, getIcon } from '@/app/shared/common/Util/iconsFormat';
import { madaniArabicBold } from '@/public/assets/fonts';

interface Examen {
  nombre: string;
  clave: string;
  aspirantes: number;
  examenPagado: number;
}

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
  captacionClase: {};
  examenClase: Record<string, Examen[]>;
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
  icon: React.JSX.Element | null;
}

const mapDataToItems = (data: any[], category: string, total?: number): IndicatorCardItem[] => data
  .map((item) => ({
    label: capitalizeWords(item[category]),
    value: total ? new Intl.NumberFormat('es-MX').format(item.cantidad) : item.cantidad,
    icon: getIcon(item[category], category),
  }));

function CaptacionTotalIndicator({ captacionTotal, estatusData } : {
  captacionTotal: number, estatusData: EstatusData[] }) {
  const registradosSinValidar = estatusData
    .find((data) => data.estatus === 'REGISTRADO SIN VALIDAR')?.cantidad || 0;
  const registradosValidados = estatusData
    .find((data) => data.estatus === 'REGISTRADO VALIDADO')?.cantidad || 0;
  const candidatosAvanzados = captacionTotal - registradosSinValidar - registradosValidados;
  const porcentajeAvanzados = (candidatosAvanzados / captacionTotal) || 0;
  return (
    <IndicatorCard
      title='Registros totales'
      description={`Con exámen pagado ${new Intl.NumberFormat('es-MX')
        .format(candidatosAvanzados)} - ${new Intl.NumberFormat(
        'es-MX',
        { style: 'percent', maximumFractionDigits: 0 },
      ).format(porcentajeAvanzados)}`}
      value={new Intl.NumberFormat('es-MX').format(captacionTotal)}
      icon={<Groups2 sx={{ fontSize: '4rem', color: '#308fff' }} />}
      colors={{
        iconColor: `#308fff`,
      }}
    />
  );
}

function GeneroIndicator({ generoData, captacionTotal } : {
  generoData: GeneroData[], captacionTotal: number }) {
  return (
    <IndicatorCard
      title='Genero'
      items={mapDataToItems(generoData, 'genero')}
      layout='horizontal'
      total={captacionTotal}
    />
  );
}

function ModalidadIndicator({ modalidadData, captacionTotal }:{
  modalidadData: ModalidadData[], captacionTotal: number }) {
  return (
    <IndicatorCard
      title='Modalidad'
      items={mapDataToItems(modalidadData, 'modalidad')}
      layout='horizontal'
      total={captacionTotal}
    />
  );
}

function EstatusIndicator({ estatusData, captacionTotal }:{
  estatusData: EstatusData[], captacionTotal: number }) {
  return (
    <IndicatorCardEstatus
      title='Estatus'
      value={captacionTotal}
      items={mapDataToItems(estatusData, 'estatus')}
    />
  );
}

type ChartDataItem = {
  clave: string;
  nombre: string;
  programa?: string;
  estudiantes?: number;
  cantidad?: number;
  aspirantes?: number;
  examenPagado?: number;
};

function transformData(data1: [string, ChartDataItem[]][]): ChartDataItem[] {
  return data1.flatMap(([, unidades]) => unidades.map((unidad) => ({
    clave: unidad.clave,
    nombre: unidad.nombre,
    aspirantes: unidad.aspirantes,
    examenPagado: unidad.examenPagado,
  })));
}

function DashboardCaptacion({ data }: DashboardPageProps) {
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
          variant='h4'
          sx={{ whiteSpace: 'nowrap' }}
          className={madaniArabicBold.className}
        >
          {`Captación ${data.periodo}`}
        </Typography>
        <Typography
          variant='h5'
          sx={{ whiteSpace: 'nowrap', maxWidth: { xs: '100%', md: '60%' } }}
        >
          {`Última actualización ${data.ultimaFecha}`}
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
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' },
          width: '100%',
        }}
        >
          <GraphBarAll
            title='Captación General'
            chartData={transformData(Object.entries(data.examenClase))}
            dataType='captacion'
          />
        </Box>
        <Box
          sx={{
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
            width: '100%',
            gap: 2,
          }}
        >
          {Object.entries(data.examenClase).map(([clase, valores]) => (valores.length > 0 ? (
            <GraphBarAll
              key={clase}
              title={`Clase ${clase}`}
              chartData={valores}
              dataType='captacion'
            />
          ) : null))}

          <Box sx={{ gridColumn: '1 / -1', width: '100%' }}>
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
    </Box>
  );
}

export default DashboardCaptacion;
