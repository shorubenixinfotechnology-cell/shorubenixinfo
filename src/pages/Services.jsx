import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Code2, Smartphone, Cloud, Palette, Database, Shield,
  Globe, Zap, ArrowRight, CheckCircle2, Star
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

const services = [
  {
    icon: Code2, title: 'Web Development', color: 'from-blue-500 to-cyan-500',
    desc: 'Custom websites and web applications built with modern frameworks like React, Next.js, and Python.',
    features: ['Responsive Design', 'SEO Optimized', 'Fast Performance', 'CMS Integration'],
    price: 'Starting from ₹15,000'
  },
  {
    icon: Smartphone, title: 'Mobile App Development', color: 'from-purple-500 to-pink-500',
    desc: 'Native and cross-platform mobile apps for iOS and Android using React Native and Flutter.',
    features: ['Cross-Platform', 'Push Notifications', 'Offline Support', 'App Store Deployment'],
    price: 'Starting from ₹25,000'
  },
  {
    icon: Palette, title: 'UI/UX Design', color: 'from-pink-500 to-rose-500',
    desc: 'Beautiful, intuitive user interfaces and seamless user experiences that convert.',
    features: ['Wireframing', 'Prototyping', 'User Research', 'Design Systems'],
    price: 'Starting from ₹10,000'
  },
  {
    icon: Cloud, title: 'Cloud Solutions', color: 'from-emerald-500 to-teal-500',
    desc: 'AWS, Azure, and Google Cloud deployments with auto-scaling and high availability.',
    features: ['Auto Scaling', 'CI/CD Pipeline', 'Monitoring', '99.9% Uptime'],
    price: 'Starting from ₹20,000'
  },
  {
    icon: Database, title: 'Database Management', color: 'from-orange-500 to-amber-500',
    desc: 'Optimized database design, migration, and management for PostgreSQL, MongoDB, and more.',
    features: ['Schema Design', 'Query Optimization', 'Backup & Recovery', 'Data Migration'],
    price: 'Starting from ₹12,000'
  },
  {
    icon: Shield, title: 'Cybersecurity', color: 'from-red-500 to-orange-500',
    desc: 'Comprehensive security audits, penetration testing, and protection strategies.',
    features: ['Security Audit', 'Penetration Testing', 'SSL Setup', 'Firewall Config'],
    price: 'Starting from ₹18,000'
  },
  {
    icon: Globe, title: 'Digital Marketing & SEO', color: 'from-indigo-500 to-blue-500',
    desc: 'Data-driven marketing strategies, SEO optimization, and social media management.',
    features: ['SEO Optimization', 'Content Strategy', 'Social Media', 'Analytics'],
    price: 'Starting from ₹8,000'
  },
  {
    icon: Zap, title: 'API Development', color: 'from-yellow-500 to-amber-500',
    desc: 'RESTful and GraphQL APIs with authentication, rate limiting, and documentation.',
    features: ['REST & GraphQL', 'Authentication', 'Documentation', 'Rate Limiting'],
    price: 'Starting from ₹15,000'
  },
]



export default function Services() {
  const [activeService, setActiveService] = useState(0)

  // ==========================================
  // SEO & METADATA DYNAMIC CONFIGURATION
  // ==========================================
  useEffect(() => {
    document.title = "Our Services | Shorubenix Info Technology | Premium IT Solutions"
    
    let metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute("content", "Explore our premium IT solutions including Web Development, Mobile Apps, UI/UX Design, Cloud Solutions, Database Management, Cybersecurity, Digital Marketing, and APIs.")
    }
    
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.name = 'keywords'
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute("content", "Web Development, Mobile App Development, UI/UX Design, Cloud Solutions, Database Management, Cybersecurity, Digital Marketing, SEO, API Development, Shorubenix Services")
  }, [])

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <motion.div {...fadeInUp}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm mb-4">
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Premium IT <span className="gradient-text">Solutions</span>
            </h1>
            <p className="text-dark-300 text-lg">
              From web development to cloud deployment, we provide comprehensive technology services to accelerate your business growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                {...fadeInUp}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveService(i)}
                className={`glass-card p-6 cursor-pointer transition-all duration-300 ${
                  activeService === i ? 'border-primary-500/40 shadow-lg shadow-primary-500/10' : ''
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} p-0.5 mb-4`}>
                  <div className="w-full h-full rounded-xl bg-dark-900 flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-display font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed mb-4">{service.desc}</p>
                <div className="space-y-2">
                  {service.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-dark-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {f}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-dark-700/50">
                  <span className="text-sm font-display font-semibold text-primary-400">{service.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


    </div>
  )
}
