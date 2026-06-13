import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Predictions from './pages/Predictions'
import Analytics from './pages/Analytics'
import ModelMonitoring from './pages/ModelMonitoring'
import Settings from './pages/Settings'
import AdminPanel from './pages/AdminPanel'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './layouts/MainLayout'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/predictions" element={<PrivateRoute><Predictions /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
          <Route path="/monitoring" element={<PrivateRoute><ModelMonitoring /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
        </Routes>
        <ToastContainer position="top-right" />
      </Layout>
    </AuthProvider>
  )
}
