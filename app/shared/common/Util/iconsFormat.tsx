import {
  Woman, Man, HomeWork, DomainDisabled, CastForEducation, Apartment,
  CheckCircle, FlagCircle, RemoveCircle, PauseCircle, Report,
} from '@mui/icons-material';
import React from 'react';

export const capitalizeWords = (str: string): string => str.toLocaleLowerCase('es')
  .replace(/(^|\s)\S/g, (char) => char.toUpperCase());

export const getIcon = (type: string, category: string): React.JSX.Element | null => {
  switch (category) {
    case 'genero':
      return type === 'M' ? <Woman sx={{ fontSize: '2rem', color: '#ff4d63' }} />
        : <Man sx={{ fontSize: '2rem', color: '#308fff' }} />;
    case 'modalidad':
      return {
        MIXTA: <HomeWork sx={{ color: '#ffae31', fontSize: '2rem' }} />,
        'NO ESCOLARIZADA': <DomainDisabled sx={{ color: '#308fff', fontSize: '2rem' }} />,
        'A DISTANCIA': <CastForEducation sx={{ color: '#ff4d63', fontSize: '2rem' }} />,
        ESCOLARIZADA: <Apartment sx={{ color: '#54c98f', fontSize: '2rem' }} />,
      }[type] || (null as unknown as React.JSX.Element);
    case 'estatus':
      return {
        Vigente: <CheckCircle sx={{ color: '#308fff', fontSize: '1.4rem' }} />,
        'Cursos Especiales': <FlagCircle sx={{ color: '#54c98f', fontSize: '1.4rem' }} />,
        'Baja Definitiva': <RemoveCircle sx={{ color: '#ff4d63', fontSize: '1.4rem' }} />,
        'Baja Temporal': <PauseCircle sx={{ color: '#ffae31', fontSize: '1.4rem' }} />,
        'Baja Especial': <Report sx={{ color: '#d8d8d8', fontSize: '1.4rem' }} />,
      }[type] || (null as unknown as React.JSX.Element);
    default:
      return null as unknown as React.JSX.Element;
  }
};
