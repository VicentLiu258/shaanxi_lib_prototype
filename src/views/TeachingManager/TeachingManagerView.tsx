import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  BookOpen, 
  FileCheck, 
  FolderTree, 
  ClipboardList, 
  UserRound, 
  GraduationCap,
  ChevronLeft,
  Menu,
  ChevronDown,
  User,
  Lock,
  LogOut,
  X,
  Search,
  Bell,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { Booking } from './modules/Booking';
import { Record } from './modules/Record';
import { OpenRecord } from './modules/OpenRecord';
import { LibraryManage } from './modules/LibraryManage';
import { PilotProgram } from './modules/PilotProgram';
import { TeacherOpenStatistics } from './modules/TeacherOpenStatistics';
import { ClassOpenStatistics } from './modules/ClassOpenStatistics';

interface TabItem {
  id: string;
  label: string;
  icon: any;
}

interface TeachingManagerViewProps {
  onBack: () => void;
  onLogout: () => void;
}

export const TeachingManagerView: React.FC<TeachingManagerViewProps> = ({ onBack, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTabId, setActiveTabId] = useState('Booking');
  const [openTabs, setOpenTabs] = useState<TabItem[]>([
    { id: 'Booking', label: '实验排课', icon: Calendar }
  ]);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuItems = [
    { id: 'Booking', label: '实验排课', icon: Calendar },
    { id: 'Record', label: '实验预约记录', icon: BookOpen },
    { id: 'openRecord', label: '实验开课记录', icon: FileCheck },
    { id: 'libraryManage', label: '实验库管理', icon: FolderTree },
    { id: 'pilotProgram', label: '实验计划管理', icon: ClipboardList },
    { id: 'teacherOpenStatistics', label: '教师实验开出统计', icon: UserRound },
    { id: 'classOpenStatistics', label: '班级实验开出统计', icon: GraduationCap },
  ];

  const handleMenuClick = (item: any) => {
    if (!openTabs.find(tab => tab.id === item.id)) {
      setOpenTabs([...openTabs, { id: item.id, label: item.label, icon: item.icon }]);
    }
    setActiveTabId(item.id);
  };

  const closeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(tab => tab.id !== id);
    if (newTabs.length === 0) {
      // Keep at least one tab or redirect to dashboard? 
      // For this system, let's just use first menu item as default
      return;
    }
    setOpenTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const renderActiveModule = () => {
    switch (activeTabId) {
      case 'Booking': return <Booking />;
      case 'Record': return <Record />;
      case 'openRecord': return <OpenRecord />;
      case 'libraryManage': return <LibraryManage />;
      case 'pilotProgram': return <PilotProgram />;
      case 'teacherOpenStatistics': return <TeacherOpenStatistics />;
      case 'classOpenStatistics': return <ClassOpenStatistics />;
      default: return <Booking />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#f0f2f5] font-sans text-slate-800 overflow-hidden">
      {/* Navigation Header */}
      <header className="h-14 bg-[#001529] text-white flex items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold">XY</div>
            <h1 className="text-sm font-bold tracking-tight">咸阳市实验中学 · 实验排课管理系统</h1>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
          >
            <ArrowLeft size={14} />
            <span>返回门户</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-white/70">
            <Search size={18} className="cursor-pointer hover:text-white" />
            <Bell size={18} className="cursor-pointer hover:text-white" />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-blue-400 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" />
              </div>
              <span className="text-sm">管理员</span>
              <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {showUserMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-xl text-slate-700 py-1 border border-slate-100"
                >
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-100 transition-colors">
                    <User size={16} />
                    <span>个人信息</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-100 transition-colors">
                    <Lock size={16} />
                    <span>修改密码</span>
                  </button>
                  <div className="h-px bg-slate-100 my-1" />
                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-100 text-red-500 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>退出登录</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <motion.aside 
          animate={{ width: isCollapsed ? 64 : 220 }}
          className="bg-[#001529] text-white flex flex-col shrink-0 transition-all border-t border-white/5"
        >
          <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar overflow-x-hidden">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className={cn(
                  "w-full flex items-center gap-3 px-6 py-4 transition-all text-sm relative group",
                  activeTabId === item.id 
                    ? "bg-blue-600 text-white" 
                    : "text-white/70 hover:text-white hover:bg-white/5"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon size={18} className={cn(activeTabId === item.id ? "text-white" : "text-white/70 group-hover:text-white")} />
                {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                {activeTabId === item.id && (
                   <div className="absolute right-0 top-0 bottom-0 w-1 bg-white" />
                )}
              </button>
            ))}
          </nav>

          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-12 border-t border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </motion.aside>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab Bar */}
          <div className="h-10 bg-white border-b border-slate-200 flex items-center px-1 gap-1 shrink-0">
             {openTabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={cn(
                    "h-8 flex items-center gap-2 px-3 rounded-t-md border-x border-t cursor-pointer transition-all text-xs font-medium group",
                    activeTabId === tab.id 
                      ? "bg-white border-slate-200 text-blue-600 -mb-[1px] relative z-10" 
                      : "bg-[#fafafa] border-transparent text-slate-500 hover:bg-slate-100"
                  )}
                >
                  <tab.icon size={12} />
                  <span>{tab.label}</span>
                  <X 
                    size={12} 
                    className="ml-1 opacity-40 hover:opacity-100 hover:bg-slate-200 rounded-sm" 
                    onClick={(e) => closeTab(e, tab.id)}
                  />
                </div>
             ))}
          </div>

          {/* Module Content */}
          <main className="flex-1 overflow-auto bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTabId}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                {renderActiveModule()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};
