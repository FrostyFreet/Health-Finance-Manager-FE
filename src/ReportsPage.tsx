// typescript
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
  Input,
  Avatar,
  LinearProgress,
  Fade,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimelineIcon from '@mui/icons-material/Timeline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import Pager from './Components/Pager';
import { useContext, useEffect, useMemo, useState } from 'react';
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

function formatLocalDateTime(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  // returns e.g. "2025-01-01T00:00:00" (no trailing Z)
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

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
  const userContext = useContext(IsLoggedInContext);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [exerciseId, setExerciseId] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' }>();

  const { data: exerciseList } = useQuery({
    queryKey: ['exerciseList'],
    queryFn: () => getAllExercises(userContext!.access_token),
    enabled: !!userContext?.access_token,
  });

  const formattedStart = startDate ? formatLocalDateTime(startDate) : undefined;
  const formattedEnd = endDate ? formatLocalDateTime(endDate) : undefined;

  const { data: progressData } = useQuery({
    queryKey: ['progressData', exerciseId, formattedStart, formattedEnd],
    queryFn: () =>
      getExerciseProgressByExerciseIdAndDateRange(
        userContext!.access_token,
        exerciseId,
        formattedStart!,
        formattedEnd!
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
  useEffect(()=>{
    console.log(progressData);
    
  },[progressData])

  // Calculate stats
  const stats = useMemo(() => {
    if (!chartData.length) return { max: 0, min: 0, avg: 0, improvement: 0 };
    const weights = chartData.filter((d) => d.weight !== null).map((d) => d.weight as number);
    if (!weights.length) return { max: 0, min: 0, avg: 0, improvement: 0 };
    
    const max = Math.max(...weights);
    const min = Math.min(...weights);
    const avg = weights.reduce((a, b) => a + b, 0) / weights.length;
    const improvement = weights.length > 1 ? ((weights[weights.length - 1] - weights[0]) / weights[0]) * 100 : 0;
    
    return { max, min, avg: Math.round(avg * 10) / 10, improvement: Math.round(improvement * 10) / 10 };
  }, [chartData]);

  const isDataReady = exerciseId && startDate && endDate;

  return (
    <Box sx={{ p: { xs: 3, md: 6 } }}>
      {/* Hero Header */}
      <Box
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 5,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={3} mb={2}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 72, height: 72 }}>
              <TimelineIcon fontSize="large" sx={{ fontSize: 40 }} />
            </Avatar>
            <Box>
              <Typography variant="h2" fontWeight="bold" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
                Progress Reports
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
                Track your journey, visualize your growth
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.1)',
          }}
        />
      </Box>

      <Grid container spacing={4}>
        {/* Left Panel - Exercise Selection */}
        <Grid sx={{xs:12, lg:4}}>
          <Stack spacing={4}>
            {/* Step 1 Card */}
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 15px 60px rgba(0,0,0,0.2)',
                  transform: 'translateY(-6px)',
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2.5} mb={3}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                    <Typography variant="h5" fontWeight="bold">1</Typography>
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      Choose Exercise
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                      Select from your workout library
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Stack spacing={2}>
                  {userContext ? (
                    <>
                      {exerciseArray?.length ? (
                        exerciseArray.map((ex: any) => (
                          <Paper
                            key={ex.id}
                            onClick={() => {
                              setExerciseId(ex.id);
                            }}
                            sx={{
                              p: 3,
                              borderRadius: 3,
                              cursor: 'pointer',
                              border: '2px solid',
                              borderColor: exerciseId === ex.id ? 'primary.main' : 'transparent',
                              bgcolor: exerciseId === ex.id ? 'primary.light' : 'background.paper',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                borderColor: 'primary.main',
                                transform: 'scale(1.03)',
                              },
                            }}
                          >
                            <Stack direction="row" alignItems="center" spacing={2.5}>
                              <Avatar
                                sx={{
                                  bgcolor: exerciseId === ex.id ? 'primary.main' : 'action.hover',
                                  width: 35,
                                  height: 35,
                                }}
                              >
                                <FitnessCenterIcon />
                              </Avatar>
                              <Typography
                                variant="h6"
                                fontWeight={exerciseId === ex.id ? 'bold' : 'medium'}
                                sx={{ flex: 1 }}
                              >
                                {ex.title ?? ex.name}
                              </Typography>
                              {exerciseId === ex.id && (
                                <CheckCircleOutlineIcon color="primary" sx={{ fontSize: 22 }} />
                              )}
                            </Stack>
                          </Paper>
                        ))
                      ) : (
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 4,
                            borderRadius: 3,
                            textAlign: 'center',
                            borderStyle: 'dashed',
                          }}
                        >
                          <Typography variant="h6" color="text.secondary">No exercises available</Typography>
                        </Paper>
                      )}
                      {totalPages && totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2}}>
                          <Pager numberOfPages={totalPages} page={currentPage} onChange={handlePageChange} />
                        </Box>
                      )}
                    </>
                  ) : (
                    ['Back Squat', 'Bench Press', 'Deadlift', 'Overhead Press', 'Row'].map((label) => (
                      <Chip
                        key={label}
                        label={label}
                        icon={<FitnessCenterIcon />}
                        variant="outlined"
                        sx={{ borderRadius: 3, p: 2, fontSize: '1rem' }}
                      />
                    ))
                  )}
                </Stack>
              </CardContent>
            </Card>

            
          </Stack>
        </Grid>

        {/* Right Panel - Chart and Stats */}
        <Grid sx={{xs:12, lg:8}} >
          <Stack spacing={4}>
            {/* Stats Cards */}
            {isDataReady && chartData.length > 0 && (
              <Grid container spacing={3}>
                <Grid sx={{xs:6, sm:3}}>
                  <Card sx={{ borderRadius: 3, bgcolor: 'primary.dark', color: 'white' }}>
                    <CardContent sx={{ p: 3 }}>
                      <TrendingUpIcon sx={{ mb: 2, opacity: 0.8, fontSize: 40 }} />
                      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                        {stats.max} kg
                      </Typography>
                      <Typography variant="body1">Peak Weight</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid sx={{xs:6, sm:3}} >
                  <Card sx={{ borderRadius: 3, bgcolor: 'info.dark', color: 'white' }}>
                    <CardContent sx={{ p: 3 }}>
                      <InsertChartOutlinedIcon sx={{ mb: 2, opacity: 0.8, fontSize: 40 }} />
                      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                        {stats.avg} kg
                      </Typography>
                      <Typography variant="body1">Average</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid sx={{xs:6, sm:3}}>
                  <Card sx={{ borderRadius: 3, bgcolor: 'warning.dark', color: 'white' }}>
                    <CardContent sx={{ p: 3 }}>
                      <TimelineIcon sx={{ mb: 2, opacity: 0.8, fontSize: 40 }} />
                      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                        {stats.min} kg
                      </Typography>
                      <Typography variant="body1">Starting</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid sx={{xs:6, sm:3}}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      bgcolor: stats.improvement >= 0 ? 'success.dark' : 'error.dark',
                      color: 'white',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <TrendingUpIcon sx={{ mb: 2, opacity: 0.8, fontSize: 40 }} />
                      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                        {stats.improvement > 0 ? '+' : ''}
                        {stats.improvement}%
                      </Typography>
                      <Typography variant="body1">Growth</Typography>
                    </CardContent>
                  </Card>
                </Grid>
        
              </Grid>
            )}

            {/* Date Selection and Chart Row */}
            <Grid container spacing={4}>
              {/* Step 2 Card - Date Selection */}
              <Grid sx={{xs:12, md:4}}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" alignItems="center" spacing={2.5} mb={3}>
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
                        <Typography variant="h5" fontWeight="bold">2</Typography>
                      </Avatar>
                      <Box>
                        <Typography variant="h5" fontWeight="bold">
                          Select Period
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                          Define your time range
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Stack spacing={3}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          bgcolor: 'background.default',
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                          <CalendarMonthIcon color="primary" sx={{ fontSize: 28 }} />
                          <Typography variant="h6" fontWeight="bold">
                            Start Date
                          </Typography>
                        </Stack>
                        <Input
                          type="date"
                          fullWidth
                          value={startDate ? startDate.toISOString().split('T')[0] : ''}
                          onChange={(e) =>
                            setStartDate(e.target.value ? new Date(e.target.value) : undefined)
                          }
                          sx={{ fontSize: '1.1rem', py: 1 }}
                        />
                      </Paper>

                      <Paper
                        variant="outlined"
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          bgcolor: 'background.default',
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                          <CalendarMonthIcon color="secondary" sx={{ fontSize: 28 }} />
                          <Typography variant="h6" fontWeight="bold">
                            End Date
                          </Typography>
                        </Stack>
                        <Input
                          type="date"
                          fullWidth
                          value={endDate ? endDate.toISOString().split('T')[0] : ''}
                          onChange={(e) => {
                            const value = e.target.value ? new Date(e.target.value) : undefined;
                            if (value && startDate && value < startDate) {
                              setStatus({
                                message: "You can't set the endDate before startDate",
                                type: 'error',
                              });
                            } else {
                              setStatus(undefined);
                            }
                            setEndDate(value);
                          }}
                          sx={{ fontSize: '1.1rem', py: 1 }}
                        />
                      </Paper>
                    </Stack>

                    {status && (
                      <Fade in={!!status}>
                        <Paper
                          sx={{
                            mt: 3,
                            p: 2.5,
                            borderRadius: 3,
                            bgcolor: status.type === 'error' ? 'error.dark' : 'success.dark',
                            color: 'white',
                          }}
                        >
                          <Typography variant="body1" textAlign="center" fontWeight="medium">
                            {status.message}
                          </Typography>
                        </Paper>
                      </Fade>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Main Chart Card */}
              <Grid sx={{xs:12, md:8}}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          Progress Timeline
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                          {startDate && endDate
                            ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
                            : 'Select dates to view progress'}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: 'primary.light', width: 64, height: 64 }}>
                        <InsertChartOutlinedIcon color="primary" sx={{ fontSize: 36 }} />
                      </Avatar>
                    </Stack>

                    {isDataReady && <LinearProgress sx={{ mb: 3, borderRadius: 2, height: 8 }} />}

                    <Divider sx={{ my: 3 }} />

                    <Box
                      sx={{
                        height: 400,
                        borderRadius: 3,
                        p: 3,
                        bgcolor: 'background.default',
                        border: '2px dashed',
                        borderColor: isDataReady ? 'primary.main' : 'divider',
                      }}
                    >
                      {!isDataReady ? (
                        <Stack
                          alignItems="center"
                          justifyContent="center"
                          spacing={3}
                          sx={{ height: '100%' }}
                        >
                          <Avatar sx={{ width: 100, height: 100, bgcolor: 'action.hover' }}>
                            <InsertChartOutlinedIcon sx={{ fontSize: 50 }} color="disabled" />
                          </Avatar>
                          <Box textAlign="center">
                            <Typography variant="h5" color="text.secondary" gutterBottom fontWeight="bold">
                              Ready to Analyze
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                              Complete steps 1 & 2 to visualize your progress
                            </Typography>
                          </Box>
                        </Stack>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#667eea" stopOpacity={0.1} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis
                              dataKey="date"
                              tickFormatter={(value) =>
                                new Date(value).toLocaleDateString('en-US', {
                                  day: '2-digit',
                                  month: 'short',
                                })
                              }
                              tick={{ fill: '#999', fontSize: 14 }}
                            />
                            <YAxis
                              tickFormatter={(value) => `${value} kg`}
                              tick={{ fill: '#999', fontSize: 14 }}
                              label={{
                                value: 'Weight (kg)',
                                angle: -90,
                                position: 'insideLeft',
                                fill: '#999',
                                fontSize: 16,
                              }}
                            />
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor: '#1e1e1e',
                                border: '1px solid #667eea',
                                borderRadius: 12,
                                padding: 16,
                              }}
                              labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}
                              formatter={(value: any) => [`${value} kg`, 'Weight']}
                            />
                            <Legend iconSize={20} wrapperStyle={{ fontSize: 16 }} />
                            <Area
                              type="monotone"
                              dataKey="weight"
                              name="Weight"
                              stroke="#667eea"
                              strokeWidth={4}
                              fill="url(#colorWeight)"
                              dot={{ r: 6, fill: '#667eea', strokeWidth: 3, stroke: '#fff' }}
                              activeDot={{ r: 8, stroke: '#764ba2', strokeWidth: 4 }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
