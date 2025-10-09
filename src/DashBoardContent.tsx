import { Box, Card, CardContent, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import Grid from '@mui/material/Grid';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const activityData = [
  { month: 'Jan', value: 65 },
  { month: 'Feb', value: 68 },
  { month: 'Mar', value: 70 },
  { month: 'Apr', value: 72 },
  { month: 'May', value: 75 },
  { month: 'Jun', value: 78 },
  { month: 'Jul', value: 95 },
  { month: 'Aug', value: 88 },
  { month: 'Sep', value: 92 },
  { month: 'Oct', value: 98 },
  { month: 'Nov', value: 85 },
  { month: 'Dec', value: 90 },
];

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 1, border: '1px solid #333' }}>
        <Typography variant="body2">{payload[0].payload.month}</Typography>
        <Typography variant="body2" color="primary.main" fontWeight="bold">
          {payload[0].value}%
        </Typography>
      </Box>
    );
  }
  return null;
};

export default function DashboardContent() {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Overview Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Overview</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <Box sx={{ 
                    width: 150, 
                    height: 150, 
                    borderRadius: '50%', 
                    border: '8px solid', 
                    borderColor: 'primary.main',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0) 100%)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <Typography variant="h4" fontWeight="bold">+23%</Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">vs last month</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Activity */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ bgcolor: 'primary.main', borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Today's activity</Typography>
              <Typography variant="h3" fontWeight="bold">30</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Minutes</Typography>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h5" sx={{ mb: 1 }} fontWeight="bold">Push Workout</Typography>
                <Typography variant="body2" sx={{ mb: 1, ml:1 }}>🏋️ Squats - 10 reps</Typography>
                <Typography variant="body2" sx={{ mb: 1, ml:1 }}>🦵 Low lungs - 8 reps</Typography>
                <Typography variant="body2" sx= {{ ml:1 }} >🪢 Batting rope - 20 reps</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Past Activity */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Your Latest Activities</Typography>
                <Typography variant="body2" color="primary.main" sx={{ cursor: 'pointer' }}>View all</Typography>
              </Box>
              <List sx={{ p: 0 }}>
                <ListItem sx={{ px: 0, py: 1.5, borderRadius: 2, '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.05)' } }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>U</Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={<Typography fontWeight="bold">Ultimate body workout</Typography>}
                    secondary="17 Feb, 2022 at 3:30 PM" 
                  />
                  <Typography fontWeight="bold" color="primary.main">$12,700/m</Typography>
                </ListItem>
                <ListItem sx={{ px: 0, py: 1.5, borderRadius: 2, '&:hover': { bgcolor: 'rgba(255, 152, 0, 0.05)' } }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>B</Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={<Typography fontWeight="bold">Beginner to advance gym</Typography>}
                    secondary="18 Feb, 2022 at 3:30 PM" 
                  />
                  <Typography fontWeight="bold" color="warning.main">$12,700/m</Typography>
                </ListItem>
                <ListItem sx={{ px: 0, py: 1.5, borderRadius: 2, '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.05)' } }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'success.main' }}>F</Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={<Typography fontWeight="bold">Fitness for beginners</Typography>}
                    secondary="19 Feb, 2022 at 3:30 PM" 
                  />
                  <Typography fontWeight="bold" color="success.main">$12,700/m</Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Activity</Typography>
                <Typography variant="body2" color="text.secondary">Monthly</Typography>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}