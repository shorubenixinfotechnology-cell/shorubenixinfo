import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Hi there! 👋 How can we help you today with your IT needs or themes?", time: "15:30", isBot: true }
  ])
  
  const phoneNumber = '916384640244'
  const businessName = 'Shorubenix Support'
  
  useEffect(() => {
    // Show tooltip after 3 seconds
    const timer = setTimeout(() => {
      setShowTooltip(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleOpenChat = () => {
    setIsSending(true)
    
    // Add a simulated user message
    const newMessages = [...messages, { text: "I'm interested in your services.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isBot: false }]
    setMessages(newMessages)
    
    // Show "Auto-reply" after a short delay
    setTimeout(() => {
      setMessages([...newMessages, { 
        text: "Thank you for reaching out! 🚀 Redirecting you to our WhatsApp now...", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
        isBot: true 
      }])
      
      // Finally redirect after another short delay
      setTimeout(() => {
        const message = encodeURIComponent("Hello! I'm interested in your services.")
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
        setIsSending(false)
        setIsOpen(false)
      }, 1500)
    }, 800)
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-72 sm:w-80 glass-card bg-dark-900/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden mb-2"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 text-white font-bold">
                    S
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-600"></div>
                </div>
                <div>
                  <h4 className="text-white font-display font-bold text-sm">{businessName}</h4>
                  <p className="text-emerald-100 text-[10px]">Typically replies in minutes</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                disabled={isSending}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 bg-dark-950/50 max-h-[300px] overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed border relative ${
                    msg.isBot 
                    ? 'bg-dark-800/80 border-white/5 rounded-tl-none text-dark-200' 
                    : 'bg-emerald-500/20 border-emerald-500/30 rounded-tr-none text-emerald-100'
                  }`}>
                    <p>{msg.text}</p>
                    <span className="text-[9px] text-dark-500 mt-1 block text-right">{msg.time}</span>
                  </div>
                </div>
              ))}
              {isSending && messages.length < 3 && (
                <div className="flex justify-start">
                  <div className="bg-dark-800/80 border border-white/5 rounded-2xl rounded-tl-none p-3 flex gap-1">
                    <div className="w-1.5 h-1.5 bg-dark-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-dark-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-dark-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Footer / CTA */}
            <div className="p-4 bg-dark-900/80 border-t border-white/5">
              <button
                onClick={handleOpenChat}
                disabled={isSending}
                className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? 'Connecting...' : <><Send className="w-4 h-4" /> Start Chat</>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group">
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-white text-dark-950 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl flex items-center gap-2"
            >
              Need help? Chat with us!
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsOpen(!isOpen)
            setShowTooltip(false)
          }}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
            isOpen ? 'bg-red-500 hover:bg-red-400' : 'bg-emerald-500 hover:bg-emerald-400'
          }`}
        >
          {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
        </motion.button>
      </div>
    </div>
  )
}
