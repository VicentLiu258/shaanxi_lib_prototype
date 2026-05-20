import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BarChart3, 
  LayoutDashboard, 
  FlaskConical, 
  User, 
  LogOut,
  X,
  Maximize2,
  Calendar,
  Layers,
  Search
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

interface DataCenterLayoutProps {
  children: React.ReactNode;
}

export const DataCenterLayout: React.FC<DataCenterLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [activeTabs, setActiveTabs] = useState<{ name: string; path: string }[]>([
    { name: '校级数据可视化', path: '/dashboard' }
  ]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const tabs = {
      '/dashboard': '校级数据可视化',
      '/laboratoryDashboard': '实验数据可视化'
    };
    const name = tabs[location.pathname as keyof typeof tabs];
    if (name && !activeTabs.find(t => t.path === location.pathname)) {
      setActiveTabs(prev => [...prev, { name, path: location.pathname }]);
    }
  }, [location.pathname]);

  const closeTab = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (activeTabs.length === 1) return;
    const newTabs = activeTabs.filter(t => t.path !== path);
    setActiveTabs(newTabs);
    if (location.pathname === path) {
      navigate(newTabs[newTabs.length - 1].path);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const menuItems = [
    {
      title: '可视化报表',
      icon: <BarChart3 size={20} />,
      children: [
        { name: '校级数据可视化', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
        { name: '实验数据可视化', path: '/laboratoryDashboard', icon: <FlaskConical size={16} /> }
      ]
    }
  ];

  return (
    <div className="flex h-screen w-full bg-[#050e24] text-[#c8e6ff] overflow-hidden font-sans select-none">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 240 }}
        className="relative z-30 flex flex-col border-r border-[#0d3a6e] bg-[#0a1a3c]/80 backdrop-blur-xl"
      >
        <div className="h-16 flex items-center px-4 border-b border-[#0d3a6e]/50 overflow-hidden shrink-0">
          <div className="w-8 h-8 rounded bg-[#00c8ff] flex items-center justify-center shrink-0">
             <Layers className="text-[#0a1a3c]" size={20} />
          </div>
          {!collapsed && (
            <span className="ml-3 font-black text-lg tracking-tighter truncate text-white">可视化中心</span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-hide">
          {menuItems.map((group, idx) => (
            <div key={idx} className="mb-6">
              {!collapsed && (
                <div className="px-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  {group.icon} {group.title}
                </div>
              )}
              <div className="space-y-1">
                {group.children.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center h-12 px-6 transition-all relative group",
                      location.pathname === item.path 
                        ? "bg-[#00c8ff]/10 text-[#00c8ff]" 
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <div className={cn("shrink-0", location.pathname === item.path ? "text-[#00c8ff]" : "")}>
                      {item.icon}
                    </div>
                    {!collapsed && (
                      <span className="ml-4 text-sm font-medium transition-opacity">{item.name}</span>
                    )}
                    {location.pathname === item.path && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00c8ff] shadow-[0_0_10px_#00c8ff]" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="h-12 border-t border-[#0d3a6e]/50 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Top Navigation */}
        <header className="h-16 bg-[#0a1a3c]/60 backdrop-blur-md border-b border-[#0d3a6e]/50 px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-full bg-white p-1">
                <img src="https://img.icons8.com/color/48/000000/education.png" alt="logo" className="w-full h-full" />
              </div>
              <h1 className="text-xl font-black text-white whitespace-nowrap hidden sm:block">咸阳市实验中学</h1>
            </div>
            
            <div className="h-6 w-px bg-[#0d3a6e] mx-4 hidden md:block" />
            
            {/* Tabs */}
            <div className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {activeTabs.map((tab) => (
                  <motion.div
                    key={tab.path}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    layout
                    className={cn(
                      "h-8 flex items-center gap-2 px-3 rounded text-[11px] font-bold tracking-wider transition-all whitespace-nowrap cursor-pointer",
                      location.pathname === tab.path 
                        ? "bg-[#00c8ff]/20 text-[#00c8ff] border border-[#00c8ff]/30 shadow-[0_0_10px_rgba(0,180,255,0.1)]"
                        : "bg-white/5 text-slate-400 hover:bg-white/10"
                    )}
                    onClick={() => navigate(tab.path)}
                  >
                    <span>{tab.name}</span>
                    <button 
                      onClick={(e) => closeTab(tab.path, e)}
                      className={cn(
                        "hover:text-white rounded-sm",
                        activeTabs.length === 1 && "hidden"
                      )}
                    >
                      <X size={12} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-6 ml-4">
             <div className="hidden lg:flex items-center gap-4 text-right">
                <div className="flex flex-col">
                  <span className="text-white text-xs font-bold font-mono">{currentTime.format('HH:mm:ss')}</span>
                  <span className="text-slate-400 text-[10px] font-bold">{currentTime.format('YYYY年MM月DD日 dddd')}</span>
                </div>
                <button 
                  onClick={toggleFullScreen}
                  className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-[#00c8ff] hover:bg-[#00c8ff]/10 transition-all"
                >
                  <Maximize2 size={18} />
                </button>
             </div>

             <div className="flex items-center gap-3 pl-6 border-l border-[#0d3a6e]">
                <div className="flex flex-col text-right">
                   <span className="text-white text-xs font-black">管理员</span>
                   <span className="text-[#00c8ff] text-[10px] uppercase tracking-tighter">System Admin</span>
                </div>
                <div className="relative group cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-[#00c8ff]/20 border border-[#00c8ff]/30 flex items-center justify-center">
                    <User size={20} className="text-[#00c8ff]" />
                  </div>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#0a1a3c] border border-[#0d3a6e] rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="p-4 border-b border-[#0d3a6e]/50">
                      <p className="text-white text-xs font-bold">Adminstrator</p>
                      <p className="text-slate-500 text-[10px]">admin@xyexperimental.edu.cn</p>
                    </div>
                    <button 
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors text-xs font-bold"
                      onClick={() => navigate('/')}
                    >
                      <LogOut size={16} /> 退出登录
                    </button>
                  </div>
                </div>
             </div>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-auto bg-[#050e24] relative">
          {children}
        </div>
      </div>
    </div>
  );
};
