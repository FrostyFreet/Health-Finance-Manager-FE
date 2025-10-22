import axios from "axios"

const backendURL = import.meta.env.VITE_BACKEND_URL

export async function getAllExercises(token:string){
    try{
        const response = await axios.get(`${backendURL}/api/exercises/getAll`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        return response.data
    }
    catch (e: unknown) {
        if (axios.isAxiosError(e)) {
        throw new Error(e.response?.data?.message || e.message);
        }
        throw e;
    }
}
export async function getExerciseByName(token:string, name:string){
  try{
    const response = await axios.get(`${backendURL}/api/exercises/getExerciseByName`, {
      params: { name },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
  catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      throw new Error(e.response?.data?.message || e.message);
    }
    throw e;
  }
}

export async function getExerciseByMuscleGroup(token:string, name:string){
  try{
    const response = await axios.get(`${backendURL}/api/exercises/getAllByMuscleGroup`, {
      params: { name },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
  catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      throw new Error(e.response?.data?.message || e.message);
    }
    throw e;
  }
}

export async function createExercise(token:string, name:string, muscleGroup:string,){
    try{
        const response = await axios.post(`${backendURL}/api/exercises/create`,{
            name,
            muscleGroup,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
        );
        return response.data
    }
    catch (e: unknown) {
        if (axios.isAxiosError(e)) {
        throw new Error(e.response?.data?.message || e.message);
        }
        throw e;
    }
}

export async function deleteExerciseById(token:string, exerciseId:string){
    try{
        const response = await axios.delete(`${backendURL}/api/exercises/deleteById/${exerciseId}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
        );
        return response.data
    }
    catch (e: unknown) {
        if (axios.isAxiosError(e)) {
        throw new Error(e.response?.data?.message || e.message);
        }
        throw e;
    }
}
export async function deleteExerciseFromWorkoutById(token:string, exerciseId:string, workoutId:string){
    try{
        const response = await axios.delete(`${backendURL}/api/workouts/deleteExerciseFromWorkoutById`,
        {
            params: {workoutId,exerciseId },
            headers: { Authorization: `Bearer ${token}` },
        }
        );
        return response.data
    }
    catch (e: unknown) {
        if (axios.isAxiosError(e)) {
        throw new Error(e.response?.data?.message || e.message);
        }
        throw e;
    }
}

export async function getExerciseProgressByExerciseIdAndDateRange(token:string, exerciseId:string, startDate:string, endDate:string ){
    try{
        const response = await axios.get(`${backendURL}/api/exercises/${exerciseId}/weight-progress`,
        {
            params: {startDate,endDate },
            headers: { Authorization: `Bearer ${token}` },
        }
        );
        return response.data
    }
    catch (e: unknown) {
        if (axios.isAxiosError(e)) {
        throw new Error(e.response?.data?.message || e.message);
        }
        throw e;
    }
}