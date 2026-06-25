import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, Clock, ArrowRight, Search, Tag } from 'lucide-react'
import api from '../utils/api'
import BlogDetailsModal from '../components/BlogDetailsModal'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

const defaultPosts = [
  {
    id: 1, title: 'Building Modern Web Applications with React 19',
    excerpt: 'Explore the latest features of React 19 and learn how to build performant, scalable web applications with the newest hooks and patterns.',
    content: `React 19 brings a host of new features that revolutionize how we build web applications. From the new 'use' hook for resource loading to improved transitions and action support, the framework is more powerful than ever.

Key features include:
- Server Components by default
- Enhanced Assets Loading
- Document Metadata support
- Optimized Compiler for better performance

In this article, we dive deep into each of these features with real-world examples and migration strategies.`,
    author: 'ShoRubenix', date: '2024-12-15', readTime: '8 min',
    tags: ['React', 'Web Development', 'JavaScript'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2, title: 'Python FastAPI: The Ultimate Backend Framework',
    excerpt: 'Why FastAPI is becoming the go-to choice for building high-performance APIs. Complete guide with best practices.',
    author: 'ShoRubenix', date: '2024-12-10', readTime: '10 min',
    tags: ['Python', 'FastAPI', 'Backend'],
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 3, title: 'Securing Your Web Application: Best Practices',
    excerpt: 'A comprehensive guide to web application security — from authentication to data encryption and everything in between.',
    author: 'ShoRubenix', date: '2024-12-05', readTime: '12 min',
    tags: ['Security', 'Authentication', 'Best Practices'],
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 4, title: 'Cloud Deployment Strategies for Startups',
    excerpt: 'Learn the most cost-effective cloud deployment strategies and how to scale your infrastructure as your business grows.',
    author: 'ShoRubenix', date: '2024-11-28', readTime: '7 min',
    tags: ['Cloud', 'DevOps', 'AWS'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 5, title: 'UI/UX Design Trends for 2025',
    excerpt: 'Stay ahead with the latest design trends, including glassmorphism, micro-animations, and AI-powered interfaces.',
    author: 'ShoRubenix', date: '2024-11-20', readTime: '6 min',
    tags: ['Design', 'UI/UX', 'Trends'],
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 6, title: 'PostgreSQL vs MongoDB: Choosing the Right Database',
    excerpt: 'A detailed comparison of PostgreSQL and MongoDB to help you make the right database choice for your project.',
    author: 'ShoRubenix', date: '2024-11-15', readTime: '9 min',
    tags: ['Database', 'PostgreSQL', 'MongoDB'],
    color: 'from-yellow-500 to-amber-500'
  },
]

export default function Blog() {
  const [posts, setPosts] = useState(defaultPosts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenPost = (post) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }

  // ==========================================
  // SEO & METADATA DYNAMIC CONFIGURATION
  // ==========================================
  useEffect(() => {
    document.title = "Tech Blog & Articles | Shorubenix Info Technology | Industry Insights"
    
    let metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute("content", "Read the latest tech articles, tutorials, and industry insights on React, FastAPI, Cybersecurity, Cloud Deployments, and UI/UX design trends from Shorubenix developers.")
    }
    
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.name = 'keywords'
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute("content", "Shorubenix Blog, Tech Articles, React 19, FastAPI Python, Web Security, Cloud Deployment, UI/UX Trends, Database Comparisons, Coding Tutorials")
  }, [])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/blog')
        if (res.data.posts?.length > 0) setPosts(res.data.posts)
      } catch (err) { /* use defaults */ }
    }
    fetchPosts()
  }, [])

  const allTags = [...new Set(posts.flatMap(p => p.tags))]

  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchTag = !selectedTag || p.tags.includes(selectedTag)
    return matchSearch && matchTag
  })

  return (
    <div className="pt-20">
      <section className="section-padding">
        <div className="container-custom">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm mb-4">
              Our Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Insights & <span className="gradient-text">Articles</span>
            </h1>
            <p className="text-dark-300 text-lg">
              Stay updated with the latest in technology, design, and development from our expert team.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                type="text" placeholder="Search articles..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field !pl-10 w-full sm:w-64"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  !selectedTag ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' : 'text-dark-400 hover:text-white'
                }`}
              >
                <Tag className="w-3 h-3" /> All
              </button>
              {allTags.slice(0, 6).map(tag => (
                <button
                  key={tag} onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    selectedTag === tag ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' : 'text-dark-400 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((post, i) => (
              <motion.article key={post.id} {...fadeInUp} transition={{ delay: i * 0.1 }}>
                <div 
                  onClick={() => handleOpenPost(post)}
                  className="glass-card overflow-hidden h-full flex flex-col group cursor-pointer hover:border-primary-500/30 transition-all shadow-lg hover:shadow-primary-500/10"
                >
                  <div className={`h-48 bg-gradient-to-br ${post.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-dark-950/30" />
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-1 rounded-md bg-dark-950/50 text-white text-xs backdrop-blur-sm">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-dark-400 text-xs mb-3">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-display font-semibold text-white mb-3 group-hover:text-primary-300 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-dark-400 text-sm leading-relaxed mb-4 flex-1">{post.excerpt}</p>
                    <div className="flex items-center text-primary-400 text-sm font-medium group-hover:text-primary-300 transition-colors">
                      Read Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <BlogDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        post={selectedPost} 
      />
    </div>
  )
}
