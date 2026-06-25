import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, CreditCard, FileText, Eye, TrendingUp, TrendingDown,
  MessageSquare, Bell, Settings, BarChart3, IndianRupee, Calendar, Plus, Trash2, Edit3, X
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../utils/api'
import toast from 'react-hot-toast'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const COLORS = ['#6366f1', '#d946ef', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

const defaultAnalytics = {
  revenue: [
    { month: 'Jan', amount: 45000 }, { month: 'Feb', amount: 52000 },
    { month: 'Mar', amount: 48000 }, { month: 'Apr', amount: 61000 },
    { month: 'May', amount: 55000 }, { month: 'Jun', amount: 67000 },
    { month: 'Jul', amount: 72000 }, { month: 'Aug', amount: 69000 },
    { month: 'Sep', amount: 78000 }, { month: 'Oct', amount: 82000 },
    { month: 'Nov', amount: 91000 }, { month: 'Dec', amount: 95000 },
  ],
  visitors: [
    { month: 'Jan', visits: 1200 }, { month: 'Feb', visits: 1800 },
    { month: 'Mar', visits: 2200 }, { month: 'Apr', visits: 2800 },
    { month: 'May', visits: 3400 }, { month: 'Jun', visits: 4100 },
  ],
  services: [
    { name: 'Web Dev', value: 40 }, { name: 'Mobile', value: 25 },
    { name: 'Cloud', value: 15 }, { name: 'UI/UX', value: 12 },
    { name: 'API', value: 8 },
  ],
}

const defaultStats = [
  { label: 'Total Revenue', value: '₹8,15,000', change: '+12.5%', up: true, icon: IndianRupee, color: 'from-primary-500/20 to-primary-500/5' },
  { label: 'Total Users', value: '238', change: '+8.1%', up: true, icon: Users, color: 'from-emerald-500/20 to-emerald-500/5' },
  { label: 'Active Projects', value: '24', change: '+3', up: true, icon: FileText, color: 'from-accent-500/20 to-accent-500/5' },
  { label: 'Page Views', value: '12,450', change: '-2.3%', up: false, icon: Eye, color: 'from-cyan-500/20 to-cyan-500/5' },
]

const recentContacts = [
  { name: 'Aarav Mehra', email: 'aarav@example.com', subject: 'Web Development Inquiry', time: '2 hours ago' },
  { name: 'Diya Nair', email: 'diya@example.com', subject: 'Mobile App Quote', time: '5 hours ago' },
  { name: 'Karthik S', email: 'karthik@example.com', subject: 'SEO Services', time: '1 day ago' },
  { name: 'Ananya Reddy', email: 'ananya@example.com', subject: 'Cloud Migration', time: '2 days ago' },
]

export default function AdminDashboard() {
  const [stats] = useState(defaultStats)
  const [analytics] = useState(defaultAnalytics)
  const [contacts] = useState(recentContacts)
  const [activeTab, setActiveTab] = useState('overview')
  const [projects, setProjects] = useState([])
  const [userProjects, setUserProjects] = useState([])
  const [users, setUsers] = useState([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  
  // New project state
  const [newProject, setNewProject] = useState({
    title: '', description: '', category: 'Web Development', tech: [],
    price: '', image_url: '', live_url: ''
  })
  const [techInput, setTechInput] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, userProjectsRes, usersRes] = await Promise.all([
          api.get('/projects'),
          api.get('/admin/user-projects'),
          api.get('/admin/users')
        ])
        setProjects(projectsRes.data.projects || [])
        setUserProjects(userProjectsRes.data.user_projects || [])
        setUsers(usersRes.data.users || [])
      } catch (err) { /* ok */ }
    }
    fetchData()
  }, [])

  const handleAddTech = () => {
    if (techInput.trim() && !newProject.tech.includes(techInput.trim())) {
      setNewProject({ ...newProject, tech: [...newProject.tech, techInput.trim()] })
      setTechInput('')
    }
  }

  const handleAddTechEdit = () => {
    if (techInput.trim() && editingProject && !(editingProject.tech || []).includes(techInput.trim())) {
      setEditingProject({ ...editingProject, tech: [...(editingProject.tech || []), techInput.trim()] })
      setTechInput('')
    }
  }

  const handlePushProject = async (e) => {
    e.preventDefault()
    try {
      await api.post('/projects', newProject)
      toast.success('Project pushed successfully!')
      setIsAdding(false)
      setNewProject({ title: '', description: '', category: 'Web Development', tech: [], price: '', image_url: '', live_url: '' })
      const projectsRes = await api.get('/projects')
      setProjects(projectsRes.data.projects || [])
    } catch (err) {
      toast.error('Failed to push project')
    }
  }

  const handleUpdateProject = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/projects/${editingProject.id}`, editingProject)
      toast.success('Project updated successfully!')
      setEditingProject(null)
      const projectsRes = await api.get('/projects')
      setProjects(projectsRes.data.projects || [])
    } catch (err) {
      toast.error('Failed to update project')
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    try {
      await api.delete(`/projects/${projectId}`)
      toast.success('Project deleted successfully')
      setProjects(projects.filter(p => p.id !== projectId))
    } catch (err) {
      toast.error('Failed to delete project')
    }
  }

  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/status`)
      toast.success(res.data.message || 'User status updated')
      setUsers(users.map(u => u.id === userId ? { ...u, is_active: res.data.is_active } : u))
    } catch (err) {
      toast.error('Failed to update user status')
    }
  }

  const handleUserRoleChange = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role })
      toast.success('User role updated')
      setUsers(users.map(u => u.id === userId ? { ...u, role } : u))
    } catch (err) {
      toast.error('Failed to update user role')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will also remove their project records and active sessions.')) return
    try {
      await api.delete(`/admin/users/${userId}`)
      toast.success('User deleted successfully')
      setUsers(users.filter(u => u.id !== userId))
    } catch (err) {
      toast.error('Failed to delete user')
    }
  }

  return (
    <div className="pt-20 min-h-screen relative overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1920&q=80" 
          alt="Premium Office" 
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-950/98 to-primary-900/10" />
      </div>

      <section className="section-padding relative z-10">
        <div className="container-custom">
          {/* Company Branding */}
          <div className="mb-12 border-b border-white/5 pb-8">
            <p className="text-primary-400 font-display font-medium tracking-widest uppercase text-xs mb-2">Administrative Command Center</p>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
              Shorubenix <span className="gradient-text">Info Technology</span>
            </h2>
          </div>

          <motion.div {...fadeInUp} className="flex items-center justify-between mb-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-1">
                Admin <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-dark-400 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-400" /> {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'users' ? 'bg-primary-500 text-white' : 'glass text-dark-300 hover:text-white'}`}
              >
                <Users className="w-4 h-4" /> Manage Users
              </button>
              <button 
                onClick={() => setActiveTab('user-projects')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'user-projects' ? 'bg-primary-500 text-white' : 'glass text-dark-300 hover:text-white'}`}
              >
                <Users className="w-4 h-4" /> User Projects
              </button>
              <button 
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'projects' ? 'bg-primary-500 text-white' : 'glass text-dark-300 hover:text-white'}`}
              >
                <FileText className="w-4 h-4" /> Manage Projects
              </button>
              <button 
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'overview' ? 'bg-primary-500 text-white' : 'glass text-dark-300 hover:text-white'}`}
              >
                <BarChart3 className="w-4 h-4" /> Overview
              </button>
            </div>
          </motion.div>

          {/* Main Content Area */}
          {activeTab === 'overview' ? (
            <>
              {/* Stats Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className={`glass-card p-6 bg-gradient-to-br ${stat.color}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-dark-800/50 flex items-center justify-center">
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className={`flex items-center gap-1 text-sm font-medium ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                          {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-2xl font-display font-bold text-white mb-1">{stat.value}</p>
                      <p className="text-dark-400 text-sm">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 glass-card p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analytics.revenue}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', color: '#e2e8f0' }}
                        formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="amount" stroke="#6366f1" fill="url(#revenueGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="glass-card p-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={analytics.services} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                        {analytics.services.map((entry, i) => (
                          <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', color: '#e2e8f0' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {analytics.services.map((s, i) => (
                      <div key={s.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                          <span className="text-dark-300">{s.name}</span>
                        </div>
                        <span className="text-dark-400">{s.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visitors Chart & Recent Contacts */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass-card p-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analytics.visitors}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '12px', color: '#e2e8f0' }} />
                      <Bar dataKey="visits" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="glass-card p-6">
                  <div className="space-y-4">
                    {contacts.map((contact, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-dark-800/30 hover:bg-dark-800/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{contact.name.charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-white text-sm font-medium truncate">{contact.name}</p>
                            <span className="text-dark-500 text-xs flex-shrink-0 ml-2">{contact.time}</span>
                          </div>
                          <p className="text-dark-400 text-xs truncate">{contact.subject}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : activeTab === 'projects' ? (
            <motion.div {...fadeInUp} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold text-white">Project Management</h2>
                <button 
                  onClick={() => { setIsAdding(!isAdding); setEditingProject(null); }}
                  className="btn-primary flex items-center gap-2"
                >
                  {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isAdding ? 'Cancel' : 'Push New Project'}
                </button>
              </div>

              {editingProject && (
                <div className="glass-card p-8 border-primary-500/20">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-display font-bold text-white">Edit Project: {editingProject.title}</h3>
                    <button onClick={() => setEditingProject(null)} className="p-2 text-dark-300 hover:text-white"><X className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={handleUpdateProject} className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-dark-300 mb-1 block">Project Title *</label>
                        <input 
                          type="text" required value={editingProject.title}
                          onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                          className="input-field" placeholder="e.g. Modern E-commerce"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-dark-300 mb-1 block">Price (INR) *</label>
                        <input 
                          type="number" required value={editingProject.price || ''}
                          onChange={e => setEditingProject({...editingProject, price: Number(e.target.value)})}
                          className="input-field" placeholder="5000"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-dark-300 mb-1 block">Category</label>
                        <select 
                          value={editingProject.category}
                          onChange={e => setEditingProject({...editingProject, category: e.target.value})}
                          className="input-field"
                        >
                          <option>Web Development</option>
                          <option>App Development</option>
                          <option>UI/UX Design</option>
                          <option>Cloud Solutions</option>
                          <option>Business Automation</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-dark-300 mb-1 block">Tech Stack (hit Enter to add)</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" value={techInput}
                            onChange={e => setTechInput(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTechEdit())}
                            className="input-field" placeholder="React, Node.js..."
                          />
                          <button type="button" onClick={handleAddTechEdit} className="px-4 bg-dark-800 rounded-lg text-white hover:bg-dark-700">+</button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(editingProject.tech || []).map(t => (
                            <span key={t} className="px-2 py-1 rounded bg-primary-500/20 text-primary-300 text-xs flex items-center gap-1">
                              {t} <X className="w-3 h-3 cursor-pointer" onClick={() => setEditingProject({...editingProject, tech: editingProject.tech.filter(i => i !== t)})} />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-dark-300 mb-1 block">Description</label>
                        <textarea 
                          rows="4" value={editingProject.description || ''}
                          onChange={e => setEditingProject({...editingProject, description: e.target.value})}
                          className="input-field resize-none" placeholder="Project details..."
                        ></textarea>
                      </div>
                      <div>
                        <label className="text-sm text-dark-300 mb-1 block">Image URL</label>
                        <input 
                          type="text" value={editingProject.image_url || ''}
                          onChange={e => setEditingProject({...editingProject, image_url: e.target.value})}
                          className="input-field" placeholder="https://..."
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-sm text-dark-300 mb-1 block">Live URL</label>
                          <input 
                            type="text" value={editingProject.live_url || ''}
                            onChange={e => setEditingProject({...editingProject, live_url: e.target.value})}
                            className="input-field"
                          />
                        </div>
                      </div>
                      <button type="submit" className="btn-primary w-full py-4 shadow-primary-500/25">Save Project Changes</button>
                    </div>
                  </form>
                </div>
              )}

              {isAdding && (
                <div className="glass-card p-8 border-primary-500/20">
                  <h3 className="text-xl font-display font-bold text-white mb-6">Push New Project</h3>
                  <form onSubmit={handlePushProject} className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-dark-300 mb-1 block">Project Title *</label>
                        <input 
                          type="text" required value={newProject.title}
                          onChange={e => setNewProject({...newProject, title: e.target.value})}
                          className="input-field" placeholder="e.g. Modern E-commerce"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-dark-300 mb-1 block">Price (INR) *</label>
                        <input 
                          type="number" required value={newProject.price}
                          onChange={e => setNewProject({...newProject, price: e.target.value})}
                          className="input-field" placeholder="5000"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-dark-300 mb-1 block">Category</label>
                        <select 
                          value={newProject.category}
                          onChange={e => setNewProject({...newProject, category: e.target.value})}
                          className="input-field"
                        >
                          <option>Web Development</option>
                          <option>App Development</option>
                          <option>UI/UX Design</option>
                          <option>Cloud Solutions</option>
                          <option>Business Automation</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-dark-300 mb-1 block">Tech Stack (hit Enter to add)</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" value={techInput}
                            onChange={e => setTechInput(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                            className="input-field" placeholder="React, Node.js..."
                          />
                          <button type="button" onClick={handleAddTech} className="px-4 bg-dark-800 rounded-lg text-white hover:bg-dark-700">+</button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newProject.tech.map(t => (
                            <span key={t} className="px-2 py-1 rounded bg-primary-500/20 text-primary-300 text-xs flex items-center gap-1">
                              {t} <X className="w-3 h-3 cursor-pointer" onClick={() => setNewProject({...newProject, tech: newProject.tech.filter(i => i !== t)})} />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-dark-300 mb-1 block">Description</label>
                        <textarea 
                          rows="4" value={newProject.description}
                          onChange={e => setNewProject({...newProject, description: e.target.value})}
                          className="input-field resize-none" placeholder="Project details..."
                        ></textarea>
                      </div>
                      <div>
                        <label className="text-sm text-dark-300 mb-1 block">Image URL</label>
                        <input 
                          type="text" value={newProject.image_url}
                          onChange={e => setNewProject({...newProject, image_url: e.target.value})}
                          className="input-field" placeholder="https://..."
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-sm text-dark-300 mb-1 block">Live URL</label>
                          <input 
                            type="text" value={newProject.live_url}
                            onChange={e => setNewProject({...newProject, live_url: e.target.value})}
                            className="input-field"
                          />
                        </div>
                      </div>
                      <button type="submit" className="btn-primary w-full py-4 shadow-primary-500/25">Push Project to Portfolio</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="glass-card overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-dark-800/50 text-dark-300 text-sm uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Project</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Price</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {projects.map(p => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-white font-medium">{p.title}</p>
                          <p className="text-dark-400 text-xs">{p.tech?.join(', ')}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded bg-primary-500/10 text-primary-400 text-xs">{p.category}</span>
                        </td>
                        <td className="px-6 py-4 text-white font-display">₹{p.price?.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => { setEditingProject(p); setIsAdding(false); }}
                              className="p-2 rounded-lg hover:bg-dark-700 text-dark-300 hover:text-white transition-all"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProject(p.id)}
                              className="p-2 rounded-lg hover:bg-red-500/10 text-dark-300 hover:text-red-400 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : activeTab === 'user-projects' ? (
            <motion.div {...fadeInUp} className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-white mb-6">User Projects & Activity</h2>
              <div className="glass-card overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-dark-800/50 text-dark-300 text-sm uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">User Info</th>
                      <th className="px-6 py-4 font-semibold">Assigned Project</th>
                      <th className="px-6 py-4 font-semibold">Purchased At</th>
                      <th className="px-6 py-4 font-semibold">Last Login</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {userProjects.length > 0 ? userProjects.map((up, i) => (
                      <tr key={`${up.user_id}-${up.project_id}-${i}`} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-white font-medium">{up.user_name}</p>
                          <p className="text-dark-400 text-xs">{up.user_email}</p>
                        </td>
                        <td className="px-6 py-4">
                          {up.project_title ? (
                            <div>
                              <p className="text-primary-400 font-medium">{up.project_title}</p>
                              <p className="text-dark-500 text-xs">{up.project_category}</p>
                            </div>
                          ) : (
                            <span className="text-dark-600 italic">No project assigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-dark-300 text-sm">
                          {up.purchased_at ? new Date(up.purchased_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          {up.last_login ? (
                            <span className="text-emerald-400 text-xs flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              {new Date(up.last_login).toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-dark-600 text-xs">Never</span>
                          )}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-dark-500">No user data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : activeTab === 'users' ? (
            <motion.div {...fadeInUp} className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-white mb-6">User Management</h2>
              <div className="glass-card overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-dark-800/50 text-dark-300 text-sm uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">User Info</th>
                      <th className="px-6 py-4 font-semibold">Phone</th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.length > 0 ? users.map(u => (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-white font-medium">{u.name}</p>
                          <p className="text-dark-400 text-xs">{u.email}</p>
                        </td>
                        <td className="px-6 py-4 text-dark-300 text-sm">
                          {u.phone || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            value={u.role}
                            onChange={(e) => handleUserRoleChange(u.id, e.target.value)}
                            className="bg-dark-900 border border-white/10 text-white text-xs rounded px-2 py-1 focus:outline-none focus:border-primary-500"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleUserStatus(u.id)}
                            className={`px-2 py-1 rounded text-xs font-semibold ${u.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}
                          >
                            {u.is_active ? 'Active' : 'Suspended'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-dark-300 hover:text-red-400 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-dark-500">No user records found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : null}
        </div>
      </section>
    </div>
  )
}
