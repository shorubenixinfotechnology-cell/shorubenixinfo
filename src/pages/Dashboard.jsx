import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  User, Settings, CreditCard, FileText, Bell, LogOut,
  ArrowRight, Clock, CheckCircle2, IndianRupee
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [payments, setPayments] = useState([])
  const [projects, setProjects] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsRes, projectsRes] = await Promise.allSettled([
          api.get('/payments'),
          api.get('/projects/my-projects'),
        ])
        if (paymentsRes.status === 'fulfilled') setPayments(paymentsRes.value.data.payments || [])
        if (projectsRes.status === 'fulfilled') setProjects(projectsRes.value.data.projects || [])
      } catch (err) { /* ok */ }
    }
    fetchData()
  }, [])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'projects', label: 'My Projects', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="pt-20 min-h-screen relative overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt="Office Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-950/95 to-primary-900/20" />
      </div>

      <section className="section-padding relative z-10">
        <div className="container-custom">
          {/* Company Branding */}
          <motion.div {...fadeInUp} className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
            <div>
              <p className="text-primary-400 font-display font-medium tracking-widest uppercase text-xs mb-2">Platform Dashboard</p>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                Shorubenix <span className="gradient-text">Info Technology</span>
              </h2>
            </div>
            <div className="text-right">
              <p className="text-dark-500 text-sm">Member since {new Date(user?.created_at || Date.now()).toLocaleDateString()}</p>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} className="mb-8 p-8 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              Welcome back, <span className="gradient-text">{user?.name || 'User'}</span>
            </h1>
            <p className="text-dark-400 text-lg">Manage your projects, payments, and account settings from your command center.</p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-card p-4 space-y-1 sticky top-24">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                        ? 'bg-primary-500/10 text-primary-300 border border-primary-500/20'
                        : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
                      }`}
                  >
                    <tab.icon className="w-4 h-4" /> {tab.label}
                  </button>
                ))}
                <hr className="border-dark-700/50 my-2" />
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-dark-800/50 transition-all"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeTab === 'overview' && (
                <motion.div {...fadeInUp} className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="glass-card p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-display font-bold text-white">{projects.length || 0}</p>
                          <p className="text-dark-400 text-sm">Projects</p>
                        </div>
                      </div>
                    </div>
                    <div className="glass-card p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-display font-bold text-white">{payments.length || 0}</p>
                          <p className="text-dark-400 text-sm">Payments</p>
                        </div>
                      </div>
                    </div>
                    <div className="glass-card p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center">
                          <Bell className="w-5 h-5 text-accent-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-display font-bold text-white">0</p>
                          <p className="text-dark-400 text-sm">Notifications</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-display font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Link to="/payment" className="flex items-center justify-between p-4 rounded-xl bg-dark-800/30 hover:bg-dark-800/50 transition-colors group">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-primary-400" />
                          <span className="text-dark-200">Make a Payment</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-dark-400 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link to="/contact" className="flex items-center justify-between p-4 rounded-xl bg-dark-800/30 hover:bg-dark-800/50 transition-colors group">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary-400" />
                          <span className="text-dark-200">Request a Project</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-dark-400 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  {/* Profile Card */}
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-display font-semibold text-white mb-4">Profile Information</h3>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl font-bold text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="space-y-1">
                        <p className="text-white font-medium">{user?.name || 'User'}</p>
                        <p className="text-dark-400 text-sm">{user?.email || 'email@example.com'}</p>
                        <p className="text-dark-400 text-sm">{user?.phone || 'No phone added'}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'projects' && (
                <motion.div {...fadeInUp}>
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-display font-semibold text-white mb-4">My Projects</h3>
                    {projects.length === 0 ? (
                      <div className="text-center py-12 text-dark-400">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No projects yet. <Link to="/contact" className="text-primary-400 hover:text-primary-300">Request one!</Link></p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {projects.map(p => (
                          <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-dark-800/30">
                            <div>
                              <p className="text-white font-medium">{p.title}</p>
                              <p className="text-dark-400 text-sm">{p.category}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">Active</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'payments' && (
                <motion.div {...fadeInUp}>
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-display font-semibold text-white">Payment History</h3>
                      <Link to="/payment" className="btn-primary text-sm !px-4 !py-2">New Payment</Link>
                    </div>
                    {payments.length === 0 ? (
                      <div className="text-center py-12 text-dark-400">
                        <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No payments yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {payments.map(p => (
                          <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-dark-800/30">
                            <div className="flex items-center gap-3">
                              <IndianRupee className="w-4 h-4 text-primary-400" />
                              <div>
                                <p className="text-white font-medium">₹{p.amount?.toLocaleString('en-IN')}</p>
                                <p className="text-dark-400 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {p.created_at}</p>
                              </div>
                            </div>
                            <span className="flex items-center gap-1 text-xs text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" /> {p.status || 'Completed'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div {...fadeInUp}>
                  <div className="glass-card p-6 space-y-6">
                    <h3 className="text-lg font-display font-semibold text-white">Account Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-dark-300 mb-2 block">Full Name</label>
                        <input type="text" defaultValue={user?.name || ''} className="input-field" />
                      </div>
                      <div>
                        <label className="text-sm text-dark-300 mb-2 block">Email</label>
                        <input type="email" defaultValue={user?.email || ''} className="input-field" disabled />
                      </div>
                      <div>
                        <label className="text-sm text-dark-300 mb-2 block">Phone</label>
                        <input type="tel" defaultValue={user?.phone || ''} className="input-field" />
                      </div>
                      <button className="btn-primary">Save Changes</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
