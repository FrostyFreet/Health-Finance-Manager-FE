import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  InputAdornment,
  useTheme,
} from '@mui/material';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState, type FormEvent } from 'react';
import { useLocation } from 'react-router';
import { resetPassword } from '../API/Authentication';

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation()
  


  const [resetPasswordFormData, setResetPasswordFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setErrors({
      password: '',
      confirmPassword: '',
    });

    let hasError = false;
    const newErrors = { ...errors };

    if (!resetPasswordFormData.password) {
      newErrors.password = 'Password is required';
      hasError = true;
    } else if (resetPasswordFormData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      hasError = true;
    }

    if (resetPasswordFormData.confirmPassword !== resetPasswordFormData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
        hasError = true;
    }
    
    if (hasError) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword(resetPasswordFormData.password)
      
      setStatus({ message: 'Password reset successfully!', type: 'success' });
      
      setResetPasswordFormData({
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Resetting password failed:', error);
      setStatus({ message: 'Resetting password went wrong!', type: 'error' });
    }
    finally{
       setIsLoading(false);
    }
  };

  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      bgcolor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#f5f5f5',
      borderRadius: 2,
      '& fieldset': {
        borderColor: theme.palette.mode === 'dark' ? '#333' : '#e0e0e0',
      },
      '&:hover fieldset': {
        borderColor: 'primary.main',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
      },
      '& input': {
        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
      },
    },
  };

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
          maxWidth: 480,
          width: '100%',
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: theme.palette.mode === 'light' ? 3 : 0,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                margin: '0 auto',
                mb: 2,
              }}
            >
              <FitnessCenterOutlinedIcon sx={{ fontSize: 48 }} />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {location.pathname === "/change-password" ? "Change Password" : "Reset Password"}
            </Typography>
           
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
          >
           
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 0.5 }}>
                Password
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your password"
                value={resetPasswordFormData.password}
                name="password"
                onChange={(e) =>
                  setResetPasswordFormData({ ...resetPasswordFormData, [e.target.name]: e.target.value })
                }
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyle}
              />
            </Box>

            <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 0.5 }}>
                  Confirm Password
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Confirm your password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  value={resetPasswordFormData.confirmPassword}
                  name="confirmPassword"
                  onChange={(e) =>
                    setResetPasswordFormData({ ...resetPasswordFormData, [e.target.name]: e.target.value })
                  }
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  sx={textFieldStyle}
                />
              </Box>

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
            <Button type="submit" fullWidth variant="contained" size="large"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                py: 1.5,
                mt: 1,
                fontWeight: 'bold',
                fontSize: '1rem',
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              {isLoading ? 'Processing...' :  ( location.pathname === "/change-password" ? "Change Password" : "Reset Password")}

            </Button>
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
}
