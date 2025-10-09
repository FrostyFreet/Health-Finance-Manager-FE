import { supabase } from "./SupabaseClient";
import axios from 'axios'
const backendURL = import.meta.env.VITE_BACKEND_URL

export async function supabaseRegister(email:string, password:string,lastName:string,firstName:string){
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
            }
        }
    })
    if (error) return "Error while registering to supabase "+error
    
    return data
}

export async function backEndRegister(email:string, password:string,lastName:string,firstName:string){
    try{
        const supaData = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                }
            }
        })
        console.log(supaData);
        const supabaseUserId = supaData.data.user?.id
        const { data } = await axios.post(
            `${backendURL}/api/users/register`, 
            {
                email,
                password,
                lastName,
                firstName,
                supabaseUserId
            }
        );
        console.log('Registration successful:', data);

        return data
    }
    catch(e: unknown){
        if (e instanceof Error) {
            return { error: e.message }
        }
        return { error: "Unknown error occurred" }
    }
}

export async function supabaseLogin(email:string, password:string){
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })
    
    if (error) {
        return { error: error.message }
    }
    
    return { data }
}

export async function supabaseLogOut(){
    const { error } = await supabase.auth.signOut()
    if (error) {
        return error.message
    }

    return "Logged out!"   
}

export async function sendResetPasswordEmail(email:string){
    await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:5173/reset-password',
    })
}

export async function resetPassword(password:string){
   await supabase.auth.updateUser({ password: password })
}

