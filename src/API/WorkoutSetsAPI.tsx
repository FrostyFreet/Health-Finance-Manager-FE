
import axios from "axios"

const backendURL = import.meta.env.VITE_BACKEND_URL

export async function getAllSetsByExerciseId(token:string, exerciseId:string){
    try{
        const response = await axios.get(`${backendURL}/api/sets/getAllByExerciseId/${exerciseId}`, {
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

export async function createSet(token:string, form:any){
    try{
        const response = await axios.post(`${backendURL}/api/sets/create`,form,
            { headers: { Authorization: `Bearer ${token}` }, });
        return response.data;
  }
  catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      throw new Error(e.response?.data?.message || e.message);
    }
    throw e;
  }
}

export async function updateSet(token:string, id:string, weight:string, reps:string){
    try{
        const response = await axios.put(`${backendURL}/api/sets/updateSetById`,{
          weight:weight,
          reps:reps
        },
            { 
              params: {id},
              headers: { Authorization: `Bearer ${token}` }, });
        return response.data;
  }
  catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      throw new Error(e.response?.data?.message || e.message);
    }
    throw e;
  }
}

export async function deleteSetExerciseById(token:string, id:string){
    try{
        const response = await axios.delete(`${backendURL}/api/sets/deleteSetExerciseById`,
            { params:{ id },
              headers: { Authorization: `Bearer ${token}` }, });
        return response.data;
  }
  catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      throw new Error(e.response?.data?.message || e.message);
    }
    throw e;
  }
}