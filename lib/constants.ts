export const navigation = [
  { name: 'Inventory', href: '/cars', description: 'Premium EV selection' },
  { name: 'Invest', href: '/investments', description: 'Automated portfolios' },
  { name: 'Stocks', href: '/stocks', description: 'Live market data' },
  { name: 'Portfolio', href: '/portfolio', description: 'Track performance' },
  { name: 'Wallet', href: '/wallet', description: 'Crypto funding' },
]

export const featuredCars = [
  {
    id: 1,
    name: 'Model S Plaid',
    description: 'Beyond Ludicrous',
    price: '$89,990',
    image: 'https://cdn.motor1.com/images/mgl/BEooZ/s3/2021-tesla-model-s-plaid.jpg',
    specs: {
      range: '396 mi',
      acceleration: '1.99s',
      topSpeed: '200 mph',
    }
  },
  {
    id: 2,
    name: 'Model 3',
    description: 'Performance',
    price: '$50,990',
    image: 'https://cdn.motor1.com/images/mgl/mrz1e/s1/2022-tesla-model-3.jpg',
    specs: {
      range: '315 mi',
      acceleration: '3.1s',
      topSpeed: '162 mph',
    }
  },
  {
    id: 3,
    name: 'Model X',
    description: 'Plaid',
    price: '$94,990',
    image: 'https://cdn.motor1.com/images/mgl/0x2G6/s1/tesla-model-x.jpg',
    specs: {
      range: '348 mi',
      acceleration: '2.5s',
      topSpeed: '155 mph',
    }
  },
]

export const stockData = {
  featured: [
    { symbol: 'TSLA', name: 'Tesla Inc', price: '$246.73', change: '+4.32%', changeColor: 'text-green-500' },
    { symbol: 'AAPL', name: 'Apple Inc', price: '$189.25', change: '+1.23%', changeColor: 'text-green-500' },
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: '$495.22', change: '+3.45%', changeColor: 'text-green-500' },
  ],
  gainers: [
    { symbol: 'TSLA', change: '+4.32%' },
    { symbol: 'NVDA', change: '+3.45%' },
    { symbol: 'AMD', change: '+2.89%' },
    { symbol: 'MSTR', change: '+2.56%' },
  ],
  losers: [
    { symbol: 'RIVN', change: '-2.34%' },
    { symbol: 'LCID', change: '-1.89%' },
    { symbol: 'NIO', change: '-1.45%' },
  ],
  active: [
    { symbol: 'TSLA', volume: '145.2M' },
    { symbol: 'AAPL', volume: '98.7M' },
    { symbol: 'NVDA', volume: '87.3M' },
    { symbol: 'AMD', volume: '65.4M' },
  ]
}

export const newsArticles = [
  {
    id: 1,
    title: 'Tesla Announces Record Q4 Deliveries',
    source: 'Bloomberg',
    time: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&q=80',
    sentiment: 'positive'
  },
  {
    id: 2,
    title: 'EV Market Growth Exceeds Expectations',
    source: 'Reuters',
    time: '4 hours ago',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&q=80',
    sentiment: 'positive'
  },
  {
    id: 3,
    title: 'New Battery Technology Breakthrough',
    source: 'TechCrunch',
    time: '6 hours ago',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&q=80',
    sentiment: 'positive'
  },
]