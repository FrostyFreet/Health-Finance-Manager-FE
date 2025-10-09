import React, { useState } from 'react';
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  Stack,
  useTheme,
} from '@mui/material';

interface CreateWorkoutModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: { title: string; duration: number }) => void;
}

export default function CreateWorkoutModal({ open, onClose, onSubmit }: CreateWorkoutModalProps) {
  const theme = useTheme();
  const [form, setForm] = useState({ title: '', duration: '' });
  const [errors, setErrors] = useState({ title: '', duration: '' });

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

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: '' });
  };

  const handleSubmit = () => {
    const newErrors = { title: '', duration: '' };
    let hasError = false;

    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
      hasError = true;
    }

    if (!form.duration || isNaN(Number(form.duration)) || Number(form.duration) <= 0) {
      newErrors.duration = 'Duration must be a positive number';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ title: form.title, duration: Number(form.duration) });
    setForm({ title: '', duration: '' });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="create-workout-modal">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="create-workout-modal" variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Create Workout
        </Typography>
        <Stack spacing={2}>
          <TextField
            fullWidth
            placeholder="Enter workout title"
            value={form.title}
            onChange={handleChange('title')}
            variant="outlined"
            error={!!errors.title}
            helperText={errors.title}
            sx={textFieldStyle}
          />
          <TextField
            fullWidth
            placeholder="Enter duration (in minutes)"
            value={form.duration}
            onChange={handleChange('duration')}
            type="number"
            variant="outlined"
            error={!!errors.duration}
            helperText={errors.duration}
            sx={textFieldStyle}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                bgcolor: 'primary.main',
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              Create
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}