import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
} from '@mui/material';
import {
  EmojiEvents,
  Add,
  AccountBalanceWallet,
  AdminPanelSettings,
  Store,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { isAdmin, canCreateContest } from '../utils/roles';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickLinks = [

    {
  title: 'Store',
  description: 'Browse and buy items with your coins',
  icon: <Store sx={{ fontSize: 40 }} />,
  path: '/store',
  show: true,
},

{
      title: 'Admin store',
      description: 'Manage departments and system settings',
      icon: <AdminPanelSettings sx={{ fontSize: 40 }} />,
      path: '/admin/store',
      show: isAdmin(user?.role),
    },


    {
      title: 'Contests',
      description: 'Browse and participate in coding contests',
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      path: '/contests',
      show: true,
    },
    {
      title: 'Create Contest',
      description: 'Create a new coding contest',
      icon: <Add sx={{ fontSize: 40 }} />,
      path: '/contests/create',
      show: canCreateContest(user?.role),
    },
    {
      title: 'Wallet',
      description: 'Manage your wallet and transactions',
      icon: <AccountBalanceWallet sx={{ fontSize: 40 }} />,
      path: '/wallet',
      show: true,
    },
    {
      title: 'Admin Panel',
      description: 'Manage departments and system settings',
      icon: <AdminPanelSettings sx={{ fontSize: 40 }} />,
      path: '/admin/departments',
      show: isAdmin(user?.role),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name}!
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            <strong>Role:</strong>{' '}
            <Chip label={user?.role} color="primary" size="small" />
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Department:</strong> {user?.department}
          </Typography>
        </Box>
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Quick Links
      </Typography>

      <Grid container spacing={3}>
        {quickLinks
          .filter((link) => link.show)
          .map((link) => (
            <Grid item xs={12} sm={6} md={4} key={link.title}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    {link.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom align="center">
                    {link.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {link.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate(link.path)}
                    fullWidth
                    sx={{ mx: 2 }}
                  >
                    Go
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};