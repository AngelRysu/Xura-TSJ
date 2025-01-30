'use client';

import { createContext, useContext } from 'react';

interface PermissionContextProps {
  // eslint-disable-next-line no-unused-vars
  hasApplicationAccess: (id: string) => boolean;
  // eslint-disable-next-line no-unused-vars
  hasGroupAccess: (id: string) => boolean;
}

export const PermissionsContext = createContext<PermissionContextProps | undefined>(undefined);

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions debe usarse dentro de PermissionsProvider');
  }
  return context;
}
