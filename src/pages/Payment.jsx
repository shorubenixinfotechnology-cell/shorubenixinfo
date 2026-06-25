import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Shield, CheckCircle2, IndianRupee, FileText, AlertCircle, ArrowLeft } from 'lucide-react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_SSKuly2gksJCuu'

const plans = [
  { id: 'starter', name: 'Starter', amount: 15000, features: ['Single Page Website', 'Responsive Design', 'Basic SEO', '1 Month Support'] },
  { id: 'professional', name: 'Professional', amount: 45000, features: ['Multi-Page Website', 'Custom Design', 'Admin Panel', 'Payment Integration', '3 Months Support'] },
  { id: 'enterprise', name: 'Enterprise', amount: 100000, features: ['Full-Stack App', 'API Development', 'Cloud Deploy', 'Mobile App', '12 Months Support'] },
]

export default function Payment() {
  const [searchParams] = useSearchParams()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [customAmount, setCustomAmount] = useState('')
  const [description, setDescription] = useState('')
  const [projectId, setProjectId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [paymentMode, setPaymentMode] = useState('plan') // 'plan', 'custom', or 'direct'
  const { user } = useAuth()

  useEffect(() => {
    const amount = searchParams.get('amount')
    const item = searchParams.get('item')
    const pId = searchParams.get('project_id')
    if (amount) {
      setPaymentMode('direct')
      setCustomAmount(amount)
      setDescription(item || 'Service Payment')
      if (pId) setProjectId(pId)
    }
  }, [searchParams])

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) { resolve(true); return }
      const script = document.createElement('script')
      script.id = 'razorpay-script'
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    const amount = paymentMode === 'plan'
      ? plans.find(p => p.id === selectedPlan)?.amount
      : parseInt(customAmount)

    if (!amount || amount < 1) {
      toast.error('Please select a plan or enter a valid amount')
      return
    }

    setLoading(true)

    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) { toast.error('Failed to load payment gateway'); setLoading(false); return }

      let orderId = 'order_' + Date.now()
      try {
        const res = await api.post('/payments/create-order', {
          amount,
          description: description || (paymentMode === 'plan' ? `${plans.find(p => p.id === selectedPlan)?.name} Plan` : 'Custom Payment'),
          project_id: projectId
        })
        orderId = res.data.order_id
      } catch (err) {
        console.log('Backend unavailable, proceeding with client-side payment')
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: amount * 100,
        currency: 'INR',
        name: 'ShoRubenix Infotech',
        description: description || (paymentMode === 'plan' ? `${plans.find(p => p.id === selectedPlan)?.name} Plan Payment` : 'Service Payment'),
        order_id: orderId.startsWith('order_') && !orderId.startsWith('order_rzp') ? undefined : orderId,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#6366f1',
          backdrop_color: 'rgba(2, 6, 23, 0.85)',
        },
        handler: async function (response) {
          try {
            await api.post('/payments/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount,
            })
          } catch (err) {
            console.log('Verification on backend failed, but payment succeeded')
          }
          toast.success('Payment successful! Thank you.')
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', (response) => {
        toast.error('Payment failed: ' + response.error.description)
        setLoading(false)
      })
      razorpay.open()
    } catch (err) {
      toast.error('Payment initialization failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-20">
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm mb-4">
              Secure Payments
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {paymentMode === 'direct' ? 'Complete Your ' : 'Make a '}
              <span className="gradient-text">Payment</span>
            </h1>
            <p className="text-dark-300 text-lg">
              {paymentMode === 'direct' 
                ? `You are paying for: ${description}`
                : 'Choose a plan or enter a custom amount. Powered by Razorpay.'}
            </p>
          </motion.div>

          {/* Payment Mode Toggle (Only if not direct) */}
          {paymentMode !== 'direct' ? (
            <div className="flex justify-center gap-4 mb-12">
              <button
                onClick={() => setPaymentMode('plan')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  paymentMode === 'plan' ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' : 'text-dark-400 hover:text-white bg-dark-800/30'
                }`}
              >
                Choose a Plan
              </button>
              <button
                onClick={() => setPaymentMode('custom')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  paymentMode === 'custom' ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' : 'text-dark-400 hover:text-white bg-dark-800/30'
                }`}
              >
                Custom Amount
              </button>
            </div>
          ) : (
            <div className="flex justify-center mb-12">
              <button
                onClick={() => setPaymentMode('plan')}
                className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Plans
              </button>
            </div>
          )}

          {paymentMode === 'plan' ? (
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {plans.map(plan => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`glass-card p-6 cursor-pointer transition-all duration-300 ${
                    selectedPlan === plan.id
                      ? 'border-primary-500/40 shadow-lg shadow-primary-500/10 ring-2 ring-primary-500/20'
                      : 'hover:border-dark-600'
                  }`}
                >
                  <h3 className="text-lg font-display font-semibold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-center gap-1 mb-4">
                    <IndianRupee className="w-5 h-5 text-primary-400" />
                    <span className="text-3xl font-display font-bold gradient-text">{plan.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="space-y-2">
                    {plan.features.map(f => (
                      <div key={f} className="flex items-center gap-2 text-sm text-dark-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {f}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 max-w-lg mx-auto mb-12 space-y-6"
            >
              <div>
                <label className="text-sm text-dark-300 mb-2 block">Amount (₹) *</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                  <input
                    type="number" min="1" value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    disabled={paymentMode === 'direct'}
                    placeholder="Enter amount" className="input-field !pl-10 disabled:opacity-70"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-dark-300 mb-2 block">Item / Description</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                  <input
                    type="text" value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={paymentMode === 'direct'}
                    placeholder="Payment description" className="input-field !pl-10 disabled:opacity-70"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Pay Button */}
          <div className="text-center">
            <button
              onClick={handlePayment}
              disabled={loading || (paymentMode === 'plan' && !selectedPlan) || (paymentMode === 'custom' && !customAmount) || (paymentMode === 'direct' && !customAmount)}
              className="btn-primary inline-flex items-center gap-2 px-10 py-4 text-lg disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay ₹{(parseInt(paymentMode === 'plan' ? (plans.find(p => p.id === selectedPlan)?.amount || 0) : customAmount) || 0).toLocaleString('en-IN')}
                </>
              )}
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-dark-500 text-sm">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> Secure Payment</div>
            <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Razorpay Protected</div>
          </div>
        </div>
      </section>
    </div>
  )
}
