import {Routes, Route, Navigate } from "react-router";
import AppProviderBasic from "./Components/AppProviderBasic";
import DashboardContent from "./DashBoardContent";
import ActivityPage from "./ActivityPage";
import ReportsPage from "./ReportsPage";
import WorkoutsPage from "./WorkoutsPage";
import { type Session } from '@supabase/supabase-js'
import { createContext, useEffect, useState } from "react";
import { supabase } from "./API/SupabaseClient";
import "./App.css"
import AuthForm from "./Components/AuthForm";
import ResetPassword from "./Components/ResetPassword";
import SendResetPasswordEmail from "./Components/SendResetPasswordEmail";
import ProfilePage from "./Components/ProfilePage";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


export const IsLoggedInContext = createContext<Session | null>(null);
const queryClient = new QueryClient();

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    
    
    
    return () => subscription.unsubscribe()
  }, [])

  return (
     <QueryClientProvider client={queryClient}>
        <IsLoggedInContext.Provider value={session}>
          <Routes>
        
            <Route path="/" element={<AppProviderBasic/>}>
              
              <Route index element={<Navigate to="/overview" replace />} />
              <Route path="overview" element={<DashboardContent />} />
              <Route path="activity" element={<ActivityPage />} />
              <Route path="workouts" element={<WorkoutsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="/login" element={<AuthForm />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/change-password" element={<ResetPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/send-reset-password" element={<SendResetPasswordEmail />} />
            
            </Route>
        </Routes>
      </IsLoggedInContext.Provider>
    </QueryClientProvider>
  )
}