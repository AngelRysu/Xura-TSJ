'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Groups2 } from '@mui/icons-material';
import {
  GraphBarAll,
  LineChartPeriods,
  IndicatorCard,
  IndicatorCardEstatus,
  IndicatorCardModalidad,
} from '@/app/shared/common';
import { TableUnidades } from '@/app/components/dashboard';
import { madaniArabicBold } from '@/public/assets/fonts';
import { fetchData, fetchString } from '@/app/services/api';
import { capitalizeWords, getIcon } from '@/app/shared/common/Util/iconsFormat';

// const procedenciaTotal = () => fetchData(`/procedencias`);

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

function MatriculaIndicator({ estudiantes }:{ estudiantes: string }) {
  return (
    <IndicatorCard
      title='Matrícula'
      value={estudiantes}
      icon={<Groups2 sx={{ fontSize: '4rem', color: '#308fff' }} />}
    />
  );
}

function GeneroIndicator({ generoData, total } : { generoData: GeneroData[], total: number }) {
  return (
    <IndicatorCard
      title='Género'
      items={mapDataToItems(generoData, 'genero')}
      layout='horizontal'
      total={total}
    />
  );
}

function ModalidadIndicator({ modalidadData, total }: {
  modalidadData: ModalidadData[], total: number }) {
  const items = modalidadData.map((item) => ({
    label: item.modalidad,
    value: item.cantidad,
    icon: getIcon(item.modalidad, 'modalidad'),
  }));

  return (
    <IndicatorCardModalidad
      title='Modalidad'
      items={items}
      total={total}
    />
  );
}

function EstatusIndicator({ estatusData, total }: { estatusData: EstatusData[], total: number }) {
  return (
    <IndicatorCardEstatus
      title='Estatus'
      type='Matricula'
      value={total}
      items={mapDataToItems(estatusData, 'estatus')}
    />
  );
}

export default function DashboardPage() {
  const params = useParams();
  const id = params?.unidadId as string;
  const nombreUnidad = Array.isArray(id) ? id[0] : id;
  const nombreUnidad1 = decodeURIComponent(nombreUnidad);
  const formattedName = capitalizeWords(nombreUnidad1);

  const [periodo, setPeriodo] = useState('');
  const [estPeriodos, setEstPeriodos] = useState<any[]>([]);
  const [matriculaData, setMatriculaData] = useState<any[]>([]);
  const [generoDatos, setGeneroData] = useState<any[]>([]);
  const [modalidadData, setModalidadData] = useState<any[]>([]);
  const [estatusData, setEstatusData] = useState<any[]>([]);
  const [matricula, setMatriculaClaseData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDataFromAPI() {
      try {
        const periodoActivo = await fetchString('/periodo');
        const periodos = await fetchData(`/matricula/periodo?unidad=${nombreUnidad}`);
        const matriculaPre = await fetchData(`/matricula/total?unidad=${nombreUnidad}`);
        const genero = await fetchData(`/estudiantes/genero?unidad=${nombreUnidad}`);
        const modalidad = await fetchData(`/modalidades?unidad=${nombreUnidad}`);
        const estatus = await fetchData(`/matricula/estatus?unidad=${nombreUnidad}`);
        const matriculaClase = await fetchData(`/carreras/${nombreUnidad}`);

        setPeriodo(periodoActivo);
        setEstPeriodos(periodos);
        setMatriculaData(matriculaPre);
        setGeneroData(genero);
        setModalidadData(modalidad);
        setEstatusData(estatus);
        setMatriculaClaseData(matriculaClase);
      } catch (error) {
        console.error('Error al obtener datos:', error); // eslint-disable-line no-console
      }
    }
    if (nombreUnidad) {
      fetchDataFromAPI();
    }
  }, [nombreUnidad]);

  const totalData = matriculaData;
  const total = totalData[0]?.estudiantes || 0;
  const numEstudiantes = new Intl.NumberFormat('es-MX').format(total);

  const periodos = {
    xAxis: [0, ...estPeriodos.map((item) => item.periodo)],
    yAxis: [null, ...estPeriodos.map((item) => item.estudiantes)],
    max: Math.max(...estPeriodos.map((item) => item.estudiantes)),
    min: Math.min(...estPeriodos.map((item) => item.estudiantes)),
  };

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
          {`Matrícula ${periodo} ${formattedName}`}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)', xl: 'repeat(4, 1fr)',
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
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateRows: 'auto',
            gap: 1,
            width: '100%',
          }}
        >
          <GraphBarAll title='' chartData={matricula} dataType='carrera' unidad={nombreUnidad} />
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
        <TableUnidades datos={matricula} />
        <Box>
          <LineChartPeriods
            xAxisData={periodos.xAxis}
            yAxisData={periodos.yAxis}
            label='Estudiantes'
            color='#3f8ef8'
            yAxisRange={{ min: periodos.min - (periodos.max / 10), max: periodos.max }}
          />
          {/* <MapaJalisco topojson={topojal} entidad={14} data={procedencias} /> */}
        </Box>
      </Box>
    </Box>
  );
}
