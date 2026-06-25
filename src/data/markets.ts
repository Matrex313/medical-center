import { Market, Candlestick } from '../types';

export const INITIAL_MARKETS: Market[] = [
  // Cryptocurrencies
  {
    symbol: 'BTC/USDT',
    name: 'Bitcoin',
    category: 'crypto',
    price: 67240.50,
    change24h: 3.45,
    high24h: 68100.00,
    low24h: 64850.20,
    volume24h: 2845012390,
    sparkline: [64.8, 65.2, 65.0, 65.8, 66.2, 65.9, 66.7, 67.0, 66.8, 67.24]
  },
  {
    symbol: 'ETH/USDT',
    name: 'Ethereum',
    category: 'crypto',
    price: 3485.20,
    change24h: -1.25,
    high24h: 3560.00,
    low24h: 3420.50,
    volume24h: 1589403210,
    sparkline: [35.6, 35.3, 35.1, 34.9, 35.2, 34.6, 34.5, 34.7, 34.9, 34.85]
  },
  {
    symbol: 'SOL/USDT',
    name: 'Solana',
    category: 'crypto',
    price: 142.75,
    change24h: 8.12,
    high24h: 145.50,
    low24h: 131.20,
    volume24h: 948203110,
    sparkline: [13.1, 13.2, 13.5, 13.4, 13.8, 13.9, 14.1, 14.0, 14.3, 14.27]
  },
  {
    symbol: 'BNB/USDT',
    name: 'BNB',
    category: 'crypto',
    price: 582.40,
    change24h: 0.85,
    high24h: 589.00,
    low24h: 574.30,
    volume24h: 412039480,
    sparkline: [57.4, 57.6, 57.5, 57.9, 58.1, 58.0, 58.3, 58.1, 58.2, 58.24]
  },
  {
    symbol: 'XRP/USDT',
    name: 'Ripple',
    category: 'crypto',
    price: 0.528,
    change24h: -2.34,
    high24h: 0.545,
    low24h: 0.512,
    volume24h: 328402110,
    sparkline: [0.54, 0.54, 0.53, 0.53, 0.52, 0.52, 0.51, 0.52, 0.53, 0.528]
  },
  {
    symbol: 'ADA/USDT',
    name: 'Cardano',
    category: 'crypto',
    price: 0.455,
    change24h: 4.15,
    high24h: 0.468,
    low24h: 0.431,
    volume24h: 184501230,
    sparkline: [0.43, 0.44, 0.43, 0.44, 0.45, 0.44, 0.45, 0.45, 0.46, 0.455]
  },
  {
    symbol: 'DOGE/USDT',
    name: 'Dogecoin',
    category: 'crypto',
    price: 0.1245,
    change24h: 12.35,
    high24h: 0.1310,
    low24h: 0.1080,
    volume24h: 584901230,
    sparkline: [0.10, 0.11, 0.11, 0.12, 0.11, 0.12, 0.12, 0.12, 0.13, 0.1245]
  },
  // Forex Pairs
  {
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    category: 'forex',
    price: 1.0845,
    change24h: 0.22,
    high24h: 1.0870,
    low24h: 1.0815,
    volume24h: 428019300,
    sparkline: [1.081, 1.082, 1.082, 1.083, 1.084, 1.083, 1.084, 1.085, 1.084, 1.0845]
  },
  {
    symbol: 'GBP/USD',
    name: 'Pound Sterling / US Dollar',
    category: 'forex',
    price: 1.2640,
    change24h: -0.15,
    high24h: 1.2685,
    low24h: 1.2610,
    volume24h: 310245000,
    sparkline: [1.268, 1.267, 1.265, 1.264, 1.263, 1.262, 1.263, 1.265, 1.264, 1.264]
  },
  {
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    category: 'forex',
    price: 158.20,
    change24h: 0.58,
    high24h: 158.45,
    low24h: 157.10,
    volume24h: 512039000,
    sparkline: [157.1, 157.3, 157.5, 157.4, 157.8, 157.9, 158.1, 158.0, 158.3, 158.2]
  },
  {
    symbol: 'AUD/USD',
    name: 'Australian Dollar / US Dollar',
    category: 'forex',
    price: 0.6655,
    change24h: -0.42,
    high24h: 0.6690,
    low24h: 0.6620,
    volume24h: 189304000,
    sparkline: [0.669, 0.668, 0.667, 0.665, 0.664, 0.663, 0.665, 0.666, 0.665, 0.6655]
  },
  {
    symbol: 'USD/CAD',
    name: 'US Dollar / Canadian Dollar',
    category: 'forex',
    price: 1.3680,
    change24h: 0.11,
    high24h: 1.3715,
    low24h: 1.3650,
    volume24h: 142039000,
    sparkline: [1.365, 1.366, 1.368, 1.367, 1.369, 1.368, 1.370, 1.369, 1.368, 1.368]
  },
  {
    symbol: 'EUR/GBP',
    name: 'Euro / British Pound',
    category: 'forex',
    price: 0.8578,
    change24h: 0.38,
    high24h: 0.8605,
    low24h: 0.8540,
    volume24h: 125043000,
    sparkline: [0.854, 0.855, 0.856, 0.857, 0.856, 0.858, 0.859, 0.858, 0.857, 0.8578]
  }
];

export function generateMockCandlesticks(basePrice: number, numCandles = 40): Candlestick[] {
  const candles: Candlestick[] = [];
  let currentPrice = basePrice * 0.95; // start slightly lower
  const now = new Date();

  for (let i = 0; i < numCandles; i++) {
    const date = new Date(now.getTime() - (numCandles - i) * 15 * 60 * 1000); // 15-min intervals
    const change = currentPrice * (Math.random() * 0.02 - 0.0095); // positive/negative drift
    const open = currentPrice;
    const close = currentPrice + change;
    
    // Ensure high and low contain both open and close
    const maxOC = Math.max(open, close);
    const minOC = Math.min(open, close);
    const high = maxOC + Math.random() * (currentPrice * 0.008);
    const low = minOC - Math.random() * (currentPrice * 0.008);
    const volume = Math.round(1000 + Math.random() * 15000);

    candles.push({
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      open,
      high,
      low,
      close,
      volume
    });

    currentPrice = close;
  }

  return candles;
}
