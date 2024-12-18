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

const panelCards = [
  { icon: <LockOutlinedIcon fontSize='large' />, title: 'SSO', link: '/inicio' },
  { icon: <AssessmentOutlinedIcon fontSize='large' />, title: 'Indicadores', link: '/indicadores' },
  { icon: <SchoolOutlinedIcon fontSize='large' />, title: 'Edcore', link: '/edcore' },
];

export default function PanelCard() {
  const router = useRouter();
  const accessibleCards = panelCards;

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
                    fontFamily: 'MadaniArabic-Regular',
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
