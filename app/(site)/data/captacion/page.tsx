import { DashboardCaptacion } from '@/app/components/dashboard';

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

const periodoActivo = () => fetchString('/captacionp');

const captacionTotal = () => fetchData('/captaciont');

const captacionExamen = () => fetchData('/captacione');

const getUltimaFecha = () => fetchString('/captacionfin');

const generoTotal = () => fetchData('/captacion/genero');

const modalidadTotal = () => fetchData('/captacion/modalidad');

const estatusTotal = () => fetchData('/captacion/estatus');

const captacionClase = () => fetchData('/captacion/unidad');

const fechasCaptacion = () => fetchData('/captaciond');

const procedenciaTotal = () => fetchData('/captacion/procedencia');

export default async function ServerComponent() {
  const [
    totalData,
    generoData,
    modalidadData,
    estatusData,
    periodo,
    fechasCapt,
    procedencias,
    captacionData,
    captacionE,
    ultimaFecha,
  ] = await Promise.all([
    captacionTotal(),
    generoTotal(),
    modalidadTotal(),
    estatusTotal(),
    periodoActivo(),
    fechasCaptacion(),
    procedenciaTotal(),
    captacionClase(),
    captacionExamen(),
    getUltimaFecha(),
  ]);

  const data = {
    total: totalData?.[0]?.cantidad || 20,
    generoData: generoData?.length === 0
      ? [{ genero: 'M', cantidad: 5 }, { genero: 'H', cantidad: 10 }]
      : generoData,
    modalidadData: modalidadData?.length === 0
      ? [{ modalidad: 'ESCOLARIZADA', cantidad: 15 }, { modalidad: 'NO ESCOLARIZADA', cantidad: 5 }]
      : modalidadData,
    estatusData: estatusData?.length === 0
      ? [{ estatus: 'EXAMEN PAGADO', cantidad: 15 },
        { estatus: 'REGISTRADO SIN VALIDAR', cantidad: 5 }]
      : estatusData,
    periodo: periodo || '',
    fechas: {
      xAxis: [0, ...(fechasCapt || []).map((item) => item.fecha)],
      yAxis: [null, ...(fechasCapt || []).map((item) => item.cantidad)],
      min: Math.min(...(fechasCapt || []).map((item) => item.cantidad) || [0]),
      max: Math.max(...(fechasCapt || []).map((item) => item.cantidad) || [0]),
    },
    procedencias: procedencias || [],
    captacionData: captacionData || [],
    captacionExamen: captacionE || [],
    ultimaFecha: ultimaFecha?.ultimaFecha || '',
  };

  return <DashboardCaptacion data={data} />;
}
