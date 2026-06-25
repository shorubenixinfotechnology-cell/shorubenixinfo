import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Target, Lightbulb, Award, Code2, Cpu, BookOpen, 
  GraduationCap, Check, Briefcase, Zap, Shield, Sparkles, Star
} from 'lucide-react'

import subbulakshmiImg from '../assets/subbulakshmi.jpg'
import rubanrajImg from '../assets/Rubanraj.png'
import johnsonselvaImg from '../assets/Johnsonselva.jpg'

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

const achievements = [
  { icon: Award, text: '100+ Successful Projects Delivered' },
  { icon: GraduationCap, text: 'Academic Project Development Expertise' },
  { icon: BookOpen, text: 'Research Paper Publication Support' },
  { icon: Briefcase, text: 'Internship & Training Programs' },
  { icon: Code2, text: 'Web & Mobile Application Development' },
  { icon: Cpu, text: 'IoT & Embedded Solutions' },
  { icon: Users, text: 'Client-Centric Technology Services' },
  { icon: Zap, text: 'Continuous Innovation & Growth' }
]

const whyChooseUs = [
  { title: 'Experienced Technology Team', desc: 'A skilled pool of developers, advisors, and creators built to tackle complex digital challenges.' },
  { title: 'Industry-Focused Solutions', desc: 'Deploying robust products matching modern industry benchmarks and corporate architectures.' },
  { title: 'End-to-End Project Support', desc: 'Complete conceptualization, writing, source code compilation, documentation, and viva prep.' },
  { title: 'Modern Development Practices', desc: 'Leveraging reliable tech stacks, version control pipelines, and clean architectures.' },
  { title: 'Quality Assurance Standards', desc: 'Rigorous validation, code reviews, and testing to guarantee secure deliverables.' },
  { title: 'Transparent Communication', desc: 'Direct, clear updates during all phases of development, publications, or internships.' },
  { title: 'On-Time Delivery', desc: 'Committed to strictly aligned project schedules and prompt publishing deadlines.' },
  { title: 'Long-Term Client Relationships', desc: 'Supporting students and businesses with dedicated post-launch support and growth advisory.' }
]

const timeline = [
  {
    year: '2022',
    title: 'The Beginning',
    desc: 'Shorubenix Info Technology was established with a bold vision to create innovative technology solutions and empower the next generation of digital professionals.'
  },
  {
    year: '2023',
    title: 'Expanding Horizons',
    desc: 'Expanded services into Academic Project Development, Research Paper Publication Support, Internship Programs, IoT Solutions, and Software Development.'
  },
  {
    year: '2024',
    title: 'Digital Excellence',
    desc: 'Successfully delivered numerous software projects, automated business workflows, and guided students through industry-focused technical training and career development.'
  },
  {
    year: '2025',
    title: 'Innovation & Growth',
    desc: 'Strengthened expertise in Web Development, Mobile Applications, Cloud Technologies, AI-powered solutions, and Enterprise Software Systems while expanding client relationships across multiple sectors.'
  },
  {
    year: '2026',
    title: 'Success & Recognition',
    desc: 'Achieved significant milestones through successful project deliveries, increased client satisfaction, growing professional partnerships, and becoming a trusted technology partner.'
  }
]

const leadership = [
  {
    name: 'Subbulakshmi',
    role: 'Founder & Chief Executive Officer (CEO)',
    initials: 'SL',
    gradient: 'from-sky-400 to-blue-600',
    image: subbulakshmiImg,
    desc: 'Subbulakshmi is the visionary founder of Shorubenix Info Technology. With a strong passion for innovation and entrepreneurship, she established the company with a mission to deliver high-quality, technology-driven solutions. She focuses on building a sustainable growth ecosystem by empowering students, startups, and businesses through modern digital services and innovative ideas.'
  },
  {
    name: 'Rubanraja',
    role: 'Co-Founder & Managing Director',
    initials: 'RR',
    gradient: 'from-blue-500 to-indigo-600',
    image: rubanrajImg,
    desc: 'Rubanraja leads the company’s strategic direction, business development, and operational excellence. He is dedicated to building strong client relationships and delivering impactful digital solutions. His focus is on innovation, quality service, and scaling the organization with a strong technical and business foundation.'
  },
  {
    name: 'Johnsonselva',
    role: 'Technical Advisor',
    initials: 'JS',
    gradient: 'from-indigo-500 to-purple-600',
    image: johnsonselvaImg,
    desc: 'Jonsan provides advanced technical leadership and architectural guidance for all major projects. He ensures scalable, efficient, and future-ready software solutions by integrating modern technologies and best development practices. His expertise supports the company in maintaining technical excellence and innovation.'
  }
]

export default function About() {
  
  useEffect(() => {
    // Dynamic SEO Optimization
    document.title = "About Us | Shorubenix Info Technology | Software & Academic Solutions"
    
    let metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute("content", "Shorubenix Info Technology delivers innovative software solutions, academic project development, research support, IoT solutions, web development, mobile app development, internship programs, and technology consulting services that help students, startups, and businesses achieve digital success.")
    }
    
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.name = 'keywords'
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute("content", "Shorubenix Info Technology, Software Development Company, IT Services, Web Development, Mobile App Development, Academic Projects, Internship Training, Research Paper Publication, IoT Solutions, Technology Consulting, Digital Transformation, Software Company India")
  }, [])

  const handleMouseMove = (e) => {
    const { currentTarget, clientX, clientY } = e
    const { left, top } = currentTarget.getBoundingClientRect()
    currentTarget.style.setProperty("--mouse-x", `${clientX - left}px`)
    currentTarget.style.setProperty("--mouse-y", `${clientY - top}px`)
  }

  return (
    <div className="overflow-hidden grain">
      
      {/* Hero Section */}
      <section className="relative pt-36 pb-20 bg-dark-blue-grad overflow-hidden z-10">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none select-none bg-grid-pattern" />
        
        {/* Ambient Glows */}
        <div className="absolute top-[15%] left-[20%] w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-[80px] animate-blob" />
        <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '3s' }} />

        <div className="container-custom relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto flex flex-col items-center"
          >
            <span className="px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-6 uppercase tracking-wider">
              About Our Company
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-black leading-[1.1] mb-8 tracking-tight text-white">
              Empowering Innovation <br />
              <span className="gradient-text-blue">Through Technology</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl leading-relaxed font-light">
              Shorubenix Info Technology delivers innovative software solutions, academic project development, research support, IoT solutions, web development, mobile application development, internship programs, and technology consulting services that help students, startups, and businesses achieve digital success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Company Intro Section */}
      <section className="section-padding bg-slate-900/10 relative z-10 border-y border-white/5 bg-grid-pattern">
        <div className="container-custom">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <motion.div {...fadeInUp} className="lg:col-span-6">
              <span className="px-3 py-1 rounded-md bg-sky-500/10 text-sky-400 text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                Our Foundation
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                Bridging Education <br />
                <span className="gradient-text-blue">& Industry</span>
              </h2>
              <p className="text-slate-300 leading-relaxed font-light text-lg mb-6">
                Founded in 2022, Shorubenix Info Technology has grown into a technology-driven organization dedicated to software innovation, academic excellence, and digital transformation.
              </p>
              <p className="text-slate-400 leading-relaxed font-light">
                We specialize in creating cutting-edge solutions that bridge the gap between education and industry while empowering businesses with modern technology. By matching technical rigor with practical application, we ensure the success of all candidates and enterprise clients.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} className="lg:col-span-6 grid sm:grid-cols-2 gap-6">
              {/* Mission Card */}
              <div 
                onMouseMove={handleMouseMove}
                className="glass-card glass-card-glow glass-card-spotlight glass-card-glow-spotlight p-8 border-white/[0.03] hover:border-sky-500/30 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-6">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3">Our Mission</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-light">
                    To deliver innovative, reliable, and scalable technology solutions that empower students, professionals, startups, and enterprises.
                  </p>
                </div>
              </div>

              {/* Vision Card */}
              <div 
                onMouseMove={handleMouseMove}
                className="glass-card glass-card-glow glass-card-spotlight glass-card-glow-spotlight p-8 border-white/[0.03] hover:border-sky-500/30 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3">Our Vision</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-light">
                    To become a globally recognized technology company known for innovation, excellence, and transformative digital solutions.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="section-padding relative z-10">
        <div className="container-custom">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-20">
            <span className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-4 inline-block uppercase tracking-wider">
              Management
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
              Leadership <span className="gradient-text-blue">Team</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {leadership.map((profile, i) => (
              <motion.div
                key={profile.name}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                onMouseMove={handleMouseMove}
                className="glass-card glass-card-glow glass-card-spotlight glass-card-glow-spotlight overflow-hidden border-white/5 hover:border-sky-500/20 flex flex-col"
              >
                {/* Large Profile Image - Full Width at Top */}
                <div className="relative h-72 md:h-80 w-full overflow-hidden group">
                  {profile.image ? (
                    <img 
                      src={profile.image} 
                      alt={profile.name} 
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${profile.gradient} flex items-center justify-center text-white font-display font-black text-4xl`}>
                      {profile.initials}
                    </div>
                  )}
                  {/* Subtle vignette gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
                  
                  {/* Overlay Name & Role */}
                  <div className="absolute bottom-6 left-6 right-6 z-10">
                    <span className="px-2.5 py-1 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[10px] uppercase font-semibold tracking-wider mb-2 inline-block">
                      {profile.role}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white leading-tight mt-1">{profile.name}</h3>
                  </div>
                </div>

                {/* Profile Description Container */}
                <div className="p-6 flex-grow flex flex-col justify-between border-t border-white/5 bg-slate-950/10">
                  <p className="text-slate-400 text-sm leading-relaxed font-light">{profile.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="section-padding bg-slate-900/10 border-y border-white/5 relative z-10 bg-grid-pattern">
        <div className="container-custom">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4 inline-block uppercase tracking-wider">
              Our Record
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
              Company <span className="gradient-text-blue">Achievements</span>
            </h2>
          </motion.div>

          <motion.div {...staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {achievements.map((item, i) => (
              <motion.div 
                key={item.text} 
                {...fadeInUp} 
                transition={{ delay: i * 0.05 }}
                onMouseMove={handleMouseMove}
                className="glass-card glass-card-glow glass-card-spotlight glass-card-glow-spotlight p-6 flex flex-col items-center text-center border-white/5 hover:border-sky-500/20"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4 border border-white/5 text-sky-400 relative z-10">
                  <item.icon className="w-5 h-5" />
                </div>
                <h4 className="text-white font-display font-bold text-base leading-snug relative z-10">{item.text}</h4>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding relative z-10">
        <div className="container-custom">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-20">
            <span className="px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-4 inline-block uppercase tracking-wider">
              Chronology
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
              Company <span className="gradient-text-blue">Timeline</span>
            </h2>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Center connector line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-sky-500/50 via-sky-500/10 to-transparent -translate-x-[0.5px] z-0" />
            
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className={`relative flex flex-col md:flex-row items-stretch gap-8 mb-16 z-10 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Year Marker Desktop Left/Right */}
                <div className={`hidden md:flex w-1/2 items-center ${i % 2 === 0 ? 'justify-end pr-12' : 'justify-start pl-12'}`}>
                  <span className="text-5xl font-display font-black text-slate-800 tracking-tight transition-colors">
                    {item.year}
                  </span>
                </div>

                {/* Center dot */}
                <div className="absolute left-4 md:left-1/2 w-3.5 h-3.5 rounded-full bg-sky-500 -translate-x-[7px] mt-6 ring-4 ring-[#030712] z-20" />

                {/* Content Box */}
                <div className="w-full md:w-1/2 pl-12 md:pl-0">
                  <div 
                    onMouseMove={handleMouseMove}
                    className="glass-card glass-card-glow glass-card-spotlight glass-card-glow-spotlight p-8 border-white/5 hover:border-sky-500/20 relative"
                  >
                    {/* Mobile Year Badge */}
                    <span className="md:hidden inline-block px-3 py-1 rounded-md bg-sky-500/10 text-sky-400 text-xs font-bold mb-3">
                      {item.year}
                    </span>
                    <h3 className="text-xl font-display font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-light">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Internship Programs Section */}
      <section className="section-padding bg-slate-900/10 border-y border-white/5 relative overflow-hidden z-10 bg-grid-pattern">
        <div className="container-custom">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-4 inline-block uppercase tracking-wider">
              Careers
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-white">
              Practical <span className="gradient-text-blue">Internship Programs</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto font-light text-center">
              Kickstart your career with industrial training certifications and active product support.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                onMouseMove={handleMouseMove}
                className="glass-card glass-card-glow glass-card-spotlight glass-card-glow-spotlight p-8 border-white/[0.03] hover:border-sky-500/20 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-md bg-sky-500/10 text-sky-400 text-xs font-bold uppercase tracking-wider">{intern.duration}</span>
                    <Briefcase className="w-5 h-5 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-3">{intern.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed font-light">{intern.desc}</p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Skills Covered:</p>
                  <p className="text-xs text-sky-300 font-mono">{intern.skills}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding border-t border-white/5 relative z-10">
        <div className="container-custom">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-20">
            <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4 inline-block uppercase tracking-wider">
              Core Strengths
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
              Why <span className="gradient-text-blue">Choose Us</span>
            </h2>
          </motion.div>

          <motion.div {...staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeInUp}
                transition={{ delay: i * 0.05 }}
                onMouseMove={handleMouseMove}
                className="glass-card glass-card-glow glass-card-spotlight glass-card-glow-spotlight p-8 border-white/5 hover:border-emerald-500/20 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                    <Check className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-light">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tagline CTA Section */}
      <section className="py-24 relative z-10 overflow-hidden bg-dark-blue-grad">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none select-none bg-grid-pattern" />
        <div className="container-custom relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div {...fadeInUp}>
            <Sparkles className="w-10 h-10 text-sky-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white leading-tight mb-8 tracking-tight max-w-3xl mx-auto">
              Building Innovation. <br />
              Empowering Success. <span className="gradient-text-blue">Transforming Futures.</span>
            </h2>
            <p className="text-slate-400 text-base max-w-lg mx-auto mb-10 font-light">
              Join hands with Shorubenix Info Technology to build scalable products, pursue state-of-the-art research publications, and transform digital ideas.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl hover:from-sky-400 hover:to-blue-500 transform hover:-translate-y-0.5 transition-all duration-300 shadow-xl shadow-sky-500/20"
            >
              Get In Touch <Star className="w-4 h-4 fill-white text-white" />
            </a>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
