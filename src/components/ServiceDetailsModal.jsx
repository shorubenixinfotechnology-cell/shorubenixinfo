import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ServiceDetailsModal({ isOpen, onClose, service }) {
  if (!service) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#030712]/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl glass-card overflow-hidden shadow-2xl border-white/10"
          >
            {/* Header / Graphic Container */}
            <div className={`h-32 bg-gradient-to-br ${service.color} opacity-20 absolute top-0 left-0 right-0`} />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-12 relative">
              <div className="flex items-center gap-6 mb-8">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} p-[1px]`}>
                  <div className="w-full h-full rounded-2xl bg-[#030712] flex items-center justify-center">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-display font-bold text-white mb-1">{service.title}</h3>
                  <p className="text-sky-400 font-semibold tracking-widest uppercase text-xs">Expert IT Services</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-display font-bold text-slate-300 uppercase tracking-wider mb-4">Overview</h4>
                  <p className="text-slate-400 text-lg font-light leading-relaxed">
                    {service.longDesc || service.desc}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-display font-bold text-slate-300 uppercase tracking-wider mb-4">Key Features & Deliverables</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {(service.features || []).map((feature) => (
                      <div key={feature} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <CheckCircle2 className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300 font-medium text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center gap-6">
                  <Link
                    to="/contact"
                    onClick={onClose}
                    className="btn-primary flex items-center justify-center gap-3 w-full sm:w-auto px-8"
                  >
                    Start Consultation
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <p className="text-slate-500 text-sm italic">
                    Contact us for a tailored quote based on your requirements.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
