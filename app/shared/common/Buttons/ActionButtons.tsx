'use client';

import { Box, Button } from '@mui/material';
import {
  Add,
  Search,
  EditOutlined,
  Close,
  PersonOutline,
  GroupsOutlined,
  BookmarkBorder,
  SellOutlined,
} from '@mui/icons-material';
import { madaniArabicRegular } from '@/public/assets/fonts';
import { usePermissions } from '@/app/context/PermissionsContext';
import { usePathname } from 'next/navigation';

interface ActionButtonsProps {
  tableType: 'aplicaciones' | 'credenciales' | 'grupos' | 'modulos' | 'roles';
  selectedRowsCount: number;
  // eslint-disable-next-line no-unused-vars
  onButtonClick: (actionType: string) => void;
}

interface Actions {
  agregar?: number;
  consultar?: number;
  editar?: number;
  cancelar?: number;
  subir?: number;
}

export default function ActionButtons({
  tableType,
  selectedRowsCount,
  onButtonClick,
}: ActionButtonsProps) {
  const { permissions } = usePermissions();
  const pathname = usePathname();

  const moduleName = pathname.split('/').filter(Boolean)[1] || '';

  const modulePermissions = permissions
    .flatMap((app) => app.modulos)
    .find((mod) => mod.moduloClave?.toLowerCase() === moduleName?.toLowerCase());

  const allowedActions: Actions = modulePermissions?.acciones ?? {};

  const customButtonStyles = {
    borderRadius: '20px',
    color: 'rgb(50, 22, 155)',
    textTransform: 'capitalize',
    borderColor: 'rgb(50, 22, 155)',
    '&:hover': {
      backgroundColor: 'rgba(50, 22, 155, 0.08)',
      borderColor: 'rgb(50, 22, 155)',
    },
  };

  const isMultipleSelection = selectedRowsCount > 1;
  const isSingleSelection = selectedRowsCount === 1;
  const notSelection = selectedRowsCount === 0;

  const buttonsConfig = [
    {
      id: 'agregar',
      label: 'Agregar',
      icon: <Add />,
      disabled: isMultipleSelection || isSingleSelection,
      show: allowedActions.agregar === 1,
    },
    {
      id: 'consultar',
      label: 'Consultar',
      icon: <Search />,
      disabled: isMultipleSelection || notSelection,
      show: allowedActions.consultar === 1,
    },
    {
      id: 'editar',
      label: 'Editar',
      icon: <EditOutlined />,
      disabled: isMultipleSelection || notSelection,
      show: allowedActions.editar === 1,
    },
    {
      id: 'cancelar',
      label: 'Cancelar',
      icon: <Close />,
      disabled: notSelection,
      show: allowedActions.cancelar === 1,
    },
    {
      id: 'perfil',
      label: 'Perfil',
      icon: <PersonOutline />,
      disabled: isMultipleSelection || notSelection,
      show: tableType === 'credenciales',
    },
    {
      id: 'grupos',
      label: 'Grupos',
      icon: <GroupsOutlined />,
      disabled: isMultipleSelection || notSelection,
      show: tableType === 'credenciales',
    },
    {
      id: 'etiquetas',
      label: 'Etiquetas',
      icon: <SellOutlined />,
      disabled: isMultipleSelection || notSelection,
      show: tableType === 'credenciales',
    },
    {
      id: 'permisos',
      label: 'Permisos',
      icon: <BookmarkBorder />,
      disabled: isMultipleSelection || notSelection,
      show: tableType === 'roles',
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 2,
        marginBottom: 2,
      }}
    >
      {buttonsConfig.map(
        (button) => button.show && (
          <Button
            key={button.id}
            variant='outlined'
            startIcon={button.icon}
            sx={customButtonStyles}
            className={madaniArabicRegular.className}
            onClick={() => onButtonClick(button.label)}
            disabled={button.disabled}
          >
            {button.label}
          </Button>
        ),
      )}
    </Box>
  );
}
