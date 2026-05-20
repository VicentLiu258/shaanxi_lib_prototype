
import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  Bell, 
  Home, 
  ChevronDown, 
  ChevronUp, 
  LayoutDashboard,
  ShieldCheck,
  Settings,
  ShoppingCart,
  HandHelping,
  Layers,
  ChevronRight,
  ClipboardCheck,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface MenuSubItem {
  label: string;
  path: string;
}

interface MenuItem {
  icon: any;
  label: string;
  subItems: MenuSubItem[];
}

export const HCManageLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['危化品管理']);

  const menuData: MenuItem[] = [
    {
      icon: Layers,
      label: '危化品管理',
      subItems: [
        { label: '入库审核', path: '/hc-manage/warehousing' },
        { label: '危废物审核', path: '/hc-manage/waste' },
        { label: '安全检查', path: '/hc-manage/security-check' },
        { label: '基础信息', path: '/hc-manage/base-info' },
      ]
    },
    {
      icon: ShoppingCart,
      label: '危化品采购',
      subItems: [
        { label: '采购审核', path: '/hc-manage/purchase' },
      ]
    },
    {
      icon: HandHelping,
      label: '危化品领用',
      subItems: [
        { label: '领用审核', path: '/hc-manage/receive' },
      ]
    }
  ];

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]
    );
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path.includes('warehousing')) return ['危化品管理', '入库审核'];
    if (path.includes('waste')) return ['危化品管理', '危废物审核'];
    if (path.includes('security-check')) return ['危化品管理', '安全检查'];
    if (path.includes('base-info')) return ['危化品管理', '基础信息'];
    if (path.includes('purchase')) return ['危化品采购', '采购审核'];
    if (path.includes('receive')) return ['危化品领用', '领用审核'];
    if (path.includes('messages')) return ['系统消息'];
    return ['首页'];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="h-16 bg-slate-900 flex items-center justify-between px-6 shrink-0 relative z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">HC</div>
          <span className="text-lg font-bold text-white">危化品管理</span>
        </div>

        <div className="flex items-center gap-8">
          <div 
            onClick={() => navigate('/hc-manage/messages')}
            className="relative cursor-pointer group"
          >
            <Bell size={22} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold ring-2 ring-slate-900">
              20
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-200">秦淮附属中学管理员</span>
            <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-slate-600">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="User" />
            </div>
          </div>

          <button 
            onClick={() => navigate('/portal')}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
          >
            <Home size={18} />
            <span className="text-sm font-medium">首页</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[180px] bg-white border-r flex flex-col shrink-0 overflow-y-auto">
          <nav className="py-4">
            {menuData.map((item) => {
              const isExpanded = expandedMenus.includes(item.label);
              return (
                <div key={item.label} className="mb-1">
                  <button 
                    onClick={() => toggleMenu(item.label)}
                    className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className="text-slate-500" />
                      <span className="text-sm font-bold">{item.label}</span>
                    </div>
                    {isExpanded ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-gray-50/50"
                      >
                        {item.subItems.map((subItem) => {
                          const isActive = location.pathname === subItem.path;
                          return (
                            <button
                              key={subItem.path}
                              onClick={() => navigate(subItem.path)}
                              className={cn(
                                "w-full text-left pl-12 py-2.5 text-sm transition-all relative",
                                isActive 
                                  ? "bg-blue-600 text-white font-medium shadow-sm" 
                                  : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                              )}
                            >
                              {subItem.label}
                              {isActive && (
                                <motion.div 
                                  layoutId="active-indicator"
                                  className="absolute left-0 top-0 w-1 h-full bg-blue-700"
                                />
                              )}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white overflow-y-auto">
          <div className="p-6">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-slate-600 mb-6">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <span className={cn(idx === breadcrumbs.length - 1 ? "text-slate-500" : "text-slate-700 font-bold")}>
                    {crumb}
                  </span>
                  {idx < breadcrumbs.length - 1 && <ChevronRight size={12} className="text-slate-400" />}
                </React.Fragment>
              ))}
            </div>

            {/* View Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-blue-600" />
              <h2 className="text-2xl font-bold bg-clip-text text-gray-900 tracking-tight">
                {breadcrumbs[breadcrumbs.length - 1]}
              </h2>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[calc(100vh-250px)]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
