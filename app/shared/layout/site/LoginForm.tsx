import {
  useState, Dispatch, SetStateAction, ChangeEvent, useEffect,
} from 'react';
import {
  Box, TextField, InputAdornment, IconButton, Button, Typography, Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { PersonOutline, VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { useAuthContext } from '@/app/context/AuthContext';
import { madaniArabicRegular } from '@/public/assets/fonts';
import SubmitNewLogin from './SubmitNewLogin';

interface LoginPayload {
  curp?: string;
  celular?: string;
  correo?: string;
  contrasena: string;
}

export interface LoginFormProps {
  onSwitchToRegister: () => void;
  userErrors: {
    account?: string;
    password?: string;
  };
  setUserErrors: Dispatch<SetStateAction<{
    account?: string;
    password?: string;
  }>>;
  onShowVerifyCode: (
    // eslint-disable-next-line no-unused-vars
    validationNeeded: { correo?: boolean; celular?: boolean },
    // eslint-disable-next-line no-unused-vars
    correo?: string,
    // eslint-disable-next-line no-unused-vars
    celular?: string,
    // eslint-disable-next-line no-unused-vars
    credencial?: string,
    // eslint-disable-next-line no-unused-vars
    type?: 'Auth' | 'Register'
  ) => void;
  onForgotPassword: () => void;
}

export default function LoginForm({
  onSwitchToRegister,
  userErrors,
  setUserErrors,
  onShowVerifyCode,
  onForgotPassword,
}: LoginFormProps) {
  const router = useRouter();
  const { setLoading } = useAuthContext();
  const [form, setForm] = useState({ account: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { data: session } = useSession();

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const isValidAccount = (value: string) => {
    const isEmail = /\S+@\S+\.\S+/.test(value);
    const isCurp = /^[A-Z0-9]{18}$/i.test(value);
    const isPhone = /^\d{10}$/i.test(value);
    return isEmail || isCurp || isPhone;
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async () => {
    let valid = true;
    const errors = { account: '', password: '' };

    if (!isValidAccount(form.account)) {
      errors.account = 'Ingrese un CURP, email o número de celular válido.';
      valid = false;
    }

    if (form.password.length === 0) {
      errors.password = 'La contraseña es obligatoria.';
      valid = false;
    }

    setUserErrors(errors);
    if (!valid) return;

    const payload: LoginPayload = { contrasena: form.password };

    if (/^[A-Z0-9]{18}$/i.test(form.account)) {
      payload.curp = form.account;
    } else if (/^\d{10}$/i.test(form.account)) {
      payload.celular = form.account;
    } else if (/\S+@\S+\.\S+/.test(form.account)) {
      payload.correo = form.account;
    }

    setLoading(true);
    await SubmitNewLogin(
      payload,
      setUserErrors,
      setLoading,
      (action, validationNeeded, correo, celular, credencial) => {
        if (action === 'VALIDATE_CONTACT_INFO') {
          onShowVerifyCode(validationNeeded, correo, celular, credencial, 'Register');
        } else if (action === 'AUTHENTICATE_CONTACT_INFO') {
          onShowVerifyCode(validationNeeded, correo, celular, credencial, 'Auth');
        }
      },
    );

    setLoading(false);
  };

  useEffect(() => {
    if (session?.accessToken) {
      localStorage.setItem('authToken', session.accessToken);
      router.replace('/panel');
    }
  }, [session, router]);

  return (
    <>
      <TextField
        label='Cuenta'
        variant='outlined'
        placeholder='CURP, Email o Celular'
        fullWidth
        name='account'
        value={form.account}
        onChange={handleOnChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <PersonOutline />
            </InputAdornment>
          ),
        }}
        error={Boolean(userErrors.account)}
        helperText={userErrors.account}
      />
      <TextField
        label='Contraseña'
        variant='outlined'
        type={showPassword ? 'text' : 'password'}
        placeholder='Contraseña'
        fullWidth
        name='password'
        value={form.password}
        onChange={handleOnChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton onClick={togglePasswordVisibility} edge='end'>
                {showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        error={Boolean(userErrors.password)}
        helperText={userErrors.password}
      />
      <Typography
        align='right'
        color='primary'
        sx={{
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
        onClick={onForgotPassword}
      >
        ¿Olvidaste tu contraseña?
      </Typography>
      <Button
        variant='contained'
        color='primary'
        fullWidth
        onClick={handleSubmit}
        sx={{
          py: 2,
          textTransform: 'capitalize',
          borderRadius: '10px',
          backgroundColor: '#32169b',
          '&:hover': { backgroundColor: '#14005E' },
        }}
      >
        Ingresar
      </Button>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Divider sx={{ flex: 1 }} />
        <Typography
          sx={{
            mx: 2,
            opacity: 0.7,
            whiteSpace: 'nowrap',
          }}
        >
          O Ingresa con
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>
      <Button
        variant='contained'
        fullWidth
        sx={{
          bgcolor: '#ffffff',
          padding: 2,
          color: 'black',
          textTransform: 'capitalize',
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
        }}
        className={madaniArabicRegular.className}
        startIcon={(
          <Image
            src='/google-icon-logo.svg'
            alt='Google'
            width={24}
            height={24}
            priority
          />
        )}
        onClick={() => signIn('google')}
      >
        Google
      </Button>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography sx={{ opacity: '70%' }}>
          ¿No tienes una cuenta?
          {' '}
          <Typography
            component='span'
            color='primary'
            sx={{
              cursor: 'pointer',
              color: '#32169b',
            }}
            onClick={onSwitchToRegister}
          >
            Registrate
          </Typography>
        </Typography>
      </Box>
    </>
  );
}
