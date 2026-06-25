import React, { useState, useEffect } from 'react';
import { Shield, Lock, Mail, ArrowLeftRight, Coins } from 'lucide-react';
import GlassCard from './GlassCard';

interface AuthScreenProps {
  onSuccess: (email: string) => void;
}

export default function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user session is already saved
    const savedEmail = localStorage.getItem('saved_user_email');
    const autoLogin = localStorage.getItem('auto_login') === 'true';
    if (savedEmail && autoLogin) {
      onSuccess(savedEmail);
    }
  }, [onSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      if (rememberMe) {
        localStorage.setItem('saved_user_email', email);
        localStorage.setItem('auto_login', 'true');
      } else {
        localStorage.removeItem('saved_user_email');
        localStorage.removeItem('auto_login');
      }
      onSuccess(email);
    }, 1200);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('saved_user_email', 'demo@aitrading.com');
      localStorage.setItem('auto_login', 'true');
      onSuccess('demo@aitrading.com');
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden font-sans" dir="rtl">
      {/* Dynamic Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-indigo-500/15 rounded-full blur-[80px] animate-pulse"></div>

      <GlassCard className="w-full max-w-md p-8 relative z-10 border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20 mb-4">
            <Coins className="w-8 h-8 text-white animate-bounce" />
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 tracking-tight">
            منصة التداول الذكي AI
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            روبوت التداول الفوري اللحظي والتحليل بالذكاء الاصطناعي
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm mb-5 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-3 pr-11 pl-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-left"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-3 pr-11 pl-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-left"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/10 bg-slate-950 text-blue-500 focus:ring-0 focus:ring-offset-0 w-4 h-4"
              />
              <span>تذكر تسجيل الدخول</span>
            </label>
            <a href="#" className="hover:text-white transition-colors">نسيت كلمة المرور؟</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none mt-6"
          >
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <span className="relative bg-[#0d1527] px-3 text-xs text-slate-500 font-medium">أو</span>
        </div>

        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full py-3 px-4 bg-slate-800/40 hover:bg-slate-800/60 border border-white/5 text-slate-200 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeftRight className="w-5 h-5 text-blue-400" />
          <span>الدخول السريع بحساب تجريبي ($50,000)</span>
        </button>

        <div className="mt-6 text-center text-xs text-slate-500">
          <Shield className="inline-flex w-4 h-4 text-emerald-400 mr-1" />
          تشفير آمن ثنائي الأطراف متوافق مع كافة أنظمة تشغيل الأجهزة الذكية
        </div>
      </GlassCard>
    </div>
  );
}
