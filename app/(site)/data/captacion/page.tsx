import { DashboardCaptacion } from '@/app/components/dashboard';
import { fetchData, fetchString } from '@/app/services/api';

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
    fetchData('/captaciont'),
    fetchData('/captacion/genero'),
    fetchData('/captacion/modalidad'),
    fetchData('/captacion/estatus'),
    fetchString('/captacionp'),
    fetchData('/captaciond'),
    fetchData('/captacion/procedencia'),
    fetchData('/captacion/unidad'),
    fetchData('/captacione'),
    fetchString('/captacionfin'),
  ]);

  const clases = ['A', 'B', 'C', 'D', 'E', 'N'];
  const captacionPorClase: { [key: string]: typeof captacionData } = {};
  const examenPorClase: { [key: string]: typeof captacionE } = {};

  clases.forEach((clase) => {
    captacionPorClase[clase] = captacionData.filter((item) => item.clase === clase);
    examenPorClase[clase] = captacionE.filter((item) => captacionPorClase[clase]
      .some((c) => c.nombre === item.nombre));
  });

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
    captacionClase: captacionPorClase || '',
    examenClase: examenPorClase || '',
  };

  return <DashboardCaptacion data={data} />;
}
