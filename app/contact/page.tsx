'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'
import { Mail, Phone, MapPin, Send, CheckCircle, ChevronRight, MessageSquare } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Function to trigger JivoChat via their API
  const handleOpenChat = () => {
    if (typeof window !== 'undefined' && (window as any).jivo_api) {
      (window as any).jivo_api.open();
    } else {
      console.warn("JivoChat is still initializing...");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
    setTimeout(() => { 
      setIsSubmitted(false); 
      setFormData({ name: '', email: '', subject: '', message: '' }) 
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <>
      {/* JivoChat Widget Script */}
      <Script 
        src="//code.jivosite.com/widget/svNfhpgyVp" 
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Cinematic Ambient Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1400px] pointer-events-none opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-gray-500/10 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          {/* Header */}
          <div className="mb-20">
            <h1 className="text-sm uppercase tracking-[0.6em] font-bold text-gray-400 dark:text-gray-500 mb-4">
              Support // Connectivity
            </h1>
            <h2 className="text-5xl md:text-7xl font-light tracking-tighter">
              Get in touch.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Column: Direct Channels & Live Chat Trigger */}
            <div className="lg:col-span-5 space-y-12">
              <section>
                <h3 className="text-xs uppercase tracking-widest font-bold mb-8 text-gray-400">Communication Channels</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Neural Mail', value: 'support@tslavehiclepartners.com', icon: Mail },
                    { label: 'Voice Link', value: '+1 (352) 328-0550', icon: Phone },
                    { label: 'Global HQ', value: 'Austin, Texas', icon: MapPin },
                  ].map((item) => (
                    <div key={item.label} className="group flex items-center justify-between p-6 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all duration-500">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center">
                          <item.icon className="w-4 h-4 stroke-[1.5px]" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{item.label}</p>
                          <p className="text-sm font-medium mt-0.5">{item.value}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                  ))}
                </div>
              </section>

              {/* LIVE CHAT TRIGGER BOX */}
              <section className="p-8 rounded-[2.5rem] bg-black text-white dark:bg-white dark:text-black shadow-2xl">
                <h3 className="text-xs uppercase tracking-widest font-bold mb-4 opacity-60">Instant Protocol</h3>
                <p className="text-xl font-light leading-snug mb-6">Average response latency: <span className="font-medium text-blue-500 dark:text-blue-400">14 minutes</span>.</p>
                <button 
                  onClick={handleOpenChat}
                  className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] font-bold group bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full transition-all active:scale-95"
                >
                  Start Live Session <MessageSquare className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </button>
              </section>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="relative p-1 rounded-[3rem] bg-gradient-to-br from-gray-200 to-transparent dark:from-white/20 dark:to-transparent">
                <div className="bg-white dark:bg-black/40 backdrop-blur-3xl rounded-[2.9rem] p-8 md:p-12 border border-gray-100 dark:border-white/5">
                  {isSubmitted ? (
                    <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
                      <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_-10px_rgba(34,197,94,0.3)]">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                      </div>
                      <h3 className="text-2xl font-light mb-2">Transmission Received</h3>
                      <p className="text-gray-500 text-sm">A fleet specialist will reach out shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 ml-1">Identity</label>
                          <input 
                            name="name" 
                            onChange={handleChange} 
                            required 
                            className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none" 
                            placeholder="Full Name" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 ml-1">Secure Email</label>
                          <input 
                            type="email" 
                            name="email" 
                            onChange={handleChange} 
                            required 
                            className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none" 
                            placeholder="Email Address" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 ml-1">Subject Matter</label>
                        <select name="subject" onChange={handleChange} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none appearance-none">
                          <option>General Inquiry</option>
                          <option>Technical Support</option>
                          <option>Vehicle Inventory</option>
                          <option>Portfolio Management</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 ml-1">Message Body</label>
                        <textarea 
                          name="message" 
                          rows={5} 
                          onChange={handleChange} 
                          required 
                          className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-3xl px-6 py-4 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none resize-none" 
                          placeholder="How can we assist your journey?" 
                        />
                      </div>

                      <button 
                        disabled={isSubmitting} 
                        className="w-full bg-black dark:bg-white text-white dark:text-black rounded-full py-5 text-[11px] font-bold uppercase tracking-[0.4em] hover:opacity-80 transition-all flex items-center justify-center gap-3 shadow-xl"
                      >
                        {isSubmitting ? 'Encrypting...' : 'Initiate Transmission'}
                        {!isSubmitting && <Send className="w-3.5 h-3.5" />}
                      </button>
                    </form>
                  )}
                </div>
              </div>
              
              <p className="mt-8 text-center text-[10px] uppercase tracking-widest text-gray-400">
                End-to-End Encrypted // TSLA Secure Link v4.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}