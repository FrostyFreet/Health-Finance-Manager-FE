import axios from "axios"

const backendURL = import.meta.env.VITE_BACKEND_URL
export async function getUserData(token:string){
    try {
        const response = await axios.get(`${backendURL}/api/users/getUserData`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        return response.data;
    } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
        throw new Error(e.response?.data?.message || e.message);
        }
        throw e;
    }

}

export async function updateUserData(token:string,form:any){
    try {
        const response = await axios.put(`${backendURL}/api/users/updateCurrentUser`,
           form,
        {
            headers: { Authorization: `Bearer ${token}`, },
        });
        return response.data;
    } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
        throw new Error(e.response?.data?.message || e.message);
        }
        throw e;
    }

}