'use client';

import { ReactNode, useMemo } from 'react';
import { useAuthContext } from '@/app/context/AuthContext';
import { applicationPermission, groupPermission } from '@/app/mocks/permissions';
import { PermissionsContext } from './PermissionsContext';

interface PermissionsProviderProps {
  children: ReactNode;
}

export default function PermissionsProvider({ children }: PermissionsProviderProps) {
  const { user } = useAuthContext();

  const aplicacionesList = useMemo(() => {
    if (!user?.aplicaciones) return [];
    return user.aplicaciones.split(',').map((id: string) => id.trim());
  }, [user?.aplicaciones]);

  const gruposList = useMemo(() => {
    if (!user?.grupos) return [];
    return user.grupos.split(',').map((id: string) => id.trim());
  }, [user?.grupos]);

  const hasApplicationAccess = useMemo(
    () => (id: string) => aplicacionesList.includes(id) && !!applicationPermission[id],
    [aplicacionesList],
  );

  const hasGroupAccess = useMemo(
    () => (id: string) => gruposList.includes(id) && !!groupPermission[id],
    [gruposList],
  );

  const providerValue = useMemo(() => ({
    hasApplicationAccess,
    hasGroupAccess,
  }), [hasApplicationAccess, hasGroupAccess]);

  return (
    <PermissionsContext.Provider value={providerValue}>
      {children}
    </PermissionsContext.Provider>
  );
}
