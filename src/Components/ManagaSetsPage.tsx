import { Box, IconButton, Typography, Card, CardContent, Divider, Stack, Paper, TextField, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { getAllSetsByExerciseId, createSet, deleteSetExerciseById, updateSet } from "../API/WorkoutSetsAPI";
import { IsLoggedInContext } from "../App";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ManageSetsPage() {
  const userContext = useContext(IsLoggedInContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { exerciseName, exerciseId } = location.state;

  const [sets, setSets] = useState([{ weight: '', reps: '' }]);
  const [editValues, setEditValues] = useState<{ [id: string]: { weight: string, reps: string } }>({});
  const [status, setStatus] = useState<"Successfully added sets!"| "Please provide weight and reps!" | "Successfully updated set">()

  const { data: exerciseDetail, error, refetch } = useQuery({
    queryKey: ['exerciseDetail', exerciseId],
    queryFn: () => getAllSetsByExerciseId(userContext!.access_token, exerciseId),
    enabled: !!userContext?.access_token && !!exerciseId,
  });

  useEffect(() => {
    if (exerciseDetail) {
      const initial: { [id: string]: { weight: string, reps: string } } = {};
      exerciseDetail.forEach((ex: any) => {
        initial[ex.id] = {
          weight: ex.weight,
          reps: ex.numberOfReps
        };
      });
      setEditValues(initial);
    }
  }, [exerciseDetail]);
  
 
  


  if (error) return <Box>{error.message}</Box>;

  const handleSetChange = (idx: number, field: 'weight' | 'reps', value: string) => {
    setSets(prev =>
      prev.map((set, i) => (i === idx ? { ...set, [field]: value } : set))
    );
  };

  const handleAddSet = () => {
    setSets(prev => [...prev, { weight: '', reps: '' }]);
  };

  const handleDeleteSet = (idx: number) => {
    setSets(prev => prev.filter((_, i) => i !== idx));
  };

  const handleDeleteSetFromDb = async (id: string) => {
    try {
      await deleteSetExerciseById(userContext?.access_token!, id);
      refetch(); 
    } catch (e) {
      console.error(e);
    }
  }

  const handleUpdate = async (id:string) => {
    try {
      const { weight, reps } = editValues[id];
      await updateSet(userContext?.access_token!, id,weight,reps)

      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    try {
      await Promise.all(
      sets.map((set,idx)=> {
        if (set.weight !== '' && set.reps !== '') {
          setStatus("Successfully added sets!")
          return createSet(userContext?.access_token!, {
            weight: set.weight,
            numberOfReps: set.reps,
            numberOfSets:idx,
            workoutExercise: {id: exerciseId },
          }
        );
          
        }
        setStatus("Please provide weight and reps!")
        
      }))
      
      setSets([{ weight: '', reps: '' }]);
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {exerciseName}
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Existing Sets
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {exerciseDetail && exerciseDetail.map((row: any, idx: number) => (
              <Paper key={row.id ?? idx} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ minWidth: 48 }}>
                  Set {idx + 1}
                </Typography>
                <TextField label="Weight (kg)" size="small" sx={{ width: 100 }} value={editValues[row.id]?.weight ?? ''} name="weight" onChange={(e)=> setEditValues(prev => ({...prev, [row.id]: {...prev[row.id],[e.target.name]:e.target.value}}))}/>
                <TextField label="Reps" size="small" sx={{ width: 70 }} name="reps" value={editValues[row.id]?.reps ?? ''} onChange={(e)=> setEditValues(prev => ({...prev, [row.id]: {...prev[row.id],[e.target.name]:e.target.value}}))}/>
                
                <Box>
                  <IconButton color="error" onClick={() => handleDeleteSetFromDb(row.id)}>
                    <DeleteIcon />
                  </IconButton>

                  <IconButton color="primary" onClick={() => {handleUpdate(row.id)}}>
                    <SaveIcon />
                  </IconButton>
                </Box>
               
              </Paper>
            ))}
          </Stack>

          <Typography variant="h6" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
            Add New Sets
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {sets.map((set, idx) => (
              <Paper key={idx} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ minWidth: 48 }}>
                  Set {idx + 1}
                </Typography>
                <TextField
                  label="Weight (kg)"
                  size="small"
                  sx={{ width: 100 }}
                  value={set.weight}
                  onChange={e => handleSetChange(idx, 'weight', e.target.value)}
                />
                <TextField
                  label="Reps"
                  size="small"
                  sx={{ width: 70 }}
                  value={set.reps}
                  onChange={e => handleSetChange(idx, 'reps', e.target.value)}
                />
                <IconButton color="error" sx={{ ml: 'auto' }} onClick={() => handleDeleteSet(idx)}>
                  <DeleteIcon />
                </IconButton>
              </Paper>
            ))}
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ textTransform: 'none', borderRadius: 2 }}
              onClick={handleAddSet}
            >
              Add Set
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Save/Cancel Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" sx={{ textTransform: 'none', borderRadius: 2 }} onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button variant="contained" sx={{ textTransform: 'none', borderRadius: 2 }} onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Box>
  );
}