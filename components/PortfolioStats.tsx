import { Target, Zap, Shield } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/format'

export default function PortfolioStats({ stats }: { stats: any }) {
  const items = [
    { label: 'Growth Plan', val: stats?.bestPerformer || 'N/A', icon: Zap, color: 'text-yellow-500' },
    { label: 'Holdings', val: stats?.holdingsCount || '0', icon: Target, color: 'text-blue-500' },
    { label: 'Security Status', val: 'Encrypted', icon: Shield, color: 'text-green-500' },
  ]

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-white/[0.03] ${item.color}`}>
            <item.icon size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{item.label}</p>
            <p className="text-sm font-bold text-white uppercase tracking-tight">{item.val}</p>
          </div>
        </div>
      ))}
    </div>
  )
}