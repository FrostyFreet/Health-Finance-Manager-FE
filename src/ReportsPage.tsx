import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
} from '@mui/material';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';

export default function ReportsPage() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review your progress across exercises and workouts.
          </Typography>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="report-exercise-label">Exercise</InputLabel>
              <Select labelId="report-exercise-label" label="Exercise" value="">
                <MenuItem value="">All Exercises</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="report-muscle-label">Muscle Group</InputLabel>
              <Select labelId="report-muscle-label" label="Muscle Group" value="">
                <MenuItem value="">All Muscle Groups</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="report-period-label">Time Range</InputLabel>
              <Select labelId="report-period-label" label="Time Range" value="">
                <MenuItem value="">Last 30 Days</MenuItem>
                <MenuItem value="60">Last 60 Days</MenuItem>
                <MenuItem value="90">Last 90 Days</MenuItem>
              </Select>
            </FormControl>
            <ToggleButtonGroup size="small" value="volume" exclusive sx={{ ml: { md: 'auto' } }}>
              <ToggleButton value="volume">Total Volume</ToggleButton>
              <ToggleButton value="sets">Total Sets</ToggleButton>
              <ToggleButton value="duration">Duration</ToggleButton>
            </ToggleButtonGroup>
            <Button variant="outlined" startIcon={<FilterListIcon />} sx={{ borderRadius: 2 }}>
              Clear Filters
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={1}>
        {[ 'Total Workouts', 'Total Sets', 'Avg Duration' ].map(label => (
          <Grid key={label} size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {label}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  —
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Compared to previous period
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Workout Volume Trend
                </Typography>
                <InsertChartOutlinedIcon color="primary" />
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Paper
                variant="outlined"
                sx={{
                  height: 280,
                  borderStyle: 'dashed',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                }}
              >
                Chart placeholder
              </Paper>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Top Exercises by Volume
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                {[1, 2, 3].map(idx => (
                  <Paper
                    key={idx}
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Box>
                      <Typography fontWeight="bold">Exercise Name</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Volume — kg • Sets —
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      —
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tables */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Exercise Breakdown
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  p: 3,
                  color: 'text.secondary',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr',
                  columnGap: 2,
                  rowGap: 1,
                  '& > span': { fontSize: 14 }
                }}
              >
                <span><strong>Workout</strong></span>
                <span><strong>Exercise</strong></span>
                <span><strong>Sets</strong></span>
                <span><strong>Best Weight</strong></span>
                <span>—</span>
                <span>—</span>
                <span>—</span>
                <span>—</span>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}