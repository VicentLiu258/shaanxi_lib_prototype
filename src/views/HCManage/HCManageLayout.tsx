import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Home, Bell, ChevronDown, ChevronRight, Monitor, BookOpen, Search,
  ClipboardList, Menu, ChevronLeft, RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { HC_MENU, findMenuLabel } from './menu';
import { getCurrentUserAsync, switchUser, getTodos, resetDemoData } from './mock/api';
import { SAMPLE_HC_USERS } from './mock/constants';
import { HcUser, TodoItem } from './types';
import { ToastContainer, useToast } from './components/shared';

const ICON_MAP: Record<string, React.ElementType> = {
  dashboard: Monitor,
  chemicals: ClipboardList,
  flow: BookOpen,
  storage: Menu,
  waste: RotateCcw,
  risk: Bell,
  training: BookOpen,
  settings: Menu,
};

export const HCManageLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toasts, showToast } = useToast();
  const [expanded, setExpanded] = useState<string[]>(['chemicals', 'flow', 'storage']);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<HcUser | null>(null);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [todoOpen, setTodoOpen] = useState(false);
  const [searchKw, setSearchKw] = useState('');
  const [userMenu, setUserMenu] = useState(false);

  const isScreen = location.pathname.includes('/screen');
  const isTerminal = location.pathname.includes('/terminal-simulator');

  useEffect(() => {
    getCurrentUserAsync().then(setUser);
    getTodos().then(setTodos);
  }, []);

  if (isScreen || isTerminal) {
    return <Outlet />;
  }

  const breadcrumbs = findMenuLabel(location.pathname);

  const toggle = (id: string) => {
    setExpanded(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const handleSearch = () => {
    if (!searchKw.trim()) return;
    navigate(`/hc-manage/chemicals/catalog`);
    showToast(`检索：${searchKw}`);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <ToastContainer toasts={toasts} />

      {/* 主系统级顶栏：保留返回门户、用户、消息 */}
      <header className="h-16 bg-[#1E3A8A] flex items-center justify-between px-6 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center text-white font-black text-sm">HC</div>
          <div>
            <span className="text-lg font-bold text-white">危化品全生命周期管理</span>
            <p className="text-[10px] text-blue-200">陕西实验室综合管理平台 · 子系统</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button type="button" onClick={() => navigate('/hc-manage/screen')} className="hidden md:flex items-center gap-1 text-blue-100 hover:text-white text-sm">
            <Monitor size={16} /> 监管大屏
          </button>
          <div className="relative">
            <Bell size={20} className="text-blue-100 cursor-pointer" onClick={() => setTodoOpen(true)} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[9px] text-white rounded-full flex items-center justify-center">{todos.length}</span>
          </div>
          <div className="relative">
            <button type="button" onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 text-blue-100 text-sm">
              <span>{user?.name || '加载中'}</span>
              <ChevronDown size={14} />
            </button>
            {userMenu && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-xl py-1 z-50 text-slate-800">
                {SAMPLE_HC_USERS.map(u => (
                  <button key={u.id} type="button" className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50" onClick={async () => {
                    setUser(await switchUser(u.id));
                    setUserMenu(false);
                    showToast(`已切换为 ${u.name}`);
                  }}>{u.name} · {u.role}</button>
                ))}
              </div>
            )}
          </div>
          <button type="button" onClick={() => navigate('/portal')} className="flex items-center gap-1 text-blue-100 hover:text-white text-sm">
            <Home size={16} /> 返回门户
          </button>
        </div>
      </header>

      {/* 子系统 40px 辅助条 */}
      <div className="h-10 bg-white border-b flex items-center justify-between px-6 text-sm shrink-0">
        <div className="flex items-center gap-2 text-slate-600">
          {breadcrumbs.map((c, i) => (
            <React.Fragment key={c}>
              {i > 0 && <ChevronRight size={12} />}
              <span className={cn(i === breadcrumbs.length - 1 && 'text-slate-900 font-bold')}>{c}</span>
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 rounded-full px-3 py-1 gap-2">
            <Search size={14} className="text-slate-400" />
            <input
              value={searchKw}
              onChange={e => setSearchKw(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="检索化学品/瓶码/库房"
              className="bg-transparent border-none outline-none text-xs w-40"
            />
          </div>
          <button type="button" onClick={() => setTodoOpen(true)} className="text-xs font-bold text-[#1E3A8A]">
            待办（{todos.length}）
          </button>
          <button type="button" onClick={() => navigate('/hc-manage/screen')} className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1">
            <Monitor size={14} /> 大屏
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <motion.aside animate={{ width: collapsed ? 56 : 220 }} className="bg-white border-r flex flex-col shrink-0 overflow-y-auto">
          <nav className="py-3 px-2 space-y-0.5">
            {HC_MENU.map(group => {
              const Icon = ICON_MAP[group.id] || ClipboardList;
              const hasChildren = !!group.children?.length;
              const isExp = expanded.includes(group.id);
              const isActive = group.path === location.pathname || group.children?.some(c => c.path === location.pathname);

              if (group.path) {
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => navigate(group.path!)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold',
                      location.pathname === group.path ? 'bg-[#1E3A8A] text-white' : 'text-slate-600 hover:bg-slate-100',
                    )}
                  >
                    <Icon size={18} />
                    {!collapsed && <span>{group.label}</span>}
                  </button>
                );
              }

              return (
                <div key={group.id}>
                  <button
                    type="button"
                    onClick={() => (hasChildren ? toggle(group.id) : null)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold',
                      isActive ? 'text-[#1E3A8A] bg-blue-50' : 'text-slate-600 hover:bg-slate-100',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={18} />
                      {!collapsed && <span>{group.label}</span>}
                    </div>
                    {!collapsed && hasChildren && <ChevronDown size={14} className={cn('transition-transform', isExp && 'rotate-180')} />}
                  </button>
                  {!collapsed && hasChildren && isExp && (
                    <div className="ml-3 mt-0.5 border-l border-slate-200 pl-2">
                      {group.children!.map(sub => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => sub.path && navigate(sub.path)}
                          className={cn(
                            'w-full text-left px-3 py-2 rounded-lg text-xs font-medium',
                            location.pathname === sub.path ? 'bg-[#1E3A8A] text-white' : 'text-slate-500 hover:text-blue-700',
                          )}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="m-2 p-2 border rounded-lg text-slate-400 hover:bg-slate-50"
          >
            {collapsed ? <Menu size={14} /> : <ChevronLeft size={14} />}
          </button>
        </motion.aside>

        <main className="flex-1 overflow-y-auto p-4">
          <Outlet context={{ showToast }} />
        </main>
      </div>

      <AnimatePresence>
        {todoOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-40" onClick={() => setTodoOpen(false)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 p-4"
            >
              <h3 className="font-bold mb-4">业务待办</h3>
              <ul className="space-y-3 text-sm">
                {todos.map(t => (
                  <li key={t.id} className="border-b pb-2">
                    <p className="font-medium">{t.title}</p>
                    <p className="text-xs text-slate-400">{t.module} · {t.time}</p>
                  </li>
                ))}
              </ul>
              <button type="button" className="mt-4 text-xs text-slate-500" onClick={async () => { await resetDemoData(); showToast('演示数据已重置'); }}>重置演示数据</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
