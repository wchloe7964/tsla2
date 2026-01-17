import { formatCurrency, formatPercent } from '@/lib/utils/format'

export default function HoldingsTable({ holdings, isPreview }: { holdings: any[], isPreview?: boolean }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 overflow-hidden">
      <h3 className="text-lg font-medium mb-6 flex items-center justify-between">
        Current Holdings
        {isPreview && <span className="text-[10px] text-blue-500 font-bold tracking-widest uppercase">Live View</span>}
      </h3>
      
      <div className="space-y-6">
        {holdings.map((asset) => (
          <div key={asset.id} className="group flex items-center justify-between py-2">
            <div className="flex-1">
              <p className="text-sm font-bold text-white uppercase tracking-tight">{asset.name}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{asset.type}</p>
            </div>
            
            <div className="flex-1 text-center">
              <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden mx-auto">
                <div 
                  className="h-full bg-blue-600 rounded-full" 
                  style={{ width: `${asset.percent}%` }} 
                />
              </div>
              <p className="text-[9px] text-gray-600 mt-2 font-bold uppercase tracking-tighter">
                {asset.percent.toFixed(1)}% Allocation
              </p>
            </div>

            <div className="flex-1 text-right">
              <p className="text-sm font-bold text-white">{formatCurrency(asset.value)}</p>
              <p className={`text-[10px] font-bold ${asset.gain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {asset.gain >= 0 ? '+' : ''}{formatPercent(asset.percent)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}