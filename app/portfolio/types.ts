/**
 * Core data structure for the Portfolio response
 */
export interface PortfolioData {
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  investments: InvestmentNode[];
  stocks: StockHolding[];
  transactions: Transaction[];
}

export interface InvestmentNode {
  _id: string;
  planType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  amount: number;
  returns: number;
  status: 'active' | 'matured' | 'liquidated';
  startDate: string;
  endDate: string;
}

export interface StockHolding {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentValue: number;
}

export interface Transaction {
  _id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'dividend';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
}

/**
 * Reducer Actions for state management
 */
export type PortfolioAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: PortfolioData }
  | { type: 'FETCH_ERROR'; payload: string };