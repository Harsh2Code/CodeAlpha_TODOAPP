import { useState } from 'react'
import './App.css'
import Navbar from './Components/Navbar'
import Dashboard from './Components/Dashboard'
import { Routes, Route } from 'react-router-dom'
import Login from './Components/Login'
import Register from './Components/Register'
import Todos from './Components/Todos'
import Teams from './Components/Teams'
import Admin from './Components/Admin'
import NotFound from './Components/notFound'
import ChiefDashboard from './Components/ChiefDashboard'
import MemberDashboard from './Components/MemberDashboard'

function App() {
  return (
    <>
      <Navbar />
      <div className="mt-[1rem]">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin/dashboard" element={<Admin />} />
          <Route path="/chief/dashboard" element={<ChiefDashboard />} />
          <Route path="/member/dashboard" element={<MemberDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/todo" element={<Todos />} />
          <Route path="/team" element={<Teams />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default App
