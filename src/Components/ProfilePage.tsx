import { useContext, useEffect, useState, type FormEvent } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  useTheme,
  Stack,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { getUserData, updateUserData } from '../API/UserAPI';
import { IsLoggedInContext } from '../App';
import { useQuery } from '@tanstack/react-query';

export default function ProfilePage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const userContext = useContext(IsLoggedInContext)

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const result = useQuery({ queryKey: ['userData'], queryFn: () => getUserData(userContext!.access_token), enabled: !!userContext?.access_token })
  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    weight:'',
    height:'',
    tdee:'',
    activityLevel:'',
    gender:''
  });

  useEffect(()=>{
    if (result && result.data){
        setForm({
            firstName: result.data.firstName || '',
            lastName: result.data.lastName || '',
            email: result.data.email || '',
            age: result.data.age || '',
            weight: result.data.weight || '',
            height: result.data.height || '',
            tdee: result.data.tdee || '',
            activityLevel: result.data.activityLevel || '',
            gender: result.data.gender || ''
        })
    }
  },[result.data])
  
  

  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      bgcolor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#f5f5f5',
      borderRadius: 2,
      '& fieldset': {
        borderColor: theme.palette.mode === 'dark' ? '#333' : '#e0e0e0',
      },
      '&:hover fieldset': { borderColor: 'primary.main' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
      '& input': { color: theme.palette.mode === 'dark' ? '#fff' : '#000' },
    },
  } as const;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);

    setIsLoading(true);
    try {
      await updateUserData(userContext!.access_token, form)

      setStatus({ message: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setStatus({ message: 'Something went wrong updating your profile.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const initials = `${form.firstName?.[0] ?? ''}${form.lastName?.[0] ?? ''}`.toUpperCase() || (form.email?.[0]?.toUpperCase() ?? 'U');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Card
        sx={{
          maxWidth: 720,
          width: '100%',
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: theme.palette.mode === 'light' ? 3 : 0,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 96,
                height: 96,
                bgcolor: 'primary.main',
                margin: '0 auto',
                mb: 1.5,
                fontSize: 36,
                fontWeight: 700,
              }}
            >
              {initials}
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              Profile
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your personal information
            </Typography>
          </Box>

          <Divider sx={{ my: 3, '&::before, &::after': { borderColor: theme.palette.mode === 'dark' ? '#333' : 'grey.300' } }} />

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 0.5 }}>
                  First Name
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your first name"
                  name="firstName"
                  value={form.firstName}
                  onChange={(e)=> setForm({...form, [e.target.name]:e.target.value})}
                  variant="outlined"
                  sx={textFieldStyle}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 0.5 }}>
                  Last Name
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your last name"
                  name="lastName"
                  value={form.lastName}
                  onChange={(e)=> setForm({...form, [e.target.name]:e.target.value})}
                  variant="outlined"
                  sx={textFieldStyle}
                />
              </Box>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 0.5 }}>
                  Age
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your age"
                  name="age"
                  value={form.age}
                  type="number"
                  onChange={(e)=> setForm({...form, [e.target.name]:e.target.value})}
                  variant="outlined"
                  sx={textFieldStyle}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 0.5 }}>
                  Weight (kg)
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your weight"
                  name="weight"
                  value={form.weight}
                  onChange={(e)=> setForm({...form, [e.target.name]:e.target.value})}
                  type="number"
                  variant="outlined"
                  sx={textFieldStyle}
                />
              </Box>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 0.5 }}>
                  Height (cm)
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your height"
                  name="height"
                  value={form.height}
                  onChange={(e)=> setForm({...form, [e.target.name]:e.target.value})}
                  type="number"
                  variant="outlined"
                  sx={textFieldStyle}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 0.5 }}>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your email"
                  value={form.email}
                  type="email"
                  slotProps={{
                    input: { 
                        readOnly: true
                    }
                  }}
                  variant="outlined"
                  sx={textFieldStyle}
                />
              </Box>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 0.5 }}>
                  TDEE
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Your TDEE"
                  value={form.tdee ? parseInt(form.tdee) : ''}
                  slotProps={{
                    input: { 
                        readOnly: true
                    },
                    formHelperText: {
                        sx: { mx: 0, mt: 0.75, color: 'text.secondary' },
                    }
                  }}
                  variant="outlined"
                  sx={textFieldStyle}
                  helperText={
                    <Typography
                        component="span"
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary', fontSize: 12 }}
                    >
                        <InfoOutlinedIcon sx={{ fontSize: 14 }} />
                            This number shows your calorie need according to your activity level
                    </Typography>
                  }
                />
                
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 0.5 }}>
                  Activity Level
                </Typography>
                <TextField
                  select
                  fullWidth
                  variant="outlined"
                  value={form.activityLevel}
                  name="activityLevel"
                  onChange={(e)=> setForm({...form, [e.target.name]:e.target.value})}
                  placeholder="Select activity level"
                  sx={textFieldStyle}
                >
                  <MenuItem value="" disabled >Select activity level</MenuItem>
                  <MenuItem value="Sedentary">Sedentary</MenuItem>
                  <MenuItem value="Lightly_Active">Lightly active</MenuItem>
                  <MenuItem value="Moderately_Active">Moderately active</MenuItem>
                  <MenuItem value="Very_Active">Very active</MenuItem>
                </TextField>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 0.5 }}>
                  Gender
                </Typography>
                <TextField
                  select
                  fullWidth
                  variant="outlined"
                  value={form.gender}
                  name="gender"
                  onChange={(e)=> setForm({...form, [e.target.name]:e.target.value})}
                  placeholder="Select your gender"
                  sx={textFieldStyle}
                >
                  <MenuItem value="" disabled >Select your gender</MenuItem>
                  <MenuItem value="MALE">Male</MenuItem>
                  <MenuItem value="FEMALE">Female</MenuItem>
                  
                </TextField>
              </Box>
            </Stack>

            {status && (
              <Typography
                sx={{
                  color: status.type === 'success' ? 'success.main' : 'error.main',
                  textAlign: 'center',
                  p: 1,
                  borderRadius: 1,
                  opacity: 0.9,
                }}
              >
                {status.message}
              </Typography>
            )}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{ flex: 1 }}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outlined"
                disabled={isLoading }
                onClick={() => {
                  setStatus(null);
                }}
                sx={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="text"
                onClick={() => navigate('/change-password')}
                sx={{ flex: 1 }}
              >
                Change Password
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

