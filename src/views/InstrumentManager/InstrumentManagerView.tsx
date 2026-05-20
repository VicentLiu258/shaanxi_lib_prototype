import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Menu, 
  ChevronLeft, 
  ChevronRight,
  Settings, 
  FileText, 
  Users, 
  HelpCircle,
  Bell,
  Search,
  ArrowLeft,
  Briefcase,
  Layers,
  ClipboardCheck,
  ShoppingCart,
  PieChart,
  LogOut,
  User,
  Package,
  Wrench,
  Clock,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Dashboard } from './modules/Dashboard';
import { InstrumentStock } from './modules/InstrumentStock';
import { InstrumentList } from './modules/InstrumentList';
import { ConsumableStock } from './modules/ConsumableStock';
import { AssetVisualization } from './modules/AssetVisualization';
import { SubjectAssetVisualization } from './modules/SubjectAssetVisualization';
import { InstrumentStorage } from './modules/InstrumentStorage';
import { InstrumentStandard } from './modules/InstrumentStandard';
import { InstrumentBorrow } from './modules/InstrumentBorrow';
import { InstrumentReturn } from './modules/InstrumentReturn';
import { InstrumentDispose } from './modules/InstrumentDispose';
import { InstrumentRepair } from './modules/InstrumentRepair';
import { InstrumentMainPlan } from './modules/InstrumentMainPlan';
import { InstrumentUpkeep } from './modules/InstrumentUpkeep';
import { InstrumentMigration } from './modules/InstrumentMigration';
import { InstrumentBook } from './modules/InstrumentBook';
import { FlowConfiguration } from './modules/FlowConfiguration';
import { SystemLog } from './modules/SystemLog';
import { ConsumableList } from './modules/ConsumableList';
import { ConsumableWarehousing } from './modules/ConsumableWarehousing';
import { ConsumableLedger } from './modules/ConsumableLedger';
import { ConsumableStandard } from './modules/ConsumableStandard';
import { ConsumableReceipt } from './modules/ConsumableReceipt';
import { ConsumableRevert } from './modules/ConsumableRevert';
import { ConsumableDispose } from './modules/ConsumableDispose';
import { InventoryTask } from './modules/InventoryTask';
import { InstrumentCheck } from './modules/InstrumentCheck';
import { InventoryTaskExecute } from './modules/InventoryTaskExecute';
import { ProcureApply } from './modules/ProcureApply';
import { ProcureOrder } from './modules/ProcureOrder';
import { SupplierManage } from './modules/SupplierManage';
import { AssetClassReport } from './modules/reports/AssetClassReport';
import { AssetBorrowReport } from './modules/reports/AssetBorrowReport';
import { MyUsageStatistics } from './modules/reports/MyUsageStatistics';
import { OrgStatusReport } from './modules/reports/OrgStatusReport';
import { AreaStatusReport } from './modules/reports/AreaStatusReport';
import { DisposeStatistics } from './modules/reports/DisposeStatistics';
import { DeptStatistics } from './modules/reports/DeptStatistics';

interface InstrumentManagerViewProps {
  onBack: () => void;
  onLogout: () => void;
}

export const InstrumentManagerView: React.FC<InstrumentManagerViewProps> = ({ onBack, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['instruments', 'consumables']);

  const toggleExpand = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const menuGroups = [
    { id: 'dashboard', label: '首页', icon: LayoutDashboard },
    {
      id: 'visuals',
      label: '可视化中心',
      icon: PieChart,
      subItems: [
        { id: 'vis-dept', label: '部门仪器可视化' },
        { id: 'vis-global', label: '全局仪器可视化' },
      ]
    },
    { 
      id: 'instruments', 
      label: '仪器模块', 
      icon: Wrench,
      subItems: [
        { id: 'instr-stock', label: '仪器库存' },
        { id: 'instr-list', label: '仪器清单' },
        { id: 'instr-entry', label: '仪器入库' },
        { id: 'instr-std', label: '仪器标准品库' },
        { id: 'instr-borrow', label: '仪器借用' },
        { id: 'instr-return', label: '仪器归还' },
        { id: 'instr-disposal', label: '仪器处置' },
        { id: 'instr-repair', label: '仪器维修' },
        { id: 'instr-plan', label: '仪器保养计划' },
        { id: 'instr-maint', label: '保养仪器' },
        { id: 'instr-transfer', label: '仪器转移' },
        { id: 'instr-reserve', label: '仪器预约' },
        { id: 'instr-flow', label: '审批流设置' },
        { id: 'instr-logs', label: '系统日志' },
      ]
    },
    {
      id: 'consumables',
      label: '耗材模块',
      icon: Package,
      subItems: [
        { id: 'cons-stock', label: '耗材库存' },
        { id: 'cons-list', label: '耗材清单' },
        { id: 'cons-entry', label: '耗材入库' },
        { id: 'cons-ledger', label: '耗材台账' },
        { id: 'cons-std', label: '耗材标准品库' },
        { id: 'cons-claim', label: '耗材领用' },
        { id: 'cons-return', label: '耗材退还' },
        { id: 'cons-disposal', label: '耗材处置' },
        { id: 'cons-transfer', label: '耗材转移' },
      ]
    },
    {
      id: 'inventory',
      label: '盘点模块',
      icon: ClipboardCheck,
      subItems: [
        { id: 'inv-plan', label: '盘点计划' },
        { id: 'inv-daily', label: '日常盘点' },
        { id: 'inv-exec', label: '盘点执行' },
      ]
    },
    {
      id: 'procurement',
      label: '采购模块',
      icon: ShoppingCart,
      subItems: [
        { id: 'proc-apply', label: '采购申请' },
        { id: 'proc-order', label: '采购订单' },
        { id: 'proc-vendor', label: '供应商管理' },
      ]
    },
    {
      id: 'reports',
      label: '统计报表',
      icon: PieChart,
      subItems: [
        { id: 'rep-types', label: '仪器类型统计' },
        { id: 'rep-status', label: '仪器区域-状态' },
        { id: 'rep-org', label: '所属组织-状态' },
        { id: 'rep-usage', label: '月份-仪器借还' },
        { id: 'rep-add', label: '新增资产趋势' },
        { id: 'rep-dispose', label: '仪器处置统计' },
        { id: 'rep-dept', label: '部门资产统计' },
        { id: 'rep-personal', label: '我使用的统计' },
      ]
    }
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-[#F5F7FA] text-slate-800 transition-colors duration-300">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1B6BE5] rounded-lg flex items-center justify-center text-white font-black text-xs">
              XY
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-800 leading-none">咸阳市实验中学</h1>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">数字化实验室仪器与耗材管理平台</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-1.5 gap-2 border border-slate-200">
             <Search size={14} className="text-slate-400" />
             <input type="text" placeholder="全域搜索仪器设备 / 耗材..." className="bg-transparent border-none outline-none text-xs font-medium w-48" />
          </div>
          
          <div className="flex items-center gap-4 border-l border-slate-200 pl-6 text-slate-500">
            <button className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 cursor-pointer group">
               <div className="text-right">
                  <p className="text-xs font-black text-slate-800 leading-none">管理员</p>
                  <p className="text-[10px] text-slate-400 mt-1">系统中心控制室</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden group-hover:border-blue-500 transition-colors">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" />
               </div>
               <ChevronDown size={14} className="text-slate-400 group-hover:text-blue-500" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.aside 
          animate={{ width: isCollapsed ? 80 : 256 }}
          className="bg-white border-r border-slate-200 flex flex-col z-40 relative shadow-sm h-full"
        >
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
            {menuGroups.map((group) => (
              <div key={group.id} className="space-y-1">
                <button
                  onClick={() => {
                    if (group.subItems) {
                      toggleExpand(group.id);
                    } else {
                      setActiveMenu(group.id);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm font-bold group",
                    activeMenu === group.id || (activeMenu.startsWith(group.id) && group.subItems)
                      ? "bg-[#1B6BE5]/5 text-[#1B6BE5]" 
                      : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <group.icon size={20} className={cn(
                       "transition-colors",
                       activeMenu === group.id || (activeMenu.startsWith(group.id) && group.subItems) ? "text-[#1B6BE5]" : "text-slate-400 group-hover:text-slate-600"
                    )} />
                    {!isCollapsed && <span>{group.label}</span>}
                  </div>
                  {!isCollapsed && group.subItems && (
                    <motion.div
                      animate={{ rotate: expandedMenus.includes(group.id) ? 0 : -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={14} />
                    </motion.div>
                  )}
                </button>

                {!isCollapsed && group.subItems && expandedMenus.includes(group.id) && (
                  <div className="pl-11 space-y-1 py-1">
                    {group.subItems.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setActiveMenu(sub.id)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all",
                          activeMenu === sub.id 
                            ? "bg-[#1B6BE5] text-white shadow-md shadow-blue-500/20" 
                            : "text-slate-400 hover:text-slate-800 hover:bg-slate-50"
                        )}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all text-sm font-bold"
            >
              <LogOut size={20} />
              {!isCollapsed && <span>安全退出</span>}
            </button>
          </div>

          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-1/2 -right-3 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md hover:text-[#1B6BE5] transition-colors z-50"
          >
            {isCollapsed ? <Menu size={12} /> : <ChevronLeft size={12} />}
          </button>
        </motion.aside>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden flex flex-col relative">
          {/* Breadcrumbs / Tab Bar */}
          <div className="h-12 bg-white border-b border-slate-200 flex items-center px-8 text-xs font-bold text-slate-400 gap-2 shrink-0">
             <LayoutDashboard size={14} />
             <span>首页</span>
             {activeMenu !== 'dashboard' && (
                <>
                  <ChevronRight size={14} />
                  <span className="text-[#1B6BE5]">
                    {menuGroups.find(g => g.id === activeMenu)?.label || 
                     menuGroups.flatMap(g => g.subItems || []).find(s => s.id === activeMenu)?.label || 
                     '当前功能'}
                  </span>
                </>
             )}
          </div>

          <div className="flex-1 overflow-y-auto">
             <AnimatePresence mode="wait">
                {activeMenu === 'dashboard' && <Dashboard key="dashboard" />}
                
                {/* Visualizations */}
                {activeMenu === 'vis-dept' && <SubjectAssetVisualization key="vis-dept" />}
                {activeMenu === 'vis-global' && <AssetVisualization key="vis-global" />}

                {/* Instruments */}
                {activeMenu === 'instr-stock' && <InstrumentStock key="instr-stock" />}
                {activeMenu === 'instr-list' && <InstrumentList key="instr-list" />}
                {activeMenu === 'instr-entry' && <InstrumentStorage key="instr-entry" />}
                {activeMenu === 'instr-std' && <InstrumentStandard key="instr-std" />}
                {activeMenu === 'instr-borrow' && <InstrumentBorrow key="instr-borrow" />}
                {activeMenu === 'instr-return' && <InstrumentReturn key="instr-return" />}
                {activeMenu === 'instr-disposal' && <InstrumentDispose key="instr-disposal" />}
                {activeMenu === 'instr-repair' && <InstrumentRepair key="instr-repair" />}
                {activeMenu === 'instr-plan' && <InstrumentMainPlan key="instr-plan" />}
                {activeMenu === 'instr-maint' && <InstrumentUpkeep key="instr-maint" />}
                {activeMenu === 'instr-transfer' && <InstrumentMigration key="instr-transfer" />}
                {activeMenu === 'instr-reserve' && <InstrumentBook key="instr-reserve" />}
                {activeMenu === 'instr-flow' && <FlowConfiguration key="instr-flow" />}
                {activeMenu === 'instr-logs' && <SystemLog key="instr-logs" />}
                
                {/* Consumables */}
                {activeMenu === 'cons-stock' && <ConsumableStock key="cons-stock" />}
                {activeMenu === 'cons-list' && <ConsumableList key="cons-list" />}
                {activeMenu === 'cons-entry' && <ConsumableWarehousing key="cons-entry" />}
                {activeMenu === 'cons-ledger' && <ConsumableLedger key="cons-ledger" />}
                {activeMenu === 'cons-std' && <ConsumableStandard key="cons-std" />}
                {activeMenu === 'cons-claim' && <ConsumableReceipt key="cons-claim" />}
                {activeMenu === 'cons-return' && <ConsumableRevert key="cons-return" />}
                {activeMenu === 'cons-disposal' && <ConsumableDispose key="cons-disposal" />}
                {activeMenu === 'cons-transfer' && <InstrumentMigration key="cons-transfer" />}

                {/* Inventory */}
                {activeMenu === 'inv-plan' && <InventoryTask key="inv-plan" />}
                {activeMenu === 'inv-daily' && <InstrumentCheck key="inv-daily" />}
                {activeMenu === 'inv-exec' && <InventoryTaskExecute key="inv-exec" />}

                {/* Procurement */}
                {activeMenu === 'proc-apply' && <ProcureApply key="proc-apply" />}
                {activeMenu === 'proc-order' && <ProcureOrder key="proc-order" />}
                {activeMenu === 'proc-vendor' && <SupplierManage key="proc-vendor" />}

                {/* Reports */}
                {activeMenu === 'rep-types' && <AssetClassReport key="rep-types" />}
                {activeMenu === 'rep-status' && <AreaStatusReport key="rep-status" />}
                {activeMenu === 'rep-org' && <OrgStatusReport key="rep-org" />}
                {activeMenu === 'rep-usage' && <AssetBorrowReport key="rep-usage" />}
                {activeMenu === 'rep-personal' && <MyUsageStatistics key="rep-personal" />}
                {activeMenu === 'rep-add' && <AssetBorrowReport key="rep-add" />}
                {activeMenu === 'rep-dispose' && <DisposeStatistics key="rep-dispose" />}
                {activeMenu === 'rep-dept' && <DeptStatistics key="rep-dept" />}
                
                {/* Fallback for other modules */}
                {!['dashboard', 'vis-dept', 'vis-global', 'instr-stock', 'instr-list', 'instr-entry', 'instr-std', 'instr-borrow', 'instr-return', 'instr-disposal', 'instr-repair', 'instr-plan', 'instr-maint', 'instr-transfer', 'instr-reserve', 'instr-flow', 'instr-logs', 'cons-stock', 'cons-list', 'cons-entry', 'cons-ledger', 'cons-std', 'cons-claim', 'cons-return', 'cons-disposal', 'cons-transfer', 'inv-plan', 'inv-daily', 'inv-exec', 'proc-apply', 'proc-order', 'proc-vendor', 'rep-types', 'rep-status', 'rep-org', 'rep-usage', 'rep-personal', 'rep-add', 'rep-dispose', 'rep-dept'].includes(activeMenu) && (
                 <motion.div 
                   key="other"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="p-8"
                 >
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-20 flex flex-col items-center justify-center min-h-[500px]">
                       <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-8 animate-pulse">
                          <Settings size={48} />
                       </div>
                       <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight uppercase">模块功能正在集成</h2>
                       <p className="text-slate-400 font-medium text-center max-w-md">
                         您点击的模块「{menuGroups.flatMap(g => g.subItems || []).find(s => s.id === activeMenu)?.label}」正在联调后端接口规范。
                         本系统遵循咸阳市实验中学数字化实验室业务规范。
                       </p>
                       <button 
                         onClick={() => setActiveMenu('dashboard')}
                         className="mt-8 px-8 py-3 bg-[#1B6BE5] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all uppercase text-xs tracking-widest"
                       >
                         返回仪表盘首页
                       </button>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};
