import { Box, Typography } from '@mui/material';

export default function UpdateDate() {
  const currentDate = new Date();
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const formattedDate = `${currentDate.getDate()} de 
  ${monthNames[currentDate.getMonth()]} de ${currentDate.getFullYear()}`;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        right: 32,
        textAlign: 'right',
      }}
    >
      <Typography
        variant='body1'
        sx={{ userSelect: 'none' }}
      >
        Actualización:
        {' '}
        {formattedDate}
      </Typography>
    </Box>
  );
}
