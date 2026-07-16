import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard,
  EmojiEvents,
  Add,
  AccountBalanceWallet,
  AdminPanelSettings,
  Store, // NEW!
  Leaderboard as LeaderboardIcon, // NEW!
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { isAdmin, canCreateContest } from '../../utils/roles';

interface SideNavProps {
  open: boolean;
  onClose: () => void;
}

const drawerWidth = 240;

export const SideNav: React.FC<SideNavProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <Dashboard />, 
      path: '/dashboard', 
      show: true 
    },
    { 
      text: 'Contests', 
      icon: <EmojiEvents />, 
      path: '/contests', 
      show: true 
    },
    {
      text: 'Create Contest',
      icon: <Add />,
      path: '/contests/create',
      show: canCreateContest(user?.role),
    },
    { 
      text: 'Wallet', 
      icon: <AccountBalanceWallet />, 
      path: '/wallet', 
      show: true 
    },
    // NEW! Store Menu Item
    { 
      text: 'Store', 
      icon: <Store />, 
      path: '/store', 
      show: true 
    },
    // NEW! Leaderboard
    { 
      text: 'Leaderboard', 
      icon: <LeaderboardIcon />, 
      path: '/leaderboard', 
      show: true 
    },
    {
      text: 'Admin',
      icon: <AdminPanelSettings />,
      path: '/admin/departments',
      show: isAdmin(user?.role),
    },
    // NEW! Admin Store Management
    {
      text: 'Store Management',
      icon: <Store />,
      path: '/admin/store',
      show: isAdmin(user?.role),
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawer = (
    <>
      <Toolbar />
      <List>
        {menuItems
          .filter((item) => item.show)
          .map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};