import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, Phone, Code2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields'); return
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match'); return
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters'); return
    }
    setLoading(true)
    try {
      await register(formData.name, formData.email, formData.password, formData.phone)
      toast.success('Successfully created!')
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.detail || 'Registration failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center section-padding pt-28">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Code2 className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Create Account</h1>
          <p className="text-dark-400">Join ShoRubenix today</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          <div>
            <label className="text-sm text-dark-300 mb-2 block">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="input-field !pl-10" />
            </div>
          </div>

          <div>
            <label className="text-sm text-dark-300 mb-2 block">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="input-field !pl-10" />
            </div>
          </div>

          <div>
            <label className="text-sm text-dark-300 mb-2 block">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" className="input-field !pl-10" />
            </div>
          </div>

          <div>
            <label className="text-sm text-dark-300 mb-2 block">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="input-field !pl-10 !pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-dark-300 mb-2 block">Confirm Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="input-field !pl-10" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-dark-400 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign In</Link>
        </p>
      </motion.div>
    </div>
  )
}
