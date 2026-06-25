import React, { useState } from 'react';
import { Search, Flame, DollarSign, PlusCircle, ArrowUpDown } from 'lucide-react';
import GlassCard from './GlassCard';
import { Market } from '../types';

interface MarketListProps {
  markets: Market[];
  selectedSymbol: string;
  onSelectMarket: (symbol: string) => void;
  onAddCustomMarket: (symbol: string, name: string, category: 'crypto' | 'forex', price: number) => void;
}

export default function MarketList({
  markets,
  selectedSymbol,
  onSelectMarket,
  onAddCustomMarket
}: MarketListProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | 'crypto' | 'forex'>('all');
  const [showAddCustom, setShowAddCustom] = useState(false);
  
  // States for adding custom market
  const [customSymbol, setCustomSymbol] = useState('');
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<'crypto' | 'forex'>('crypto');
  const [customPrice, setCustomPrice] = useState('');

  const filteredMarkets = markets.filter((m) => {
    const matchesSearch = m.symbol.toLowerCase().includes(search.toLowerCase()) || 
                          m.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' ? true : m.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const priceVal = parseFloat(customPrice);
    if (!customSymbol || !customName || isNaN(priceVal) || priceVal <= 0) {
      return;
    }
    
    // Format symbol properly (e.g. BTC/USDT or EUR/USD)
    const formattedSymbol = customSymbol.toUpperCase().includes('/') 
      ? customSymbol.toUpperCase() 
      : customCategory === 'crypto' 
        ? `${customSymbol.toUpperCase()}/USDT` 
        : `${customSymbol.toUpperCase().substring(0,3)}/${customSymbol.toUpperCase().substring(3,6)}`;

    onAddCustomMarket(formattedSymbol, customName, customCategory, priceVal);
    
    // Reset inputs
    setCustomSymbol('');
    setCustomName('');
    setCustomPrice('');
    setShowAddCustom(false);
  };

  return (
    <GlassCard className="p-4 h-full flex flex-col font-sans" dir="rtl">
      {/* Search Bar */}
      <div className="relative mb-3">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="ابحث عن أصل مالي (BTC، EUR/USD...)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2 pr-9 pl-3 text-white text-xs focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Tabs / Filter Navigation */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-white/5 mb-3 text-[11px] font-bold">
        <button
          onClick={() => setCategory('all')}
          className={`py-1.5 rounded-lg transition-all ${
            category === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          الكل
        </button>
        <button
          onClick={() => setCategory('crypto')}
          className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
            category === 'crypto' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          رقمي
        </button>
        <button
          onClick={() => setCategory('forex')}
          className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
            category === 'forex' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-blue-400" />
          فوركس
        </button>
      </div>

      {/* Markets List Container */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[300px] md:max-h-none">
        {filteredMarkets.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            لا توجد نتائج متطابقة للبحث.
          </div>
        ) : (
          filteredMarkets.map((m) => {
            const isSelected = m.symbol === selectedSymbol;
            const isPositive = m.change24h >= 0;
            return (
              <div
                key={m.symbol}
                onClick={() => onSelectMarket(m.symbol)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected 
                    ? 'bg-blue-600/15 border-blue-500/30' 
                    : 'bg-slate-950/20 border-white/5 hover:bg-slate-950/40 hover:border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white">{m.symbol}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                      m.category === 'crypto' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {m.category === 'crypto' ? 'رقمي' : 'فوركس'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{m.name}</div>
                </div>

                <div className="text-left font-mono">
                  <div className="text-xs font-bold text-white">
                    ${m.price.toLocaleString(undefined, { minimumFractionDigits: m.category === 'forex' ? 4 : 2 })}
                  </div>
                  <div className={`text-[10px] font-semibold mt-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPositive ? '+' : ''}{m.change24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dynamic Asset Addition Trigger (All markets) */}
      <div className="mt-4 pt-3 border-t border-white/5">
        {!showAddCustom ? (
          <button
            onClick={() => setShowAddCustom(true)}
            className="w-full py-2 bg-slate-950/40 hover:bg-slate-950/60 border border-white/5 rounded-xl text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-blue-400" />
            <span>إضافة عملة / سوق جديد يدوياً</span>
          </button>
        ) : (
          <form onSubmit={handleCreateCustom} className="space-y-3 bg-slate-950/50 p-3.5 rounded-xl border border-white/10">
            <h4 className="text-xs font-bold text-white mb-2 text-right">أضف عملتك المفضلة للسوق</h4>
            
            <div>
              <input
                type="text"
                placeholder="رمز العملة (مثال: ADA, SOL, GBPUSD)"
                value={customSymbol}
                onChange={(e) => setCustomSymbol(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg py-1.5 px-2.5 text-white text-xs focus:outline-none"
                required
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="اسم الأصل المالي (مثال: كاردانو)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg py-1.5 px-2.5 text-white text-xs focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold">
              <button
                type="button"
                onClick={() => setCustomCategory('crypto')}
                className={`py-1 rounded-lg border ${customCategory === 'crypto' ? 'bg-orange-600/10 border-orange-500/40 text-orange-400' : 'border-white/5 text-slate-400'}`}
              >
                عملة رقمية
              </button>
              <button
                type="button"
                onClick={() => setCustomCategory('forex')}
                className={`py-1 rounded-lg border ${customCategory === 'forex' ? 'bg-blue-600/10 border-blue-500/40 text-blue-400' : 'border-white/5 text-slate-400'}`}
              >
                سوق فوركس
              </button>
            </div>

            <div>
              <input
                type="number"
                step="any"
                placeholder="السعر الابتدائي الحالي بالدولار"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg py-1.5 px-2.5 text-white text-xs focus:outline-none"
                required
              />
            </div>

            <div className="flex gap-1.5 pt-1">
              <button
                type="submit"
                className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg"
              >
                إنشاء وإضافة
              </button>
              <button
                type="button"
                onClick={() => setShowAddCustom(false)}
                className="py-1.5 px-3 bg-slate-800 text-slate-300 text-xs rounded-lg"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>
    </GlassCard>
  );
}
