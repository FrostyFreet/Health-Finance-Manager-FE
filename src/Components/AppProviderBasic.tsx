
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';

import DashboardContent from '../DashBoardContent';
import { useLocation, useNavigate } from 'react-router';
import { useMemo } from 'react';
import WorkoutsPage from '../WorkoutsPage';
import ReportsPage from '../ReportsPage';
import ActivityPage from '../ActivityPage';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Menu items',
  },
  {
    segment: 'overview',
    title: 'Overview',
    icon: <DashboardIcon />,
  },
  {
    segment: 'activity',
    title: 'Activity',
    icon: <TimelineIcon />,
  },
  {
    segment: 'workouts',
    title: 'Workouts',
    icon: <FitnessCenterIcon />,
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <AssessmentIcon />,
  },
];

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    mode: 'dark',
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    primary: {
      main: '#8b5cf6',
    },
  },
});


export default function AppProviderBasic() {
   const navigate = useNavigate()
   const location = useLocation()

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

  const renderContent = () => {
    switch (location.pathname) {
      case '/overview':
        return <DashboardContent />;
      case '/activity':
        return <ActivityPage/>;
      case '/workouts':
        return <WorkoutsPage/>;
      case '/reports':
        return <ReportsPage/>;
      default:
        return <DashboardContent />;
    }
  };
  
  return (
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={theme}
        branding={{
            title:"Finance & Health Manager",
            logo: <FitnessCenterOutlinedIcon />,
        }}
      >
        <DashboardLayout>
           {renderContent()}

        </DashboardLayout>
      </AppProvider>
  );
}
