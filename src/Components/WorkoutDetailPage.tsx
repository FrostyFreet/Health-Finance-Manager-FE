import { useQuery } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router"
import { getWorkoutById } from "../API/WorkoutsAPI";
import { useContext, useState } from "react";
import { IsLoggedInContext } from "../App";
import { Avatar, Box, Button, Card, CardContent, Chip, Divider, IconButton, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import Grid from '@mui/material/Grid';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TimerIcon from '@mui/icons-material/Timer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AddExerciseModal from "./AddExerciseModal";
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteExerciseFromWorkoutById } from "../API/ExercisesAPI";

export default function WorkoutDetailPage(){
    const location = useLocation()
    const navigate = useNavigate() 
    const userContext = useContext(IsLoggedInContext)
    const [isModalOpen,setIsModalOpen] = useState<boolean>(false)
    const { id,title} = location.state
    const workoutId = id
    const {data:workoutDetail, error, refetch} = useQuery({
        queryKey: ['workoutDetail',workoutId],
        queryFn: () => getWorkoutById(userContext!.access_token, workoutId),
        enabled: !!userContext?.access_token && !!workoutId,
      })
    if (error) return <Box>{error.message}</Box>

    let maxWeight: number = 0
    workoutDetail?.exercises?.forEach((ex:any)=> {
        maxWeight = Math.max(...ex.sets.map((set:any) => set.weight));
    })
  
    
    
    const deleteExercise = async (exerciseId: string)=>{
        try{

            await deleteExerciseFromWorkoutById(userContext?.access_token!, exerciseId, workoutId)
            refetch()
        }
        catch(e){
          console.error(e)
        }
    }

    return (
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton aria-label="back" sx={{ bgcolor: 'background.paper' }} onClick={()=>navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" fontWeight="bold">
              {title || 'Workout Title'}
            </Typography>
            <Chip
              icon={<FitnessCenterIcon />}
              label={workoutDetail?.duration ? `${workoutDetail.duration} min` : 'Duration'}
              sx={{ ml: 1, bgcolor: 'background.paper' }}
            />
          </Box>
        </Box>
        
        <Card sx={{ bgcolor: 'background.paper', borderRadius: 2, mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid >
                <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
                  <FitnessCenterIcon />
                </Avatar>
              </Grid>

              <Grid>
                <Typography variant="h6" fontWeight="bold">
                  {title || 'Workout Title'}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 1, alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Date: {workoutDetail?.createdAt ? new Date(workoutDetail?.createdAt).toISOString().slice(0,10) : '—'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <TimerIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                    {workoutDetail?.duration ? `${workoutDetail.duration} min` : '—'}
                  </Typography>
                </Stack>
              </Grid>

              <Grid>
                <Stack direction="column" spacing={1} alignItems="flex-end">
                  <Chip icon={<WhatshotIcon />} label={maxWeight ? `Best: ${maxWeight}kg` : 'Best: —'} sx={{ bgcolor: 'background.default' }} />
                </Stack>
              </Grid>
            </Grid>
          </CardContent>

          
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{ textTransform: 'none', borderRadius: 2 }}
                onClick={() => setIsModalOpen(true)}
            >
                Add Exercise
            </Button>
            <AddExerciseModal
                      id={workoutId}
                      open={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      refetchParent={refetch}
                />
        </Box>
        <Card sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Exercises</Typography>
              <Stack direction="row" spacing={1}>
                <Chip label={`${workoutDetail?.exercises?.length ?? '0'} exercises`} sx={{ bgcolor: 'background.default' }} />
                <Chip label={`Sets: ${workoutDetail?.totalSets ?? '—'}`} sx={{ bgcolor: 'background.default' }} />
              </Stack>
            </Box>
            

            <Divider sx={{ mb: 2 }} />

            <List disablePadding>
              {workoutDetail?.exercises?.length ? (
                workoutDetail.exercises.map((exercise: any, idx: number) => (
                  <ListItem
                    key={exercise?.id ?? idx}
                    sx={{ bgcolor: 'background.default', mb: 1, borderRadius: 1 }}
                    secondaryAction={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80, textAlign: 'right' }}>
                          Highest: {maxWeight > 0 ? maxWeight : '-'}
                        </Typography>
                        <IconButton
                          size="small"
                          sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
                          onClick={() => {(navigate(`/workout/${title}}/${exercise.name}/sets`, { state: {exerciseName:exercise.name, exerciseId:exercise.id}}))
                          }}
                        >
                          <EditIcon fontSize="small" sx={{ color: 'primary.main' }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
                          onClick={() => { deleteExercise(exercise.id) }}
                        >
                          <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                    slotProps={{
                      primary: {component: 'div'},
                      secondary: {component: 'div'}
                    }}
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold" component="span">
                              {exercise?.name ?? 'Exercise name'}
                            </Typography>
                            <Chip label={`${exercise?.sets?.length ?? '0'} sets`} size="small" sx={{ bgcolor: 'background.paper' }} />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                            {exercise?.sets?.length
                              ? exercise.sets.map((set: any, sidx: number) => (
                                  <Chip
                                    key={sidx}
                                    label={set?.label ?? `Set ${sidx + 1}`}
                                    size="small"
                                    sx={{ bgcolor: 'background.paper' }}
                                  />
                                ))
                              : (
                                <Typography variant="body2" color="text.secondary" component="span">
                                  No sets
                                </Typography>
                              )}
                          </Box>
                        }
                      />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="body2" color="text.secondary" component="span">
                        No exercises added yet.
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>

          </CardContent>
        </Card>
      </Box>
    )
}

