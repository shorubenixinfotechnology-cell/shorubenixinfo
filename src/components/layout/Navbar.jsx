import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Code2, ChevronDown, User, LogOut, LayoutDashboard, Shield, Moon, Sun } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logoIcon from '../../assets/ICON.png'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Browse Themes', path: '/portfolio' },

  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showAdminMenu, setShowAdminMenu] = useState(false)
  const location = useLocation()
  const { user, admin, isAuthenticated, isAdminAuthenticated, logout, adminLogout } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setShowUserMenu(false)
    setShowAdminMenu(false)
  }, [location])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-lg shadow-dark-950/50' : 'bg-transparent'
      }`}
    >
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 p-[1.5px] shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full rounded-xl bg-dark-950 flex items-center justify-center overflow-hidden">
                  <img 
                    src={logoIcon} 
                    alt="Shorubenix Icon" 
                    className="w-7 h-7 object-contain"
                  />
                </div>
              </div>
              <span className="text-xl font-display font-extrabold text-white tracking-tight group-hover:text-sky-400 transition-colors duration-300">
                Shorubenix
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  location.pathname === link.path ? 'text-white' : 'text-dark-300 hover:text-white'
                }`}
              >
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-sky-500/10 border border-sky-500/20 rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Get a Quote */}
            <div className="flex items-center gap-4">
              <Link 
                to="/contact" 
                className="btn-primary text-sm !px-6 !py-2.5 shadow-primary-500/20"
              >
                Get a Quote
              </Link>
            </div>

            {/* Admin badge & menu */}
            {isAdminAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => { setShowAdminMenu(!showAdminMenu); setShowUserMenu(false) }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-dark-800/50 transition-colors border border-red-500/20"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-red-300 font-medium">Admin</span>
                  <ChevronDown className="w-3 h-3 text-dark-400" />
                </button>
                <AnimatePresence>
                  {showAdminMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 glass rounded-xl overflow-hidden shadow-xl border border-red-500/10"
                    >
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-3 text-sm text-dark-200 hover:bg-dark-700/50 transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                      </Link>
                      <button onClick={adminLogout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-dark-700/50 transition-colors">
                        <LogOut className="w-4 h-4" /> Admin Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => { setShowUserMenu(!showUserMenu); setShowAdminMenu(false) }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-dark-800/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-sky-500/20">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-slate-200">{user?.name || 'User'}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 glass rounded-xl overflow-hidden shadow-xl"
                    >
                      <Link to="/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm text-dark-200 hover:bg-dark-700/50 transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-dark-700/50 transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm !px-4 !py-2">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm !px-4 !py-2">Get Started</Link>
              </>
            )}

          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-dark-800/50 text-dark-300 hover:text-white transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-dark-700/50 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-white bg-sky-500/10 border border-sky-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                {isAdminAuthenticated && (
                  <>
                    <Link to="/admin" className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-red-300 bg-red-500/10 border border-red-500/20">
                      <Shield className="w-4 h-4" /> Admin Dashboard
                    </Link>
                    <button onClick={adminLogout} className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-dark-800/50">
                      <LogOut className="w-4 h-4" /> Admin Logout
                    </button>
                  </>
                )}
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="btn-secondary text-sm text-center">Dashboard</Link>
                    <button onClick={logout} className="btn-primary text-sm">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary text-sm text-center">Sign In</Link>
                    <Link to="/register" className="btn-primary text-sm text-center">Get Started</Link>
                    <Link to="/admin/login" className="flex items-center justify-center gap-2 text-sm text-dark-500 hover:text-red-400 py-2">
                      <Shield className="w-3 h-3" /> Admin Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
