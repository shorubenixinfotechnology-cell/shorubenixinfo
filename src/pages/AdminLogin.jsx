import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { adminLogin, isAdminAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin', { replace: true })
    }
  }, [isAdminAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    try {
      await adminLogin(email, password)
      toast.success('Welcome, Admin!')
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid admin credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center section-padding pt-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/25">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Login</h1>
          <p className="text-dark-400">Sign in to the admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6 border-red-500/10">
          <div>
            <label className="text-sm text-dark-300 mb-2 block">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shorubenix.com" className="input-field !pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-dark-300 mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                type={showPassword ? 'text' : 'password'} value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" className="input-field !pl-10 !pr-10"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:from-red-400 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Shield className="w-4 h-4" /> Admin Sign In</>}
          </button>
        </form>

        <p className="text-center text-dark-400 text-sm mt-6">
          Not an admin? <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">User Login</Link>
        </p>
      </motion.div>
    </div>
  )
}
