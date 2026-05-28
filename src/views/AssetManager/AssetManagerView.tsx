import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard, Menu, ChevronLeft, ChevronDown, ArrowLeft,
  Search, Bell, Database, FolderTree, MapPin, Truck, ClipboardList,
  PackagePlus, UserCheck, Clock, CheckSquare, ShoppingCart, Trash2,
  BarChart3, RotateCcw, ScanLine, Maximize, LogOut, Wrench, GitBranch,
  WalletCards,
  ShieldAlert, ShieldCheck, ArrowRightLeft,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ToastContainer, useToast } from './components/shared';
import { DashboardPage } from './pages/DashboardPage';
import { AssetListPage } from './pages/AssetListPage';
import { AssetInboundPage } from './pages/AssetInboundPage';
import { AssetReceivePage } from './pages/AssetReceivePage';
import { CategoryManagePage } from './pages/CategoryManagePage';
import { AreaManagePage } from './pages/AreaManagePage';
import { SupplierManagePage } from './pages/SupplierManagePage';
import { CategoryReportPage } from './pages/CategoryReportPage';
import { AssetHistoryPage } from './pages/AssetHistoryPage';
import { PurchaseApplyPage } from './pages/PurchaseApplyPage';
import { InventoryCheckPage } from './pages/InventoryCheckPage';
import { ScrapDisposalPage } from './pages/ScrapDisposalPage';
import { MaintenancePlanPage } from './pages/MaintenancePlanPage';
import { LifecycleOverviewPage } from './pages/LifecycleOverviewPage';
import { FinanceReportPage } from './pages/FinanceReportPage';
import { BorrowReportPage } from './pages/BorrowReportPage';
import { AssetDamagePage } from './pages/AssetDamagePage';
import { AssetWarrantyPage } from './pages/AssetWarrantyPage';
import { AssetTransferPage } from './pages/AssetTransferPage';
import { getCurrentUserAsync, switchUser, resetDemoData } from './mock/api';
import { SAMPLE_USERS } from './mock/constants';
import { User } from './types';

interface AssetManagerViewProps {
  id: string;
  name: string;
  onBack: () => void;
  onLogout: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  dashboard: '工作台',
  'asset-list': '资产清单',
  'asset-inbound': '资产入库',
  'asset-receive': '资产领用',
  'asset-history': '资产履历',
  'asset-inventory': '资产盘点',
  'asset-maintenance': '维保计划',
  'asset-damage': '资产报损',
  'asset-warranty': '资产保修',
  'asset-transfer': '资产转移',
  'basic-category': '资产分类',
  'basic-area': '存放区域',
  'basic-supplier': '供应商管理',
  purchase: '采购申请',
  lifecycle: '流转总览',
  scrap: '报废处置',
  'report-category': '分类统计',
  'report-finance': '财务折旧',
  'report-borrow': '借用账查询',
};

export const AssetManagerView: React.FC<AssetManagerViewProps> = ({ name, onBack, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['asset', 'basic']);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [listKeyword, setListKeyword] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { toasts, showToast } = useToast();

  useEffect(() => { getCurrentUserAsync().then(setCurrentUser); }, []);

  const toggleExpand = (id: string) => {
    setExpandedMenus(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const navigate = (key: string) => setActiveMenu(key);

  const handleSearch = () => {
    if (!searchKeyword.trim()) return;
    setListKeyword(searchKeyword);
    setActiveMenu('asset-list');
    showToast(`已打开资产清单，搜索：${searchKeyword}`);
  };

  const handleReset = async () => {
    await resetDemoData();
    setCurrentUser(await getCurrentUserAsync());
    showToast('演示数据已重置');
    window.location.reload();
  };

  const menuGroups = [
    { id: 'dashboard', label: '工作台', icon: LayoutDashboard },
    {
      id: 'basic', label: '基础信息', icon: FolderTree,
      subItems: [
        { id: 'basic-category', label: '资产分类', icon: FolderTree },
        { id: 'basic-area', label: '存放区域', icon: MapPin },
        { id: 'basic-supplier', label: '供应商', icon: Truck },
      ],
    },
    {
      id: 'asset', label: '资产管理', icon: Database,
      subItems: [
        { id: 'asset-list', label: '资产清单', icon: ClipboardList },
        { id: 'asset-inbound', label: '资产入库', icon: PackagePlus },
        { id: 'asset-receive', label: '资产领用', icon: UserCheck },
        { id: 'asset-history', label: '资产履历', icon: Clock },
        { id: 'asset-inventory', label: '资产盘点', icon: CheckSquare },
        { id: 'asset-maintenance', label: '维保计划', icon: Wrench },
        { id: 'asset-damage', label: '资产报损', icon: ShieldAlert },
        { id: 'asset-warranty', label: '资产保修', icon: ShieldCheck },
        { id: 'asset-transfer', label: '资产转移', icon: ArrowRightLeft },
      ],
    },
    {
      id: 'finance', label: '生命周期', icon: GitBranch,
      subItems: [
        { id: 'purchase', label: '采购申请', icon: ShoppingCart },
        { id: 'lifecycle', label: '流转总览', icon: GitBranch },
        { id: 'scrap', label: '报废处置', icon: Trash2 },
      ],
    },
    {
      id: 'reports', label: '查询报表', icon: BarChart3,
      subItems: [
        { id: 'report-category', label: '分类统计', icon: BarChart3 },
        { id: 'report-finance', label: '财务折旧', icon: WalletCards },
        { id: 'report-borrow', label: '借用账查询', icon: ClipboardList },
      ],
    },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard': return <DashboardPage onNavigate={navigate} />;
      case 'asset-list': return <AssetListPage onOpenInbound={() => navigate('asset-inbound')} showToast={showToast} initialKeyword={listKeyword} />;
      case 'asset-inbound': return <AssetInboundPage onDone={() => navigate('asset-list')} onBack={() => navigate('asset-list')} showToast={showToast} />;
      case 'asset-receive': return <AssetReceivePage showToast={showToast} />;
      case 'asset-history': return <AssetHistoryPage />;
      case 'asset-inventory': return <InventoryCheckPage showToast={showToast} />;
      case 'asset-maintenance': return <MaintenancePlanPage showToast={showToast} />;
      case 'asset-damage': return <AssetDamagePage showToast={showToast} />;
      case 'asset-warranty': return <AssetWarrantyPage showToast={showToast} />;
      case 'asset-transfer': return <AssetTransferPage showToast={showToast} />;
      case 'basic-category': return <CategoryManagePage />;
      case 'basic-area': return <AreaManagePage />;
      case 'basic-supplier': return <SupplierManagePage showToast={showToast} />;
      case 'purchase': return <PurchaseApplyPage showToast={showToast} />;
      case 'lifecycle': return <LifecycleOverviewPage onNavigate={navigate} />;
      case 'scrap': return <ScrapDisposalPage />;
      case 'report-category': return <CategoryReportPage />;
      case 'report-finance': return <FinanceReportPage />;
      case 'report-borrow': return <BorrowReportPage />;
      default: return <DashboardPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[var(--bg-main)] text-[var(--text-main)] transition-colors">
      <ToastContainer toasts={toasts} />

      <header className="h-16 bg-[var(--card-bg)] border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">资</div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none">陕西实验室 · {name}</h1>
              <p className="text-[10px] font-bold text-muted mt-1 uppercase tracking-widest">Asset Management System</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-white/5 rounded-full px-4 py-1.5 gap-2 border border-slate-200 dark:border-white/10">
            <Search size={14} className="text-muted" />
            <input
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="搜索资产编号/名称/使用人..."
              className="bg-transparent border-none outline-none text-xs font-medium w-48 text-[var(--text-main)] placeholder:text-[var(--text-placeholder)]"
            />
          </div>
          <button onClick={() => { showToast('模拟扫码成功'); navigate('asset-list'); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-secondary" title="扫码/RFID">
            <ScanLine size={18} />
          </button>
          <button onClick={() => document.documentElement.requestFullscreen?.()} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-secondary hidden md:block">
            <Maximize size={18} />
          </button>
          <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-secondary">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="relative border-l border-slate-200 dark:border-white/10 pl-4">
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 font-bold text-xs">
                {currentUser?.name?.[0] || '管'}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold">{currentUser?.name || '加载中'}</div>
                <div className="text-[10px] text-muted">{currentUser?.role}</div>
              </div>
              <ChevronDown size={14} className="text-muted" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-white/10 py-2 z-50">
                {SAMPLE_USERS.map(u => (
                  <button key={u.id} onClick={async () => { const nu = await switchUser(u.id); setCurrentUser(nu); showToast(`已切换至 ${nu.name}`); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5">
                    {u.name} · {u.dept}
                  </button>
                ))}
                <hr className="my-1 border-slate-100 dark:border-white/10" />
                <button onClick={handleReset} className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2">
                  <RotateCcw size={14} /> 重置演示数据
                </button>
                <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <LogOut size={14} /> 退出登录
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <motion.aside
          animate={{ width: isCollapsed ? 72 : 240 }}
          className="bg-[var(--card-bg)] border-r border-slate-200 dark:border-white/10 flex flex-col z-40 relative shadow-sm"
        >
          <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
            {menuGroups.map(group => (
              <div key={group.id}>
                <button
                  onClick={() => group.subItems ? toggleExpand(group.id) : setActiveMenu(group.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                    activeMenu === group.id || group.subItems?.some(s => s.id === activeMenu)
                      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600'
                      : 'text-secondary hover:bg-slate-50 dark:hover:bg-white/5',
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <group.icon size={18} />
                    {!isCollapsed && <span>{group.label}</span>}
                  </div>
                  {!isCollapsed && group.subItems && (
                    <ChevronDown size={14} className={cn('transition-transform', expandedMenus.includes(group.id) && 'rotate-180')} />
                  )}
                </button>
                {!isCollapsed && group.subItems && expandedMenus.includes(group.id) && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-slate-100 dark:border-white/10 pl-3">
                    {group.subItems.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => setActiveMenu(sub.id)}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all',
                          activeMenu === sub.id
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : 'text-muted hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5',
                        )}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-1/2 -right-3 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center shadow-md z-50"
          >
            {isCollapsed ? <Menu size={12} /> : <ChevronLeft size={12} />}
          </button>
        </motion.aside>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h2 className="text-xl font-black text-[var(--text-main)]">{PAGE_TITLES[activeMenu] || activeMenu}</h2>
            <p className="text-xs text-muted mt-1">数据持久化至 localStorage · 共 85+ 条演示资产</p>
          </div>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
