import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  Stack,
  useTheme,
  Tabs,
  Tab,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { IsLoggedInContext } from '../App';
import { createExercise, getAllExercises, getExerciseByMuscleGroup, getExerciseByName } from '../API/ExercisesAPI';
import { useQuery } from '@tanstack/react-query';
import { addExerciseToWorkout } from '../API/WorkoutsAPI';
import Pager from './Pager';

interface AddExerciseModalProps {
  id:number
  open: boolean
  onClose: () => void
  refetchParent: () => void
}

const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'];
function TabPanel({ children, value, index }: { children?: React.ReactNode; value:number; index:number }) {
  return <div hidden={value !== index}>{value === index && <Box sx={{ mt: 2 }}>{children}</Box>}</div>;
}

export default function AddExerciseModal({ open, onClose, id, refetchParent }: AddExerciseModalProps) {
  const theme = useTheme()
  const userContext = useContext(IsLoggedInContext)
  const [tab, setTab] = useState(0)
  const [query, setQuery] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [createName, setCreateName] = useState('')
  const [createGroup, setCreateGroup] = useState('')
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [currentPage, setCurrentPage]=useState<number>(1)
  const pageSize = 5 

  const { data: exerciseList, refetch } = useQuery({
        queryKey: ['exerciseList'],
        queryFn: () => getAllExercises(userContext!.access_token),
        enabled: !!userContext?.access_token,
  });
  const { data: exerciseByName } = useQuery({
        queryKey: ['exerciseByName', query],
        queryFn: () => getExerciseByName(userContext!.access_token,query),
        enabled: !!userContext?.access_token && !!query,
  });

  const { data: exercisesByMuscleGroup } = useQuery({
        queryKey: ['exercisesByMuscleGroup', selectedGroup],
        queryFn: () => getExerciseByMuscleGroup(userContext!.access_token, selectedGroup!),
        enabled: !!userContext?.access_token && !!selectedGroup,
  });

 
  const exerciseArray = exerciseList?.slice((currentPage-1) * pageSize, currentPage * pageSize)
  const exercisesByMuscleGroupArray = exercisesByMuscleGroup?.slice((currentPage-1) * pageSize, currentPage * pageSize)
  console.log(exerciseArray);
  

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  }

  const createAndAdd = async ()=>{
    try{
        if((createName && createGroup != '') || (createName && createGroup != null)){
          await createExercise(userContext?.access_token!, createName,createGroup)
          await addExerciseToWorkout(userContext?.access_token!,id,createName)
          refetch()
          refetchParent();
          onClose()
          setStatus({message:'Created', type:'success'})

        }
        else{
            setStatus({message:'Please provide an exercise name/muscle group', type:'error'})

        }
        
    }
    catch(e){
      return e
    }
    
  }
  
  const addExercise = async (exerciseName: string)=>{
    try{
          await addExerciseToWorkout(userContext?.access_token!,id, exerciseName)
          onClose()
          refetchParent();
    }
    catch(e){
      console.error(e)
    }
  }
  
  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      bgcolor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#f5f5f5',
      borderRadius: 2,
      '& fieldset': { borderColor: theme.palette.mode === 'dark' ? '#333' : '#e0e0e0' },
      '&:hover fieldset': { borderColor: 'primary.main' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
      '& input': { color: theme.palette.mode === 'dark' ? '#fff' : '#000' },
    },
  } as const;


  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-exercise-modal">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '92%', sm: 720 },
          maxHeight: '85vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          p: 3,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography id="add-exercise-modal" variant="h6" fontWeight="bold">
            Add Exercise
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Search" />
          <Tab label="Browse" />
          <Tab label="Create" />
        </Tabs>

        <TabPanel value={tab} index={0}>
          {/* Search */}
          <TextField
            fullWidth
            placeholder="Search exercises by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            variant="outlined"
            sx={textFieldStyle}
          />

          <List sx={{ mt: 2 }}>
            {(exerciseList && query === '' ? exerciseArray : exerciseByName)?.map((ex:any) => (
              <ListItem
                key={ex.id}
                sx={{
                  bgcolor: 'background.default',
                  mb: 1,
                  borderRadius: 1,
                  alignItems: 'flex-start',
                }}
                secondaryAction={
                  <Button size="small" variant="contained" startIcon={<AddIcon />} sx={{ textTransform: 'none' }} onClick={()=>{addExercise(ex.name)}}>
                    Add
                  </Button>
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt:2}}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {ex.name}
                      </Typography>
                      <Chip label={ex.group} size="small" sx={{ bgcolor: 'background.paper' }} />
                    </Box>
                  }
                />
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                No matching results? Switch to Create tab to add a new exercise.
              </Typography>
            </Box>
          </List>
          <Box sx={{display:'flex', justifyContent:'center'}}>
            { exerciseList && query === '' ?
              <Pager numberOfPages={exerciseList && Math.ceil(exerciseList.length / 8)} 
                page={currentPage}
                onChange={handlePageChange}
                />
              :
              <Pager numberOfPages={exercisesByMuscleGroup && Math.ceil(exercisesByMuscleGroup.length / 8)} 
                page={currentPage}
                onChange={handlePageChange}
              />
              
            }
           </Box>
        </TabPanel>

        <TabPanel value={tab} index={1}>
          {/* Browse by muscle group */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {muscleGroups.map((g) => (
              <Chip
                key={g}
                label={g}
                clickable
                color={selectedGroup === g ? 'primary' : 'default'}
                onClick={() => setSelectedGroup(selectedGroup === g ? null : g)}
              />
            ))}
          </Box>

          
          <Grid container spacing={2}>
            {(exerciseList && selectedGroup === null ? exerciseArray : exercisesByMuscleGroupArray)?.map((ex:any) => (
              <Grid sx={{ xs:12, sm:6}} key={ex.id}>
                <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {ex.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {ex.muscleGroup}
                    </Typography>
                  </Box>

                  <Button variant="outlined" startIcon={<AddIcon />} sx={{ textTransform: 'none', ml:1.5 }} onClick={()=>addExercise(ex.name)}>
                    Add
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box sx={{display:'flex', justifyContent:'center', mt:2}}>
            { exerciseList && selectedGroup === null ?
              <Pager numberOfPages={exerciseList && Math.ceil(exerciseList.length / 8)} 
                page={currentPage}
                onChange={handlePageChange}
                />
              :
              <Pager numberOfPages={exercisesByMuscleGroup && Math.ceil(exercisesByMuscleGroup.length / 8)} 
                page={currentPage}
                onChange={handlePageChange}
              />
              
            }
          </Box>
         

        </TabPanel>

        <TabPanel value={tab} index={2}>
          
          <Stack spacing={2}>
            <TextField
              fullWidth
              placeholder="Exercise name"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              variant="outlined"
              sx={textFieldStyle}
            />

            <FormControl fullWidth>
              <InputLabel id="group-select-label">Muscle group</InputLabel>
              <Select
                labelId="group-select-label"
                value={createGroup}
                label="Muscle group"
                onChange={(e) => setCreateGroup(e.target.value)}
              >
                {muscleGroups.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
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

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button variant="outlined" onClick={onClose} sx={{ textTransform: 'none' }}>
                Cancel
              </Button>
              <Button variant="contained" startIcon={<AddIcon />} sx={{ textTransform: 'none' }} onClick={createAndAdd}>
                Create & Add
              </Button>
            </Box>
          </Stack>
        </TabPanel>
      </Box>
    </Modal>
    
  );
}