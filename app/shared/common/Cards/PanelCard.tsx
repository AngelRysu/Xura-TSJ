'use client';

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { usePermissions } from '@/app/context/PermissionsContext';

const panelCards = [
  {
    id: '1',
    icon: <LockOutlinedIcon fontSize='large' />,
    title: 'SSO',
    link: '/inicio',
  },
  {
    id: '3',
    icon: <AssessmentOutlinedIcon fontSize='large' />,
    title: 'Indicadores',
    link: '/data',
  },
  {
    id: '4',
    icon: <SchoolOutlinedIcon fontSize='large' />,
    title: 'Edcore',
    link: 'https://edcore.tecmm.mx/',
  },
];

export default function PanelCard() {
  const router = useRouter();
  const { hasApplicationAccess } = usePermissions();

  const accessibleCards = panelCards.filter((card) => hasApplicationAccess(card.id));

  const handleNavigation = (link: string) => {
    router.push(link);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        width: '100%',
      }}
    >
      <Grid
        container
        spacing={3}
        justifyContent='center'
        sx={{ maxWidth: 900 }}
      >
        {accessibleCards.map((card) => (
          <Grid
            item
            xs={accessibleCards.length === 1 ? 12 : 6}
            md={accessibleCards.length === 3 ? 4 : 6}
            key={card.title}
          >
            <Card
              elevation={3}
              onClick={() => handleNavigation(card.link)}
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  height: 200,
                }}
              >
                <Box sx={{ mb: 1, color: '#444' }}>{card.icon}</Box>
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: '500',
                    color: 'text.primary',
                  }}
                >
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
