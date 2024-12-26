import { Paper, Typography } from '@mui/material';
import { TableGrupos } from '@/app/components/grupos';
import { BottomActionButtons } from '@/app/shared/common/Buttons';

export default function GruposPage() {
  return (
    <Paper elevation={3} sx={{ width: '100%', padding: 4 }}>
      <Typography
        variant='h4'
        component='h1'
        gutterBottom
        align='left'
        sx={{
          fontFamily: 'MadaniArabic-Regular',
        }}
      >
        Grupos
      </Typography>
      <TableGrupos />
      <BottomActionButtons />
    </Paper>
  );
}
