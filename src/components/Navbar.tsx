import React from 'react';
import { Settings, LogOut, Bell, Search, Sun, Moon, Palette } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onLogout: () => void;
  showSearch?: boolean;
  onSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogout, showSearch = true, onSettings }) => {
  const { theme, toggleTheme, setPrimaryColor } = useTheme();
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    if (onSettings) {
      onSettings();
    } else {
      navigate('/settings');
    }
  };

  return (
    <header className="h-16 bg-[var(--card-bg)] border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-8 shrink-0 z-50 transition-colors">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-extrabold text-black dark:text-white tracking-tight">
          工作台控制中心 
          <span className="text-slate-650 dark:text-slate-400 font-medium text-sm ml-2 hidden sm:inline">1920px 规范标准</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-full">
          <button 
            onClick={() => theme === 'dark' && toggleTheme()}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm",
              theme === 'light' ? "bg-white text-blue-600 font-bold" : "text-slate-700 dark:text-slate-400"
            )}
          >
            浅色模式
          </button>
          <button 
            onClick={() => theme === 'light' && toggleTheme()}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold transition-all",
              theme === 'dark' ? "bg-slate-800 text-blue-400" : "text-slate-700 dark:text-slate-400"
            )}
          >
            深色模式
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-white/10"></div>

        <div className="flex items-center gap-4">
          <button className="relative p-1 text-slate-400 hover:text-blue-500 transition-colors">
            <div className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></div>
            <Bell size={22} />
          </button>
          
          <button 
            onClick={handleSettingsClick}
            className="p-1 text-slate-400 hover:text-blue-500 transition-colors"
            title="系统设置-系统管理"
          >
            <Settings size={22} />
          </button>

          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200 dark:border-white/10">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold">管理员</p>
              <p className="text-[10px] text-slate-400">咸阳市实验中学</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={22} />
          </button>
        </div>
      </div>
    </header>
  );
};
