import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Menu, 
  ChevronLeft, 
  Settings, 
  FileText, 
  Users, 
  HelpCircle,
  Bell,
  Search,
  ArrowLeft
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { cn } from '../lib/utils';
import { AssetManagerView } from './AssetManagerView';
import { EnvMonitoringView } from './EnvMonitoringView';
import { RemoteClassInspectionView } from './RemoteClassInspectionView';
import { ExamOperationView } from './ExamOperationView';

interface SubsystemViewProps {
  id: string;
  name: string;
  onBack: () => void;
  onLogout: () => void;
}

export const SubsystemView: React.FC<SubsystemViewProps> = ({ id, name, onBack, onLogout }) => {
  if (id === 'asset') {
    return <AssetManagerView id={id} name={name} onBack={onBack} onLogout={onLogout} />;
  }
  if (id === 'env') {
    return <EnvMonitoringView id={id} name={name} onBack={onBack} onLogout={onLogout} />;
  }
  if (id === 'rem') {
    return <RemoteClassInspectionView id={id} name={name} onBack={onBack} onLogout={onLogout} />;
  }
  if (id === 'exam') {
    return <ExamOperationView onBack={onBack} onLogout={onLogout} />;
  }

  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: '工作台', active: true },
    { icon: FileText, label: '业务台账' },
    { icon: Settings, label: '参数配置' },
    { icon: Users, label: '权限管理' },
    { icon: HelpCircle, label: '使用帮助' },
  ];

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden bg-[var(--bg-main)] transition-colors">
      <Navbar onLogout={onLogout} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Collapsible Sidebar */}
        <motion.aside 
          animate={{ width: isCollapsed ? 80 : 256 }}
          className="bg-[var(--card-bg)] border-r border-slate-200 dark:border-white/10 flex flex-col z-20 relative group shadow-sm transition-colors"
        >
          <div className="p-4 flex flex-col gap-4">
            <button 
              onClick={onBack}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all",
                isCollapsed && "justify-center"
              )}
              title="返回总门户"
            >
              <ArrowLeft size={20} />
              {!isCollapsed && <span className="text-sm font-bold">返回总门户</span>}
            </button>
            
            <div className="h-px bg-slate-100 dark:bg-white/5 mx-2" />
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                  item.active 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5",
                  isCollapsed && "justify-center px-0"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-1/2 -right-3 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center shadow-md hover:text-blue-500 transition-colors z-30"
          >
            {isCollapsed ? <Menu size={12} /> : <ChevronLeft size={12} />}
          </button>
        </motion.aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
           <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded text-[10px] font-black uppercase tracking-widest">
                       Subsystem
                    </span>
                    <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{name}</h2>
                  </div>
                  <p className="text-sm text-slate-400 font-medium">当前模块正在根据 1920x 规范进行业务集成中...</p>
                </div>

                <div className="flex gap-3">
                   <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-blue-500 cursor-pointer shadow-sm">
                      <Search size={20} />
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-blue-500 cursor-pointer shadow-sm relative">
                      <Bell size={20} />
                      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                   </div>
                </div>
              </div>

              {/* Placeholder Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="pro-card h-48 bg-[var(--card-bg)]/50 backdrop-blur-sm border-dashed border-2 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                      <FileText size={48} className="mb-4 opacity-20" />
                      <span className="text-xs font-bold uppercase tracking-widest opacity-40 text-center">业务数据待加载<br/>MODULAR_SLOT_0{i}</span>
                   </div>
                 ))}
              </div>

              <div className="pro-card p-12 bg-[var(--card-bg)]/50 backdrop-blur-sm border-dashed border-2 flex flex-col items-center justify-center min-h-[400px]">
                 <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-200 dark:text-slate-700 mb-6">
                    <LayoutDashboard size={40} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-300 dark:text-slate-700 mb-2 uppercase tracking-tight">核心业务操作区</h3>
                 <p className="text-sm text-slate-400 dark:text-slate-600 max-w-sm text-center">系统正在联调业务接口，如果您有具体的功能需求，请联系实验室信息化管理员。</p>
              </div>
           </div>
        </main>
      </div>
    </div>
  );
};
