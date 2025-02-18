'use client';

import { createContext, useContext } from 'react';

interface ModuleAccess {
  idModulo: number;
  moduloClave: string;
  moduloImagen: string;
  moduloIcon: string;
  idAcceso: number;
  acciones: {
    agregar: number;
    consultar: number;
    editar: number;
    cancelar: number;
    subir: number;
  };
}

export interface ApplicationData {
  idAplicacion: number;
  aplicacionClave: string;
  aplicacionImagen: string;
  link: string;
  modulos: ModuleAccess[];
}

interface PermissionsContextType {
  permissions: ApplicationData[];
  isLoading: boolean;
}

export const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions debe usarse dentro de PermissionsProvider');
  }
  return context;
}
