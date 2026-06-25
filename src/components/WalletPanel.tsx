import React, { useState } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, Plus, Minus, CreditCard, Landmark, CheckCircle2, History } from 'lucide-react';
import GlassCard from './GlassCard';
import { Transaction } from '../types';

interface WalletPanelProps {
  balance: number;
  demoBalance: number;
  transactions: Transaction[];
  onTransaction: (type: 'deposit' | 'withdraw', amount: number, method: string, isDemo: boolean) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
}

export default function WalletPanel({
  balance,
  demoBalance,
  transactions,
  onTransaction,
  isDemoMode,
  setIsDemoMode
}: WalletPanelProps) {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('usdt');
  const [cryptoAddress, setCryptoAddress] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setErrorMsg('يرجى إدخال مبلغ صحيح أكبر من الصفر.');
      return;
    }

    const currentLimit = isDemoMode ? demoBalance : balance;
    if (activeTab === 'withdraw' && val > currentLimit) {
      setErrorMsg('المبلغ المطلوب يتجاوز الرصيد المتاح لديك في المحفظة.');
      return;
    }

    const methodLabel = paymentMethod === 'usdt' 
      ? `USDT (${cryptoAddress.substring(0, 8)}...)` 
      : `بطاقة بنكية (${cardNumber.slice(-4)})`;

    onTransaction(activeTab, val, methodLabel, isDemoMode);
    
    setSuccessMsg(
      activeTab === 'deposit' 
        ? `تم تقديم طلب إيداع بقيمة $${val.toLocaleString()} بنجاح. سيتم معالجة الطلب فوراً.`
        : `تم تقديم طلب سحب بقيمة $${val.toLocaleString()} بنجاح. سيتم تحويل الأموال قريباً.`
    );
    setAmount('');
    setCryptoAddress('');
    setCardNumber('');
    setErrorMsg('');

    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  return (
    <GlassCard className="p-6 h-full flex flex-col font-sans" dir="rtl">
      {/* Balance Title & Quick Mode Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">إدارة المحفظة والرصيد</h2>
            <p className="text-xs text-slate-400">شحن الحساب وسحب الأرباح فورياً</p>
          </div>
        </div>
        
        {/* Toggle Account Mode */}
        <div className="bg-slate-950/60 p-1 rounded-xl border border-white/5 flex gap-1">
          <button
            onClick={() => { setIsDemoMode(false); setErrorMsg(''); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !isDemoMode 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            حساب حقيقي
          </button>
          <button
            onClick={() => { setIsDemoMode(true); setErrorMsg(''); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isDemoMode 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            حساب تجريبي
          </button>
        </div>
      </div>

      {/* Main Balance Display */}
      <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 mb-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">الرصيد المتاح الحالي</p>
        <div className="text-3xl font-black text-white tracking-tight">
          ${(isDemoMode ? demoBalance : balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
          isDemoMode ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
        }`}>
          {isDemoMode ? 'وضع التدريب والتعليم' : 'رأس المال الحي المباشر'}
        </span>
      </div>

      {/* Navigation Buttons for Deposit, Withdraw, History */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950/60 rounded-xl border border-white/5 mb-6">
        <button
          onClick={() => { setActiveTab('deposit'); setErrorMsg(''); }}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'deposit' 
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20 font-bold' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowDownCircle className="w-4 h-4" />
          إيداع رصيد
        </button>
        <button
          onClick={() => { setActiveTab('withdraw'); setErrorMsg(''); }}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'withdraw' 
              ? 'bg-rose-600/20 text-rose-400 border border-rose-500/20 font-bold' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowUpCircle className="w-4 h-4" />
          سحب رصيد
        </button>
        <button
          onClick={() => { setActiveTab('history'); setErrorMsg(''); }}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'history' 
              ? 'bg-slate-800 text-slate-200 border border-white/5 font-bold' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          السجل
        </button>
      </div>

      {/* Panel Body Content */}
      <div className="flex-1 overflow-y-auto pr-1">
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">
            {errorMsg}
          </div>
        )}

        {activeTab !== 'history' ? (
          <form onSubmit={handleAction} className="space-y-4">
            {/* Amount Input */}
            <div>
              <label className="block text-slate-300 text-xs font-medium mb-1.5">المبلغ المراد العمل به ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 pl-8 pr-3 text-white text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-slate-300 text-xs font-medium mb-1.5">طريقة الدفع أو الاستلام</label>
              <div className="grid grid-cols-2 gap-2">
                <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'usdt' 
                    ? 'border-blue-500 bg-blue-500/5 text-white' 
                    : 'border-white/5 bg-slate-950/20 text-slate-400'
                }`}>
                  <input
                    type="radio"
                    name="method"
                    value="usdt"
                    checked={paymentMethod === 'usdt'}
                    onChange={() => setPaymentMethod('usdt')}
                    className="hidden"
                  />
                  <Landmark className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold">عملة USDT (TRC-20)</span>
                </label>

                <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'card' 
                    ? 'border-blue-500 bg-blue-500/5 text-white' 
                    : 'border-white/5 bg-slate-950/20 text-slate-400'
                }`}>
                  <input
                    type="radio"
                    name="method"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="hidden"
                  />
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold">بطاقة فيزا / ماستر</span>
                </label>
              </div>
            </div>

            {/* Conditional input fields based on payment method */}
            {paymentMethod === 'usdt' ? (
              <div>
                <label className="block text-slate-300 text-xs font-medium mb-1.5">عنوان محفظة USDT الخاص بك</label>
                <input
                  type="text"
                  placeholder="أدخل عنوان TRC20 (مثال: TX123...)"
                  value={cryptoAddress}
                  onChange={(e) => setCryptoAddress(e.target.value)}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 px-3 text-white text-xs focus:outline-none focus:border-blue-500 text-left"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-slate-300 text-xs font-medium mb-1.5">رقم البطاقة الائتمانية</label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="4000 1234 5678 9010"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 px-3 text-white text-xs focus:outline-none focus:border-blue-500 text-left"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'deposit'
                  ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/10 text-white'
                  : 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/10 text-white'
              }`}
            >
              {activeTab === 'deposit' ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              <span>{activeTab === 'deposit' ? 'تأكيد عملية الإيداع الفوري' : 'تأكيد طلب السحب الفوري'}</span>
            </button>
          </form>
        ) : (
          /* Transaction Ledger */
          <div className="space-y-2.5">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                لا توجد عمليات مسجلة في المحفظة حتى الآن.
              </div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="p-3 bg-slate-950/30 border border-white/5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${
                      tx.type.includes('deposit') 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {tx.type.includes('deposit') ? <ArrowDownCircle className="w-4 h-4" /> : <ArrowUpCircle className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {tx.type.includes('deposit') ? 'عملية إيداع رصيد' : 'عملية سحب رصيد'}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{tx.details || 'تحويل مالي'}</div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className={`text-xs font-black ${
                      tx.type.includes('deposit') ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {tx.type.includes('deposit') ? '+' : '-'}${tx.amount.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-slate-500 mt-0.5">{tx.timestamp}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
