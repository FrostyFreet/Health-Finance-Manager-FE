import axios from "axios"

const backendURL = import.meta.env.VITE_BACKEND_URL

export async function getAllWorkouts(token:string){
    try{
        const response = await axios.get(`${backendURL}/api/workouts/getAll`, {
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

export async function getWorkoutsInOrder(token:string){
    try{
        const response = await axios.get(`${backendURL}/api/workouts/getWorkoutsInOrder`, {
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

export async function getLatestWorkout(token:string){
    try{
        const response = await axios.get(`${backendURL}/api/workouts/getWorkoutsInOrder`, {
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

export async function getWorkoutById(token:string, id:number){
    try{
        const response = await axios.get(`${backendURL}/api/workouts/getById/${id}`, {
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
export async function updateWorkoutName(token:string, id:string, name:string){
    try{
        const response = await axios.get(`${backendURL}/api/workouts/updateWorkoutName`, {
        params:{id,name},
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

export async function createWorkout(token:string,form:any){
    try{
        const response = await axios.post(`${backendURL}/api/workouts/create`,
           form,
        {
            headers: { Authorization: `Bearer ${token}`, },
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

export async function deleteWorkoutById(token:string,id:number){
    try{
        const response = await axios.delete(`${backendURL}/api/workouts/deleteById/${id}`,
          
        {
            headers: { Authorization: `Bearer ${token}`, },
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

export async function addExerciseToWorkout(token:string,id:number,exerciseName:string){
  try{
    const response = await axios.post(
      `${backendURL}/api/workouts/${id}/addExercise`, 
      null,
      {
        params: { exerciseName },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }
  catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      throw new Error(e.response?.data?.message || e.message);
    }
    throw e;
  }
}