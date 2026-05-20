import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, Chrome, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoginViewProps {
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4 bg-[var(--bg-main)] font-sans transition-colors">
      {/* Refined Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 dark:bg-blue-400/5 rounded-full blur-[120px] transition-colors" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 dark:bg-indigo-400/5 rounded-full blur-[120px] transition-colors" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1100px] flex flex-col md:flex-row bg-[var(--card-bg)] rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-slate-100 dark:border-white/5 transition-colors"
      >
        {/* Left Side: Professional Branding */}
        <div className="hidden md:flex flex-1 bg-slate-900 p-16 flex-col justify-between text-white relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-black text-white text-xl">
                SX
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div className="text-xs font-bold uppercase tracking-[0.3em] opacity-80">
                Shaanxi Lab Project
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-5xl font-black leading-[1.1] tracking-tighter">
                数字化实验室<br />教学服务管理平台
              </h2>
              <div className="h-1.5 w-16 bg-blue-500 rounded-full" />
              <p className="text-sm opacity-50 max-w-sm leading-relaxed font-medium">
                Integrated Management Excellence. Built for precision, security, and next-generation research efficiency.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-8">
             <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(idx => (
                  <div key={idx} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] uppercase font-bold overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${idx + 10}`} alt="User" />
                  </div>
                ))}
             </div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
               Trusted by <span className="text-white">1,200+</span> Researchers
             </div>
          </div>
        </div>

        {/* Right Side: Clean Login Form */}
        <div className="w-full md:w-[460px] p-12 md:p-20 flex flex-col justify-center">
          <div className="mb-12">
            <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-3">账号登录</h3>
            <p className="text-sm text-slate-400 font-medium tracking-tight">请使用您的身份识别系统账号进行安全登录</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">用户名 / ACCOUNT ID</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="职工号 / 学生证号" 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">登录密码 / CREDENTIALS</label>
                <button type="button" className="text-[10px] text-blue-500 font-bold uppercase tracking-widest hover:underline">找回密码</button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  placeholder="个人认证密码" 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 transition-all hover:translate-y-[-2px] active:translate-y-0 disabled:opacity-70 group uppercase text-xs tracking-[0.2em]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  认证并登录系统 
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="mt-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
            技术支持: 西北大学信息化建设中心
          </p>
        </div>
      </motion.div>

      {/* Simplified Footer */}
      <div className="absolute bottom-6 w-full text-center opacity-30 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-8">
         <span>Version 4.2.0</span>
         <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
         <span>Standard Environment</span>
      </div>
    </div>
  );
};
