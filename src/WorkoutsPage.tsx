import { Box, Card, CardContent, Typography, Avatar, Chip, IconButton, Button, Menu, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TimerIcon from '@mui/icons-material/Timer';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createWorkout, deleteWorkoutById, getAllWorkouts } from './API/WorkoutsAPI';
import { IsLoggedInContext } from './App';
import CreateWorkoutModal from './Components/CreateWorkoutModal';
import { useNavigate } from 'react-router';

const workouts = [
  {
    id: 1,
    title: 'Upper Body Strength',
    createdAt: '2024-10-08',
    duration: 45,
    numberOfExercises: 8,
    color: '#8b5cf6',
    completed: true,
  },
  {
    id: 2,
    title: 'HIIT Cardio Session',
    createdAt: '2024-10-07',
    duration: 30,
    numberOfExercises: 6,
    color: '#ef4444',
    completed: true,
  },
  {
    id: 3,
    title: 'Leg Day - Heavy',
    createdAt: '2024-10-06',
    duration: 60,
    numberOfExercises: 10,
    color: '#8b5cf6',
    completed: true,
  },
  {
    id: 4,
    title: 'Yoga & Stretching',
    createdAt: '2024-10-05',
    duration: 40,
    numberOfExercises: 12,
    color: '#10b981',
    completed: true,
  },
  {
    id: 5,
    title: 'Full Body Circuit',
    createdAt: '2024-10-04',
    duration: 50,
    numberOfExercises: 9,
    color: '#f59e0b',
    completed: true,
  },
  {
    id: 6,
    title: 'Core & Abs Blast',
    createdAt: '2024-10-03',
    duration: 25,
    numberOfExercises: 7,
    color: '#06b6d4',
    completed: true,
  },
];

const getCurrentWeek = ()=>{
  let curr = new Date();
  let week = [];

  for (let i = 1; i <= 7; i++) {
    let first = curr.getDate() - curr.getDay() + i;
    let day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
    week.push(day);
  }
  return week
}

const getWorkoutsThisWeek = (workouts: any[], currentWeek: string[]) => {
  return workouts.filter((workout) => {
    const workoutDate = new Date(workout.createdAt).toISOString().slice(0, 10); 
    return currentWeek.includes(workoutDate); 
  }).length; 
};

export default function WorkoutsPage() {
  const navigate = useNavigate()
  const userContext = useContext(IsLoggedInContext)
  const { data: workoutsList, refetch } = useQuery({
    queryKey: ['workoutData'],
    queryFn: () => getAllWorkouts(userContext!.access_token),
    enabled: !!userContext?.access_token,
  });
  
 
  const workoutItems = userContext
    ? Array.isArray(workoutsList) ? workoutsList : []
    : workouts;

  const totalWorkouts = userContext ? workoutItems.length : undefined;
  const totalDuration = userContext ? workoutItems.reduce((sum: number, w: any) => sum + (w.duration ?? 0), 0) : undefined;
  const averageDuration = totalWorkouts && totalWorkouts > 0 ? `${Math.round(totalDuration! / totalWorkouts)} min` : userContext ? 0 : '42 min';
  const workoutsThisWeek = userContext ? getWorkoutsThisWeek(workoutItems, getCurrentWeek()) : 6;

  const stats = [
    { label: 'Total Workouts', value: userContext ? totalWorkouts ?? 0 : 24, icon: <FitnessCenterIcon /> },
    { label: 'Avg Duration', value: averageDuration, icon: <TimerIcon /> },
    { label: 'This Week', value: userContext ? workoutsThisWeek : 6, icon: <TrendingUpIcon /> },
  ];
  
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null);
  const [selectedWorkoutTitle, setSelectedWorkoutTitle] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateWorkout = async (formData: { title: string; duration: number }) => {
    try {
      await createWorkout(userContext!.access_token, formData)
      setIsModalOpen(false)
      refetch()
    } catch (error) {
      return error
    }
  };
  const handleDeleteWorkout = async ()=>{
    try {
      await deleteWorkoutById(userContext?.access_token!, selectedWorkoutId!)
      refetch()
    }
    catch (error) {
      return error
    }

  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, workoutId: number,workoutTitle:string) => {
    setAnchorEl(event.currentTarget);
    setSelectedWorkoutId(workoutId);
    setSelectedWorkoutTitle(workoutTitle)
  };
  
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedWorkoutId(null);
  };

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
          onClick={() => setIsModalOpen(true)}
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
        <CreateWorkoutModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateWorkout}
        />
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
      {userContext ? (
        workoutsList && workoutsList.length > 0 ? (
          workoutsList.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((workout: any) => (
            <Grid size={{ xs: 12, md: 6 }} key={workout.id}>
              <Card
                onClick={() => {
                  navigate(`/workout/${workout.title}`, {
                    state: { title: workout.title, id: workout.id },
                  });
                  setSelectedWorkoutTitle(workout.title);
                }}
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
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: workout.color, width: 48, height: 48 }}>
                        <FitnessCenterIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {workout.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(workout.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick(e, workout.id, workout.title);
                      }}
                      sx={{
                        '&:hover': {
                          bgcolor: 'rgba(139, 92, 246, 0.1)',
                        },
                      }}
                    >
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
                      label={`${workout.numberOfExercises} exercises`}
                      size="small"
                      sx={{ bgcolor: 'background.paper' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ m: 2 }}>
            No workouts yet
          </Typography>
        )
      ) : (
        workouts.map((workout: any) => (
          <Grid size={{ xs: 12, md: 6 }} key={workout.id}>
            <Card
              onClick={() => {
                navigate(`/workout/${workout.title}`, {
                  state: { title: workout.title, id: workout.id },
                });
                setSelectedWorkoutTitle(workout.title);
              }}
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
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: workout.color, width: 48, height: 48 }}>
                      <FitnessCenterIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {workout.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(workout.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(e, workout.id, workout.title);
                    }}
                    sx={{
                      '&:hover': {
                        bgcolor: 'rgba(139, 92, 246, 0.1)',
                      },
                    }}
                  >
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
                    label={`${workout.numberOfExercises} exercises`}
                    size="small"
                    sx={{ bgcolor: 'background.paper' }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  </CardContent>
</Card>


      {/* Menu Component */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              minWidth: 180,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            }
          }
        }}
      >
        <MenuItem 
          onClick={()=> {navigate(`/workout/${selectedWorkoutTitle}`, {state: { title: selectedWorkoutTitle, id:selectedWorkoutId }})}}
          sx={{
            gap: 1.5,
            py: 1.5,
            '&:hover': {
              bgcolor: 'rgba(139, 92, 246, 0.1)',
            }
          }}
        >
          <EditIcon sx={{ fontSize: 20, color: 'primary.main' }} />
          <Typography variant="body2">Edit Workout</Typography>
        </MenuItem>

        <MenuItem 
          sx={{
            gap: 1.5,
            py: 1.5,
            '&:hover': {
              bgcolor: 'rgba(139, 92, 246, 0.1)',
            }
          }}
        >
          <ShareIcon sx={{ fontSize: 20, color: 'info.main' }} />
          <Typography variant="body2">Share</Typography>
        </MenuItem>
        <MenuItem
            onClick={async () => {
              if (selectedWorkoutId !== null) {
                await handleDeleteWorkout();
                handleClose(); 
              }
            }}
            sx={{
              gap: 1.5,
              py: 1.5,
              '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' },
            }}
          >
            <DeleteIcon sx={{ fontSize: 20, color: 'error.main' }} />
            <Typography variant="body2" color="error.main">
              Delete
            </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}