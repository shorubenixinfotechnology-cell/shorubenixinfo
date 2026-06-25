import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, User, Clock, Share2, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BlogDetailsModal({ isOpen, onClose, post }) {
  if (!post) return null

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        toast.error('Failed to share')
      }
    }
  }

  const handleComment = () => {
    toast.success('Comments coming soon! You can contact us for more info.')
  }

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
            className="fixed inset-0 bg-dark-950/90 backdrop-blur-md z-[60]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div className="w-full max-w-4xl max-h-[90vh] glass-card bg-dark-900 border border-white/10 shadow-2xl overflow-hidden flex flex-col pointer-events-auto rounded-3xl">
              {/* Header Image/Banner */}
              <div className={`h-48 md:h-64 bg-gradient-to-br ${post.color} relative shrink-0`}>
                <div className="absolute inset-0 bg-dark-950/40" />
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-dark-950/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-dark-950 transition-all z-10"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags?.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl md:text-4xl font-display font-bold text-white leading-tight">
                    {post.title}
                  </h2>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-white/5 text-dark-300">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center border border-primary-500/30">
                      <User className="w-4 h-4 text-primary-400" />
                    </div>
                    <span className="text-sm font-medium">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-dark-500" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-dark-500" />
                    {post.readTime} read
                  </div>
                </div>

                {/* Article Text */}
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-primary-200/90 leading-relaxed mb-6 font-medium italic">
                    {post.excerpt}
                  </p>
                  <div className="text-dark-200 space-y-6 leading-relaxed text-base md:text-lg whitespace-pre-line">
                    {post.content || (
                      "Full article content coming soon. We are currently preparing a detailed breakdown of this topic including case studies and technical implementations. Stay tuned for updates!"
                    )}
                  </div>
                </div>

                {/* Share/Actions */}
                <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm transition-all border border-white/10 group"
                    >
                      <Share2 className="w-4 h-4 text-primary-400 group-hover:scale-110 transition-transform" /> Share
                    </button>
                    <button 
                      onClick={handleComment}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm transition-all border border-white/10 group"
                    >
                      <MessageSquare className="w-4 h-4 text-primary-400 group-hover:scale-110 transition-transform" /> Comment
                    </button>
                  </div>
                  <span className="text-dark-500 text-xs">© 2024 Shorubenix Info Technology</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
