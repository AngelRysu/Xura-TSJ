import { Paper, Typography } from '@mui/material';
import { TableAplicaciones } from '@/app/components/aplicaciones';
import { BottomActionButtons } from '@/app/shared/common';
import UpdateDate from '@/app/shared/utils/UpdateDate';

export default function AplicacionesPage() {
  return (
    <Paper elevation={3} sx={{ width: '100%', padding: 4, position: 'relative' }}>
      <UpdateDate />
      <Typography
        variant='h4'
        component='h1'
        gutterBottom
        align='left'
        sx={{ userSelect: 'none' }}
      >
        Aplicaciones
      </Typography>
      <TableAplicaciones />
      <BottomActionButtons />
    </Paper>
  );
}
