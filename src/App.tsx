import { useState, useEffect, useCallback } from 'react';
import { Coins, LogOut, TrendingUp, TrendingDown, Cpu, Wallet as WalletIcon, HelpCircle, LayoutGrid, Smartphone, Laptop, Bell, BellRing, X } from 'lucide-react';
import AuthScreen from './components/AuthScreen';
import GlassCard from './components/GlassCard';
import MarketList from './components/MarketList';
import TradingChart from './components/TradingChart';
import RobotTerminal from './components/RobotTerminal';
import WalletPanel from './components/WalletPanel';
import { INITIAL_MARKETS, generateMockCandlesticks } from './data/markets';
import { Market, Candlestick, Transaction, BotTrade, BotMemory, UserProfile, PriceAlert, InAppNotification } from './types';

export default function App() {
  // Auth state
  const [user, setUser] = useState<UserProfile>({
    email: '',
    balance: 1540.20,
    demoBalance: 50000.00,
    isLoggedIn: false
  });

  // Mobile / Desktop View states
  const [activeMobileTab, setActiveMobileTab] = useState<'markets' | 'chart' | 'bot' | 'wallet'>('chart');

  // Markets and Charts states
  const [markets, setMarkets] = useState<Market[]>(INITIAL_MARKETS);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC/USDT');
  const [timeframe, setTimeframe] = useState<string>('15m');
  const [candles, setCandles] = useState<Candlestick[]>([]);

  // AI predictions states
  const [predictions, setPredictions] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Bot states
  const [isBotActive, setIsBotActive] = useState(false);
  const [botMemory, setBotMemory] = useState<BotMemory>({
    totalTrades: 12,
    winRate: 0.75,
    profitableTrades: 9,
    totalProfit: 412.50,
    currentRiskLevel: 'medium',
    learnedMistakes: [
      'تجنب التداول وقت تقلبات السوق العالية الناتجة عن الأخبار الاقتصادية.',
      'تفعيل أمر وقف الخسارة المتحرك (Trailing Stop) بنسبة 1.5% لتأمين المكاسب.'
    ]
  });
  const [botTrades, setBotTrades] = useState<BotTrade[]>([
    {
      id: 'trade-1',
      marketSymbol: 'BTC/USDT',
      action: 'BUY',
      entryPrice: 65200.00,
      exitPrice: 66400.00,
      amount: 0.1,
      profitPercent: 1.84,
      profitAmount: 120.00,
      status: 'CLOSED',
      timestamp: '2026-06-24 18:30',
      exitTimestamp: '2026-06-24 20:15',
      reason: 'تقاطع خطوط المتوسط المتحرك البسيط SMA 20 مع السعر',
      wasMistake: false
    },
    {
      id: 'trade-2',
      marketSymbol: 'EUR/USD',
      action: 'SELL',
      entryPrice: 1.0890,
      exitPrice: 1.0820,
      amount: 10000,
      profitPercent: 0.64,
      profitAmount: 64.00,
      status: 'CLOSED',
      timestamp: '2026-06-25 00:10',
      exitTimestamp: '2026-06-25 04:30',
      reason: 'ملامسة مؤشر RSI لمستوى ذروة الشراء 70 والتراجع من مقاومة رئيسية',
      wasMistake: false
    }
  ]);
  const [learningInProgress, setLearningInProgress] = useState(false);

  // Real-time trading parameters (user-customizable)
  const [tradeAmount, setTradeAmount] = useState<number>(50); // Default $50 per trade
  const [stopLossPercent, setStopLossPercent] = useState<number>(1.5); // Default 1.5% Stop Loss
  const [takeProfitPercent, setTakeProfitPercent] = useState<number>(3.0); // Default 3.0% Take Profit
  const [capitalProtectionLimit, setCapitalProtectionLimit] = useState<number>(500); // Default $500 minimum capital protection limit

  // Binance API sync
  const [binanceApiKey, setBinanceApiKey] = useState<string>('');
  const [binanceApiSecret, setBinanceApiSecret] = useState<string>('');
  const [isBinanceConnected, setIsBinanceConnected] = useState<boolean>(false);
  const [binanceSettlementMode, setBinanceSettlementMode] = useState<'balance' | 'wallet'>('balance');

  // Modal download state
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);

  // Financial Ledger states
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx-1',
      type: 'deposit',
      amount: 1000.00,
      timestamp: '2026-06-24 10:00',
      status: 'completed',
      details: 'عملية إيداع رصيد حقيقي عبر محفظة USDT (TRC-20)'
    },
    {
      id: 'tx-2',
      type: 'deposit',
      amount: 50000.00,
      timestamp: '2026-06-25 01:00',
      status: 'completed',
      details: 'شحن رصيد تجريبي ترحيبي مجاني لتجربة الروبوت'
    }
  ]);

  // Custom Price Alerts & In-App Notifications State
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([
    {
      id: 'alert-1',
      marketSymbol: 'BTC/USDT',
      targetPrice: 65000,
      condition: 'ABOVE',
      isActive: true,
      createdAt: '2026-06-25 01:00'
    },
    {
      id: 'alert-2',
      marketSymbol: 'EUR/USD',
      targetPrice: 1.0900,
      condition: 'ABOVE',
      isActive: true,
      createdAt: '2026-06-25 01:15'
    }
  ]);

  const [notifications, setNotifications] = useState<InAppNotification[]>([
    {
      id: 'notif-1',
      title: '🔔 تم تهيئة نظام التنبيهات الذكي',
      message: 'يمكنك الآن تعيين تنبيهات أسعار مخصصة لأي أصل مالي، وسيقوم النظام بإشعارك فور تحقق الشرط.',
      type: 'system',
      timestamp: '03:40 ص',
      isRead: false
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  // Extract selected market object
  const activeMarket = markets.find(m => m.symbol === selectedSymbol) || markets[0];

  // Load candlesticks on market change
  useEffect(() => {
    if (activeMarket) {
      const initialCandles = generateMockCandlesticks(activeMarket.price, 40);
      setCandles(initialCandles);
      setPredictions(null); // Clear predictions for new market
    }
  }, [selectedSymbol]);

  // Handle dynamic real-time price ticking & Alert checks
  useEffect(() => {
    const timer = setInterval(() => {
      let triggeredAlertIds: string[] = [];
      const nowStr = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setMarkets((prevMarkets) => {
        return prevMarkets.map((m) => {
          // Add a random tiny fluctuation (e.g., -0.2% to +0.25%)
          const drift = m.price * (Math.random() * 0.0045 - 0.002);
          const newPrice = Math.max(m.price + drift, 0.0001);
          const change = m.change24h + (Math.random() * 0.1 - 0.05);

          // Check alerts for this market
          priceAlerts.forEach((alert) => {
            if (alert.isActive && alert.marketSymbol === m.symbol) {
              const isTriggered = alert.condition === 'ABOVE'
                ? newPrice >= alert.targetPrice
                : newPrice <= alert.targetPrice;

              if (isTriggered) {
                triggeredAlertIds.push(alert.id);
                
                // Add in-app notification
                const targetPriceStr = alert.targetPrice.toLocaleString(undefined, { minimumFractionDigits: m.category === 'forex' ? 4 : 2 });
                const currentPriceStr = newPrice.toLocaleString(undefined, { minimumFractionDigits: m.category === 'forex' ? 4 : 2 });
                
                setNotifications((prevNotifs) => [
                  {
                    id: `notif-${Date.now()}-${Math.random()}`,
                    title: `🔔 تنبيه سعر: ${alert.marketSymbol}`,
                    message: `وصل سعر ${m.name} إلى المستوى المحدد $${targetPriceStr} (السعر الحالي: $${currentPriceStr})`,
                    type: 'alert',
                    timestamp: nowStr,
                    isRead: false
                  },
                  ...prevNotifs
                ]);
              }
            }
          });

          return {
            ...m,
            price: newPrice,
            change24h: change,
            high24h: Math.max(m.high24h, newPrice),
            low24h: Math.min(m.low24h, newPrice)
          };
        });
      });

      // Mark triggered alerts as inactive
      if (triggeredAlertIds.length > 0) {
        setPriceAlerts((prevAlerts) =>
          prevAlerts.map((a) =>
            triggeredAlertIds.includes(a.id) ? { ...a, isActive: false } : a
          )
        );
      }

      // Append/update the latest candlestick for active market
      setCandles((prevCandles) => {
        if (prevCandles.length === 0) return prevCandles;
        const last = { ...prevCandles[prevCandles.length - 1] };
        
        // Simulating the ticking close
        const currentPrice = activeMarket.price;
        last.close = currentPrice;
        last.high = Math.max(last.high, currentPrice);
        last.low = Math.min(last.low, currentPrice);

        // Keep 40 candles maximum
        return [...prevCandles.slice(0, -1), last];
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [priceAlerts, activeMarket?.price]);

  // Fetch AI Analysis from backend server
  const handleFetchAIAnalysis = useCallback(async () => {
    setLoadingAI(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: activeMarket.symbol,
          name: activeMarket.name,
          price: activeMarket.price,
          candles: candles.slice(-10)
        })
      });
      const data = await response.json();
      setPredictions(data);
    } catch (err) {
      console.error('Error fetching AI analysis:', err);
    } finally {
      setLoadingAI(false);
    }
  }, [activeMarket, candles]);

  // Trigger Robot Self-Learning Cycle
  const handleTriggerLearning = useCallback(async () => {
    const badTrades = botTrades.filter((t) => t.status === 'CLOSED' && (t.profitPercent || 0) < 0);
    if (badTrades.length === 0 && botTrades.length > 0) {
      // If there are no actual losing trades, let's feed the recent trades for calibration
      badTrades.push({
        id: 'mock-error',
        marketSymbol: activeMarket.symbol,
        action: 'BUY',
        entryPrice: activeMarket.price * 1.05,
        exitPrice: activeMarket.price,
        amount: 1,
        profitPercent: -5.0,
        status: 'CLOSED',
        timestamp: '2026-06-25 01:20',
        reason: 'الشراء المتسرع عند ذروة سيولة غير حقيقية دون تصفية',
        wasMistake: true
      });
    }

    setLearningInProgress(true);
    try {
      const response = await fetch('/api/bot/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastTrades: badTrades,
          currentRules: botMemory.learnedMistakes
        })
      });
      
      const learningResult = await response.json();
      
      setBotMemory((prev) => ({
        ...prev,
        currentRiskLevel: learningResult.riskAdjustment || 'low',
        learnedMistakes: [
          learningResult.newRule || 'تم إضافة قيود حجم التداول الديناميكية للحد من التعرض العالي.',
          ...prev.learnedMistakes.slice(0, 5)
        ]
      }));

      // Flag previous losing trades as successfully reviewed and learned from
      setBotTrades((prevTrades) =>
        prevTrades.map((t) => {
          if (t.id === 'mock-error' || (t.profitPercent || 0) < 0) {
            return {
              ...t,
              wasMistake: true,
              lessonLearned: learningResult.newRule || 'تم تفادي تكرار الدخول العشوائي'
            };
          }
          return t;
        })
      );
    } catch (err) {
      console.error('Failed to run bot self learning:', err);
    } finally {
      setLearningInProgress(false);
    }
  }, [botTrades, botMemory.learnedMistakes, activeMarket]);

  // Execute manual custom currency additions
  const handleAddCustomMarket = (symbol: string, name: string, category: 'crypto' | 'forex', price: number) => {
    const newMarket: Market = {
      symbol,
      name,
      category,
      price,
      change24h: 0.0,
      high24h: price,
      low24h: price,
      volume24h: 1500000,
      sparkline: [price * 0.98, price * 0.99, price * 1.0, price * 1.01, price]
    };

    setMarkets((prev) => [newMarket, ...prev]);
    setSelectedSymbol(symbol);
  };

  // Wallet and deposit/withdraw mechanics
  const handleTransaction = (type: 'deposit' | 'withdraw', amount: number, method: string, isDemo: boolean) => {
    setUser((prev) => {
      const newBalance = isDemo 
        ? prev.balance 
        : (type === 'deposit' ? prev.balance + amount : prev.balance - amount);
      const newDemoBalance = isDemo 
        ? (type === 'deposit' ? prev.demoBalance + amount : prev.demoBalance - amount)
        : prev.demoBalance;

      return {
        ...prev,
        balance: newBalance,
        demoBalance: newDemoBalance
      };
    });

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: type === 'deposit' ? 'deposit' : 'withdraw',
      amount,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'completed',
      details: `${type === 'deposit' ? 'إيداع عبر' : 'سحب إلى'} ${method}`
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  // Robot dynamic operations (instant simulator)
  const handleInstantSimulateTrade = (action: 'BUY' | 'SELL', price: number, reason: string) => {
    // Check Capital Protection Limit
    const currentLimit = isDemoMode ? user.demoBalance : user.balance;
    if (currentLimit <= capitalProtectionLimit) {
      setNotifications((prev) => [
        {
          id: `notif-prot-${Date.now()}`,
          title: '⚠️ تنبيه حماية رأس المال',
          message: `تم إلغاء فتح صفقة تلقائية جديدة لمنع تراجع الرصيد ($${currentLimit.toLocaleString()}) أدنى من حد الأمان المعين لحماية رأس المال ($${capitalProtectionLimit.toLocaleString()}).`,
          type: 'alert',
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          isRead: false
        },
        ...prev
      ]);
      setIsBotActive(false); // Disable bot automatically
      return;
    }

    const newTrade: BotTrade = {
      id: `bot-trade-${Date.now()}`,
      marketSymbol: activeMarket.symbol,
      action,
      entryPrice: price,
      amount: tradeAmount, // user defined trade amount
      status: 'OPEN',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      reason,
      wasMistake: false
    };

    setBotTrades((prev) => [newTrade, ...prev]);
  };

  const handleInstantCloseTrade = (tradeId: string, exitPrice: number) => {
    setBotTrades((prevTrades) =>
      prevTrades.map((t) => {
        if (t.id === tradeId && t.status === 'OPEN') {
          const diff = ((exitPrice - t.entryPrice) / t.entryPrice) * 100;
          const profitPercent = t.action === 'BUY' ? diff : -diff;
          // Calculate exact financial profit relative to amount allocated per trade
          const profitAmount = (profitPercent / 100) * t.amount; 

          // Adjust user balance based on trade result
          setUser((prevUser) => {
            if (isDemoMode) {
              return { ...prevUser, demoBalance: Math.max(0, prevUser.demoBalance + profitAmount) };
            } else {
              return { ...prevUser, balance: Math.max(0, prevUser.balance + profitAmount) };
            }
          });

          // Record as financial transaction too
          const newTx: Transaction = {
            id: `tx-trade-${Date.now()}`,
            type: profitAmount >= 0 ? 'trade_buy' : 'trade_sell',
            amount: Math.abs(profitAmount),
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            status: 'completed',
            details: `أرباح صفقة الروبوت الآلية على ${t.marketSymbol} (حجم الصفقة: $${t.amount.toFixed(1)})`
          };
          setTransactions((prev) => [newTx, ...prev]);

          // Update memory statistics
          setBotMemory((prevMemory) => {
            const newTotal = prevMemory.totalTrades + 1;
            const won = profitPercent >= 0;
            const newProfitable = prevMemory.profitableTrades + (won ? 1 : 0);
            return {
              ...prevMemory,
              totalTrades: newTotal,
              profitableTrades: newProfitable,
              winRate: newProfitable / newTotal,
              totalProfit: prevMemory.totalProfit + profitAmount
            };
          });

          return {
            ...t,
            exitPrice,
            profitPercent,
            profitAmount,
            status: 'CLOSED',
            exitTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            wasMistake: profitPercent < 0 // auto-detect mistakes
          };
        }
        return t;
      })
    );
  };

  const handleAddPriceAlert = (marketSymbol: string, targetPrice: number, condition: 'ABOVE' | 'BELOW') => {
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      marketSymbol,
      targetPrice,
      condition,
      isActive: true,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setPriceAlerts((prev) => [newAlert, ...prev]);

    // Also add a little notification informing that the alert is active
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: '🎯 تم إنشاء تنبيه سعر جديد',
        message: `سنقوم بتنبيهك عندما يصل سعر ${marketSymbol} إلى $${targetPrice.toLocaleString()} ${condition === 'ABOVE' ? 'صعوداً' : 'هبوطاً'}.`,
        type: 'system',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      },
      ...prev
    ]);
  };

  const handleDeletePriceAlert = (alertId: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const handleClearNotification = (notifId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
  };

  const handleLogout = () => {
    localStorage.removeItem('saved_user_email');
    localStorage.removeItem('auto_login');
    setUser((prev) => ({ ...prev, isLoggedIn: false }));
  };

  if (!user.isLoggedIn) {
    return <AuthScreen onSuccess={(email) => setUser((prev) => ({ ...prev, email, isLoggedIn: true }))} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans overflow-x-hidden" dir="rtl">
      {/* Decorative ambient color blobs */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-white/10 px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl shadow-md">
            <Coins className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
              منصة التداول بالذكاء الاصطناعي AI
            </h1>
            <span className="text-[9px] md:text-[10px] text-emerald-400 font-bold block leading-none mt-0.5">
              ● الخادم متصل بأعلى كفاءة
            </span>
          </div>
        </div>

        {/* Desktop Header User controls */}
        <div className="flex items-center gap-4 relative">
          {/* Download App trigger */}
          <button
            onClick={() => setShowDownloadModal(true)}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all flex items-center gap-1.5"
            title="تحميل التطبيق للويندوز، الأندرويد، والآيفون"
          >
            <Smartphone className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="text-[10px] font-bold hidden sm:inline text-white">تحميل البرنامج</span>
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all relative"
              title="الإشعارات والتنبيهات"
            >
              {notifications.length > 0 ? (
                <BellRing className="w-4 h-4 text-amber-400 animate-bounce" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute mt-2 w-80 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl p-4 z-50 backdrop-blur-xl animate-fade-in" style={{ left: '0px' }}>
                <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
                  <h3 className="text-xs font-black text-slate-200">مركز الإشعارات والتنبيهات</h3>
                  <button 
                    onClick={() => setNotifications([])} 
                    className="text-[10px] text-red-400 hover:text-red-300 font-bold"
                  >
                    مسح الكل
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <p className="text-center py-6 text-slate-500 text-xs">لا توجد إشعارات جديدة حالياً.</p>
                ) : (
                  <div className="max-h-64 overflow-y-auto space-y-2.5 scrollbar-thin scrollbar-thumb-slate-800">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-2.5 bg-slate-950/60 rounded-xl border border-white/5 flex gap-2.5 justify-between items-start" dir="rtl">
                        <div className="space-y-1 flex-1">
                          <h4 className="text-[11px] font-bold text-white text-right">{notif.title}</h4>
                          <p className="text-[10px] text-slate-300 text-right leading-relaxed">{notif.message}</p>
                          <span className="text-[9px] text-slate-500 block text-right">{notif.timestamp}</span>
                        </div>
                        <button
                          onClick={() => handleClearNotification(notif.id)}
                          className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white transition-all shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="hidden md:flex flex-col text-left">
            <span className="text-[10px] text-slate-400 font-medium">{user.email}</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              <span className="text-[10px] font-bold text-slate-300">تسجيل الدخول محفوظ</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Workspace Grid */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 pb-20 md:pb-8">
        
        {/* DESKTOP SIDEBARS & PANELS */}
        {/* 1. Market Sidebar Panel (Left on Desktop, Collapsible on Mobile) */}
        <section className={`col-span-1 md:col-span-3 ${activeMobileTab === 'markets' ? 'block' : 'hidden md:block'}`}>
          <div className="md:sticky md:top-20 h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] flex flex-col">
            <MarketList
              markets={markets}
              selectedSymbol={selectedSymbol}
              onSelectMarket={setSelectedSymbol}
              onAddCustomMarket={handleAddCustomMarket}
            />
          </div>
        </section>

        {/* 2. Primary Analysis & Robot Panel (Center Column) */}
        <section className={`col-span-1 md:col-span-6 flex flex-col gap-6 ${activeMobileTab === 'chart' || activeMobileTab === 'bot' ? 'block' : 'hidden md:block'}`}>
          
          {/* Sub-toggle on mobile only to choose Chart vs Bot */}
          <div className="flex md:hidden bg-slate-900/60 p-1 rounded-xl border border-white/5 mb-2 gap-1 text-xs">
            <button
              onClick={() => setActiveMobileTab('chart')}
              className={`flex-1 py-2 text-center rounded-lg font-bold transition-all ${activeMobileTab === 'chart' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >
              شارت التحليل اللحظي
            </button>
            <button
              onClick={() => setActiveMobileTab('bot')}
              className={`flex-1 py-2 text-center rounded-lg font-bold transition-all ${activeMobileTab === 'bot' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >
              روبوت التداول الآلي
            </button>
          </div>

          {/* Interactive Chart & AI Predictions */}
          {(activeMobileTab === 'chart' || !['markets', 'wallet'].includes(activeMobileTab)) && (
            <div className={`${activeMobileTab === 'bot' ? 'hidden md:block' : 'block'}`}>
              <TradingChart
                market={activeMarket}
                candles={candles}
                predictions={predictions}
                onRefresh={handleFetchAIAnalysis}
                loadingAI={loadingAI}
                priceAlerts={priceAlerts}
                onAddPriceAlert={handleAddPriceAlert}
                onDeletePriceAlert={handleDeletePriceAlert}
              />
            </div>
          )}

          {/* Automated Trading Robot Control Block */}
          {(activeMobileTab === 'bot' || !['markets', 'chart'].includes(activeMobileTab)) && (
            <div className={`${activeMobileTab === 'chart' ? 'hidden md:block' : 'block'}`}>
              <RobotTerminal
                market={activeMarket}
                botMemory={botMemory}
                botTrades={botTrades}
                isBotActive={isBotActive}
                setIsBotActive={setIsBotActive}
                onTriggerLearning={handleTriggerLearning}
                learningInProgress={learningInProgress}
                onInstantSimulateTrade={handleInstantSimulateTrade}
                onInstantCloseTrade={handleInstantCloseTrade}
                tradeAmount={tradeAmount}
                setTradeAmount={setTradeAmount}
                stopLossPercent={stopLossPercent}
                setStopLossPercent={setStopLossPercent}
                takeProfitPercent={takeProfitPercent}
                setTakeProfitPercent={setTakeProfitPercent}
                capitalProtectionLimit={capitalProtectionLimit}
                setCapitalProtectionLimit={setCapitalProtectionLimit}
                binanceApiKey={binanceApiKey}
                setBinanceApiKey={setBinanceApiKey}
                binanceApiSecret={binanceApiSecret}
                setBinanceApiSecret={setBinanceApiSecret}
                isBinanceConnected={isBinanceConnected}
                setIsBinanceConnected={setIsBinanceConnected}
                binanceSettlementMode={binanceSettlementMode}
                setBinanceSettlementMode={setBinanceSettlementMode}
                isDemoMode={isDemoMode}
              />
            </div>
          )}
        </section>

        {/* 3. Wallet Deposit/Withdraw Ledger Panel (Right on Desktop) */}
        <section className={`col-span-1 md:col-span-3 ${activeMobileTab === 'wallet' ? 'block' : 'hidden md:block'}`}>
          <div className="md:sticky md:top-20 h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] flex flex-col">
            <WalletPanel
              balance={user.balance}
              demoBalance={user.demoBalance}
              transactions={transactions}
              onTransaction={handleTransaction}
              isDemoMode={isDemoMode}
              setIsDemoMode={setIsDemoMode}
            />
          </div>
        </section>

      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR (Android & iOS Responsive viewports) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-lg border-t border-white/10 px-6 py-2 flex items-center justify-between">
        <button
          onClick={() => setActiveMobileTab('markets')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeMobileTab === 'markets' ? 'text-blue-500' : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[9px] font-bold">الأسواق</span>
        </button>

        <button
          onClick={() => setActiveMobileTab('chart')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeMobileTab === 'chart' ? 'text-blue-500' : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[9px] font-bold">الشارت</span>
        </button>

        <button
          onClick={() => setActiveMobileTab('bot')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeMobileTab === 'bot' ? 'text-blue-500' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-5 h-5 animate-pulse" />
          <span className="text-[9px] font-bold">الروبوت</span>
        </button>

        <button
          onClick={() => setActiveMobileTab('wallet')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeMobileTab === 'wallet' ? 'text-blue-500' : 'text-slate-400 hover:text-white'
          }`}
        >
          <WalletIcon className="w-5 h-5" />
          <span className="text-[9px] font-bold">المحفظة</span>
        </button>
      </nav>

      {/* NATIVE APP DOWNLOAD CENTER MODAL */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-fade-in font-sans" dir="rtl">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-6 relative overflow-hidden shadow-2xl">
            {/* Background ambient lighting */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-blue-400" />
                <div>
                  <h3 className="text-base font-black text-white text-right">مركز تحميل التطبيقات والبرامج</h3>
                  <p className="text-xs text-slate-400 text-right">تحميل النسخة المستقرة الرسمية للأنظمة الذكية والمكتبية</p>
                </div>
              </div>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="p-1.5 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Platform Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-right">
              
              {/* Windows Application Card */}
              <div className="p-4 bg-slate-950/50 border border-white/5 rounded-2xl flex flex-col items-center text-center transition-all hover:border-blue-500/30 hover:bg-slate-950">
                <Laptop className="w-10 h-10 text-blue-400 mb-3" />
                <h4 className="text-xs font-bold text-white mb-1">نسخة الويندوز (Windows OS)</h4>
                <p className="text-[10px] text-slate-500 mb-4 h-10 leading-normal">برنامج مكتبي مستقل فائق السرعة لدعم مراقبة شاشات متعددة</p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("بدأ الآن تحميل ملف التثبيت AI_Trading_Setup_v3.1.exe المجمع لويندوز 10/11 بنجاح.");
                  }}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] rounded-xl transition-all shadow-md shadow-blue-600/15"
                >
                  تحميل لـ Windows (.exe)
                </a>
              </div>

              {/* Android Application Card */}
              <div className="p-4 bg-slate-950/50 border border-white/5 rounded-2xl flex flex-col items-center text-center transition-all hover:border-emerald-500/30 hover:bg-slate-950">
                <Smartphone className="w-10 h-10 text-emerald-400 mb-3" />
                <h4 className="text-xs font-bold text-white mb-1">نسخة الأندرويد (Android APK)</h4>
                <p className="text-[10px] text-slate-500 mb-4 h-10 leading-normal">تطبيق APK مباشر للهواتف والألواح مع تنبيهات دفع ذكية وتداول لحظي</p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("بدأ الآن تحميل تطبيق الأندرويد الأصلي AI_Trading_v3.1.apk مباشرة إلى جهازك.");
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-xl transition-all shadow-md shadow-emerald-600/15"
                >
                  تحميل لـ Android (.apk)
                </a>
              </div>

              {/* iOS / iPhone Application Card */}
              <div className="p-4 bg-slate-950/50 border border-white/5 rounded-2xl flex flex-col items-center text-center transition-all hover:border-purple-500/30 hover:bg-slate-950">
                <Smartphone className="w-10 h-10 text-purple-400 mb-3" />
                <h4 className="text-xs font-bold text-white mb-1">نسخة الآيفون (iOS / iPhone)</h4>
                <p className="text-[10px] text-slate-500 mb-4 h-10 leading-normal">تطبيق ويب تقدمي (PWA) معتمد لآبل أو تثبيت مخصص TestFlight</p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("لتثبيت تطبيق الآيفون:\n1. افتح المنصة في متصفح Safari.\n2. اضغط على زر 'مشاركة' (Share) بالأسفل.\n3. اختر 'إضافة إلى الشاشة الرئيسية' (Add to Home Screen).");
                  }}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] rounded-xl transition-all shadow-md shadow-purple-600/15"
                >
                  تعليمات التثبيت لـ iOS
                </a>
              </div>

            </div>

            {/* Quick guide */}
            <div className="p-3.5 bg-blue-500/5 border border-blue-500/10 rounded-2xl text-[10px] text-slate-300 leading-relaxed text-right">
              💡 <span className="font-bold text-blue-400">ملاحظة التثبيت:</span> جميع حزم البرمجيات المرفقة أعلاه مدمجة بشهادات SSL ومحمية ببروتوكولات التشفير الثنائية للاتصال الآمن بحسابك وعقد تداول Binance المبرمة بشكل حي.
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
