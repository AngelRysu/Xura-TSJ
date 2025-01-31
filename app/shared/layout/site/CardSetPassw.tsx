'use client';

import { useState, ChangeEvent } from 'react';
import {
  Typography, Button, TextField, InputAdornment, IconButton, Link,
} from '@mui/material';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { CardHome } from '@/app/shared/common';
import { madaniArabicSemiBold } from '@/public/assets/fonts';

const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const domain = process.env.NEXT_PUBLIC_URL;

interface CardSetPasswProps {
  idCredencial: string;
  email?: string;
  celular?: string;
  onSuccess: () => void;
}

export default function CardSetPassw({
  idCredencial,
  email,
  celular,
  onSuccess,
}: CardSetPasswProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleChangeConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setError('');
  };

  const handleSetPassword = async () => {
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const requestData = {
      contrasena: password,
      correo: email || undefined,
      celular: celular || undefined,
    };

    try {
      const response = await fetch(`${domain}/sesiones/${idCredencial}/set-contrasena`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          api_key: apiKey || '',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setSuccessMessage('Contraseña actualizada con éxito.');
        setTimeout(() => {
          setSuccessMessage('');
          onSuccess();
        }, 2000);
      } else {
        setError('Hubo un error al actualizar la contraseña. Inténtalo más tarde.');
      }
    } catch {
      setError('Hubo un error al procesar la solicitud.');
    }
  };

  return (
    <CardHome title='Establecer nueva contraseña'>
      <Typography
        sx={{
          color: '#6b6b6b',
          textAlign: 'center',
          opacity: 0.7,
          marginBottom: '24px',
        }}
      >
        Introduzca su nueva contraseña y confírmela.
      </Typography>

      <TextField
        label='Nueva contraseña'
        variant='outlined'
        type={showPassword ? 'text' : 'password'}
        fullWidth
        value={password}
        onChange={handleChangePassword}
        error={Boolean(error)}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton onClick={togglePasswordVisibility} edge='end'>
                {showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ marginBottom: '16px' }}
      />
      <TextField
        label='Confirmar contraseña'
        variant='outlined'
        type={showConfirmPassword ? 'text' : 'password'}
        fullWidth
        value={confirmPassword}
        onChange={handleChangeConfirmPassword}
        error={Boolean(error)}
        helperText={error}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton onClick={toggleConfirmPasswordVisibility} edge='end'>
                {showConfirmPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ marginBottom: '24px' }}
      />

      {successMessage && (
        <Typography
          sx={{
            color: 'green',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          {successMessage}
        </Typography>
      )}

      <Typography
        component='div'
        sx={{
          cursor: 'pointer',
          color: '#0066cc',
          textDecoration: 'underline',
          marginBottom: '24px',
        }}
        className={madaniArabicSemiBold.className}
      >
        <Link href='/' color='inherit' underline='hover'>
          Regresar al inicio
        </Link>
      </Typography>

      <Button
        variant='contained'
        color='primary'
        fullWidth
        onClick={handleSetPassword}
        disabled={!password || !confirmPassword || password !== confirmPassword}
        sx={{
          py: 2,
          textTransform: 'capitalize',
          borderRadius: '10px',
          backgroundColor: '#32169b',
          '&:hover': { backgroundColor: '#14005E' },
        }}
      >
        Confirmar contraseña
      </Button>
    </CardHome>
  );
}
