import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, ExternalLink, Globe, Cpu, CheckCircle2 } from 'lucide-react'

export default function ProjectDetailsModal({ isOpen, onClose, project, onBuy }) {
  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-[60]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-y-auto z-[70] p-4 sm:p-6"
          >
            <div className="glass shadow-2xl rounded-3xl overflow-hidden border border-white/10 flex flex-col md:flex-row relative">
              
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-dark-900/50 flex items-center justify-center text-white hover:bg-red-500/20 hover:text-red-400 transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side: Image/Visuals */}
              <div className="md:w-5/12 bg-dark-900 relative min-h-[300px]">
                {project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${project.color} opacity-40`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                   <span className="px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-300 text-[10px] font-bold uppercase tracking-widest mb-3 inline-block">
                    {project.category}
                  </span>
                  <h3 className="text-2xl font-display font-bold text-white leading-tight">
                    {project.title}
                  </h3>
                </div>
              </div>

              {/* Right Side: Details */}
              <div className="md:w-7/12 p-8 md:p-10 bg-dark-950/50 flex flex-col">
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Premium Solution</span>
                  </div>
                  <p className="text-slate-300 text-lg leading-relaxed mb-6 font-light">
                    {project.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div>
                    <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-primary-400" /> Technology Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech?.map(t => (
                        <span key={t} className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-slate-300 text-[10px] font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-blue-400" /> Platform Scope
                    </h4>
                    <span className="text-white text-sm font-medium">Universal Web / Cloud Native</span>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between gap-6">
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Ownership Price</span>
                    <span className="text-3xl font-display font-bold text-white">₹{project.price?.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-1 gap-3">
                    <button 
                      onClick={() => onBuy(project)}
                      className="flex-1 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" /> Buy Theme
                    </button>
                    <button className="px-6 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl border border-white/10 transition-all flex items-center justify-center group">
                      <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
