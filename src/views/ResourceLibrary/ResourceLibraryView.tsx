import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { 
  Home, 
  Library, 
  Hammer, 
  UserRound, 
  Star, 
  History, 
  BarChart3, 
  ChevronDown, 
  ChevronUp, 
  Menu, 
  MessageSquare, 
  LogOut, 
  Bell, 
  Search,
  School,
  Languages,
  LayoutGrid,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

// Import sub-views
import HomeResourceLibrary from './HomeResourceLibrary';
import ResourceAudit from './ResourceAudit';
import InstrumentLibrary from './InstrumentLibrary';
import TeacherTraining from './TeacherTraining';
import TeacherTrainingAdd from './TeacherTrainingAdd';
import ResourceDetail from './ResourceDetail';
import InstrumentDetail from './InstrumentDetail';
import MyCollect from './MyCollect';
import BrowsingHistory from './BrowsingHistory';
import LibraryCondition from './analysis/LibraryCondition';
import LearningSituation from './analysis/LearningSituation';
import UseCondition from './analysis/UseCondition';

interface ResourceLibraryViewProps {
  onBack: () => void;
  onLogout: () => void;
}

export const ResourceLibraryView: React.FC<ResourceLibraryViewProps> = ({ onBack, onLogout }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['resourceManagement', 'resourceAnalysis']);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
    );
  };

  const navItems = [
    { title: '资源首页', icon: Home, path: '/resource-library/home' },
    { 
      title: '资源管理', 
      icon: Library, 
      id: 'resourceManagement',
      children: [
        { title: '资源审核', path: '/resource-library/audit' }
      ]
    },
    { title: '仪器资源库', icon: Hammer, path: '/resource-library/instruments' },
    { title: '教师研修', icon: UserRound, path: '/resource-library/training' },
    { title: '我的收藏', icon: Star, path: '/resource-library/collect' },
    { title: '浏览历史', icon: History, path: '/resource-library/history' },
    { 
      title: '资源分析', 
      icon: BarChart3, 
      id: 'resourceAnalysis',
      children: [
        { title: '资源库情况', path: '/resource-library/analysis/library' },
        { title: '学习情况分析', path: '/resource-library/analysis/learning' },
        { title: '资源库使用情况', path: '/resource-library/analysis/use' }
      ]
    }
  ];

  const currentPath = location.pathname;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <LayoutGrid size={20} />
            </div>
            <span className="text-lg font-bold text-slate-800 dark:text-white">资源管理</span>
          </div>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-4">
             <Languages size={16} className="text-slate-400" />
             <select className="bg-transparent text-sm text-slate-600 dark:text-slate-400 focus:outline-none">
                <option>中文</option>
                <option>英文</option>
             </select>
          </div>
          
          <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
              3
            </span>
          </button>

          <div className="flex items-center gap-3 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
             <div className="text-right">
               <p className="text-xs font-bold text-slate-700 dark:text-slate-300">管理员</p>
               <p className="text-[10px] text-slate-500">咸阳市实验中学</p>
             </div>
             <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
             </div>
          </div>

          <button 
            onClick={onLogout}
            className="p-2 text-slate-500 hover:text-red-500 transition-colors"
            title="退出登录"
          >
            <LogOut size={20} />
          </button>

          <button 
            onClick={onBack}
            className="text-sm font-medium text-blue-600 hover:underline px-2"
          >
            首页
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.aside 
          initial={false}
          animate={{ width: isSidebarCollapsed ? 64 : 260 }}
          className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-2 space-y-1">
            {navItems.map((item) => (
              <div key={item.title}>
                {item.children ? (
                  <div className="flex flex-col">
                    <button 
                      onClick={() => toggleMenu(item.id!)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                        isSidebarCollapsed && "justify-center px-2"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={20} className={expandedMenus.includes(item.id!) ? "text-blue-600" : ""} />
                        {!isSidebarCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                      </div>
                      {!isSidebarCollapsed && (
                        expandedMenus.includes(item.id!) ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </button>
                    <AnimatePresence>
                      {!isSidebarCollapsed && expandedMenus.includes(item.id!) && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-10 space-y-1"
                        >
                          {item.children.map((child) => (
                            <Link 
                              key={child.path}
                              to={child.path}
                              className={cn(
                                "block px-3 py-2 rounded-lg text-sm transition-colors",
                                currentPath === child.path 
                                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 font-bold" 
                                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                              )}
                            >
                              {child.title}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link 
                    to={item.path!}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      currentPath === item.path 
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 font-bold" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
                      isSidebarCollapsed && "justify-center px-2"
                    )}
                  >
                    <item.icon size={20} />
                    {!isSidebarCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </motion.aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 relative flex flex-col">
          <div className="flex-1">
            <Routes>
              <Route path="home" element={<HomeResourceLibrary />} />
              <Route path="audit" element={<ResourceAudit />} />
              <Route path="instruments" element={<InstrumentLibrary />} />
              <Route path="instruments/:id" element={<InstrumentDetail />} />
              <Route path="training" element={<TeacherTraining />} />
              <Route path="training/add" element={<TeacherTrainingAdd />} />
              <Route path="detail/:id" element={<ResourceDetail />} />
              <Route path="collect" element={<MyCollect />} />
              <Route path="history" element={<BrowsingHistory />} />
              <Route path="analysis/library" element={<LibraryCondition />} />
              <Route path="analysis/learning" element={<LearningSituation />} />
              <Route path="analysis/use" element={<UseCondition />} />
              <Route path="/" element={<Navigate to="home" replace />} />
            </Routes>
          </div>

          <footer className="mt-12 py-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl p-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest border-l-4 border-blue-600 pl-3">友情链接 <span className="text-slate-400 ml-1">Friendship link</span></h4>
                   <div className="flex gap-4 ml-8">
                      <a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">咸阳教育云</a>
                      <a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">实验教学服务平台</a>
                      <a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">国家资源库中心</a>
                   </div>
                </div>
                <div className="flex gap-2">
                   <button className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <ChevronRight size={16} className="rotate-180" />
                   </button>
                   <button className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <ChevronRight size={16} />
                   </button>
                </div>
             </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

const Placeholder: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
    <LayoutGrid size={64} className="mb-4 opacity-20" />
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    <p>该功能正在开发中...</p>
  </div>
);

export default ResourceLibraryView;
