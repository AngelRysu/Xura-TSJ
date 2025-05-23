'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, TextField,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { CardHome } from '@/app/shared/common/Cards';
import { useAuthContext } from '@/app/context/AuthContext';
import { parseJwt } from '@/app/shared/utils/getToken';
import { madaniArabicSemiBold } from '@/public/assets/fonts';
import { deleteRecord } from '@/app/shared/utils/apiUtils';
import CardSetPassw from './CardSetPassw';

interface VerifyCodeProps {
  type: 'Auth' | 'Register' | 'Forgot';
  email?: string;
  celular?: string;
  credencial?: string;
  validation: { correo?: boolean; celular?: boolean };
}

const generateUniqueId = (index: number) => `input-code-${index}-${Date.now()}`;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const domain = process.env.NEXT_PUBLIC_URL;

function maskEmail(email: string): string {
  const [localPart, dominio] = email.split('@');
  if (!localPart || !dominio) return email;

  const visibleChars = localPart.slice(0, 2);
  const maskedPart = '*'.repeat(Math.max(localPart.length - 2, 0));
  return `${visibleChars}${maskedPart}@${dominio}`;
}

export default function VerifyCode({
  type,
  email = '',
  celular = '',
  credencial,
  validation,
}: VerifyCodeProps) {
  const router = useRouter();
  const { activateAuth } = useAuthContext();
  const [resendDisabled, setResendDisabled] = useState(true);
  const [showAltSend, setShowAltSend] = useState(false);
  const [counter, setCounter] = useState(30);
  const [codeValues, setCodeValues] = useState(['', '', '', '']);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const inputIds = useRef([0, 1, 2, 3].map((index) => generateUniqueId(index)));
  const [isEmailStep, setIsEmailStep] = useState(validation.correo);
  const [error, setError] = useState('');
  const [resendAttempt, setResendAttempt] = useState(0);
  const [altSendUsed, setAltSendUsed] = useState(false);
  const [isSetPasswordMode, setIsSetPasswordMode] = useState(false);

  let currentData = '';

  if (isEmailStep && email) {
    currentData = maskEmail(email);
  } else if (celular) {
    currentData = `${celular.slice(0, 3)}******${celular.slice(-2)}`;
  }
  const messageTypeMap = {
    Auth: 'Autenticación',
    Register: 'Validación',
    Forgot: 'Recuperación',
  };
  const messageType = messageTypeMap[type];
  const messageMedium = isEmailStep ? 'Correo' : 'Celular';
  const destinatario = isEmailStep ? email : celular;

  const initiateVerification = async (medio: string, destinatarioActual: string) => {
    if (!credencial || !destinatarioActual) return;
    try {
      await fetch(`${domain}/credenciales/${credencial}/codigos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          api_key: apiKey || '',
        },
        body: JSON.stringify({
          tipo: messageType,
          medio,
          destinatario: destinatarioActual,
        }),
      });
    } catch {
      setError('Hubo un error al enviar el código.');
    }
  };

  useEffect(() => {
    if (type === 'Register'
      || (type === 'Auth' && !altSendUsed)
      || (type === 'Forgot' && !altSendUsed)) {
      initiateVerification(messageMedium, destinatario);
    }
  }, [credencial, type, messageMedium, destinatario]);

  useEffect(() => {
    if (counter > 0) {
      const timeout = setTimeout(() => setCounter((prev) => prev - 1), 1000);
      return () => clearTimeout(timeout);
    }
    if (resendAttempt === 0) {
      setResendDisabled(false);
    } else if ((resendAttempt === 1 && (type === 'Forgot' || type === 'Auth')) && !altSendUsed) {
      setShowAltSend(true);
    } else if (resendAttempt === 2 && altSendUsed) {
      setResendDisabled(false);
    }
    return undefined;
  }, [counter, resendAttempt, type, altSendUsed]);

  useEffect(() => {
    setCounter(30);
    setResendDisabled(true);
    setShowAltSend(false);
  }, [isEmailStep]);

  const resetCode = () => {
    setCodeValues(['', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const validateSession = async () => {
    try {
      const identifierField = email ? { correo: email }
        : { celular };

      const isValidResponse = await fetch(`${domain}/sesiones/is-valid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          api_key: apiKey || '',
        },
        body: JSON.stringify(identifierField),
      });

      const isValidData = await isValidResponse.json();
      if (isValidData.token) {
        const decodedToken = parseJwt(isValidData.token);
        const userDataWithToken = { ...decodedToken, token: isValidData.token };
        deleteRecord({ endpoint: `/${credencial}/codigos` });
        activateAuth(userDataWithToken);
        router.push('/panel');
      } else {
        setError(isValidData.message || 'Cuenta no está validada.');
      }
    } catch {
      setError('Hubo un error al validar la sesión.');
    }
  };

  const verifyCode = async () => {
    const enteredCode = codeValues.join('');
    if (!credencial || enteredCode.length !== 4) return;

    try {
      const response = await fetch(`${domain}/credenciales/${credencial}/codigos/${enteredCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          api_key: apiKey || '',
        },
        body: JSON.stringify({
          tipo: messageType,
          medio: messageMedium,
        }),
      });

      if (response.statusText === 'OK') {
        if (type === 'Forgot') {
          setIsSetPasswordMode(true);
        } else if (type === 'Register' && isEmailStep && validation.celular) {
          setIsEmailStep(false);
          resetCode();
        } else {
          validateSession();
        }
      } else {
        setError('El código ingresado es incorrecto.');
        resetCode();
      }
    } catch {
      setError('Hubo un error al verificar el código.');
    }
  };

  const handleResendCode = async () => {
    if (resendDisabled || !credencial || !destinatario) return;

    try {
      await initiateVerification(messageMedium, destinatario);
      setResendDisabled(true);
      setCounter(30);
      setResendAttempt((prev) => prev + 1);
    } catch {
      setError('Hubo un error al reenviar el código.');
    }
  };

  const handleAltSend = async () => {
    const newMedium = isEmailStep ? 'Celular' : 'Correo';
    const newDestinatario = isEmailStep ? celular : email;

    setIsEmailStep(!isEmailStep);
    setCounter(30);
    setResendDisabled(true);
    setResendAttempt(2);
    setShowAltSend(false);

    if (!altSendUsed) {
      setAltSendUsed(true);
      await initiateVerification(newMedium, newDestinatario);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newValues = [...codeValues];
      newValues[index] = value;
      setCodeValues(newValues);
      setError('');
      if (value !== '' && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'Auth':
        return 'Ingresa el código de autenticación de dos factores';
      case 'Register':
        return 'Ingresa el código de validación';
      case 'Forgot':
        return 'Ingresa el código de recuperación';
      default:
        return '';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'Auth':
        return `Te enviamos un código de autenticación a tu
        ${isEmailStep ? 'correo electrónico' : 'celular'} ${currentData}.`;
      case 'Register':
        return `Te enviamos un código de validación a tu
        ${isEmailStep ? 'correo electrónico' : 'celular'} ${currentData}.`;
      case 'Forgot':
        return `Te enviamos un código de recuperación a tu
        ${isEmailStep ? 'correo electrónico' : 'celular'} ${currentData}.`;
      default:
        return '';
    }
  };

  return isSetPasswordMode ? (
    <CardSetPassw
      idCredencial={credencial!}
      email={email}
      celular={celular}
      onSuccess={validateSession}
    />
  ) : (
    <CardHome title={getTitle()}>
      <Typography
        sx={{
          color: '#6b6b6b',
          textAlign: 'center',
          opacity: 0.7,
          marginBottom: '24px',
        }}
      >
        {getDescription()}
      </Typography>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: '9px',
        marginBottom: '24px',
      }}
      >
        {inputIds.current.map((id, index) => (
          <TextField
            key={id}
            inputRef={(el) => {
              inputRefs.current[index] = el;
            }}
            value={codeValues[index]}
            onChange={(e) => handleInputChange(index, e.target.value)}
            variant='outlined'
            error={Boolean(error)}
            inputProps={{
              inputMode: 'numeric',
              maxLength: 1,
              style: { textAlign: 'center', height: '72px' },
              className: madaniArabicSemiBold.className,
            }}
            sx={{
              width: '64px',
              borderRadius: '15px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '15px',
                '& fieldset': {
                  borderColor: codeValues[index] ? '#32169b' : 'rgba(0, 0, 0, 0.15)',
                  borderWidth: codeValues[index] ? '2px' : '1px',
                },
              },
              '& .MuiInputBase-input': {
                padding: 0,
                textAlign: 'center',
              },
            }}
          />
        ))}
      </Box>
      {error && (
        <Typography
          sx={{
            color: 'red',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          {error}
        </Typography>
      )}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '24px',
      }}
      >
        <Typography
          sx={{
            cursor: resendDisabled ? 'default' : 'pointer',
            color: resendDisabled ? '#aaa' : '#000',
            textDecoration: resendDisabled ? 'none' : 'underline',
            pointerEvents: resendDisabled ? 'none' : 'auto',
          }}
          className={madaniArabicSemiBold.className}
          onClick={handleResendCode}
        >
          Reenviar código
        </Typography>
        {counter > 0 && (
          <Typography>
            {`${counter}:00 seg.`}
          </Typography>
        )}
      </Box>
      {(type !== 'Register' && showAltSend && !altSendUsed) && (
        <Typography
          component='div'
          sx={{
            cursor: 'pointer',
            color: '#0066cc',
            textDecoration: 'underline',
            marginBottom: '24px',
          }}
          onClick={handleAltSend}
        >
          {isEmailStep
            ? '¿No recibió el código? Envíamelo al celular'
            : '¿No recibió el código? Envíamelo al correo'}
        </Typography>
      )}
      <Button
        variant='contained'
        color='primary'
        fullWidth
        sx={{
          py: 2,
          textTransform: 'capitalize',
          borderRadius: '10px',
          backgroundColor: '#32169b',
          '&:hover': { backgroundColor: '#14005E' },
        }}
        onClick={verifyCode}
      >
        Confirmar código
      </Button>
    </CardHome>
  );
}
