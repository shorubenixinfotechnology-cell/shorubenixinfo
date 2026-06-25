import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Code2, KeyRound, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // OTP States
  const [otpRequired, setOtpRequired] = useState(false)
  const [tempToken, setTempToken] = useState('')
  const [otp, setOtp] = useState('')

  const { login, verifyLoginOtp, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    try {
      const res = await login(email, password)
      if (res && res.otp_required) {
        setOtpRequired(true)
        setTempToken(res.temp_token)
        toast.success('Verification OTP code sent to your email!')
      } else {
        toast.success('Welcome back!')
        navigate('/')
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otp) { toast.error('Please enter the verification code'); return }
    if (otp.length !== 6) { toast.error('OTP code must be 6 digits'); return }
    setLoading(true)
    try {
      await verifyLoginOtp(tempToken, otp)
      toast.success('Login verified. Welcome back!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid or expired OTP code')
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Code2 className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {otpRequired ? 'Verification Required' : 'Welcome Back'}
          </h1>
          <p className="text-dark-400">
            {otpRequired ? `Enter code sent to ${email}` : 'Sign in to your account'}
          </p>
        </div>

        {otpRequired ? (
          <form onSubmit={handleVerifyOtp} className="glass-card p-8 space-y-6">
            <div>
              <label className="text-sm text-dark-300 mb-2 block">One-Time Password (OTP)</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="input-field !pl-10 text-center tracking-[1em] text-xl font-bold"
                  required
                />
              </div>
              <p className="text-xs text-dark-400 mt-2">
                This verification code will expire in 5 minutes.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Verify & Log In'
                )}
              </button>

              <button
                type="button"
                onClick={() => setOtpRequired(false)}
                className="flex items-center justify-center gap-2 text-sm text-dark-400 hover:text-white py-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
            <div>
              <label className="text-sm text-dark-300 mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field !pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-dark-300 block">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary-400 hover:text-primary-300 font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field !pl-10 !pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        )}

        <p className="text-center text-dark-400 text-sm mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
