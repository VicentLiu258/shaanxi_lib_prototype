import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, ArrowLeft, Phone } from 'lucide-react';
import { Navbar } from '../components/Navbar';

interface UnauthorizedViewProps {
  name: string;
  onBack: () => void;
  onLogout: () => void;
}

export const UnauthorizedView: React.FC<UnauthorizedViewProps> = ({ name, onBack, onLogout }) => {
  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden bg-slate-50 dark:bg-[#0f172a] transition-colors">
      <Navbar onLogout={onLogout} />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-blue-500/10 border border-slate-200 dark:border-white/10 p-10 text-center relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="text-amber-600 dark:text-amber-400" size={40} />
            </div>

            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">
              {name}
            </h2>
            <div className="inline-block px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">
              Access Restricted
            </div>

            <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium leading-relaxed">
              您的账号暂未开启该模块的操作权限。<br/>
              <b>未开通权限，请联系厂家。</b>
            </p>

            <div className="space-y-4">
              <button 
                onClick={onBack}
                className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
              >
                <ArrowLeft size={18} />
                返回主门户
              </button>

              <button className="w-full flex items-center justify-center gap-2 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-[0.98]">
                <Phone size={18} />
                联系厂家
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};
