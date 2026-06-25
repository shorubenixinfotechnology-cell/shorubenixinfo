import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

const contactInfo = [
  {
    icon: Mail,
    label: 'Email Us',
    values: ['shorubenixinfotech@gmail.com', ' '],
    type: 'email'
  },
  {
    icon: Phone,
    label: 'Call Us',
    details: [
      { label: 'Customer Support', value: '+91 6384640244' },
      { label: 'Admin Contact', value: '+91 8778584218' }
    ],
    note: 'Monday – Friday: 9:00 AM – 6:00 PM (EST)',
    type: 'phone'
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    details: [
      { label: 'Customer Support', value: '+91 6384640244' },
      { label: 'Admin Contact', value: '+91 8778584218' }
    ],
    type: 'whatsapp'
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Surviyor Colony, Madurai – 625007, Tamil Nadu, India',
    type: 'address'
  },
]

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  // ==========================================
  // SEO & METADATA DYNAMIC CONFIGURATION
  // ==========================================
  useEffect(() => {
    document.title = "Contact Us | Shorubenix Info Technology | Request Callback"
    
    let metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute("content", "Get in touch with Shorubenix Info Technology. Contact us for IT services inquiries, academic project support, internship registrations, or research paper guidance.")
    }
    
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.name = 'keywords'
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute("content", "Contact Shorubenix, IT Support, Request Callback, Student Project Guidance, Internship Registration, Publications Assistance, Office Location Madurai")
  }, [])

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }
    
    // Construct WhatsApp message
    const whatsappMessage = `*New Inquiry from Shorubenix Website*\n\n` +
      `*Name:* ${formData.name}\n` +
      `*Email:* ${formData.email}\n` +
      `*Phone:* ${formData.phone || 'N/A'}\n` +
      `*Subject:* ${formData.subject || 'N/A'}\n\n` +
      `*Message:*\n${formData.message}`
    
    const whatsappUrl = `https://wa.me/916384640244?text=${encodeURIComponent(whatsappMessage)}`
    
    setLoading(true)
    try {
      await api.post('/contacts', formData)
    } catch (err) {
      console.error('Backend logging failed:', err)
      // We still proceed to WhatsApp even if backend save fails
    } finally {
      toast.success('Opening WhatsApp...')
      window.open(whatsappUrl, '_blank')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setLoading(false)
    }
  }

  return (
    <div className="pt-20">
      <section className="section-padding">
        <div className="container-custom">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm mb-4">
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Let&apos;s <span className="gradient-text">Talk</span>
            </h1>
            <p className="text-dark-300 text-lg">
              Have a project in mind? We&apos;d love to hear from you. Send us a message and we&apos;ll respond within 24 hours.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <motion.div {...fadeInUp} className="lg:col-span-2 space-y-6">
              {contactInfo.map((item) => (
                <div key={item.label} className="glass-card p-6 flex items-start gap-4 hover:border-primary-500/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5 text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-dark-400 mb-2 font-medium">{item.label}</p>

                    {item.type === 'email' && (
                      <div className="space-y-1">
                        {item.values.map(val => (
                          <a key={val} href={`mailto:${val}`} className="block text-white hover:text-primary-400 transition-colors text-sm">
                            {val}
                          </a>
                        ))}
                      </div>
                    )}

                    {item.type === 'phone' && (
                      <div className="space-y-2">
                        {item.details.map(detail => (
                          <div key={detail.value} className="text-sm">
                            <span className="text-dark-400 block text-[10px] uppercase tracking-wider">{detail.label}</span>
                            <a href={`tel:${detail.value.replace(/\s/g, '')}`} className="text-white hover:text-primary-400 transition-colors">
                              {detail.value}
                            </a>
                          </div>
                        ))}
                        {item.note && <p className="text-[10px] text-dark-500 mt-2 italic">{item.note}</p>}
                      </div>
                    )}

                    {item.type === 'whatsapp' && (
                      <div className="space-y-3">
                        {item.details.map(detail => (
                          <div key={detail.value} className="text-sm">
                            <span className="text-dark-400 block text-[10px] uppercase tracking-wider">{detail.label}</span>
                            <span className="text-white">{detail.value}</span>
                          </div>
                        ))}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {item.details.map(detail => (
                            <a
                              key={detail.label}
                              href={`https://wa.me/${detail.value.replace(/[^0-9]/g, '')}`}
                              target="_blank" rel="noopener noreferrer"
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${detail.label.includes('Support')
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                : 'bg-primary-500/10 text-primary-400 border-primary-500/20 hover:bg-primary-500/20'
                                }`}
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              {detail.label.split(' ')[0]}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.type === 'address' && (
                      <p className="text-white text-sm leading-relaxed">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Quick Chat CTA */}
              <div className="glass-card p-6 bg-gradient-to-br from-primary-500/10 to-accent-500/10">
                <MessageCircle className="w-8 h-8 text-primary-400 mb-3" />
                <h3 className="font-display font-semibold text-white mb-2">Quick Response</h3>
                <p className="text-dark-400 text-sm">We typically respond within 2-4 hours during business hours.</p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-dark-300 mb-2 block">Name *</label>
                    <input
                      type="text" name="name" value={formData.name}
                      onChange={handleChange} placeholder="John Doe"
                      className="input-field" required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-dark-300 mb-2 block">Email *</label>
                    <input
                      type="email" name="email" value={formData.email}
                      onChange={handleChange} placeholder="john@example.com"
                      className="input-field" required
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-dark-300 mb-2 block">Phone</label>
                    <input
                      type="tel" name="phone" value={formData.phone}
                      onChange={handleChange} placeholder="+91 98765 43210"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-dark-300 mb-2 block">Subject</label>
                    <input
                      type="text" name="subject" value={formData.subject}
                      onChange={handleChange} placeholder="Project Inquiry"
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-dark-300 mb-2 block">Message *</label>
                  <textarea
                    name="message" value={formData.message}
                    onChange={handleChange} placeholder="Tell us about your project..."
                    rows={6} className="input-field resize-none" required
                  />
                </div>
                <button
                  type="submit" disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
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
      </section>
    </div>
  )
}
