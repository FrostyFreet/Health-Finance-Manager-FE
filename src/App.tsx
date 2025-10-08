import {Routes, Route, Navigate } from "react-router";
import AppProviderBasic from "./Components/AppProviderBasic";
import DashboardContent from "./DashBoardContent";
import ActivityPage from "./ActivityPage";
import ReportsPage from "./ReportsPage";
import WorkoutsPage from "./WorkoutsPage";


function App() {

  return (

      <Routes>
        <Route path="/" element={<AppProviderBasic />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<DashboardContent />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="workouts" element={<WorkoutsPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    
  )
}

export default App
