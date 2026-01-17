'use client'

import Link from 'next/link'
import { Twitter, Linkedin, Github, MessageSquare } from 'lucide-react'

const Footer = () => {
  // Function to open JivoChat
  const handleOpenChat = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && (window as any).jivo_api) {
      (window as any).jivo_api.open();
    } else {
      console.warn("Secure Chat link not yet established.");
    }
  };

  const links = [
    { name: 'Inventory', href: '/cars' },
    { name: 'Investments', href: '/investments' },
    { name: 'Stocks', href: '/stocks' },
    { name: 'Wallet', href: '/wallet' },
    { name: 'Account', href: '/account' },
    { name: 'Privacy & Legal', href: '/privacy' },
    { name: 'Contact', href: '/contact' },
    // Custom Chat Link
    { name: 'Live Support', href: '#', isChat: true }, 
    { name: 'Careers', href: '/careers' },
    { name: 'News', href: '/press' },
  ]

  return (
    <footer className="bg-black text-white/50 py-12 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
        
        {/* 1. Main Navigation */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <span className="text-white/90 font-medium tracking-tight mr-4">
            TSLA Platform © {new Date().getFullYear()}
          </span>
          {links.map((link) => (
            link.isChat ? (
              <button
                key={link.name}
                onClick={handleOpenChat}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5"
              >
                {link.name}
                <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
              </button>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-medium uppercase tracking-[0.15em] hover:text-white transition-colors duration-300"
              >
                {link.name}
              </Link>
            )
          ))}
        </nav>

        {/* 2. Status & Socials */}
        <div className="flex flex-col md:flex-row items-center gap-6 pt-4 w-full justify-center">
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-opacity opacity-60 hover:opacity-100">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-white transition-opacity opacity-60 hover:opacity-100">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-white transition-opacity opacity-60 hover:opacity-100">
              <Github className="w-4 h-4" />
            </a>
          </div>

          {/* System Status - Now also triggers chat */}
          <button 
            onClick={handleOpenChat}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95 group"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-green-500/80 group-hover:text-green-400">
              Support Online
            </span>
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer