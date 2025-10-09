import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Avatar,
  IconButton,
  InputAdornment,
  useTheme,
} from '@mui/material';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState, type FormEvent } from 'react';
import { backEndRegister, supabaseLogin } from '../API/Authentication';
import { Link, useNavigate } from 'react-router';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate()


  const [loginFormData, setLoginFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setErrors({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    let hasError = false;
    const newErrors = { ...errors };

    if (!loginFormData.email) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(loginFormData.email)) {
      newErrors.email = 'Invalid email format';
      hasError = true;
    }

    if (!loginFormData.password) {
      newErrors.password = 'Password is required';
      hasError = true;
    } else if (loginFormData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      hasError = true;
    }

    if (!isLogin) {
      if (!loginFormData.firstName) {
        newErrors.firstName = 'First name is required';
        hasError = true;
      }
      if (!loginFormData.lastName) {
        newErrors.lastName = 'Last name is required';
        hasError = true;
      }
      if (loginFormData.confirmPassword !== loginFormData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      if (!isLogin) {
        const result = await backEndRegister(loginFormData.email, loginFormData.password, loginFormData.lastName, loginFormData.firstName);
        if (result?.error) {
          setStatus({ message: result.error, type: 'error' });
          return;
        }
        setStatus({ message: 'Successfully registered! Now you can log in!', type: 'success' });
        setIsLogin(true);
      } else {
        const result = await supabaseLogin(loginFormData.email, loginFormData.password);
        if (result.error) {
          setStatus({ message: result.error, type: 'error' });
          return;
        }
        setStatus({ message: 'Successfully logged in!', type: 'success' });
        navigate("/")
      }

      setLoginFormData({
        lastName: '',
        firstName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Authentication failed:', error);
      setStatus({ message: 'Something went wrong!', type: 'error' });
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
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isLogin
                ? 'Sign in to continue to your account'
                : 'Create your account to continue'}
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
          >
            {!isLogin && (
              <>
                {/* First Name */}
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 0.5 }}>
                    First Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter your first name"
                    value={loginFormData.firstName}
                    name="firstName"
                    onChange={(e) =>
                      setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value })
                    }
                    variant="outlined"
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    sx={textFieldStyle}
                  />
                </Box>

                {/* Last Name */}
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 0.5 }}>
                    Last Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter your last name"
                    value={loginFormData.lastName}
                    name="lastName"
                    onChange={(e) =>
                      setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value })
                    }
                    variant="outlined"
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    sx={textFieldStyle}
                  />
                </Box>
              </>
            )}

            {/* Email */}
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 0.5 }}>
                Email Address
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your email"
                type="email"
                value={loginFormData.email}
                name="email"
                onChange={(e) =>
                  setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value })
                }
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email}
                sx={textFieldStyle}
              />
            </Box>

            {/* Password */}
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 0.5 }}>
                Password
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your password"
                value={loginFormData.password}
                name="password"
                onChange={(e) =>
                  setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value })
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

            {/* Confirm Password */}
            {!isLogin && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 0.5 }}>
                  Confirm Password
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Confirm your password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  value={loginFormData.confirmPassword}
                  name="confirmPassword"
                  onChange={(e) =>
                    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value })
                  }
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  sx={textFieldStyle}
                />
              </Box>
            )}

            {isLogin && (
              <Box sx={{ textAlign: 'right', mt: -1 }}>
                <Typography
                  variant="body2"
                  component={Link}
                  to='/send-reset-password'
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Forgot password?
                </Typography>
              </Box>
            )}

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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
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
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}

            </Button>
          </Box>

          <Divider
            sx={{
              my: 3,
              '&::before, &::after': {
                borderColor: theme.palette.mode === 'dark' ? '#333' : 'grey.300',
              },
            }}
          >
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Typography
                component="span"
                variant="body2"
                onClick={() => setIsLogin(!isLogin)}
                sx={{
                  color: 'primary.main',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Typography>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
