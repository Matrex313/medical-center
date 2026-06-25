/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Market {
  symbol: string;
  name: string;
  category: 'crypto' | 'forex';
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  sparkline: number[];
}

export interface Candlestick {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'trade_buy' | 'trade_sell';
  amount: number;
  asset?: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  details?: string;
}

export interface BotTrade {
  id: string;
  marketSymbol: string;
  action: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice?: number;
  amount: number;
  profitPercent?: number;
  profitAmount?: number;
  status: 'OPEN' | 'CLOSED';
  timestamp: string;
  exitTimestamp?: string;
  reason: string;
  wasMistake: boolean;
  mistakeReason?: string;
  lessonLearned?: string;
}

export interface BotMemory {
  totalTrades: number;
  winRate: number;
  profitableTrades: number;
  totalProfit: number;
  currentRiskLevel: 'low' | 'medium' | 'high';
  learnedMistakes: string[];
  lastLearningTimestamp?: string;
}

export interface UserProfile {
  email: string;
  balance: number;
  demoBalance: number;
  isLoggedIn: boolean;
}

export interface PriceAlert {
  id: string;
  marketSymbol: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  isActive: boolean;
  createdAt: string;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'trade' | 'system';
  timestamp: string;
  isRead: boolean;
}

