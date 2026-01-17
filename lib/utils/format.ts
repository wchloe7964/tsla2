export const formatCurrency = (val: number) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

export const formatPercent = (val: number) => 
  `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;