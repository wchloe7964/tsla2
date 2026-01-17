export const HELP_ARTICLES: Record<string, any> = {
  // BASICS CATEGORY
  'creating-account': {
    title: "Creating Your Account",
    category: "Basics",
    readTime: "3 min read",
    lastUpdated: "Jan 2026",
    content: [
      { type: 'text', body: "Joining the network requires a verified identity to ensure compliance with global financial standards." },
      { type: 'step', title: "1. Profile Setup", body: "Complete your basic profile with a valid email and legal name as it appears on your ID." },
      { type: 'step', title: "2. Identity Verification", body: "Upload a high-resolution scan of your Passport or National ID. Our AI usually approves this within 5 minutes." }
    ]
  },
  'funding-wallet': {
    title: "Funding Your Wallet",
    category: "Basics",
    readTime: "4 min read",
    lastUpdated: "Jan 2026",
    content: [
      { type: 'text', body: "Your wallet is the central hub for all capital. You must fund it before initiating any growth plans." },
      { type: 'step', title: "Direct Bank Transfer", body: "Connect your bank via the secure bridge for instant, zero-fee USD or EUR deposits." },
      { type: 'step', title: "Crypto Bridge", body: "Send BTC, ETH, or USDT to your unique wallet address. Funds appear after 2 network confirmations." }
    ]
  },

  // GROWTH PLANS CATEGORY
  'investment-plans': {
    title: "How Growth Plans Work",
    category: "Growth",
    readTime: "6 min read",
    lastUpdated: "Feb 2026",
    content: [
      { type: 'text', body: "Our growth plans use automated rebalancing to maximize yield while maintaining your chosen risk profile." },
      { type: 'step', title: "The Rebalancing Logic", body: "Every 24 hours, the system checks market volatility and adjusts your asset weightings automatically." },
      { type: 'step', title: "Performance Tracking", body: "View your 'Net Value' in real-time. This includes dividends, interest, and capital gains." }
    ]
  },
  'risk-management': {
    title: "Risk Management",
    category: "Growth",
    readTime: "5 min read",
    lastUpdated: "Feb 2026",
    content: [
      { type: 'text', body: "Capital preservation is our first priority. We use several layers of protection to shield your principal." },
      { type: 'step', title: "Stop-Loss Automation", body: "Every plan includes a mandatory emergency exit threshold that liquidates to stable assets if the market drops 15%." },
      { type: 'step', title: "Diversification Layer", body: "We never allocate more than 12% of a single plan to a single asset class." }
    ]
  },

  // PAYMENTS CATEGORY
  'transaction-fees': {
    title: "Withdrawal & Fees",
    category: "Payments",
    readTime: "2 min read",
    lastUpdated: "Jan 2026",
    content: [
      { type: 'text', body: "Transparency is key. We maintain a simple, low-fee structure for all users." },
      { type: 'step', title: "Withdrawal Windows", body: "Bank withdrawals take 1-3 business days. Crypto withdrawals are processed within 15 minutes." },
      { type: 'step', title: "Fee Schedule", body: "Internal transfers are free. External withdrawals carry a flat 0.1% network fee." }
    ]
  },
  'wallet-security': {
    title: "Wallet Security",
    category: "Payments",
    readTime: "4 min read",
    lastUpdated: "Mar 2026",
    content: [
      { type: 'text', body: "Your assets are protected by cold-storage technology and multi-signature authorization." },
      { type: 'step', title: "Cold Storage", body: "98% of user funds are kept offline in geographically distributed vaults." },
      { type: 'step', title: "Two-Factor Auth", body: "Every withdrawal requires Biometric or Hardware-key (Yubikey) confirmation." }
    ]
  }
};