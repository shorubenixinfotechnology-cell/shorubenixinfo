import { Link } from 'react-router-dom'
import { Code2, Mail, Phone, MapPin, Twitter, Linkedin, Instagram, ArrowRight, Heart } from 'lucide-react'
import logoIcon from '../../assets/ICON.png'

const footerLinks = {
  Company: [
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Browse Themes', path: '/portfolio' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ],
  Services: [
    { name: 'Web Development', path: '/services' },
    { name: 'Mobile Apps', path: '/services' },
    { name: 'UI/UX Design', path: '/services' },
    { name: 'Cloud Solutions', path: '/services' },
    { name: 'IT Consulting', path: '/services' },
  ],
  Support: [
    { name: 'Documentation', path: '/blog' },
    { name: 'FAQs', path: '/contact' },
    { name: 'Privacy Policy', path: '/' },
    { name: 'Terms of Service', path: '/' },
    { name: 'Refund Policy', path: '/' },
  ],
}

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-dark-800/50">
      {/* CTA Section */}
      <div className="section-padding pb-0">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 p-8 md:p-12">
            <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1.2' cy='1.2' r='1.2' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E\")" }} />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                  Ready to Transform Your Business?
                </h3>
                <p className="text-primary-100/80 text-lg">
                  Let&apos;s discuss your project and create something amazing together.
                </p>
              </div>
              <Link
                to="/contact"
                className="flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl group whitespace-nowrap"
              >
                Start a Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-2.5 mb-6 group">
                <div className="relative flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 p-[1.5px] shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-all duration-300">
                    <div className="w-full h-full rounded-xl bg-dark-950 flex items-center justify-center overflow-hidden">
                      <img 
                        src={logoIcon} 
                        alt="Shorubenix Icon" 
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                  </div>
                  <span className="text-lg font-display font-extrabold text-white tracking-tight group-hover:text-sky-400 transition-colors duration-300">
                    Shorubenix
                  </span>
                </div>
              </Link>
              <p className="text-dark-400 mb-4 max-w-sm leading-relaxed">
                We deliver cutting-edge IT solutions that drive business growth. From web development to cloud infrastructure, we&apos;re your trusted technology partner.
              </p>
              <p className="text-sky-400/80 text-xs font-semibold uppercase tracking-wider mb-6">
                Building Innovation. Empowering Success. Transforming Futures.
              </p>
              <div className="space-y-3">
                <a href="mailto:shorubenixinfotech@gmail.com" className="flex items-center gap-3 text-dark-400 hover:text-primary-400 transition-colors">
                  <Mail className="w-4 h-4" /> shorubenixinfotech@gmail.com
                </a>
                <a href="tel:+916384640244" className="flex items-center gap-3 text-dark-400 hover:text-primary-400 transition-colors">
                  <Phone className="w-4 h-4" /> +91 6384640244
                </a>
                <div className="flex items-center gap-3 text-dark-400">
                  <MapPin className="w-4 h-4 flex-shrink-0" /> Madurai, Tamil Nadu
                </div>
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-display font-semibold text-white mb-4">{title}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-dark-400 hover:text-primary-400 transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-dark-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-dark-500 text-sm flex items-center gap-1">
              © {new Date().getFullYear()} Shorubenix Info Technology. Built with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> in India
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-dark-800/50 flex items-center justify-center text-dark-400 hover:text-primary-400 hover:bg-dark-700/50 transition-all"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
