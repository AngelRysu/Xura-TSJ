'use client';

import {
  ReactNode, useEffect, useMemo, useState, useCallback,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import { getData } from '@/app/shared/utils/apiUtils';
import { PermissionsContext, ApplicationData } from './PermissionsContext';

interface PermissionsProviderProps {
  children: ReactNode;
}

export default function PermissionsProvider({ children }: PermissionsProviderProps) {
  const { user } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();

  const [permissions, setPermissions] = useState<ApplicationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPermissions = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await getData({ endpoint: `/sesiones/${user.id}/data` });

      if (response.statusCode !== 200) {
        throw new Error(response.errorMessage || 'Error fetching permissions');
      }

      const processedPermissions: ApplicationData[] = response.data.map((app: any) => ({
        idAplicacion: app.idAplicacion,
        aplicacionClave: app.aplicacionClave,
        aplicacionImagen: app.aplicacionImagen,
        link: app.aplicacionRedireccion,
        modulos: app.modulos.map((modulo: any) => ({
          idModulo: modulo.idModulo,
          moduloClave: modulo.moduloClave,
          moduloImagen: modulo.moduloImagen,
          idAcceso: modulo.accesos[0].idAcceso,
          acciones: modulo.accesos[0].acciones,
        })),
      }));

      setPermissions(processedPermissions);
    } catch (error) {
      router.push('/error');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, router]);

  useEffect(() => {
    if (user?.id) {
      fetchPermissions();
    }
  }, [pathname, user?.id, fetchPermissions]);

  const value = useMemo(() => ({ permissions, isLoading }), [permissions, isLoading]);

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}
