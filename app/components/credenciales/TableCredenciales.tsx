'use client';

import { useState, useEffect } from 'react';
import { ColDef } from 'ag-grid-community';
import {
  getData, updateRecord, deleteRecord,
} from '@/app/shared/utils/apiUtils';
import {
  ModalAddCnl,
  ModalCancelar,
  ModalPerfilGrupos,
  ModalEtiquetas,
} from '@/app/shared/modals/sso';
import estadosRepublica from '@/app/mocks/estadosRepublica';
import { CredencialFields } from '@/app/services/handlers/formFields';
import { TableTemplate, ActionButtons } from '@/app/shared/common';
import { useAuthContext } from '@/app/context/AuthContext';

interface CredencialData {
  curp: string;
  usuario: string;
  grupo: string;
  etiquetas: string;
  perfil: string;
  tipo: string;
  estado: string;
  idCredencial: string;
  idRol: number;
  idAplicacion: number;
}

export default function TableCredenciales() {
  const { setNoti } = useAuthContext();
  const [rowData, setRowData] = useState<CredencialData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRowsCount, setSelectedRowsCount] = useState<number>(0);
  const [selectedRowsData, setSelectedRowsData] = useState<CredencialData[]>([]);
  const [selectedRowData, setSelectedRowData] = useState<CredencialData | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openCancelModal, setOpenCancelModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'agregar' | 'consultar' | 'editar'>('agregar');
  const [openPerfilGruposModal, setOpenPerfilGruposModal] = useState<boolean>(false);
  const [perfilGrupoMode, setPerfilGrupoMode] = useState<'Perfil' | 'Grupos'>('Perfil');
  const [openEtiquetasModal, setOpenEtiquetasModal] = useState<boolean>(false);
  const [shouldReload, setShouldReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await getData({ endpoint: '/credenciales' });
        const transformedData = data.map((item: any) => ({
          ...item,
          usuario: `${item.nombre} ${item.primerApellido} ${item.segundoApellido || ''}`.trim(),
        }));
        setRowData(transformedData);
        setSelectedRowsCount(0);
        setSelectedRowsData([]);
        setSelectedRowData(null);
      } catch (error) {
        setNoti({
          open: true,
          type: 'error',
          message: 'Error al cargar los datos.',
        });
      } finally {
        setLoading(false);
        setShouldReload(false);
      }
    };

    if (shouldReload || rowData.length === 0) {
      fetchData();
    }
  }, [shouldReload, rowData.length, setNoti]);

  const handleSaveCredencial = async (data: Record<string, string | string[]>) => {
    if (modalMode === 'editar' && selectedRowData) {
      const endpoint = `/credenciales/${selectedRowData.idCredencial}`;
      const response = await updateRecord({ endpoint, data });

      if (response.errorMessage) {
        setNoti({
          open: true,
          type: 'error',
          message: response.errorMessage,
        });
      } else {
        const { data: responseData } = await getData({ endpoint: '/credenciales' });
        const transformedData = responseData.map((item: any) => ({
          ...item,
          usuario: `${item.nombre} ${item.primerApellido} ${item.segundoApellido || ''}`.trim(),
        }));
        setRowData(transformedData);
        setOpenModal(false);
        setNoti({
          open: true,
          type: 'success',
          message: '¡Credencial actualizada con éxito!',
        });
      }
    } else {
      const {
        curp,
        nombre,
        primerApellido,
        segundoApellido,
        fechaNacimiento,
        numEntidadReg,
        correo,
        celular,
        contrasena,
        tipo,
        perfil,
      } = data;

      if (!curp || !nombre || !primerApellido || !fechaNacimiento || !numEntidadReg) {
        setNoti({
          open: true,
          type: 'error',
          message: 'Todos los campos obligatorios deben ser completados.',
        });
        return;
      }

      const estadoNacimiento = estadosRepublica.find(
        (estado) => estado.code === Number(numEntidadReg),
      )?.name;

      if (!estadoNacimiento) {
        setNoti({
          open: true,
          type: 'error',
          message: 'Estado de nacimiento no encontrado.',
        });
        return;
      }

      const fechaNac = Array.isArray(data.fechaNacimiento)
        ? data.fechaNacimiento[0]
        : data.fechaNacimiento as string;

      const formatFechaNacimiento = (fecha: string) => {
        const [year, month, day] = fecha.split('-');
        return `${day}/${month}/${year}`;
      };

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/credenciales`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            api_key: process.env.NEXT_PUBLIC_API_KEY || '',
          },
          body: JSON.stringify({
            curp,
            nombre,
            primerApellido,
            segundoApellido,
            fechaNacimiento: formatFechaNacimiento(fechaNac),
            estadoNacimiento,
            correo,
            celular,
            contrasena,
            tipo,
            perfil,
          }),
        });

        if (!response.ok) {
          setNoti({
            open: true,
            type: 'error',
            message: 'Error al crear la credencial. Por favor, intenta nuevamente.',
          });
          return;
        }

        const { data: updatedData } = await getData({ endpoint: '/credenciales' });
        const transformedData = updatedData.map((item: any) => ({
          ...item,
          usuario: `${item.nombre} ${item.primerApellido} ${item.segundoApellido || ''}`.trim(),
        }));
        setRowData(transformedData);

        setOpenModal(false);
        setNoti({
          open: true,
          type: 'success',
          message: '¡Credencial creada con éxito!',
        });
      } catch (error) {
        setNoti({
          open: true,
          type: 'error',
          message: 'Error al realizar la operación. Verifica tu conexión y vuelve a intentarlo.',
        });
      }
    }
  };

  const handleOpenModal = (actionType: string) => {
    if (actionType === 'Agregar') {
      setModalMode('agregar');
      setSelectedRowData(null);
      setOpenModal(true);
    } else if (actionType === 'Consultar' && selectedRowsCount === 1) {
      setModalMode('consultar');
      setOpenModal(true);
    } else if (actionType === 'Editar' && selectedRowsCount === 1) {
      setModalMode('editar');
      setOpenModal(true);
    } else if (actionType === 'Cancelar' && selectedRowsCount >= 1) {
      setOpenCancelModal(true);
    } else if (actionType === 'Perfil' || actionType === 'Grupos') {
      setPerfilGrupoMode(actionType);
      setOpenPerfilGruposModal(true);
    } else if (actionType === 'Etiquetas' && selectedRowsCount === 1) {
      setOpenEtiquetasModal(true);
    }
  };

  const handleConfirmCancel = async () => {
    const idsToDelete = selectedRowsData.map((row) => row.idCredencial);
    const endpoint = `/credenciales/${idsToDelete.join(',')}`;

    const response = await deleteRecord({ endpoint });
    if (response.errorMessage) {
      setNoti({
        open: true,
        type: 'error',
        message: response.errorMessage,
      });
    } else {
      setNoti({
        open: true,
        type: 'success',
        message: '¡Credenciales canceladas con éxito!',
      });
      setOpenCancelModal(false);
      const { data: responseData } = await getData({ endpoint: '/credenciales' });
      const transformedData = responseData.map((item: any) => ({
        ...item,
        usuario: `${item.nombre} ${item.primerApellido} ${item.segundoApellido || ''}`.trim(),
      }));
      setRowData(transformedData);
    }
  };

  const handleSaveEtiquetas = async () => {
    setOpenEtiquetasModal(false);
    setNoti({
      open: true,
      type: 'success',
      message: '¡Credencial actualizada con éxito!',
    });
    const { data } = await getData({ endpoint: '/credenciales' });
    const transformedData = data.map((item: any) => ({
      ...item,
      usuario: `${item.nombre} ${item.primerApellido} ${item.segundoApellido || ''}`.trim(),
    }));
    setRowData(transformedData);
  };

  const colDefs: ColDef[] = [
    {
      field: 'curp',
      headerName: 'CURP',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: 'usuario',
      headerName: 'Usuario',
      sortable: true,
      filter: true,
      flex: 2,
    },
    {
      field: 'grupos',
      headerName: 'Grupo',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: 'etiquetas',
      headerName: 'Etiquetas',
      sortable: true,
      filter: true,
      flex: 2,
    },
    {
      field: 'roles',
      headerName: 'Perfil',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: 'tipo',
      headerName: 'Tipo',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: 'estado',
      headerName: 'Estado',
      sortable: true,
      filter: true,
      flex: 1,
    },
  ];

  const isRowSelectable = (rowNode: any) => rowNode.data.correo !== 'admin@tecmm.edu.mx';

  const handleRowSelectionChanged = (params: any) => {
    const selectedRows = params.api.getSelectedRows();
    setSelectedRowsCount(selectedRows.length);
    setSelectedRowData(selectedRows.length === 1 ? selectedRows[0] : null);
    setSelectedRowsData(selectedRows);
  };

  return (
    <>
      <ActionButtons
        tableType='credenciales'
        selectedRowsCount={selectedRowsCount}
        onButtonClick={handleOpenModal}
      />
      <TableTemplate
        rowData={rowData}
        colDefs={colDefs}
        pageSize={20}
        loading={loading}
        selectionMode='multiRow'
        isRowSelectable={isRowSelectable}
        onSelectionChanged={handleRowSelectionChanged}
        enableSelection
      />
      <ModalAddCnl
        title='Credencial'
        open={openModal}
        onClose={() => setOpenModal(false)}
        fields={CredencialFields}
        onSubmit={handleSaveCredencial}
        mode={modalMode}
        selectedData={selectedRowData}
        type='credenciales'
      />
      <ModalCancelar
        open={openCancelModal}
        onClose={() => setOpenCancelModal(false)}
        selectedRows={selectedRowsData}
        colDefs={colDefs}
        onConfirmCancel={handleConfirmCancel}
      />
      <ModalPerfilGrupos
        open={openPerfilGruposModal}
        onClose={() => setOpenPerfilGruposModal(false)}
        selectedRow={selectedRowData}
        mode={perfilGrupoMode}
        setShouldReload={setShouldReload}
      />
      <ModalEtiquetas
        open={openEtiquetasModal}
        onClose={() => setOpenEtiquetasModal(false)}
        selectedCredencial={selectedRowData && { idCredencial: selectedRowData.idCredencial }}
        onSave={handleSaveEtiquetas}
      />
    </>
  );
}
