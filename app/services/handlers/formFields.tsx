import { ReactNode } from 'react';
import {
  LinkOutlined,
  EditOutlined,
  PersonOutline,
  SmartphoneOutlined,
  MailOutlined,
} from '@mui/icons-material';

interface Field {
  name: string;
  label: string;
  icon?: ReactNode;
  type?: 'select' | 'text';
  disabled?: boolean;
  multiple?: boolean;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    errorMessage?: string;
  };
}

export const AplicacionFields: Field[] = [
  {
    name: 'clave',
    label: 'Clave',
    icon: <EditOutlined />,
    validation: {
      required: true,
      minLength: 3,
      maxLength: 10,
      errorMessage: 'La clave debe tener entre 3 y 10 caracteres.',
    },
  },
  {
    name: 'nombre',
    label: 'Nombre',
    icon: <EditOutlined />,
    validation: {
      required: true,
      minLength: 3,
      maxLength: 200,
      errorMessage: 'El nombre debe tener entre 3 y 200 caracteres.',
    },
  },
  {
    name: 'redireccion',
    label: 'Redirección',
    icon: <LinkOutlined />,
    validation: {
      required: true,
      maxLength: 500,
      pattern: /^\/[a-zA-Z0-9/-]*$/,
      errorMessage: 'Debe iniciar con "/" y contener solo letras, números, guiones o barras.',
    },
  },
];

export const ModuloFields: Field[] = [
  {
    name: 'clave',
    label: 'Clave',
    icon: <EditOutlined />,
    validation: {
      required: true,
      minLength: 3,
      maxLength: 15,
      errorMessage: 'La clave debe tener entre 3 y 15 caracteres.',
    },
  },
  {
    name: 'aplicacion',
    label: 'Aplicación',
    type: 'select',
    validation: {
      required: true,
      errorMessage: 'Debe seleccionar al menos una aplicación.',
    },
  },
  {
    name: 'nombre',
    label: 'Nombre',
    icon: <EditOutlined />,
    validation: {
      required: true,
      minLength: 3,
      maxLength: 200,
      errorMessage: 'El nombre debe tener entre 3 y 200 caracteres.',
    },
  },
];

export const RolFields: Field[] = [
  {
    name: 'clave',
    label: 'Clave',
    icon: <EditOutlined />,
    validation: {
      required: true,
      minLength: 3,
      maxLength: 10,
      errorMessage: 'La clave debe tener entre 3 y 10 caracteres.',
    },
  },
  {
    name: 'nombre',
    label: 'Nombre',
    icon: <EditOutlined />,
    validation: {
      required: true,
      minLength: 3,
      maxLength: 200,
      errorMessage: 'El nombre debe tener entre 3 y 200 caracteres.',
    },
  },
];

export const GrupoFields: Field[] = [
  {
    name: 'clave',
    label: 'Clave',
    icon: <EditOutlined />,
    validation: {
      required: true,
      minLength: 2,
      maxLength: 15,
      errorMessage: 'La clave debe tener entre 2 y 15 caracteres.',
    },
  },
  {
    name: 'nombre',
    label: 'Nombre',
    icon: <EditOutlined />,
    validation: {
      required: true,
      minLength: 3,
      maxLength: 200,
      errorMessage: 'El nombre debe tener entre 3 y 200 caracteres.',
    },
  },
];

export const CredencialFields: Field[] = [
  {
    name: 'curp',
    label: 'CURP',
    icon: <PersonOutline />,
    validation: {
      required: true,
      minLength: 18,
      maxLength: 18,
      errorMessage: 'La CURP debe ser de 18 caracteres.',
    },
  },
  {
    name: 'usuario',
    label: 'Nombre',
    icon: <PersonOutline />,
    disabled: true,
    validation: {
      minLength: 3,
      maxLength: 200,
      errorMessage: 'El nombre debe tener entre 3 y 200 caracteres.',
    },
  },
  {
    name: 'celular',
    label: 'Celular',
    icon: <SmartphoneOutlined />,
    validation: {
      required: true,
      minLength: 10,
      maxLength: 15,
      errorMessage: 'El celular debe ser de 10 caracteres.',
    },
  },
  {
    name: 'correo',
    label: 'Correo',
    icon: <MailOutlined />,
    validation: {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      errorMessage: 'Debe ser un correo electrónico válido.',
    },
  },
  {
    name: 'contrasena',
    label: 'Contraseña',
    icon: <PersonOutline />,
    validation: {
      required: true,
      minLength: 8,
      errorMessage: `La contraseña debe tener al menos 8
      caracteres y contener una letra mayúscula, un número y un carácter especial.`,
      pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
    },
  },
];
