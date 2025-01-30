import { Paper, Typography } from '@mui/material';
import { TableRoles } from '@/app/components/roles';
import { BottomActionButtons } from '@/app/shared/common/Buttons';
import UpdateDate from '@/app/shared/utils/UpdateDate';

export default function RolesPage() {
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
        Roles
      </Typography>
      <TableRoles />
      <BottomActionButtons />
    </Paper>
  );
}
