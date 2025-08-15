import { useState } from 'react'
import './App.css'
import Navbar from './Components/Navbar'
import Dashboard from './Components/Dashboard'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Login from './Components/Login'
import Register from './Components/Register'
import ChiefTeams from './Components/chiefTeams'
import Admin from './Components/Admin'
import NotFound from './Components/notFound'
import ChiefDashboard from './Components/ChiefDashboard'
import ChiefProjects from './Components/chiefProjects'
import ChiefTasks from './Components/chiefTasks'
import MemberDashboard from './Components/MemberDashboard'
import TeamDetails from './Components/TeamDetails'
import Profile from './Components/Profile'
import Settings from './Components/Settings'
import DemoPage from './Components/DemoPage'
import ProjectTasks from './Components/ProjectTasks'
import MemberProjects from './Components/memberProjects' // Import MemberProjects
import MemberTeams from './Components/memberTeams'     // Import MemberTeams
import MemberTasks from './Components/memberTasks'     // Import MemberTasks
import { Toaster } from 'sonner'
import { useSelector } from 'react-redux'
import Unauthorized from './Components/Unauthorized'
import Projects from './Components/Projects'
import Tasks from './Components/Tasks'
import Teams from './Components/Teams'

function App() {
  const { user } = useSelector((state) => state.auth)
  const location = useLocation()

  return (
    <>
      <Toaster />
      <Navbar />
      <div className="mt-[1rem]">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/tasks" element={<Tasks />} />

          {/* Chief Routes */}
          <Route path="/chief/dashboard" element={user ? <ChiefDashboard /> : <Unauthorized />} />
          <Route path="/chief/projects" element={user ? <ChiefProjects /> : <Unauthorized />} />
          <Route path="/chief/teams" element={user ? <ChiefTeams /> : <Unauthorized />} />
          <Route path="/chief/tasks" element={user ? <ChiefTasks /> : <Unauthorized />} />
          <Route path="/chief/profile" element={user ? <Profile /> : <Unauthorized />} />
          <Route path="/chief/settings" element={user ? <Settings /> : <Unauthorized />} />

          {/* Member Routes */}
          <Route path="/member/dashboard" element={user ? <MemberDashboard /> : <Unauthorized />} />
          <Route path="/member/projects" element={user ? <MemberProjects /> : <Unauthorized />} />
          <Route path="/member/teams" element={user ? <MemberTeams /> : <Unauthorized />} />
          <Route path="/member/tasks" element={user ? <MemberTasks /> : <Unauthorized />} />
          <Route path="/member/projects/:projectId/tasks" element={user ? <ProjectTasks /> : <Unauthorized />} />
          <Route path="/member/profile" element={user ? <Profile /> : <Unauthorized />} />
          <Route path="/member/settings" element={user ? <Settings /> : <Unauthorized />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={user ? <Admin /> : <Unauthorized />} />
          <Route path="/admin/profile" element={user ? <Profile /> : <Unauthorized />} />
          <Route path="/admin/settings" element={user ? <Settings /> : <Unauthorized />} />

          {/* General/Fallback Routes */}
          <Route path="/teams/:teamId" element={user ? <TeamDetails /> : <Unauthorized />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default App
