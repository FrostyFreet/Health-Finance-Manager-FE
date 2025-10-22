import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Stack,
  Paper,
  Chip,
  Avatar,
  Fade,
  InputAdornment,
  TextField,
  useTheme,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimelineIcon from '@mui/icons-material/Timeline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import Pager from './Components/Pager';
import { useContext, useMemo, useState } from 'react';
import { IsLoggedInContext } from './App';
import { useQuery } from '@tanstack/react-query';
import {
  getAllExercises,
  getExerciseProgressByExerciseIdAndDateRange,
} from './API/ExercisesAPI';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

function aggregateProgressByDay(progressData: any[] = [], startDate?: Date, endDate?: Date) {
  if (!startDate || !endDate) return [];

  const map = new Map<string, number>();
  progressData.forEach((item) => {
    const d = new Date(item.workoutDate);
    if (d < startDate || d > endDate) return;
    const key = d.toISOString().split('T')[0];
    const existing = map.get(key) ?? 0;
    map.set(key, Math.max(existing, item.weight));
  });

  const result: { date: string; weight: number | null }[] = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    const key = current.toISOString().split('T')[0];
    result.push({ date: key, weight: map.get(key) ?? null });
    current.setDate(current.getDate() + 1);
  }
  return result;
}

export default function ReportsPage() {
  const theme = useTheme()
  const userContext = useContext(IsLoggedInContext);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [exerciseId, setExerciseId] = useState<string>('');
  const [exerciseName, setExerciseName] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [status, _] = useState<{ message: string; type: 'success' | 'error' }>();

  const { data: exerciseList } = useQuery({
    queryKey: ['exerciseList'],
    queryFn: () => getAllExercises(userContext!.access_token),
    enabled: !!userContext?.access_token,
  });

  const { data: progressData } = useQuery({
    queryKey: ['progressData', exerciseId, startDate, endDate],
    queryFn: () =>
      getExerciseProgressByExerciseIdAndDateRange(
        userContext!.access_token,
        exerciseId,
        startDate!,
        endDate!
      ),
    enabled: !!userContext?.access_token && !!exerciseId && !!startDate && !!endDate,
  });

  const pageSize = 5;
  const totalPages = exerciseList && Math.ceil(exerciseList.length / pageSize);
  const exerciseArray = exerciseList?.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) =>
    setCurrentPage(value);

  const chartData = useMemo(
    () => aggregateProgressByDay(progressData ?? [], startDate, endDate),
    [progressData, startDate, endDate]
  );

  // Calculate stats and check if we have enough data
  const { stats, hasEnoughData, uniqueWeights } = useMemo(() => {
    if (!chartData.length) return { stats: { max: 0, min: 0, avg: 0, improvement: 0 }, hasEnoughData: false, uniqueWeights: 0 };
    const weights = chartData.filter((d) => d.weight !== null).map((d) => d.weight as number);
    if (!weights.length) return { stats: { max: 0, min: 0, avg: 0, improvement: 0 }, hasEnoughData: false, uniqueWeights: 0 };
    
    // Check for at least 2 unique weight values
    const uniqueWeightSet = new Set(weights);
    const hasEnoughData = uniqueWeightSet.size >= 2;
    
    const max = Math.max(...weights);
    const min = Math.min(...weights);
    const avg = weights.reduce((a, b) => a + b, 0) / weights.length;
    const improvement = weights.length > 1 ? ((weights[weights.length - 1] - weights[0]) / weights[0]) * 100 : 0;
    
    return { 
      stats: { max, min, avg: Math.round(avg * 10) / 10, improvement: Math.round(improvement * 10) / 10 },
      hasEnoughData,
      uniqueWeights: uniqueWeightSet.size
    };
  }, [chartData]);

  const isDataReady = exerciseId && startDate && endDate;

   return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
          <InsertChartOutlinedIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Exercise Statistics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track your progress in the exercises
          </Typography>
        </Box>
      </Stack>

      {/* Status Message */}
      {status && (
        <Fade in={!!status}>
          <Paper
            sx={{
              p: 2,
              mb: 3,
              bgcolor: status.type === 'success' ? 'success.light' : 'error.light',
              color: status.type === 'success' ? 'success.dark' : 'error.dark',
            }}
          >
            <Typography>{status.message}</Typography>
          </Paper>
        </Fade>
      )}

      {/* Filters Card */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <FitnessCenterIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Filters
            </Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {/* Date Range */}
             <Grid sx={{xs:12, md:6}}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={startDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>

            <Grid sx={{xs:12, md:6}} >
              <TextField
                label="End Date"
                type="date"
                fullWidth
                value={endDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Not Enough Data Warning */}
      {isDataReady && !hasEnoughData && chartData.length > 0 && (
        <Fade in={true}>
          <Paper
            sx={{
              p: 3,
              mb: 4,
              bgcolor: 'warning.light',
              border: '1px solid',
              borderColor: 'warning.main',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: 'warning.main' }}>
                <InfoOutlinedIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold" color="warning.dark" gutterBottom>
                  Not enough data
                </Typography>
                <Typography variant="body2" color="warning.dark">
                  For the statistics and the graph you need atleast 2 different weight values.
                  Currently you have {uniqueWeights}. 
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Fade>
      )}

      {/* Stats Cards - Only show when we have enough data */}
      {isDataReady && hasEnoughData && chartData.length > 0 && (
        <Fade in timeout={300}>
          <Grid container spacing={3} mb={4}>
            <Grid sx={{xs:12, sm:6, md:3}}>
              <Card elevation={2}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Max Weight
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        {stats.max} kg
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <TrendingUpIcon />
                    </Avatar>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid sx={{xs:12, sm:6, md:3}} >
              <Card elevation={2}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Average Weight
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="info.main">
                        {stats.avg} kg
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'info.light' }}>
                      <TimelineIcon />
                    </Avatar>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid sx={{xs:12, sm:6, md:3}}>
              <Card elevation={2}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Minimum Weight
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="warning.main">
                        {stats.min} kg
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'warning.light' }}>
                      <FitnessCenterIcon />
                    </Avatar>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid sx={{xs:12, sm:6, md:3}}>
              <Card elevation={2}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Growth
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color={stats.improvement >= 0 ? 'success.main' : 'error.main'}
                      >
                        {stats.improvement > 0 ? '+' : ''}{stats.improvement}%
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: stats.improvement >= 0 ? 'success.light' : 'error.light' }}>
                      <CheckCircleOutlineIcon />
                    </Avatar>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Fade>
      )}

      {/* Chart Card - Only show when we have enough data */}
      {isDataReady && hasEnoughData && (
        <Card elevation={3} sx={{ mb: 4 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <TimelineIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">
                {exerciseName || 'Gyakorlat'} - Súly Progresszió
              </Typography>
            </Stack>
            <Divider sx={{ mb: 3 }} />

            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'} />
                <XAxis 
                  dataKey="date" 
                  stroke={theme.palette.mode === 'dark' ? '#888' : '#666'}
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  label={{ 
                    value: 'Weight (kg)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fill: theme.palette.mode === 'dark' ? '#888' : '#666' }
                  }}
                  stroke={theme.palette.mode === 'dark' ? '#888' : '#666'}
                  style={{ fontSize: '12px' }}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'rgba(255, 255, 255, 0.95)',
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#ccc'}`,
                    borderRadius: '8px',
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                  }}
                  labelStyle={{
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    color: theme.palette.mode === 'dark' ? '#888' : '#666',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorWeight)"
                  name="Weight (kg)"
                  connectNulls
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Exercise List */}
      <Card elevation={3}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <FitnessCenterIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Exercises
            </Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            {exerciseArray?.map((exercise: any) => (
              <Grid sx={{xs:12,sm:6, md:4}} key={exercise.id}>
                <Paper
                  elevation={exerciseId === exercise.id ? 8 : 1}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: exerciseId === exercise.id ? '2px solid' : '2px solid transparent',
                    borderColor: 'primary.main',
                    '&:hover': {
                      elevation: 4,
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => {
                    setExerciseId(exercise.id);
                    setExerciseName(exercise.name);
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: exerciseId === exercise.id ? 'primary.main' : 'grey.400' }}>
                      <FitnessCenterIcon />
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {exercise.name}
                      </Typography>
                      {exerciseId === exercise.id && (
                        <Chip
                          label="Kiválasztva"
                          size="small"
                          color="primary"
                          sx={{ mt: 0.5 }}
                        />
                      )}
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {totalPages && totalPages > 1 && (
            <Box mt={3}>
              <Pager page={currentPage} numberOfPages={totalPages} onChange={handlePageChange} />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}