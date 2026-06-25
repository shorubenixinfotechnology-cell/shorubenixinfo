import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, KeyRound, Eye, EyeOff, Code2, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Send OTP, 2: Verify & Reset

  const { forgotPassword, resetPassword } = useAuth()
  const navigate = useNavigate()

  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!email) { toast.error('Please enter your email'); return }
    setLoading(true)
    try {
      await forgotPassword(email)
      toast.success('Verification OTP code sent to your email!')
      setStep(2)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'User not found or error sending OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!otp) { toast.error('Please enter the OTP'); return }
    if (otp.length !== 6) { toast.error('OTP must be 6 digits'); return }
    if (!newPassword || !confirmPassword) { toast.error('Please fill in password fields'); return }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return }

    setLoading(true)
    try {
      await resetPassword(email, otp, newPassword)
      toast.success('Password reset successfully! Please sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Verification failed. Try again.')
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
          <h1 className="text-3xl font-display font-bold text-white mb-2">Reset Password</h1>
          <p className="text-dark-400">
            {step === 1 ? 'Get a verification code to reset password' : `Enter OTP code sent to ${email}`}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="glass-card p-8 space-y-6">
            <div>
              <label className="text-sm text-dark-300 mb-2 block">Email Address</label>
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

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Send Verification OTP'
              )}
            </button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-dark-400 hover:text-white py-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="glass-card p-8 space-y-5">
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
            </div>

            <div>
              <label className="text-sm text-dark-300 mb-2 block">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

            <div>
              <label className="text-sm text-dark-300 mb-2 block">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field !pl-10"
                  required
                />
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
                'Reset Password'
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center justify-center gap-2 text-sm text-dark-400 hover:text-white w-full py-2"
            >
              <ArrowLeft className="w-4 h-4" /> Re-enter Email Address
            </button>
          </form>
        )}
      </motion.div>
    </div>
  )
}
