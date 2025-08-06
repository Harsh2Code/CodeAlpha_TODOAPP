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

function App() {
  return (
    <>
      <Navbar />
      <div className="mt-[5rem]">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
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
