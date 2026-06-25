import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'))

  useEffect(() => {
    let pending = 0
    if (token) {
      pending++
      fetchProfile('user')
    }
    if (adminToken) {
      pending++
      fetchProfile('admin')
    }
    if (!token && !adminToken) setLoading(false)
  }, [])

  const fetchProfile = async (type) => {
    try {
      const res = await api.get('/auth/profile')
      if (type === 'admin') {
        setAdmin(res.data.user)
      } else {
        setUser(res.data.user)
      }
    } catch (err) {
      console.error(`${type} auth error:`, err)
      if (type === 'admin') {
        localStorage.removeItem('adminToken')
        setAdminToken(null)
        setAdmin(null)
      } else {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }

  // User login (updated for 2-step OTP)
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    if (res.data.otp_required) {
      return res.data // { otp_required: true, temp_token: '...', email: '...' }
    }
    const { token: newToken, user: userData } = res.data
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
    return userData
  }

  // Verify Login OTP
  const verifyLoginOtp = async (tempToken, otp) => {
    const res = await api.post('/auth/verify-login-otp', { temp_token: tempToken, otp })
    const { token: newToken, user: userData } = res.data
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
    return userData
  }

  // Forgot Password
  const forgotPassword = async (email) => {
    const res = await api.post('/auth/forgot-password', { email })
    return res.data
  }

  // Reset Password
  const resetPassword = async (email, otp, newPassword) => {
    const res = await api.post('/auth/reset-password', { email, otp, new_password: newPassword })
    return res.data
  }

  // User register
  const register = async (name, email, password, phone) => {
    const res = await api.post('/auth/register', { name, email, password, phone })
    return res.data
  }

  // Admin login (separate endpoint)
  const adminLogin = async (email, password) => {
    const res = await api.post('/auth/admin-login', { email, password })
    const { token: newToken, user: adminData } = res.data
    localStorage.setItem('adminToken', newToken)
    setAdminToken(newToken)
    setAdmin(adminData)
    return adminData
  }

  // User logout
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  // Admin logout
  const adminLogout = () => {
    localStorage.removeItem('adminToken')
    setAdminToken(null)
    setAdmin(null)
  }

  const value = {
    user, admin, token, adminToken, loading,
    login, verifyLoginOtp, register, logout,
    forgotPassword, resetPassword,
    adminLogin, adminLogout,
    isAuthenticated: !!user,
    isAdminAuthenticated: !!admin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export default AuthContext
