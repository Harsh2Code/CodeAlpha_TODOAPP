import { useState } from 'react'
import './App.css'
import Navbar from './Components/Navbar'
import Dashboard from './Components/Dashboard'
import { Routes, Route } from 'react-router-dom'
import Login from './Components/Login'
import Register from './Components/Register'
import Todos from './Components/Todos'
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

function App() {
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

          {/* Chief Routes */}
          <Route path="/chief/dashboard" element={<ChiefDashboard />} />
          <Route path="/chief/projects" element={<ChiefProjects />} />
          <Route path="/chief/teams" element={<ChiefTeams />} />
          <Route path="/chief/tasks" element={<ChiefTasks />} />
          <Route path="/chief/profile" element={<Profile />} />
          <Route path="/chief/settings" element={<Settings />} />

          {/* Member Routes */}
          <Route path="/member/dashboard" element={<MemberDashboard />} />
          <Route path="/member/projects" element={<MemberProjects />} />
          <Route path="/member/teams" element={<MemberTeams />} />
          <Route path="/member/tasks" element={<MemberTasks />} />
          <Route path="/member/projects/:projectId/tasks" element={<ProjectTasks />} />
          <Route path="/member/profile" element={<Profile />} />
          <Route path="/member/settings" element={<Settings />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<Admin />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/settings" element={<Settings />} />

          {/* General/Fallback Routes */}
          <Route path="/teams/:teamId" element={<TeamDetails />} /> {/* This might need to be role-prefixed too depending on access */}
          <Route path="/" element={<Dashboard />} /> {/* Default route, consider redirecting based on auth status */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default App