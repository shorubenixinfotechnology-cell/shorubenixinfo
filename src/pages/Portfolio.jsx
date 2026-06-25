import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Search, Filter, Eye, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import ProjectDetailsModal from '../components/ProjectDetailsModal'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

const categories = ['All', 'UI/UX Design', 'Web Development', 'App Development', 'Cloud Solutions', 'Business Automation']

const defaultProjects = [
  {
    id: 1, id_label: '#1', title: 'FinTech Dashboard', category: 'Web Development',
    description: 'A comprehensive financial dashboard for a modern banking startup, featuring real-time data visualization.',
    tech: ['React', 'Tailwind CSS', 'D3.js'],
    price: 5000,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    liveUrl: '#',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2, id_label: '#2', title: 'Secure Health App', category: 'App Development',
    description: 'HIPAA-compliant mobile application for patient-doctor communication and medical records.',
    tech: ['React Native', 'Node.js', 'MongoDB'],
    price: 7000,
    image: 'https://images.unsplash.com/photo-1576091160550-2173bdb999ef?auto=format&fit=crop&w=800&q=80',
    liveUrl: '#',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 3, id_label: '#3', title: 'E-Commerce Cloud Migration', category: 'Cloud Solutions',
    description: 'Migrated a legacy monolithic e-commerce platform to a highly scalable AWS serverless architecture.',
    tech: ['AWS Lambda', 'DynamoDB', 'S3'],
    price: 6000,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    liveUrl: '#',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 4, id_label: '#4', title: 'SaaS Platform Redesign', category: 'UI/UX Design',
    description: 'Modernized the user experience for a B2B SaaS platform, leading to 40% increase in user engagement.',
    tech: ['Figma', 'Adobe XD', 'Prototyping'],
    price: 4500,
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&w=800&q=80',
    liveUrl: '#',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 5, id_label: '#5', title: 'Automated Billing System', category: 'Business Automation',
    description: 'Self-service billing and invoice automation tool for medium-sized enterprises.',
    tech: ['Python', 'FastAPI', 'PostgreSQL'],
    price: 5500,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    liveUrl: '#',
    color: 'from-yellow-500 to-amber-500'
  },
]

export default function Portfolio() {
  const [projects, setProjects] = useState(defaultProjects)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  // ==========================================
  // SEO & METADATA DYNAMIC CONFIGURATION
  // ==========================================
  useEffect(() => {
    document.title = "Our Portfolio | Shorubenix Info Technology | Featured Projects & Themes"
    
    let metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute("content", "Browse our successfully delivered projects and customizable source code themes for Web Development, App Development, Cloud Solutions, UI/UX, and Business Automation.")
    }
    
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.name = 'keywords'
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute("content", "Shorubenix Portfolio, Client Projects, Web Apps, Mobile Apps, UI/UX, Cloud Migrations, Business Automation, Source Code Themes, Project Source Code")
  }, [])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects')
        if (res.data.projects?.length > 0) {
          setProjects(res.data.projects)
        }
      } catch (err) {
        // Use default projects
      }
    }
    fetchProjects()
  }, [])

  const filtered = projects.filter(p => {
    const matchCategory = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  const handleBuy = (project) => {
    navigate(`/payment?amount=${project.price}&item=${encodeURIComponent(project.title)}&project_id=${project.id}`)
  }

  const handleOpenModal = (project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  return (
    <div className="pt-20">
      <section className="section-padding">
        <div className="container-custom">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm mb-4">
              Browse Themes
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Our <span className="gradient-text">Premium Themes</span>
            </h1>
            <p className="text-dark-300 text-lg">
              Check out some of our successful projects and specialized solutions.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div {...fadeInUp} className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-4 h-4 text-dark-400" />
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === cat
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                    : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                type="text"
                placeholder="Search themes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field !pl-10 w-full sm:w-64"
              />
            </div>
          </motion.div>

          {/* Projects Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="glass-card overflow-hidden group h-full flex flex-col bg-white/[0.03] hover:bg-white/[0.05] transition-all duration-300 border border-white/5 hover:border-white/10 shadow-xl">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${project.color}`} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent opacity-60" />
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-primary-400 border border-primary-500/20 px-2 py-0.5 rounded">
                          {project.category}
                        </span>
                        <span className="text-[10px] font-bold text-dark-400">
                          {project.id_label}
                        </span>
                      </div>

                      <h3 className="text-xl font-display font-bold text-primary-400 mb-3 group-hover:text-primary-300 transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-dark-300 text-sm leading-relaxed mb-5 flex-1 line-clamp-3">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map(t => (
                          <span key={t} className="px-2.5 py-1 rounded bg-dark-800 text-dark-400 text-[10px] font-medium border border-white/5">
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-dark-500 font-medium uppercase">Price</span>
                          <span className="text-xl font-display font-bold text-white">
                            ₹{project.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleBuy(project)}
                            className="bg-primary-600 hover:bg-primary-500 text-white p-2.5 rounded-lg transition-colors group/btn"
                            title="Buy Now"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleOpenModal(project)}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-dark-400 text-lg">No projects found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      <ProjectDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
        onBuy={handleBuy}
      />
    </div>
  )
}
