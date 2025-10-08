import { Box, Card, CardContent, Typography, Avatar, Chip, IconButton, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TimerIcon from '@mui/icons-material/Timer';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Sample workout data
const workouts = [
  {
    id: 1,
    name: 'Upper Body Strength',
    date: '2024-10-08',
    duration: 45,
    calories: 320,
    exercises: 8,
    type: 'Strength',
    color: '#8b5cf6',
    completed: true,
  },
  {
    id: 2,
    name: 'HIIT Cardio Session',
    date: '2024-10-07',
    duration: 30,
    calories: 450,
    exercises: 6,
    type: 'Cardio',
    color: '#ef4444',
    completed: true,
  },
  {
    id: 3,
    name: 'Leg Day - Heavy',
    date: '2024-10-06',
    duration: 60,
    calories: 380,
    exercises: 10,
    type: 'Strength',
    color: '#8b5cf6',
    completed: true,
  },
  {
    id: 4,
    name: 'Yoga & Stretching',
    date: '2024-10-05',
    duration: 40,
    calories: 150,
    exercises: 12,
    type: 'Flexibility',
    color: '#10b981',
    completed: true,
  },
  {
    id: 5,
    name: 'Full Body Circuit',
    date: '2024-10-04',
    duration: 50,
    calories: 420,
    exercises: 9,
    type: 'Mixed',
    color: '#f59e0b',
    completed: true,
  },
  {
    id: 6,
    name: 'Core & Abs Blast',
    date: '2024-10-03',
    duration: 25,
    calories: 180,
    exercises: 7,
    type: 'Core',
    color: '#06b6d4',
    completed: true,
  },
];

const stats = [
  { label: 'Total Workouts', value: '24', change: '+12%', icon: <FitnessCenterIcon /> },
  { label: 'Avg Duration', value: '42 min', change: '+5%', icon: <TimerIcon /> },
  { label: 'This Week', value: '6', change: '+2', icon: <TrendingUpIcon /> },
];

export default function WorkoutsPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            My Workouts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track and manage your fitness journey
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' },
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
          }}
        >
          New Workout
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Chip
                      label={stat.change}
                      size="small"
                      sx={{
                        mt: 1,
                        bgcolor: 'rgba(139, 92, 246, 0.1)',
                        color: 'primary.main',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(139, 92, 246, 0.1)', color: 'primary.main' }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Workouts List */}
      <Card sx={{ bgcolor: 'background.paper', borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Recent Workouts
          </Typography>
          <Grid container spacing={2}>
            {workouts.map((workout) => (
              <Grid size={{ xs: 12, md: 6 }} key={workout.id}>
                <Card
                  sx={{
                    bgcolor: 'background.default',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Avatar sx={{bgcolor: workout.color, width: 48,height: 48}}>
                          <FitnessCenterIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {workout.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(workout.date)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Chip
                        icon={<TimerIcon sx={{ fontSize: 16 }} />}
                        label={`${workout.duration} min`}
                        size="small"
                        sx={{ bgcolor: 'background.paper' }}
                      />
                      <Chip
                        icon={<LocalFireDepartmentIcon sx={{ fontSize: 16 }} />}
                        label={`${workout.calories} cal`}
                        size="small"
                        sx={{ bgcolor: 'background.paper' }}
                      />
                      <Chip
                        label={`${workout.exercises} exercises`}
                        size="small"
                        sx={{ bgcolor: 'background.paper' }}
                      />
                      <Chip
                        label={workout.type}
                        size="small"
                        sx={{
                          bgcolor: `${workout.color}20`,
                          color: workout.color,
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}