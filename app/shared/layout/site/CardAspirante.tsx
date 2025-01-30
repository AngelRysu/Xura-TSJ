'use client';

import React, { useState } from 'react';
import {
  Button, TextField, Box, InputAdornment, Typography,
} from '@mui/material';
import {
  PersonOutline,
  MailOutline,
  SmartphoneOutlined,
  VisibilityOffOutlined,
} from '@mui/icons-material';
import { CardHome } from '@/app/shared/common';
import estadosRepublica from '@/app/mocks/estadosRepublica';
import { useAuthContext } from '@/app/context/AuthContext';
import VerifyCode from './VerifyCode';

interface CardAspiranteProps {
  email?: string;
  celular?: string;
  password?: string;
  curp: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  numEntidadReg: string;
}

const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const domain = process.env.NEXT_PUBLIC_URL;

export default function CardAspirante({
  email = '',
  celular = '',
  password = '',
  curp = '',
  nombre = '',
  apellidoPaterno = '',
  apellidoMaterno = '',
  fechaNacimiento = '',
  numEntidadReg = '',
}: CardAspiranteProps) {
  const { setNoti } = useAuthContext();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [credencialId, setCredencialId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const nombreCompleto = `${nombre} ${apellidoPaterno} ${apellidoMaterno}`;

  const formatHide = (text: string) => {
    if (text.length > 4) {
      const hiddenPart = '*'.repeat(text.length - 4);
      return `${hiddenPart}${text.slice(-4)}`;
    }
    return text;
  };

  const formatFechaNacimiento = (fecha: string) => {
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleConfirm = async () => {
    setError('');
    const estadoNacimiento = estadosRepublica.find(
      (estado: any) => estado.code === Number(numEntidadReg),
    )?.name;

    if (!estadoNacimiento) {
      setError('Estado de nacimiento no encontrado');
      return;
    }

    try {
      const response = await fetch(`${domain}/credenciales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          api_key: apiKey || '',
        },
        body: JSON.stringify({
          curp,
          nombre,
          primerApellido: apellidoPaterno,
          segundoApellido: apellidoMaterno,
          fechaNacimiento: formatFechaNacimiento(fechaNacimiento),
          estadoNacimiento,
          correo: email,
          celular,
          contrasena: password,
          tipo: 'JWT',
        }),
      });

      if (!response.ok) {
        setError('Error en la creación de credencial');
        setNoti({
          open: true,
          type: 'error',
          message: 'Acuda a servicios escolares',
        });
        return;
      }

      const data = await response.json();
      setCredencialId(data.idCredencial);
      setIsConfirmed(true);
    } catch {
      setError('Error al confirmar los datos');
    }
  };

  const handleCancel = () => {
    window.location.reload();
  };

  if (isConfirmed) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '16px',
          boxSizing: 'border-box',
          height: 'calc(100vh - 64px)',
          marginTop: '-35px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '100%',
            gap: '20px',
            width: '100%',
          }}
        >
          <VerifyCode
            email={email}
            celular={celular}
            type='Register'
            credencial={credencialId}
            validation={{ correo: true, celular: true }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <CardHome title='Confirma tus datos'>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
      }}
      >
        {error && (
          <Typography color='error' sx={{ mb: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}
        <TextField
          label='Nombre'
          value={nombreCompleto}
          fullWidth
          disabled
          variant='outlined'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <PersonOutline sx={{ color: 'rgba(0, 0, 0, 0.35)' }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label='CURP'
          value={curp}
          fullWidth
          disabled
          variant='outlined'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <PersonOutline sx={{ color: 'rgba(0, 0, 0, 0.35)' }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label='Correo'
          value={email}
          fullWidth
          disabled
          variant='outlined'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <MailOutline sx={{ color: 'rgba(0, 0, 0, 0.35)' }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label='Celular'
          value={formatHide(celular)}
          fullWidth
          disabled
          variant='outlined'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <SmartphoneOutlined sx={{ color: 'rgba(0, 0, 0, 0.35)' }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label='Contraseña'
          value={formatHide(password)}
          fullWidth
          disabled
          variant='outlined'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <VisibilityOffOutlined sx={{ color: 'rgba(0, 0, 0, 0.35)' }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant='contained'
          color='primary'
          fullWidth
          onClick={handleConfirm}
          sx={{
            py: 2,
            textTransform: 'capitalize',
            borderRadius: '10px',
            backgroundColor: '#32169b',
            '&:hover': { backgroundColor: '#14005E' },
          }}
        >
          Confirmar
        </Button>
        <Button
          variant='contained'
          fullWidth
          onClick={handleCancel}
          sx={{
            py: 2,
            textTransform: 'capitalize',
            borderRadius: '10px',
            backgroundColor: 'rgb(255, 77, 99)',
            '&:hover': { backgroundColor: 'rgb(200, 50, 70)' },
          }}
        >
          Cancelar
        </Button>
      </Box>
    </CardHome>
  );
}
