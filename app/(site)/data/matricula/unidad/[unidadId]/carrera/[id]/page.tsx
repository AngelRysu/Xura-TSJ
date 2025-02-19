'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import {
  Groups2,
} from '@mui/icons-material';
import { IndicatorCard, IndicatorCardEstatus } from '@/app/shared/common';
import { madaniArabicBold } from '@/public/assets/fonts';
import { fetchData, fetchString } from '@/app/services/api';
import { capitalizeWords, getIcon } from '@/app/shared/common/Util/iconsFormat';

// const procedenciaTotal = () => fetchData(`/procedencias`);
// const getVariacion = (unidad: string) => fetchData(`/carreras/${unidad}`);

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
      title='Genero'
      items={mapDataToItems(generoData, 'genero')}
      layout='horizontal'
      total={total}
    />
  );
}

function ModalidadIndicator({ modalidadData, total }:
  { modalidadData: ModalidadData[], total: number }) {
  return (
    <IndicatorCard
      title='Modalidad'
      items={mapDataToItems(modalidadData, 'modalidad')}
      layout='horizontal'
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
  const idCarrera = params?.id as string;
  const nombreUnidad = Array.isArray(id) ? id[0] : id;
  const nombreUnidad1 = decodeURIComponent(nombreUnidad);
  const formattedName = capitalizeWords(nombreUnidad1);
  const nombreCarrera1 = Array.isArray(idCarrera) ? idCarrera[0] : idCarrera;
  const nombreCarrera = decodeURIComponent(nombreCarrera1);
  const formattedNameCarrera = capitalizeWords(nombreCarrera);

  const [periodo, setPeriodo] = useState('');
  const [generoData, setGeneroData] = useState<any[]>([]);
  const [modalidadDataPre, setModalidadData] = useState<any[]>([]);
  const [estatusDataPre, setEstatusData] = useState<any[]>([]);
  const [matriculaData, setMatriculaData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDataFromAPI() {
      try {
        const periodoActivo = await fetchString('/periodo');
        const genero = await fetchData(`/estudiantes/genero?carreras=${nombreUnidad}`);
        const modalidad = await fetchData(`/modalidades?carreras=${nombreUnidad}`);
        const estatus = await
        fetchData(`/matricula/estatus?unidad=${nombreUnidad}&carreras=${nombreUnidad}`);
        const matricula = await fetchData(`/carreras/${nombreUnidad}`);

        setPeriodo(periodoActivo);
        setGeneroData(genero);
        setModalidadData(modalidad);
        setEstatusData(estatus);
        setMatriculaData(matricula);
      } catch (error) {
        console.error('Error al obtener datos:', error); // eslint-disable-line no-console
      }
    }
    if (nombreUnidad) {
      fetchDataFromAPI();
    }
  }, [nombreUnidad]);

  const generoDatos = generoData.filter(({ nombre }) => nombre === nombreCarrera);
  const modalidadData = modalidadDataPre.filter(({ carrera }) => carrera === nombreCarrera);
  const estatusData = estatusDataPre.filter(({ nombre }) => nombre === nombreCarrera);
  const totalData = matriculaData.filter(({ programa }) => programa === nombreCarrera);
  const total = totalData.length > 0 ? totalData[0].estudiantes : 0;
  const numEstudiantes = new Intl.NumberFormat('es-MX').format(total);

  // const procedencias = await procedenciaTotal();

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
          {`Matrícula ${periodo} ${formattedNameCarrera} (${formattedName})`}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)',
          },
          width: '100%',
        }}
      >
        <MatriculaIndicator estudiantes={numEstudiantes} />
        <GeneroIndicator generoData={generoDatos} total={total} />
        <ModalidadIndicator modalidadData={modalidadData} total={total} />
        <EstatusIndicator estatusData={estatusData} total={total} />
      </Box>
    </Box>
  );
}
