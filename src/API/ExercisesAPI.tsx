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

function formatLocalDateTime(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function sanitizeTrailingSuffix(value: string) {
  return value.replace(/:\d+$/g, '').trim();
}

function ensureLocalDateTime(input: string | Date) {
  if (input instanceof Date) return formatLocalDateTime(input);
  const candidate = sanitizeTrailingSuffix(input);
  const isoLike = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  if (isoLike.test(candidate)) return candidate;
  const parsed = new Date(candidate);
  if (!isNaN(parsed.getTime())) return formatLocalDateTime(parsed);
  throw new Error('Invalid date format. Expect YYYY-MM-DDTHH:mm:ss or a Date.');
}

export async function getExerciseProgressByExerciseIdAndDateRange(
  token: string,
  exerciseId: string,
  startDate: string | Date,
  endDate: string | Date
) {
  if (!token) throw new Error('Missing auth token');
  if (!exerciseId) throw new Error('Missing exerciseId');
  if (!startDate || !endDate) throw new Error('Missing start/end date');

  const sanitizedExerciseId = encodeURIComponent(sanitizeTrailingSuffix(exerciseId));
  const s = encodeURIComponent(ensureLocalDateTime(startDate));
  const e = encodeURIComponent(ensureLocalDateTime(endDate));

  const url = `${backendURL.replace(/\/+$/, '')}/api/exercises/${sanitizedExerciseId}/weight-progress`;
  const params = new URLSearchParams({ startDate: s, endDate: e }).toString();
  const fullUrl = `${url}?${params}`;

  console.log('DEBUG GET', fullUrl);
  console.log('DEBUG Authorization header present:', !!token);

  try {
    const response = await axios.get(fullUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      console.error('Request failed', e.response?.status, e.response?.data);
      throw new Error(e.response?.data?.message || `Request failed: ${e.response?.status}`);
    }
    throw e;
  }
}