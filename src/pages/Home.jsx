import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Code2, Smartphone, Shield, Zap,
  CheckCircle2, Star, Users, Award, TrendingUp, Play,
  Cpu, GraduationCap, BookOpen, Briefcase, Terminal, Send, Check
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ServiceDetailsModal from '../components/ServiceDetailsModal'
import circleImg from '../assets/Circle.png'
import iconImg from '../assets/ICON.png'
import api from '../utils/api'
import toast from 'react-hot-toast'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true }
}

const services = [
  {
    icon: Code2,
    title: 'Web Development',
    desc: 'Enterprise-grade web applications and high-performance corporate websites.',
    longDesc: 'Our web development team crafts high-performance, secure, and scalable digital solutions tailored for enterprises. We specialize in robust backend architectures and lightning-fast frontend experiences.',
    features: ['Custom Web Applications', 'React & Next.js Ecosystem', 'Full-stack Architectures', 'Performance Optimization', 'Post-launch Support'],
    color: 'from-sky-500 to-blue-500'
  },
  {
    icon: Smartphone,
    title: 'Mobile Applications',
    desc: 'Secure and scalable mobile solutions for iOS and Android platforms.',
    longDesc: 'From native experiences to cross-platform brilliance, we build mobile applications that resonate with users. Our focus is on seamless performance, intuitive UX, and secure data handling.',
    features: ['Native iOS & Android', 'React Native Development', 'App Store Optimization', 'Third-party Integrations', 'Real-time Features'],
    color: 'from-blue-600 to-indigo-600'
  },
  {
    icon: Cpu,
    title: 'AI Solutions',
    desc: 'Custom Artificial Intelligence, Machine Learning, and Chatbot integration.',
    longDesc: 'Integrate artificial intelligence into your business workflow. From conversational AI chatbots to predictive analytics and machine learning model training, we build smart tools to automate your workload.',
    features: ['Custom Machine Learning models', 'NLP & LLM integrations', 'Chatbots & Virtual Assistants', 'Computer Vision systems', 'Data Analytics & Insights'],
    color: 'from-purple-500 to-indigo-500'
  },
  {
    icon: GraduationCap,
    title: 'Final Year Projects',
    desc: 'Complete project guidance, source code, documentation, and viva preparation.',
    longDesc: 'We provide end-to-end guidance for Engineering, MCA, and BSC computer science student projects. Get access to verified source code, detailed reports, UML diagrams, and preparation for your presentations.',
    features: ['Verified Source Code', 'UML Diagrams & Documentation', 'Viva-Voce Guidance', 'ML, Web, IoT, and Cloud domains', 'On-time delivery guarantee'],
    color: 'from-emerald-500 to-teal-500'
  },
  {
    icon: BookOpen,
    title: 'Research Paper Publication',
    desc: 'Professional writing, journal indexing guidance, and publication support.',
    longDesc: 'Get professional support for writing and publishing research papers in reputed international journals. We guide you through formatting, plagiarism checking, and selecting journals (IEEE, Springer, Scopus, Google Scholar).',
    features: ['IEEE & Springer templates', 'Plagiarism verification', 'Peer-review assistance', 'Journal indexing guidance', 'Technical writing support'],
    color: 'from-rose-500 to-pink-500'
  },
  {
    icon: Briefcase,
    title: 'Internship Programs',
    desc: 'Hands-on experience, real-world industry projects, and course certificates.',
    longDesc: 'Enhance your career readiness with our practical internship courses. Work on active production tasks, learn from senior developers, and earn a verified internship completion certificate.',
    features: ['Full Stack Web Development', 'Python AI & Data Science', 'App Development (React Native)', 'Industry-verified Certificates', 'Placement Assistance support'],
    color: 'from-yellow-500 to-amber-500'
  },
  {
    icon: Terminal,
    title: 'Software Development',
    desc: 'Custom enterprise software, API integrations, and desktop solutions.',
    longDesc: 'We design and develop tailor-made software systems that solve complex business challenges. From ERP systems to secure API architectures and desktop apps, we deliver reliability and scalability.',
    features: ['Enterprise ERP & CRM systems', 'Secure REST & GraphQL APIs', 'Cross-platform desktop apps', 'Database architecture design', 'Scalable microservices'],
    color: 'from-sky-400 to-sky-600'
  }
]

const technologies = [
  { name: 'React.js', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Python AI', category: 'Backend/AI' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Flutter / Native', category: 'Mobile' },
  { name: 'Amazon Web Services', category: 'Cloud' }
]

const stats = [
  { icon: Users, value: '250+', label: 'Corporate Clients' },
  { icon: Award, value: '300+', label: 'Projects Completed' },
  { icon: Star, value: '4.9', label: 'Satisfaction Rate' },
  { icon: TrendingUp, value: '24/7', label: 'Expert Support' }
]

const testimonials = [
  { name: 'Suresh Kumar', role: 'Director, TechGlobal', text: 'Shorubenix provided an exceptional enterprise solution that streamlined our entire operation. Truly a professional team.', rating: 5 },
  { name: 'Rajesh Kannan', role: 'Founder, InnovateHQ', text: 'The attention to detail and technical precision delivered by Shorubenix is outstanding. Highly recommended for corporate projects.', rating: 5 },
  { name: 'Jeevanantham', role: 'CTO, DataSystems', text: 'Innovative, reliable, and affordable. They are our go-to partner for all cloud and web infrastructure needs.', rating: 5 }
]

export default function Home() {
  const { isAuthenticated, isAdminAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [serviceForModal, setServiceForModal] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '', email: '', phone: '', subject: 'IT Services Inquiry', message: ''
  })
  const [sending, setSending] = useState(false)

  // ==========================================
  // SEO & METADATA DYNAMIC CONFIGURATION
  // ==========================================
  useEffect(() => {
    document.title = "Shorubenix Info Technology | Code • Solve • Deliver | IT & Academic Solutions"
    
    let metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute("content", "Shorubenix Info Technology is a leading IT services and solutions provider specializing in Web Development, Mobile Apps, AI Solutions, Academic Projects, and Internships.")
    }
    
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.name = 'keywords'
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute("content", "Shorubenix Info Technology, IT Services, Web Development, Mobile Applications, AI Solutions, Final Year Projects, Research Paper Publication, Internship Programs, Software Development")
  }, [])

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin', { replace: true })
    }
  }, [isAuthenticated, isAdminAuthenticated, navigate])

  const handleOpenModal = (service) => {
    setServiceForModal(service)
    setIsModalOpen(true)
  }

  const handleMouseMove = (e) => {
    const { currentTarget, clientX, clientY } = e
    const { left, top } = currentTarget.getBoundingClientRect()
    currentTarget.style.setProperty("--mouse-x", `${clientX - left}px`)
    currentTarget.style.setProperty("--mouse-y", `${clientY - top}px`)
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Please fill in all required fields')
      return
    }
    setSending(true)
    try {
      await api.post('/contacts', contactForm)
      toast.success('Your message has been sent successfully!')
      setContactForm({ name: '', email: '', phone: '', subject: 'IT Services Inquiry', message: '' })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="overflow-hidden grain">
      {/* 1. Redesigned Centered Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center section-padding pt-36 bg-dark-blue-grad overflow-hidden z-10">
        
        {/* Background Grid & Coding Patterns */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none select-none bg-grid-pattern" />
        
        {/* Ambient Glowing Blobs */}
        <div className="absolute top-[12%] left-[15%] w-[350px] h-[350px] bg-sky-500/10 rounded-full blur-[90px] animate-blob" />
        <div className="absolute bottom-[20%] right-[15%] w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[130px] animate-blob" style={{ animationDelay: '4s' }} />

        <div className="container-custom relative z-10 w-full flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-4xl text-center flex flex-col items-center"
          >
            {/* Center Logo Graphic */}
            <div className="relative w-60 h-60 mb-4 flex items-center justify-center">
              {/* Radial backdrop glow to highlight the dark wing against the dark background */}
              <div className="absolute w-48 h-48 bg-white/[0.07] rounded-full blur-xl pointer-events-none" />
              <img 
                src={iconImg} 
                alt="Shorubenix Logo" 
                className="relative z-10 w-44 h-44 object-contain animate-float-logo filter drop-shadow-[0_0_25px_rgba(255,255,255,0.55)] drop-shadow-[0_0_40px_rgba(41,171,226,0.35)]"
              />
            </div>

            {/* Company Name */}
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-widest uppercase mb-2">
              Shorubenix <span className="text-sky-blue">Info Technology</span>
            </h2>

            {/* Tagline */}
            <p className="text-xs font-display font-bold tracking-[0.3em] text-slate-400 uppercase mb-8 flex items-center gap-2">
              Code <span className="text-sky-blue">•</span> Solve <span className="text-sky-blue">•</span> Deliver
            </p>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-black leading-[1.1] mb-8 tracking-tight text-white max-w-3xl">
              Transforming Ideas into Powerful <br />
              <span className="gradient-text-blue">Digital Solutions</span>
            </h1>

            {/* Sub Heading */}
            <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl leading-relaxed font-light">
              We specialize in Web Development, Mobile Applications, AI Solutions, Final Year Projects, Research Paper Publication, Internship Programs, and Software Development.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
              <Link to="/portfolio" className="btn-primary flex items-center gap-3 group w-full sm:w-auto justify-center shadow-sky-500/25">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#contact-form-section" className="btn-secondary flex items-center gap-3 w-full sm:w-auto justify-center border-sky-blue border-sky-blue-hover text-white">
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>


      </section>

      {/* Stats Section */}
      <section className="section-padding bg-[#030712]/50 relative border-y border-white/5 bg-grid-pattern z-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                onMouseMove={handleMouseMove}
                className="glass-card glass-card-glow glass-card-spotlight glass-card-glow-spotlight p-8 text-center group flex flex-col items-center hover:shadow-sky-500/5"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/5 group-hover:border-sky-500/20 relative z-10">
                  <stat.icon className="w-5 h-5 text-sky-400 group-hover:text-sky-300 transition-colors" />
                </div>
                <div className="text-3xl lg:text-4xl font-display font-black text-white mb-1 relative z-10">
                  {stat.value}
                </div>
                <p className="text-slate-500 text-xs font-bold tracking-widest uppercase relative z-10">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Services Section */}
      <section className="section-padding relative overflow-hidden z-10">
        <div className="container-custom relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Expert <span className="gradient-text-blue">IT Services</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
              We provide high-end technological consulting and implementation at an affordable scale,
              ensuring your digital success with precision and quality.
            </p>
          </motion.div>

          <motion.div {...staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div key={service.title} {...fadeInUp} transition={{ delay: i * 0.1 }}>
                <div 
                  onMouseMove={handleMouseMove}
                  className="glass-card glass-card-glow glass-card-spotlight glass-card-glow-spotlight p-8 md:p-10 h-full group border-white/[0.03] hover:border-sky-500/30 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} p-[1.5px] mb-8 shadow-lg`}>
                      <div className="w-full h-full rounded-2xl bg-dark-950 flex items-center justify-center group-hover:bg-transparent transition-all duration-500">
                        <service.icon className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-4 group-hover:text-sky-300 transition-colors">{service.title}</h3>
                    <p className="text-slate-400 leading-relaxed font-light mb-8">{service.desc}</p>
                  </div>
                  <button
                    onClick={() => handleOpenModal(service)}
                    className="pt-6 border-t border-white/5 w-full flex items-center text-sky-400 text-xs font-bold tracking-widest uppercase group-hover:text-white transition-colors"
                  >
                    View Details <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. Technologies We Use Section */}
      <section className="section-padding bg-slate-900/10 border-y border-white/5 relative z-10 bg-grid-pattern">
        <div className="container-custom">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-white">
              Technologies We <span className="gradient-text-blue">Use</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto font-light text-center">
              We leverage modern and robust tech stacks to build secure, scalable solutions.
            </p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto">
            {technologies.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium text-sm flex items-center gap-2 hover:border-sky-500/50 hover:bg-sky-500/5 transition-all duration-300"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <span>{tech.name}</span>
                <span className="text-[10px] text-slate-500 uppercase ml-1">({tech.category})</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Internship Programs Section */}
      <section className="section-padding relative overflow-hidden z-10">
        <div className="container-custom">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-white">
              Practical <span className="gradient-text-blue">Internship Programs</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto font-light text-center">
              Kickstart your career with industrial training certifications and active product support.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'Full Stack Web Development',
                duration: '1 - 3 Months',
                skills: 'React.js, Next.js, Node.js, Express, MongoDB',
                desc: 'Learn backend and frontend structures while working on real agency projects.'
              },
              {
                title: 'Python AI & Data Science',
                duration: '1 - 3 Months',
                skills: 'Machine Learning, NLP, Data Analytics, TensorFlow',
                desc: 'Build smart neural networks, chatbots, and train analytics models.'
              },
              {
                title: 'Mobile App Development',
                duration: '1 - 3 Months',
                skills: 'React Native, Flutter, Firebase integration',
                desc: 'Deploy native applications onto Android Play Store and Apple App Store.'
              }
            ].map((intern, i) => (
              <motion.div
                key={intern.title}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 border-white/[0.03] hover:border-sky-500/20 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-md bg-sky-500/10 text-sky-400 text-xs font-bold uppercase tracking-wider">{intern.duration}</span>
                    <Briefcase className="w-5 h-5 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-3">{intern.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">{intern.desc}</p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Skills Covered:</p>
                  <p className="text-xs text-sky-300 font-mono">{intern.skills}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a href="#contact-form-section" className="inline-flex items-center gap-2 text-sky-400 hover:text-white font-semibold transition-colors">
              Apply for Internship <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 5. Final Year Projects Section */}
      <section className="section-padding bg-slate-900/5 border-y border-white/5 relative z-10 bg-grid-pattern">
        <div className="container-custom">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div {...fadeInUp} className="lg:col-span-5">
              <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4 inline-block uppercase tracking-wider">Academic Support</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                Final Year <br />
                <span className="gradient-text-blue">Project Guidance</span>
              </h2>
              <p className="text-slate-400 mb-8 font-light leading-relaxed">
                We support CSE, IT, ECE, MCA, and MSC students with secure, verified source code, structured documentation, and viva presentation preparation.
              </p>
              
              <div className="space-y-4">
                {[
                  '100% Executable Source Code',
                  'UML Diagrams & System Architecture',
                  'Structured Project Reports (IEEE format)',
                  'Viva-Voce Questions & Answer prep'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
              {[
                { title: 'AI & Machine Learning', desc: 'Classification, Regression, Neural Networks, Computer Vision models.' },
                { title: 'Web & Cloud App Dev', desc: 'Secure Full Stack architectures using React, Python, Node, and AWS.' },
                { title: 'IoT & Embedded Projects', desc: 'Arduino, Raspberry Pi hardware integration and real-time dashboards.' },
                { title: 'Mobile Apps (Android/iOS)', desc: 'Cross-platform app developments using React Native and Flutter.' }
              ].map((domain, i) => (
                <motion.div
                  key={domain.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 border-white/5 hover:border-emerald-500/30 group"
                >
                  <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{domain.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{domain.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Research Paper Publication Section */}
      <section className="section-padding relative overflow-hidden z-10">
        <div className="container-custom">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-white">
              Research Paper <span className="gradient-text-blue">Publication</span>
            </h2>
            <p className="text-slate-400 font-light text-center">
              Get end-to-end support for technical writing, formatting, plagiarism checking, and journal indexing.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Topic Selection', desc: 'Assistance in picking novel research domains and architectures.' },
              { step: '02', title: 'Technical Writing', desc: 'Drafting structured articles matching IEEE and Springer formatting.' },
              { step: '03', title: 'Plagiarism Check', desc: 'Ensuring unique, authentic content using Turnitin check.' },
              { step: '04', title: 'Journal Submission', desc: 'Selecting Scopus, Google Scholar, or UGC-CARE approved journals.' }
            ].map((step, i) => (
              <motion.div
                key={step.title}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 border-white/5 hover:border-sky-500/20 text-center"
              >
                <div className="text-3xl font-display font-black text-sky-400/20 mb-4">{step.step}</div>
                <h3 className="text-lg font-display font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Features */}
      <section className="section-padding bg-slate-900/10 border-y border-white/5 relative z-10">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight">
                Professionalism Met with <br />
                <span className="gradient-text-blue">Practical Implementation</span>
              </h2>
              <p className="text-slate-400 mb-10 text-xl font-light leading-relaxed">
                At Shorubenix, we combine creative excellence with technical rigor to deliver solutions
                that actually move the needle for your business or academic career.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  'Enterprise Tech Stack',
                  'Affordable Pricing',
                  'End-to-End Support',
                  'Academic Precision',
                  'Real-world IoT',
                  'Verified Quality'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <CheckCircle2 className="w-6 h-6 text-sky-500 flex-shrink-0" />
                    <span className="text-slate-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-1 bg-gradient-to-br from-sky-500/20 to-transparent rounded-[2.5rem]"
            >
              <div className="glass-card p-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px]" />
                <div className="text-sky-400 text-6xl font-display font-black mb-8 opacity-20">2026</div>
                <h3 className="text-3xl font-display font-bold text-white mb-6">Leading the Digital Transformation</h3>
                <p className="text-slate-400 mb-10 leading-relaxed font-light">
                  Our approach ensures that every project — whether a simple website or a complex IoT ecosystem — is built with a focus on long-term scalability and reliability.
                </p>
                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-3xl font-bold text-white">100%</div>
                    <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">Secure</div>
                  </div>
                  <div className="h-10 w-px bg-white/10" />
                  <div>
                    <div className="text-3xl font-bold text-white">50+</div>
                    <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">Tools</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials / Google Reviews Section */}
      <section className="section-padding relative z-10">
        <div className="container-custom">
          
          {/* Header & Google Rating Summary */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-16">
            <motion.div {...fadeInUp} className="max-w-2xl text-center lg:text-left">
              <span className="px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-4 inline-block uppercase tracking-wider">
                Google Reviews
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                What Our Clients <span className="gradient-text-blue">Say On Google</span>
              </h2>
              <p className="text-slate-400 font-light">
                Read real-time verified customer experiences and academic project success reviews from our active Google Business Profile.
              </p>
            </motion.div>

            {/* Google Rating Summary Card */}
            <motion.div 
              {...fadeInUp}
              onMouseMove={handleMouseMove}
              className="glass-card glass-card-glow glass-card-spotlight glass-card-glow-spotlight p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 border-white/5 hover:border-sky-500/20 self-center lg:self-auto shrink-0"
            >
              {/* Google Big Icon */}
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg relative z-10">
                <svg className="w-10 h-10" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <div className="text-center sm:text-left relative z-10">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                  <span className="text-3xl font-display font-black text-white">4.9</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-400 text-xs tracking-wider uppercase font-semibold mb-3">185+ Verified Reviews</p>
                <a 
                  href="https://www.google.com/search?q=Shorubenix+Info+Technology+Madurai"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sky-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Write a Review
                </a>
              </div>
            </motion.div>
          </div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} {...fadeInUp} transition={{ delay: i * 0.1 }}>
                <div 
                  onMouseMove={handleMouseMove}
                  className="glass-card glass-card-glow glass-card-spotlight glass-card-glow-spotlight p-8 md:p-10 h-full flex flex-col justify-between border-white/[0.03] hover:border-sky-500/10 relative"
                >
                  {/* Google G Logo in Top Right */}
                  <div className="absolute top-6 right-6 opacity-30 group-hover:opacity-60 transition-opacity">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>

                  <div>
                    <div className="flex gap-0.5 mb-6">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-300 text-base md:text-lg italic leading-relaxed mb-8 font-light">&ldquo;{t.text}&rdquo;</p>
                  </div>
                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 p-[1.5px] shadow-lg">
                      <div className="w-full h-full rounded-xl bg-dark-950 flex items-center justify-center text-white font-bold text-lg">
                        {t.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-base">{t.name}</p>
                      <p className="text-slate-500 text-xs font-medium tracking-wider uppercase">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Quick Contact Section */}
      <section className="section-padding bg-slate-900/10 border-t border-white/5 relative z-10 bg-grid-pattern" id="contact-form-section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-12 gap-12 max-w-5xl mx-auto items-center">
            
            {/* Info Column */}
            <div className="lg:col-span-5 text-center lg:text-left">
              <span className="px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-4 inline-block uppercase tracking-wider">Get In Touch</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                Start Your Digital <br />
                <span className="gradient-text-blue">Journey Today</span>
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed font-light">
                Have an inquiry about our web development services, final year projects, or internship registrations? Drop us a message, and our executives will get back to you shortly.
              </p>
              <div className="space-y-4 flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-slate-300 text-sm">Dedicated Tech Team support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Check className="w-5 h-5" />
                  </div>
                  <span className="text-slate-300 text-sm">Response within 2 hours</span>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-7">
              <motion.div {...fadeInUp} className="glass-card p-8 border-sky-500/10">
                <h3 className="text-xl font-display font-bold text-white mb-6">Request Callback / Send Message</h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-dark-300 mb-1.5 block">Full Name *</label>
                      <input 
                        type="text" required value={contactForm.name}
                        onChange={e => setContactForm({...contactForm, name: e.target.value})}
                        className="input-field !py-3 !text-sm" placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-dark-300 mb-1.5 block">Email Address *</label>
                      <input 
                        type="email" required value={contactForm.email}
                        onChange={e => setContactForm({...contactForm, email: e.target.value})}
                        className="input-field !py-3 !text-sm" placeholder="name@domain.com"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-dark-300 mb-1.5 block">Phone Number</label>
                      <input 
                        type="text" value={contactForm.phone}
                        onChange={e => setContactForm({...contactForm, phone: e.target.value})}
                        className="input-field !py-3 !text-sm" placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-dark-300 mb-1.5 block">Inquiry Topic</label>
                      <select 
                        value={contactForm.subject}
                        onChange={e => setContactForm({...contactForm, subject: e.target.value})}
                        className="input-field !py-3 !text-sm bg-slate-900 border border-white/10 rounded-xl"
                      >
                        <option value="IT Services Inquiry">IT Services / Software Dev</option>
                        <option value="Final Year Project support">Final Year Student Projects</option>
                        <option value="Internship Registration">Internship Programs</option>
                        <option value="Research Paper guidance">Research Paper Publications</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-dark-300 mb-1.5 block">Your Message *</label>
                    <textarea 
                      required rows={4} value={contactForm.message}
                      onChange={e => setContactForm({...contactForm, message: e.target.value})}
                      className="input-field !py-3 !text-sm resize-none" placeholder="Tell us how we can help..."
                    />
                  </div>

                  <button 
                    type="submit" disabled={sending}
                    className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 mt-4"
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
            
          </div>
        </div>
      </section>

      <ServiceDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={serviceForModal}
      />
    </div>
  )
}
