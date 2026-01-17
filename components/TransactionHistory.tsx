export default function TransactionHistory({ transactions, fullWidth }: { transactions: any[], fullWidth?: boolean }) {
  return (
    <div className={`bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 ${fullWidth ? 'w-full' : ''}`}>
      <h3 className="text-lg font-medium mb-6">Recent Activity</h3>
      
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-white/10 rounded-3xl">
            <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">No recent transactions</p>
          </div>
        ) : (
          transactions.map((tx: any) => (
            <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${tx.type === 'buy' ? 'bg-blue-500' : 'bg-green-500'}`} />
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">{tx.name}</p>
                  <p className="text-[9px] text-gray-500 uppercase font-bold">{tx.date}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-white">+${tx.amount}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}