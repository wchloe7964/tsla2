import { Hammer } from 'lucide-react'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
        <Hammer className="text-blue-500 w-10 h-10" />
      </div>
      <h1 className="text-4xl font-light tracking-tighter text-white mb-4 uppercase">
        Scheduled Maintenance
      </h1>
      <p className="text-gray-500 max-w-md text-sm leading-relaxed uppercase tracking-widest">
        We are currently upgrading our infrastructure. The platform will be back online shortly.
      </p>
    </div>
  )
}