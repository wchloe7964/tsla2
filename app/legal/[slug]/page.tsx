'use client'

import { useState } from 'react'

export default function LegalPage() {
  const sections = [
    { id: 'data-handling', title: 'Data Handling' },
    { id: 'security-protocols', title: 'Security Protocols' },
    { id: 'user-obligations', title: 'User Obligations' },
    { id: 'liability', title: 'Limitation of Liability' }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white pt-40 pb-20 px-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 hidden lg:block sticky top-40 h-fit">
          <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-500 mb-8">Navigation</h3>
          <div className="space-y-4">
            {sections.map(section => (
              <a 
                key={section.id} 
                href={`#${section.id}`}
                className="block text-sm text-gray-500 hover:text-blue-500 transition-colors font-medium"
              >
                {section.title}
              </a>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="lg:col-span-9 max-w-[700px]">
          <h1 className="text-xs uppercase tracking-[0.6em] font-bold text-blue-500 mb-6">Legal Documentation</h1>
          <h2 className="text-6xl font-light tracking-tighter mb-12">Privacy Policy.</h2>
          
          <div className="prose prose-invert prose-p:text-gray-400 prose-p:text-lg prose-p:font-light prose-h3:text-white prose-h3:text-2xl prose-h3:font-light prose-h3:tracking-tight space-y-16">
            <section id="data-handling">
              <h3>1. Data Handling</h3>
              <p>
                In 2026, data privacy is our highest priority. We utilize end-to-end encryption for all personal identifiers. Your data is stored across decentralized nodes to ensure that no single point of failure can compromise your identity.
              </p>
            </section>

            <section id="security-protocols">
              <h3>2. Security Protocols</h3>
              <p>
                Our platform employs biometric verification and hardware-level security keys. By using our services, you agree to maintain the integrity of your security devices and report any unauthorized access within 60 minutes.
              </p>
            </section>
            
            <section id="user-obligations">
              <h3>3. User Obligations</h3>
              <p>
                Users are responsible for maintaining the confidentiality of their account credentials. You agree not to use the platform for any activities that violate international financial regulations or regional laws.
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}