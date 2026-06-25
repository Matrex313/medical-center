import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
  dir?: string;
}

export default function GlassCard({ children, className = '', id, onClick, dir }: GlassCardProps) {
  return (
    <div
      id={id}
      onClick={onClick}
      dir={dir}
      className={`backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 ${
        onClick ? 'hover:bg-slate-900/50 hover:border-white/20 cursor-pointer active:scale-[0.98]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
