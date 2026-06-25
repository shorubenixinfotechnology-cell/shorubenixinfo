import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'

import Blog from './pages/Blog'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Payment from './pages/Payment'
import ForgotPassword from './pages/ForgotPassword'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import WhatsAppWidget from './components/WhatsAppWidget'

function App() {
  return (
    <div className="min-h-screen bg-dark-950 bg-mesh">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          },
        }}
      />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={
            <ProtectedRoute><Portfolio /></ProtectedRoute>
          } />

          <Route path="/projects" element={
            <ProtectedRoute><Portfolio /></ProtectedRoute>
          } />
          <Route path="/blog" element={
            <ProtectedRoute><Blog /></ProtectedRoute>
          } />
          <Route path="/contact" element={
            <ProtectedRoute><Contact /></ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  )
}

export default App
