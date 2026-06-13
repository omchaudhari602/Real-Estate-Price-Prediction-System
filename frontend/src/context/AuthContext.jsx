import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('user')
    const token = localStorage.getItem('auth_token')
    if (saved) {
      setUser(JSON.parse(saved))
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
    }
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/api/v1/auth/login', { email, password })
    const token = res.data.access_token
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const userObj = { email }
    setUser(userObj)
    localStorage.setItem('user', JSON.stringify(userObj))
    localStorage.setItem('auth_token', token)
    return res
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('auth_token')
    delete api.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
