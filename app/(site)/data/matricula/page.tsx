'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { Groups2 } from '@mui/icons-material';
import {
  GraphBarAll,
  IndicatorCard,
  LineChartPeriods,
  IndicatorCardEstatus,
  IndicatorCardModalidad,
  UnitsCard,
} from '@/app/shared/common';
import { TableUnidades } from '@/app/components/dashboard';
import { madaniArabicBold } from '@/public/assets/fonts';
import { fetchData, fetchString } from '@/app/services/api';
import { capitalizeWords, getIcon } from '@/app/shared/common/Util/iconsFormat';
import { useAuthContext } from '@/app/context/AuthContext';
import { getData } from '@/app/shared/utils/apiUtils';
import { useRouter } from 'next/navigation';

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

function MatriculaIndicator({ estudiantes }: { estudiantes: string }) {
  return (
    <IndicatorCard
      title='Matrícula'
      value={estudiantes}
      icon={<Groups2 sx={{ fontSize: '4rem', color: '#308fff' }} />}
    />
  );
}

function GeneroIndicator({ generoData, total }: { generoData: GeneroData[], total: number }) {
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
  const [periodo, setPeriodo] = useState('');
  const [estPeriodos, setEstPeriodos] = useState<any[]>([]);
  const [matriculaData, setMatriculaData] = useState<any[]>([]);
  const [generoDatos, setGeneroData] = useState<any[]>([]);
  const [modalidadData, setModalidadData] = useState<any[]>([]);
  const [estatusData, setEstatusData] = useState<any[]>([]);
  const [claseA, setClaseA] = useState<any[]>([]);
  const [claseB, setClaseB] = useState<any[]>([]);
  const [claseC, setClaseC] = useState<any[]>([]);
  const [claseD, setClaseD] = useState<any[]>([]);
  const [claseE, setClaseE] = useState<any[]>([]);
  const [claseN, setClaseN] = useState<any[]>([]);
  const [matriculaVariacion, setVariacionData] = useState<any[]>([]);
  const { user, setNoti } = useAuthContext();
  const router = useRouter();
  const gruposUsuario = useMemo(() => user?.grupos?.split(',') || [], [user]);
  const [grupos, setGrupos] = useState<any[]>([]);
  const [mostrarUnitsCard, setMostrarUnitsCard] = useState(false);

  useEffect(() => {
    async function fetchDataFromAPI() {
      try {
        const periodoActivo = await fetchString('/periodo');
        const periodos = await fetchData(`/matricula/periodo`);
        const matricula = await fetchData(`/matricula/total`);
        const genero = await fetchData(`/estudiantes/genero`);
        const modalidad = await fetchData(`/modalidades`);
        const estatus = await fetchData(`/matricula/estatus`);
        const variacion = await fetchData(`/matricula/variacion`);

        const claseAPre = await fetchData(`/matricula/clase/A`);
        const claseBPre = await fetchData(`/matricula/clase/B`);
        const claseCPre = await fetchData(`/matricula/clase/C`);
        const claseDPre = await fetchData(`/matricula/clase/D`);
        const claseEPre = await fetchData(`/matricula/clase/E`);
        const claseNPre = await fetchData(`/matricula/clase/N`);

        setClaseA(claseAPre);
        setClaseB(claseBPre);
        setClaseC(claseCPre);
        setClaseD(claseDPre);
        setClaseE(claseEPre);
        setClaseN(claseNPre);

        setPeriodo(periodoActivo);
        setEstPeriodos(periodos);
        setMatriculaData(matricula);
        setGeneroData(genero);
        setModalidadData(modalidad);
        setEstatusData(estatus);

        setVariacionData(variacion);
      } catch (error) {
        console.error('Error al obtener datos:', error); // eslint-disable-line no-console
      }
    }
    fetchDataFromAPI();
  }, []);

  const totalData = matriculaData;
  const total = totalData[0]?.estudiantes || 0;
  const numEstudiantes = new Intl.NumberFormat('es-MX').format(total);

  // const procedencias = await procedenciaTotal();

  const periodos = {
    xAxis: [0, ...estPeriodos.map((item) => item.periodo)],
    yAxis: [null, ...estPeriodos.map((item) => item.estudiantes)],
    max: Math.max(...estPeriodos.map((item) => item.estudiantes)),
    min: Math.min(...estPeriodos.map((item) => item.estudiantes)),
  };

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const { data } = await getData({ endpoint: '/grupos' });
        setGrupos(data);

        const gruposDelUsuario = data.filter((g: any) => gruposUsuario
          .includes(g.idGrupo.toString()));

        if (gruposUsuario.includes('1')) return;

        if (gruposDelUsuario.length === 1) {
          const grupo = gruposDelUsuario[0];
          const claveBase = grupo.clave?.split('_')[0];

          const tieneExtensiones = data.some((g: any) => g.clave?.startsWith(`${claveBase}_EX`));

          if (!tieneExtensiones) {
            const nombreRuta = encodeURIComponent(grupo.nombre.toUpperCase());
            router.push(`/data/matricula/unidad/${nombreRuta}`);
            return;
          }
        }
        setMostrarUnitsCard(true);
      } catch (error) {
        setNoti({
          open: true,
          type: 'error',
          message: 'Error al cargar grupos',
        });
      }
    };

    fetchGrupos();
  }, [user, gruposUsuario, router, setNoti]);

  if (mostrarUnitsCard) {
    return (
      <UnitsCard grupos={grupos} gruposUsuario={gruposUsuario} />
    );
  }

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
        <Typography
          variant='h5'
          sx={{ whiteSpace: 'nowrap', maxWidth: { xs: '100%', md: '60%' } }}
        >
          Fecha de corte: 04 Marzo 2025 registrado en el TECNM
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
            gridTemplateColumns: {
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(4, 1fr)',
            },
            gridTemplateRows: 'auto',
            gap: 1,
            width: '100%',
          }}
        >
          <GraphBarAll title='Clase D' chartData={claseD} dataType='unidad' />
          <GraphBarAll title='Clase C' chartData={claseC} dataType='unidad' />
          <GraphBarAll title='Clase B' chartData={claseB} dataType='unidad' />
          <GraphBarAll title='Clase A' chartData={claseA} dataType='unidad' />
          <GraphBarAll
            title='Nuevas Unidades'
            chartData={claseN}
            dataType='unidad'
          />
          <GraphBarAll
            title='Extensiones'
            chartData={claseE}
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
