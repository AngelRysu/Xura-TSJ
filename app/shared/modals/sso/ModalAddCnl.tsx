'use client';

import {
  ChangeEvent, ReactNode, useState, useEffect, MouseEvent,
} from 'react';
import {
  TextField,
  Button,
  Box,
  Grid,
  InputAdornment,
  MenuItem,
  CircularProgress,
  Typography,
  Menu,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import {
  Add,
  Close,
  EditOutlined,
  Check,
  PersonAddAltOutlined,
  SmartphoneOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
} from '@mui/icons-material';
import { getData } from '@/app/shared/utils/apiUtils';
import { getCurp } from '@/app/services/handlers/getMatricula';
import countryCodes from '@/app/mocks/countryCodes';
import DefaultModal from '../DefaultModal';

interface AplicacionData {
  idAplicacion: number;
  clave: string;
  nombre: string;
  redireccion?: string;
  estado: string;
  celular?: string;
}

interface CredencialData {
  curp: string;
  usuario: string;
  grupo: string;
  etiquetas: string;
  perfil: string;
  tipo: string;
  estado: string;
  idCredencial?: string;
  idAplicacion: number;
  celular?: string;
}

interface ModalAddCnlProps {
  title: string;
  open: boolean;
  onClose: () => void;
  fields: Array<{
    name: string;
    label: string;
    type?: 'select' | 'text';
    icon?: ReactNode;
    disabled?: boolean;
    multiple?: boolean;
    validation?: {
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      pattern?: RegExp;
      errorMessage?: string;
    };
  }>;
  mode: 'agregar' | 'consultar' | 'editar';
  selectedData?: AplicacionData | CredencialData | null;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: Record<string, string | string[]>) => Promise<void>;
  type?: 'modulos' | 'aplicaciones' | 'credenciales';
}

export default function ModalAddCnl({
  title,
  open,
  onClose,
  fields,
  mode,
  selectedData = null,
  onSubmit,
  type,
}: ModalAddCnlProps) {
  const [formValues, setFormValues] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dynamicOptions, setDynamicOptions] = useState<{ value: string; label: string }[]>([]);
  const [loadingCurp, setLoadingCurp] = useState(false);
  const [curpVerified, setCurpVerified] = useState(false);
  const [countryCode, setCountryCode] = useState<{
    code: string; label: string }>({ code: '52', label: '🇲🇽 +52' });
  const [rawPhoneNumber, setRawPhoneNumber] = useState('');
  const [celularError, setCelularError] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  const tipoOptions = [
    { value: 'JWT', label: 'JWT' },
    { value: 'OAuth 2.0', label: 'OAuth 2.0' },
  ];

  useEffect(() => {
    const fetchDynamicOptions = async () => {
      if (!open) return;
      try {
        if (type === 'modulos') {
          if (mode === 'agregar') {
            const { data } = await getData({ endpoint: '/aplicaciones' });
            const options = data.map((app: { idAplicacion: number; nombre: string }) => ({
              value: app.idAplicacion.toString(),
              label: app.nombre,
            }));
            setDynamicOptions(options);
          } else if (mode === 'consultar' && selectedData?.idAplicacion) {
            const { data } = await getData({
              endpoint: `/aplicaciones/${selectedData.idAplicacion}`,
            });
            const option = { value: data.idAplicacion.toString(), label: data.nombre };
            setDynamicOptions([option]);
            setFormValues((prevValues) => ({
              ...prevValues,
              aplicacion: option.value,
            }));
          } else if (mode === 'editar') {
            const { data } = await getData({ endpoint: '/aplicaciones' });
            const options = data.map((app: { idAplicacion: number; nombre: string }) => ({
              value: app.idAplicacion.toString(),
              label: app.nombre,
            }));
            setDynamicOptions(options);
            if (selectedData?.idAplicacion) {
              setFormValues((prevValues) => ({
                ...prevValues,
                aplicacion: selectedData.idAplicacion.toString(),
              }));
            }
          }
        } else if (type === 'credenciales') {
          const { data } = await getData({ endpoint: '/roles' });
          const options = data.map((perfil: { idRol: number; nombre: string }) => ({
            value: perfil.idRol.toString(),
            label: perfil.nombre,
          }));
          setDynamicOptions(options);
        }
      } catch {
        setDynamicOptions([]);
      }
    };

    fetchDynamicOptions();

    if (selectedData && mode !== 'agregar') {
      const transformedData = Object.fromEntries(
        Object.entries(selectedData).map(([key, value]) => [key, value]),
      ) as Record<string, string | string[]>;
      setFormValues(transformedData);
      if (selectedData.celular) {
        const [code, number] = selectedData.celular.split('-');
        setCountryCode(
          countryCodes.find((country) => country.code === code) || { code: '52', label: '🇲🇽 +52' },
        );
        setRawPhoneNumber(number || '');
      }
    } else if (mode === 'agregar') {
      setFormValues({});
      setRawPhoneNumber('');
    }
  }, [selectedData, mode, open, type]);

  const validateField = (field: any, value: string | string[]): string => {
    const {
      required, minLength, maxLength, pattern, errorMessage,
    } = field.validation || {};
    let error = '';

    if (required && !value) {
      error = 'Este campo es obligatorio.';
    } else if (minLength && typeof value === 'string' && value.length < minLength) {
      error = `Debe tener al menos ${minLength} caracteres.`;
    } else if (maxLength && typeof value === 'string' && value.length > maxLength) {
      error = `Debe tener como máximo ${maxLength} caracteres.`;
    } else if (pattern && typeof value === 'string' && !pattern.test(value)) {
      error = errorMessage || 'Formato no válido.';
    }

    return error;
  };

  const handleVerifyCurp = async () => {
    const curp = formValues.curp as string;
    if (!curp || curp.length !== 18) {
      setErrors((prev) => ({ ...prev, curp: 'La CURP debe tener 18 caracteres.' }));
      return;
    }

    setLoadingCurp(true);
    setCurpVerified(false);
    try {
      const response = await getCurp(curp);
      const {
        Nombre, ApellidoPaterno, ApellidoMaterno, FechaNacimiento, NumEntidadReg,
      } = response.datos;
      const usuario = `${Nombre} ${ApellidoPaterno} ${ApellidoMaterno}`.trim();
      setFormValues((prev) => ({
        ...prev,
        usuario,
        nombre: Nombre,
        primerApellido: ApellidoPaterno,
        segundoApellido: ApellidoMaterno,
        fechaNacimiento: FechaNacimiento,
        numEntidadReg: NumEntidadReg,
      }));
      setErrors((prev) => ({ ...prev, curp: '' }));
      setCurpVerified(true);
    } catch {
      setErrors((prev) => ({ ...prev, curp: 'Error al verificar la CURP.' }));
    } finally {
      setLoadingCurp(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>,
  ) => {
    const { name, value } = e.target as HTMLInputElement | { name: string; value: string };
    const field = fields.find((f) => f.name === name);

    if (name === 'curp' && mode === 'agregar') {
      setCurpVerified(false);
      setFormValues((prevValues) => ({ ...prevValues, usuario: '' }));
    }

    if (field) {
      const error = validateField(field, value);
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    }

    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleCelularChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawNumber = e.target.value.replace(/[^0-9]/g, '');
    setRawPhoneNumber(rawNumber);
  };

  const handleCelularBlur = () => {
    const formattedCelular = `${countryCode.code}-${rawPhoneNumber}`;
    if (!/^\d{2,3}-\d{10}$/.test(formattedCelular)) {
      setCelularError('El número de celular debe tener 10 dígitos.');
    } else {
      setCelularError('');
      setFormValues((prevData) => ({
        ...prevData,
        celular: formattedCelular,
      }));
    }
  };

  const handleCountryMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCountrySelect = (country: { code: string; label: string }) => {
    setCountryCode(country);
    setAnchorEl(null);
  };

  const handleClose = () => {
    onClose();
    setFormValues({});
    setErrors({});
    setCurpVerified(false);
    setLoadingCurp(false);
    setRawPhoneNumber('');
    setCelularError('');
  };

  const handleSubmit = async () => {
    if (mode === 'consultar') return;

    let formIsValid = true;
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = formValues[field.name] || '';
      if (field.name === 'contrasena' && mode === 'editar' && !value) {
        return;
      }
      const error = validateField(field, value);
      if (error) formIsValid = false;
      newErrors[field.name] = error;
    });

    setErrors(newErrors);

    if (formIsValid) {
      const dataToSubmit = { ...formValues };
      if (mode === 'editar' && !formValues.contrasena) {
        dataToSubmit.contrasena = 'N1nguna';
      }

      if (dataToSubmit.aplicacion && type === 'modulos') {
        dataToSubmit.idAplicacion = dataToSubmit.aplicacion;
        delete dataToSubmit.aplicacion;
        delete dataToSubmit.idModulo;
      }
      await onSubmit(dataToSubmit);
      handleClose();
    }
  };

  const isReadOnly = mode === 'consultar';

  const getGridSize = (index: number, totalFields: number) => {
    if (totalFields === 2) return 6;
    if (totalFields === 3) return 6;
    if (totalFields === 7) return index === 1 ? 8 : 4;
    return 12;
  };

  const upperMode = mode.charAt(0).toUpperCase() + mode.slice(1);

  return (
    <DefaultModal open={open} onClose={handleClose} title={`${upperMode} ${title}`}>
      <Box component='form' sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Grid container spacing={2}>
          {fields.map((field, index) => (
            <Grid item xs={getGridSize(index, fields.length)} key={field.name}>
              {/* eslint-disable-next-line no-nested-ternary */}
              {field.type === 'select' ? (
                // eslint-disable-next-line no-nested-ternary
                field.name === 'tipo' ? (
                  <FormControl fullWidth>
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      variant='outlined'
                      label={field.label}
                      name={field.name}
                      disabled={isReadOnly || field.disabled}
                      value={
                        Array.isArray(formValues[field.name])
                          ? formValues[field.name][0] || ''
                          : (formValues[field.name] as string) || ''
                      }
                      onChange={handleInputChange}
                      error={!!errors[field.name]}
                    >
                      {tipoOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                // eslint-disable-next-line no-nested-ternary
                ) : field.name === 'perfil' && type === 'credenciales' ? (
                  mode === 'editar' || mode === 'consultar' ? null : (
                    <FormControl fullWidth>
                      <InputLabel>{field.label}</InputLabel>
                      <Select
                        variant='outlined'
                        label={field.label}
                        name={field.name}
                        disabled={isReadOnly || field.disabled}
                        value={
                          Array.isArray(formValues[field.name])
                            ? formValues[field.name][0] || ''
                            : (formValues[field.name] as string) || ''
                        }
                        onChange={handleInputChange}
                        error={!!errors[field.name]}
                      >
                        {dynamicOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )
                ) : (
                  <FormControl fullWidth>
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      variant='outlined'
                      label={field.label}
                      name={field.name}
                      disabled={isReadOnly || field.disabled}
                      value={
                        Array.isArray(formValues[field.name])
                          ? formValues[field.name][0] || ''
                          : (formValues[field.name] as string) || ''
                      }
                      onChange={handleInputChange}
                      error={!!errors[field.name]}
                      multiple={field.multiple}
                    >
                      {dynamicOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )
              // eslint-disable-next-line no-nested-ternary
              ) : field.name === 'aplicacion' && type === 'modulos' ? (
                <FormControl fullWidth>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    variant='outlined'
                    label={field.label}
                    name={field.name}
                    disabled={isReadOnly}
                    value={
                      Array.isArray(formValues[field.name])
                        ? formValues[field.name][0] || ''
                        : (formValues[field.name] as string) || ''
                    }
                    onChange={handleInputChange}
                    error={!!errors[field.name]}
                  >
                    {dynamicOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : field.name === 'celular' ? (
                <>
                  <TextField
                    label={field.label}
                    variant='outlined'
                    fullWidth
                    placeholder='Celular'
                    value={rawPhoneNumber}
                    onChange={handleCelularChange}
                    onBlur={handleCelularBlur}
                    error={Boolean(celularError || errors[field.name])}
                    helperText={celularError || errors[field.name]}
                    disabled={isReadOnly || field.disabled
                      || (field.name === 'celular' && mode === 'editar')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Box
                            onClick={handleCountryMenuClick}
                            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          >
                            <Typography>{countryCode.label}</Typography>
                          </Box>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position='end'>
                          {field.icon || <SmartphoneOutlined />}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    MenuListProps={{
                      style: {
                        maxHeight: 200,
                        width: '20ch',
                      },
                    }}
                  >
                    {countryCodes.map((country) => (
                      <MenuItem key={country.code} onClick={() => handleCountrySelect(country)}>
                        {country.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                <TextField
                  label={field.label}
                  name={field.name}
                  type={field.name === 'contrasena' && !showPassword ? 'password' : 'text'}
                  variant='outlined'
                  value={formValues[field.name] || ''}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                  disabled={isReadOnly || field.disabled
                    || (field.name === 'curp' && mode === 'editar')}
                  InputProps={{
                    endAdornment:
                      // eslint-disable-next-line no-nested-ternary
                      field.name === 'contrasena' ? (
                        <InputAdornment position='end'>
                          <IconButton onClick={handleTogglePasswordVisibility}>
                            {showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                          </IconButton>
                        </InputAdornment>
                      ) : field.name === 'curp' && mode === 'agregar' ? (
                        <InputAdornment position='end'>
                          {/* eslint-disable-next-line no-nested-ternary */}
                          {loadingCurp ? (
                            <CircularProgress size={24} />
                          ) : curpVerified ? (
                            <Check color='success' />
                          ) : (
                            <PersonAddAltOutlined
                              onClick={formValues.curp?.length === 18
                                ? handleVerifyCurp : undefined}
                              sx={{
                                cursor: formValues.curp?.length === 18
                                  ? 'pointer' : 'default',
                                color: formValues.curp?.length === 18
                                  ? 'primary.main' : 'text.disabled',
                              }}
                            />
                          )}
                        </InputAdornment>
                      ) : (
                        <InputAdornment position='end'>
                          {field.icon || <EditOutlined />}
                        </InputAdornment>
                      ),
                  }}
                />
              )}
            </Grid>
          ))}
        </Grid>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 2,
          }}
        >
          <Button
            variant='contained'
            onClick={handleClose}
            startIcon={<Close />}
            sx={{
              py: 1,
              px: 3,
              textTransform: 'capitalize',
              borderRadius: '8px',
              backgroundColor: 'rgb(255, 77, 99)',
              '&:hover': { backgroundColor: 'rgb(200, 50, 70)' },
              fontSize: '0.875rem',
            }}
          >
            {mode === 'consultar' ? 'Cerrar' : 'Cancelar'}
          </Button>
          {mode !== 'consultar' && (
            <Button
              variant='contained'
              onClick={handleSubmit}
              startIcon={<Add />}
              sx={{
                py: 1,
                px: 3,
                textTransform: 'capitalize',
                borderRadius: '8px',
                backgroundColor: '#32169b',
                '&:hover': { backgroundColor: '#14005E' },
                fontSize: '0.875rem',
              }}
            >
              Guardar
            </Button>
          )}
        </Box>
      </Box>
    </DefaultModal>
  );
}
