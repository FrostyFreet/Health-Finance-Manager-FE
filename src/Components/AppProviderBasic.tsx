import { createTheme } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useMemo } from 'react';
import AccountMenu from './AccountMenu';
import { motion } from 'framer-motion';

const NAVIGATION: Navigation = [
  { kind: 'header', title: 'Menu' },
  { segment: 'overview', title: 'Overview', icon: <DashboardIcon /> },
  { segment: 'activity', title: 'Activity', icon: <TimelineIcon /> },
  { segment: 'workouts', title: 'Workouts', icon: <FitnessCenterIcon /> },
  { segment: 'reports', title: 'Reports', icon: <AssessmentIcon /> },
];

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0b0f14',
      paper: '#11151b',
    },
    primary: {
      main: '#b68663', // Rose gold / bronze for elegance
      light: '#d8b891',
      dark: '#8f6a4d',
      contrastText: '#071018',
    },
    secondary: { main: '#7fb6d5', contrastText: '#071018' },
    success: { main: '#3fc085' },
    warning: { main: '#f2b01e' },
    error: { main: '#e85c50' },
    info: { main: '#6fc3e8' },
    text: {
      primary: 'rgba(255,255,255,0.95)',
      secondary: 'rgba(255,255,255,0.85)',
    },
    divider: 'rgba(255,255,255,0.12)',
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Playfair Display", "Inter", serif', fontWeight: 700, fontSize: '2.75rem', letterSpacing: '0.5px' },
    h2: { fontFamily: '"Playfair Display", "Inter", serif', fontWeight: 700, fontSize: '2rem', letterSpacing: '0.4px' },
    h3: { fontWeight: 700 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.3px' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'radial-gradient(800px 400px at 10% 10%, rgba(127,182,213,0.02), transparent 10%), radial-gradient(600px 300px at 90% 85%, rgba(182,134,116,0.02), transparent 8%), #0b0f14',
          minHeight: '100vh',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#11151b',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#11151b',
          borderRight: '1px solid rgba(255,255,255,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: '#1a1f27',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(2,6,23,0.65)',
          transition: 'transform 220ms ease, box-shadow 220ms ease',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-6px) scale(1.02)',
            boxShadow: '0 24px 80px rgba(2,6,23,0.75)',
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundColor: '#1a1f27', backgroundImage: 'none' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 28, padding: '10px 18px' },
        containedPrimary: ({ theme }) => ({
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
          color: theme.palette.primary.contrastText,
          boxShadow: '0 6px 22px rgba(181,138,103,0.2)',
          transition: 'all 180ms ease',
          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(181,138,103,0.28)' },
        }),
        outlined: { borderColor: 'rgba(255,255,255,0.1)' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 10,
          background: '#1a1f27',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.light, borderWidth: 1.5 },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main, borderWidth: 1.6 },
        }),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { background: '#11151b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&.Mui-selected': { background: 'rgba(182,134,99,0.18)', borderLeft: `3px solid ${theme.palette.primary.main}` },
          '&:hover': { background: 'rgba(182,134,99,0.12)' },
        }),
      },
    },
  },
});

export default function AppProviderBasic() {
  const navigate = useNavigate();
  const location = useLocation();

  const router = useMemo(() => {
    return {
      pathname: location.pathname,
      searchParams: new URLSearchParams(location.search),
      navigate: (path: string | URL) => {
        const newPath = typeof path === 'string' ? path : path.pathname;
        navigate(newPath);
      },
    };
  }, [location, navigate]);

  return (
    <>
      <GlobalStyles
        styles={`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Playfair+Display:wght@400;700&display=swap');
          a { color: inherit; }
          .MuiListItem-root:hover { background: rgba(255,255,255,0.02) !important; }
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #b68663 0%, #8f6a4d 100%);
            border-radius: 10px;
          }
        `}
      />
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={theme}
        branding={{
          title: 'Finance & Health',
          logo: <FitnessCenterOutlinedIcon sx={{ color: 'primary.main', filter: 'drop-shadow(0 0 6px rgba(182,134,99,0.4))' }} />,
        }}
      >
        <DashboardLayout slots={{ toolbarAccount: AccountMenu }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Outlet />
          </motion.div>
        </DashboardLayout>
      </AppProvider>
    </>
  );
}
