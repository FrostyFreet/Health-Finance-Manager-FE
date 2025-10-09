import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  useTheme,
} from '@mui/material';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import { useState, type FormEvent } from 'react';
import { sendResetPasswordEmail } from '../API/Authentication';

export default function SendResetPasswordEmail() {
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const [resetPasswordFormData, setResetPasswordFormData] = useState({
    email: '',
  });

  const [errors, setErrors] = useState({
    email: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setErrors({email: ''});

    let hasError = false;
    const newErrors = { ...errors };

   
    
    if (hasError) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await sendResetPasswordEmail(resetPasswordFormData.email)
      
      setStatus({ message: 'Password reset email sent! Check your emails!', type: 'success' });
      
      setResetPasswordFormData({
        email: ''
      });
    } catch (error) {
      setStatus({ message: 'Sending password reset email went wrong!', type: 'error' });
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
              Reset Password
            </Typography>
           
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
          >
           
                
           
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 0.5 }}>
                Email Address
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your email"
                type="email"
                value={resetPasswordFormData.email}
                name="email"
                onChange={(e) =>
                  setResetPasswordFormData({ ...resetPasswordFormData, [e.target.name]: e.target.value })
                }
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email}
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
              {isLoading ? 'Processing...' : 'Send Email'}

            </Button>
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
}
