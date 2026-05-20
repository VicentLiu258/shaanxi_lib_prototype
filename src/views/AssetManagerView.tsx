import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  ClipboardList, 
  ShoppingCart, 
  CheckSquare, 
  Trash2, 
  Eye, 
  RefreshCw, 
  Trash, 
  X, 
  Check, 
  AlertTriangle, 
  ArrowLeft, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Plus, 
  ChevronRight,
  Info
} from 'lucide-react';
import { useTheme } from '../components/ThemeContext';
import { cn } from '../lib/utils';

interface AssetManagerViewProps {
  id: string;
  name: string;
  onBack: () => void;
  onLogout: () => void;
}

// Custom Toast type
interface Toast {
  id: string;
  type: 'success' | 'warning';
  message: string;
}

// 10 Mock Asset items corresponding to a Laboratory environment
interface Asset {
  id: string; // GD-2024-XXX
  name: string;
  category: '仪器设备' | '电子设备' | '家具' | '其他';
  originalValue: number;
  netValue: number;
  status: '在用' | '维修' | '封存' | '报废待处理';
  owner: string;
  location: string;
  brandModel: string;
  purchaseDate: string;
  depreciationPeriod: number; // in months
  depreciationRecords: Array<{ period: string; prevVal: number; amount: number; newVal: number }>;
  maintenanceRecords: Array<{ date: string; type: string; cost: number; result: string; engineer: string }>;
}

export const AssetManagerView: React.FC<AssetManagerViewProps> = ({ onBack, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'purchase' | 'inventory' | 'scrap'>('dashboard');
  
  // Toasts queue
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message: string, type: 'success' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // State counts that can animate or change
  const [kpiTotalAssets, setKpiTotalAssets] = useState(0);
  const [kpiTotalValue, setKpiTotalValue] = useState(0);
  const [kpiPendingCount, setKpiPendingCount] = useState(23);

  // Animation values targets
  const targetTotalAssets = 386;
  const targetTotalValue = 4287650;

  // KPI animations trigger on component mount
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200; // 1.2s animate

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      setKpiTotalAssets(Math.floor(progress * targetTotalAssets));
      setKpiTotalValue(Math.floor(progress * targetTotalValue));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, []);

  // 10 Mock Assets Data Store
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 'GD-2024-001',
      name: '高速离心机',
      category: '仪器设备',
      originalValue: 120000,
      netValue: 85000,
      status: '在用',
      owner: '王教授',
      location: '生物研发一馆 302室',
      brandModel: 'Beckman Coulter Optima L-100 XP',
      purchaseDate: '2024-03-12',
      depreciationPeriod: 60,
      depreciationRecords: [
        { period: '2026-04', prevVal: 87000, amount: 1000, newVal: 86000 },
        { period: '2026-05', prevVal: 86000, amount: 1000, newVal: 85000 },
        { period: '2026-06', prevVal: 85000, amount: 1000, newVal: 84000 },
      ],
      maintenanceRecords: [
        { date: '2025-06-12', type: '转子寿命检查', cost: 1200, result: '正常', engineer: '雷曼工程技术服务' },
        { date: '2025-11-05', type: '日常保养清洁及润滑', cost: 450, result: '良好', engineer: '科室自主维保' },
      ]
    },
    {
      id: 'GD-2024-002',
      name: '电子分析天平',
      category: '仪器设备',
      originalValue: 45000,
      netValue: 31000,
      status: '在用',
      owner: '赵教授',
      location: '先进化学分析室 105室',
      brandModel: 'Sartorius Cubis II',
      purchaseDate: '2024-05-18',
      depreciationPeriod: 48,
      depreciationRecords: [
        { period: '2026-04', prevVal: 31800, amount: 400, newVal: 31400 },
        { period: '2026-05', prevVal: 31400, amount: 400, newVal: 31000 },
      ],
      maintenanceRecords: [
        { date: '2025-05-20', type: '计量校准与精度微调', cost: 800, result: '高精度合格', engineer: '陕西计量检测院' },
      ]
    },
    {
      id: 'GD-2024-003',
      name: '紫外可见分光光度计',
      category: '仪器设备',
      originalValue: 180000,
      netValue: 112000,
      status: '维修',
      owner: '孙工程师',
      location: '核心光谱表征实验室 401室',
      brandModel: 'Shimadzu UV-2600i',
      purchaseDate: '2024-01-10',
      depreciationPeriod: 60,
      depreciationRecords: [
        { period: '2026-04', prevVal: 114500, amount: 2500, newVal: 112000 },
      ],
      maintenanceRecords: [
        { date: '2025-04-10', type: '光源氘灯更换', cost: 3500, result: '完成', engineer: '岛津厂商服务' },
        { date: '2026-05-10', type: '机械扫描故障检测', cost: 0, result: '正在维修中', engineer: '本校后勤维保组' },
      ]
    },
    {
      id: 'GD-2024-004',
      name: '超净工作台',
      category: '仪器设备',
      originalValue: 35000,
      netValue: 18000,
      status: '在用',
      owner: '李教授',
      location: '细胞培养室 211室',
      brandModel: 'AIRTECH VS-1300U',
      purchaseDate: '2023-11-20',
      depreciationPeriod: 48,
      depreciationRecords: [
        { period: '2026-05', prevVal: 18500, amount: 500, newVal: 18000 },
      ],
      maintenanceRecords: [
        { date: '2024-11-22', type: '高效过滤器(HEPA)更换', cost: 1800, result: '洁净度达标', engineer: '艾迪科净化' },
      ]
    },
    {
      id: 'GD-2024-005',
      name: '液相色谱仪',
      category: '仪器设备',
      originalValue: 480000,
      netValue: 320000,
      status: '在用',
      owner: '王教授',
      location: '精密分离与质谱中心',
      brandModel: 'Waters Alliance e2695',
      purchaseDate: '2023-08-15',
      depreciationPeriod: 72,
      depreciationRecords: [
        { period: '2026-05', prevVal: 325000, amount: 5000, newVal: 320000 },
      ],
      maintenanceRecords: [
        { date: '2024-08-10', type: '高压输液泵密封圈更换', cost: 1500, result: '无泄漏', engineer: '沃特世售后服务部' },
        { date: '2025-08-14', type: '管路流路系统清洗', cost: 800, result: '柱效恢复合格', engineer: '沃特世售后服务部' },
      ]
    },
    {
      id: 'GD-2024-006',
      name: '恒温培养箱',
      category: '仪器设备',
      originalValue: 52000,
      netValue: 39000,
      status: '封存',
      owner: '徐博士',
      location: '生物实验南楼 102室',
      brandModel: 'Thermo Scientific Heratherm',
      purchaseDate: '2024-07-22',
      depreciationPeriod: 60,
      depreciationRecords: [
        { period: '2026-05', prevVal: 39800, amount: 800, newVal: 39000 },
      ],
      maintenanceRecords: [
        { date: '2025-02-14', type: '温度传感器更换校正', cost: 950, result: '控温极佳', engineer: '赛默飞技术工程师' },
      ]
    },
    {
      id: 'GD-2024-007',
      name: '台式电脑',
      category: '电子设备',
      originalValue: 12000,
      netValue: 4200,
      status: '在用',
      owner: '勤管理员',
      location: '物资档案管理科室 220室',
      brandModel: 'Dell OptiPlex 7000 Plus Tower',
      purchaseDate: '2023-04-10',
      depreciationPeriod: 36,
      depreciationRecords: [
        { period: '2026-05', prevVal: 4500, amount: 300, newVal: 4200 },
      ],
      maintenanceRecords: [
        { date: '2025-01-20', type: '操作系统重装与固态盘检测', cost: 0, result: '正常', engineer: '校IT部支持处' },
      ]
    },
    {
      id: 'GD-2024-008',
      name: '3D打印机',
      category: '电子设备',
      originalValue: 85000,
      netValue: 61000,
      status: '在用',
      owner: '实验技术员',
      location: '创新极客工坊 507室',
      brandModel: 'Ultimaker S5',
      purchaseDate: '2024-02-12',
      depreciationPeriod: 48,
      depreciationRecords: [
        { period: '2026-05', prevVal: 62500, amount: 1500, newVal: 61000 },
      ],
      maintenanceRecords: [
        { date: '2025-03-24', type: '双喷头清理与送丝机构维护', cost: 600, result: '完成', engineer: '本地代理工程师' },
      ]
    },
    {
      id: 'GD-2024-009',
      name: '示波器',
      category: '电子设备',
      originalValue: 68000,
      netValue: 45000,
      status: '在用',
      owner: '周工程师',
      location: '先进物理电子诊断室 408室',
      brandModel: 'Keysight InfiniiVision 3000G X',
      purchaseDate: '2024-06-15',
      depreciationPeriod: 48,
      depreciationRecords: [
        { period: '2026-05', prevVal: 46200, amount: 1200, newVal: 45000 },
      ],
      maintenanceRecords: [
        { date: '2025-06-25', type: '通道探头补偿校核', cost: 300, result: '校正完毕', engineer: '科室自主维保' },
      ]
    },
    {
      id: 'GD-2024-010',
      name: '高压灭菌锅',
      category: '仪器设备',
      originalValue: 95000,
      netValue: 62000,
      status: '维修',
      owner: '马管理员',
      location: '无菌培养制备中心',
      brandModel: 'Hirayama HVE-50',
      purchaseDate: '2023-10-18',
      depreciationPeriod: 60,
      depreciationRecords: [
        { period: '2026-05', prevVal: 63800, amount: 1800, newVal: 62000 },
      ],
      maintenanceRecords: [
        { date: '2024-10-15', type: '排汽阀门疏通与气密密封条更换', cost: 1200, result: '气密正常', engineer: '平山代理商技术' },
        { date: '2026-05-18', type: '压力表指示误差校准', cost: 0, result: '待修件在检中', engineer: '校特种设备检测科' },
      ]
    }
  ]);

  // Asset Filters & Search State
  const [filterCategory, setFilterCategory] = useState<string>('全部');
  const [filterStatus, setFilterStatus] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected asset for right drawer & modal interactions
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerActiveTab, setDrawerActiveTab] = useState<number>(0);

  // Modal display controllers
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [scrapModalOpen, setScrapModalOpen] = useState(false);
  const [newPurchaseModalOpen, setNewPurchaseModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  // Modal temporary values
  const [transferTarget, setTransferTarget] = useState('先进化学合成所');
  const [transferReason, setTransferReason] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeRejectingPurchaseId, setActiveRejectingPurchaseId] = useState<string | null>(null);

  // New purchase application template state
  const [newPurchaseName, setNewPurchaseName] = useState('');
  const [newPurchaseCategory, setNewPurchaseCategory] = useState<'仪器设备' | '电子设备' | '家具' | '其他'>('仪器设备');
  const [newPurchasePrice, setNewPurchasePrice] = useState('');
  const [newPurchaseFundSource, setNewPurchaseFundSource] = useState('科研配套专项经费');
  const [newPurchaseReason, setNewPurchaseReason] = useState('');

  // 📋 Requisition applications page statistics & items
  const [purchases, setPurchases] = useState([
    { id: 'CG-2026-042', applicant: '李教授', assetName: '超净安全生物柜', price: '¥24,500', date: '2026-05-10', status: '待审批', remark: '高风险致病菌气溶胶专用防爆级' },
    { id: 'CG-2026-041', applicant: '张研究员', assetName: '高精度温控恒温槽', price: '¥12,800', date: '2026-05-08', status: '待审批', remark: '精密电化学电解池温控配套' },
    { id: 'CG-2026-039', applicant: '梁博士', assetName: '工业级高性能工作站', price: '¥32,000', date: '2026-05-02', status: '待审批', remark: '大型量子力学模型DFT理论解算' }
  ]);

  // 📦 Inventory state (8 assets matching list)
  const [inventoryList, setInventoryList] = useState([
    { id: 'GD-2024-001', name: '高速离心机', location: '生物研发一馆 302室', status: '已盘✓' },
    { id: 'GD-2024-002', name: '电子分析天平', location: '先进化学分析室 105室', status: '未盘' },
    { id: 'GD-2024-003', name: '紫外可见分光光度计', location: '核心光谱表征实验室 401室', status: '盘盈' },
    { id: 'GD-2024-004', name: '超净工作台', location: '细胞培养室 211室', status: '未盘' },
    { id: 'GD-2024-005', name: '液相色谱仪', location: '精密分离与质谱中心', status: '已盘✓' },
    { id: 'GD-2024-006', name: '恒温培养箱', location: '生物实验南楼 102室', status: '未盘' },
    { id: 'GD-2024-007', name: '台式电脑', location: '物资档案管理专室 220室', status: '已盘✓' },
    { id: 'GD-2024-008', name: '3D打印机', location: '创新极客工坊 507室', status: '盘亏' }
  ]);
  const [inventoryCount, setInventoryCount] = useState(147); // Starts at default 147

  // 🗑️ Scrap disposal list mock items
  const [scrapDisposals, setScrapDisposals] = useState([
    { id: 'SCRAP-01', assetName: '老旧台式示波器 (型号Tek-2002)', date: '2026-04-12', applicant: '实验后勤组', method: '捐赠', status: '待审批' },
    { id: 'SCRAP-02', assetName: '废旧高压加热釜 (严重受腐蚀)', date: '2026-04-20', applicant: '张教授', method: '销毁', status: '已批准' },
    { id: 'SCRAP-03', assetName: '废弃高功率稳压电源', date: '2026-05-02', applicant: '周助理', method: '公开拍卖', status: '待审批' },
    { id: 'SCRAP-04', assetName: '旧打印机与扫描一体机', date: '2026-05-15', applicant: '行政办公室', method: '捐赠', status: '已完成' },
    { id: 'SCRAP-05', assetName: '损坏的高纯水制备柱超声器', date: '2026-05-19', applicant: '沈助理', method: '销毁', status: '待审批' }
  ]);

  // Handle Maintenance Now Alert
  const actionMaintain = (equipName: string) => {
    showToast(`⚙️ 维保通知：已成功为 [${equipName}] 触发维保派单逻辑，待专属驻场工程师接单！`, 'success');
  };

  // Filter conditions
  const filteredAssets = assets.filter(item => {
    const matchCategory = filterCategory === '全部' || item.category === filterCategory;
    const matchStatus = filterStatus === '全部' || item.status === filterStatus;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.owner.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchStatus && matchSearch;
  });

  // Handle Detail drawer loading
  const openDrawer = (asset: Asset) => {
    setSelectedAsset(asset);
    setDrawerActiveTab(0);
    setDrawerOpen(true);
  };

  // Switch drawer Tabs
  const switchDrawerTab = (idx: number) => {
    setDrawerActiveTab(idx);
  };

  // Handle Transfer Popup
  const openTransferModal = (asset: Asset, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAsset(asset);
    setTransferTarget('先进化学合成所');
    setTransferReason('');
    setTransferModalOpen(true);
  };

  // Handle Scrap Confirmation Popup
  const openScrapModal = (asset: Asset, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAsset(asset);
    setScrapModalOpen(true);
  };

  // Submit asset transfer
  const submitTransfer = () => {
    if (!selectedAsset) return;
    const updated = assets.map(item => {
      if (item.id === selectedAsset.id) {
        return { 
          ...item, 
          location: `${transferTarget} - 待指派区域`,
          owner: '待落实分配'
        };
      }
      return item;
    });

    setAssets(updated);
    setTransferModalOpen(false);
    showToast(`📦 调拨成功：[${selectedAsset.name}] 已调拨到 ${transferTarget}！`, 'success');
  };

  // Submit asset scrappage
  const submitScrap = () => {
    if (!selectedAsset) return;
    const updated = assets.map(item => {
      if (item.id === selectedAsset.id) {
        return { ...item, status: '报废待处理' as const };
      }
      return item;
    });

    setAssets(updated);
    setScrapModalOpen(false);
    showToast(`🗑️ 已将 [${selectedAsset.name}] 状态变更为 [报废待处理] 并报批！`, 'warning');
  };

  // Approve Purchase Application
  const approvePurchase = (id: string, name: string) => {
    setPurchases(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: '已通过' };
      }
      return item;
    }));
    showToast(`✅ [${name}] 的采购申请审批核查已核准，已转分管领导！`, 'success');
  };

  // Reject Purchase Application
  const openRejectModal = (id: string) => {
    setActiveRejectingPurchaseId(id);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const submitRejection = () => {
    if (!activeRejectingPurchaseId) return;
    setPurchases(prev => prev.map(item => {
      if (item.id === activeRejectingPurchaseId) {
        return { ...item, status: '已拒绝' };
      }
      return item;
    }));
    setRejectModalOpen(false);
    showToast(`❌ 已否决编号 [${activeRejectingPurchaseId}] 的本月采购申请。原因已存档：${rejectionReason || '未填写'}`, 'warning');
  };

  // Create new Purchase Application
  const handleCreatePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPurchaseName) {
      showToast('⚠️ 请输入需要购置的资产物品名称！', 'warning');
      return;
    }
    const amount = parseFloat(newPurchasePrice) || 0;
    const priceFormatted = amount > 0 ? `¥${amount.toLocaleString()}` : '面议估算中';

    const newPr = {
      id: `CG-2026-0${Math.floor(Math.random() * 90 + 50)}`,
      applicant: '管理员 (咸阳中学)',
      assetName: newPurchaseName,
      price: priceFormatted,
      date: '2026-05-20',
      status: '待审批',
      remark: newPurchaseReason || '用于重点实验室扩置规划'
    };

    setPurchases(prev => [newPr, ...prev]);
    setNewPurchaseModalOpen(false);
    
    // Clear form
    setNewPurchaseName('');
    setNewPurchasePrice('');
    setNewPurchaseReason('');

    showToast(`✨ [${newPr.assetName}] 采购建账需求已成功发布，启动联合流转！`, 'success');
  };

  // Simulate scanning of QR code (Incremental inventory updater)
  const triggerScanSimulation = () => {
    // Pick first '未盘' item
    const uninspectedItem = inventoryList.find(i => i.status === '未盘');
    
    if (!uninspectedItem) {
      showToast('📦 盘点完成：当前列表内所有待核验项已点验扫描完毕！', 'success');
      return;
    }

    const updated = inventoryList.map(item => {
      if (item.id === uninspectedItem.id) {
        return { ...item, status: '已盘✓' };
      }
      return item;
    });

    setInventoryList(updated);
    setInventoryCount(prev => prev + 1);
    showToast(`✨ [扫码模拟]：资产 [${uninspectedItem.name}] 校准正常，系统一键核销更新为 [已盘✓]！`, 'success');
  };

  // Approve Scrap Disposal Item
  const approveScrapDisposal = (id: string, name: string) => {
    setScrapDisposals(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: '已批准' };
      }
      return item;
    }));
    showToast(`✅ [${name}] 处置报废方案已签核通过，可以进入清算处理！`, 'success');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
      
      {/* LEFT SIDEBAR: Rigid width 240px matching modern layout */}
      <aside className="w-[240px] bg-[var(--card-bg)] border-r border-slate-200 dark:border-white/10 flex flex-col flex-shrink-0 z-10 transition-colors duration-300 shadow-sm">
        
        {/* Brand/Exit block */}
        <div className="p-4 flex flex-col gap-3 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
              <BarChart3 size={18} />
            </div>
            <span className="font-extrabold text-[15px] text-slate-800 dark:text-white truncate">固定资产管理</span>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-650 transition-all cursor-pointer"
            title="返回二级系统选择"
          >
            <ArrowLeft size={14} />
            <span>返回总门户</span>
          </button>
        </div>

        {/* Tab Items Menu */}
        <nav className="flex-1 p-3 space-y-2">
          {[
            { id: 'dashboard', label: '资产总览', icon: BarChart3 },
            { id: 'list', label: '资产列表', icon: ClipboardList },
            { id: 'purchase', label: '采购申请', icon: ShoppingCart },
            { id: 'inventory', label: '资产盘点', icon: CheckSquare },
            { id: 'scrap', label: '报废处置', icon: Trash2 }
          ].map(item => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left text-xs font-semibold tracking-wide transition-all relative cursor-pointer",
                  isActive 
                    ? "bg-blue-600 text-white shadow shadow-blue-500/20 font-bold" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-md" />
                )}
                <IconComponent size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-tighter truncate">
          <span>SYSTEM READY</span>
        </div>
      </aside>

      {/* MAIN CONTAINER: Breadcrumb, Top Bar, Flexible Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* SUB BAR - Subsystem header with local items */}
        <header className="h-16 bg-[var(--card-bg)] border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-6 flex-shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>主控调度门户</span>
            <ChevronRight size={12} />
            <span className="text-blue-600 dark:text-blue-400 font-extrabold font-sans">
              {activeTab === 'dashboard' ? '📊 资产总览 DB' :
               activeTab === 'list' ? '📋 资产账目列表' :
               activeTab === 'purchase' ? '🛒 采购建账需求' :
               activeTab === 'inventory' ? '📦 资产条码盘点' :
               '🗑️ 报废方案审核'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Inline search box with binding */}
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-slate-450" />
              <input 
                type="text" 
                placeholder="搜索资产并按回车..." 
                className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full py-1.5 pl-8 pr-4 text-xs text-[var(--text-main)] outline-none w-44 focus:w-56 focus:border-blue-500 dark:focus:border-blue-500 transition-all font-sans"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Quick theme toggle inside subsystem for user experience */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
              title="一键转换系统主题"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Bell notification with count badge 3 */}
            <div className="relative p-2 text-slate-500 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 rounded-full">
              <Bell size={17} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white dark:border-slate-900">
                3
              </span>
            </div>

            {/* Admin Profile */}
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-white/10 pl-3">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center font-sans">
                管
              </div>
              <span className="text-xs font-bold hidden md:inline text-[var(--text-main)]">咸中-实验室</span>
            </div>
          </div>
        </header>

        {/* WORKSPACE VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* ========================================================= */}
          {/* PAGE 1: DASHBOARD VIEW */}
          {/* ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animation-fade-in">
              
              {/* KPI Cards section with animated counters on load */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Card 1: 资产总数 */}
                <div className="bg-[var(--card-bg)] border border-slate-200 dark:border-white/10 p-5 rounded-xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start text-slate-400">
                    <span className="text-xs font-semibold">总管固定资产 (件)</span>
                    <span className="text-lg">📊</span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
                      {kpiTotalAssets}
                    </span>
                    <span className="text-xs text-slate-400">在册</span>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                    <span className="text-green-500 font-bold">100% 建立档案</span> 含仪器与IT配套
                  </div>
                </div>

                {/* Card 2: 资产总价值 */}
                <div className="bg-[var(--card-bg)] border border-slate-200 dark:border-white/10 p-5 rounded-xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start text-slate-400">
                    <span className="text-xs font-semibold">总资产原账单价值</span>
                    <span className="text-lg">💰</span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-xl font-black text-slate-800 dark:text-slate-100">
                      ¥{kpiTotalValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-3 text-[10px] text-slate-400 flex items-center gap-1">
                    <span className="text-blue-400 font-black">财务建账价值</span> 历史累积
                  </div>
                </div>

                {/* Card 3: 本月新增 */}
                <div className="bg-[var(--card-bg)] border border-slate-200 dark:border-white/10 p-5 rounded-xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start text-slate-400">
                    <span className="text-xs font-semibold">本月验收新增入库</span>
                    <span className="text-lg">📈</span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-green-500">
                      12
                    </span>
                    <span className="text-xs text-slate-400">件仪器</span>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                    <span className="text-green-500 font-bold">+12% 同比增加</span> 本季度扩容中
                  </div>
                </div>

                {/* Card 4: 待盘点 */}
                <div className="bg-[var(--card-bg)] border border-slate-205 dark:border-white/10 p-5 rounded-xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 font-sans">
                  <div className="flex justify-between items-start text-slate-400">
                    <span className="text-xs font-semibold">待核查盘点资产 (本轮)</span>
                    <span className="text-lg text-amber-500">⏳</span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-orange-500 animate-pulse">
                      {kpiPendingCount}
                    </span>
                    <span className="text-xs text-slate-400">待核销</span>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                    <span className="text-amber-500 font-bold bg-orange-500/10 px-1.5 py-0.5 rounded">橙色指示：急需周六前清算</span>
                  </div>
                </div>

                {/* Maintenance alerts list */}
                <div className="bg-[var(--card-bg)] border border-slate-200 dark:border-white/10 p-6 rounded-xl shadow-sm lg:col-span-12 xl:col-span-5 flex flex-col justify-between">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5">
                    <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200">🔔 维保校准到期提醒</h3>
                    <span className="text-[10px] text-red-500 bg-red-100 dark:bg-red-500/10 px-2 py-0.5 rounded font-bold font-sans">近期 3 条</span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-white/5 mt-3 flex-1 overflow-y-auto">
                    
                    {/* Item 1 */}
                    <div className="py-3 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-xs font-extrabold text-[var(--text-main)] font-sans">行政服务器 (总服务科室)</p>
                        <p className="text-[11px] text-slate-400">到期时间: <span className="text-red-500 font-mono font-bold">2026-06-02</span> | 校准负责人: 章科员</p>
                      </div>
                      <button 
                        onClick={() => actionMaintain('行政服务器')}
                        className="text-[11px] font-bold px-2.5 py-1 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        立即处理
                      </button>
                    </div>

                    {/* Item 2 */}
                    <div className="py-3 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-xs font-extrabold text-[var(--text-main)] font-sans">超速冷冻离心机 (GD-001)</p>
                        <p className="text-[11px] text-slate-400">到期时间: 2026-06-15 | 负责人: 王博导</p>
                      </div>
                      <button 
                        onClick={() => actionMaintain('超速冷冻离心机')}
                        className="text-[11px] font-bold px-2.5 py-1 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        立即处理
                      </button>
                    </div>

                    {/* Item 3 */}
                    <div className="py-3 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-xs font-extrabold text-[var(--text-main)] font-sans">数字光电耦合仪 (化学二馆)</p>
                        <p className="text-[11px] text-slate-400">到期时间: 2026-07-01 | 负责人: 周工程师</p>
                      </div>
                      <button 
                        onClick={() => actionMaintain('数字光电耦合仪')}
                        className="text-[11px] font-bold px-2.5 py-1 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        立即处理
                      </button>
                    </div>

                  </div>
                </div>

              </div>

              {/* Informative Guidance Banner */}
              <div className="p-4 bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-550/10 rounded-xl flex items-start gap-3">
                <Info className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={18} />
                <div className="text-xs text-[var(--text-main)]">
                  <p className="font-extrabold text-blue-650 dark:text-blue-400">实验室设备资产清算提示说明：</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-sans">
                    本季度固定资产账面净值核对工作已经上线，请各院系、教研室负责人依照左下角“分类检索”清单录入新增采购折旧，对报废品及折退资产及时在此子系统提报，以便年底集中盘点账物一致。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 2: ASSET LIST VIEW */}
          {/* ========================================================= */}
          {activeTab === 'list' && (
            <div className="space-y-6 animation-fade-in">
              
              {/* Category, Status, Keyword Filter Row */}
              <div className="bg-[var(--card-bg)] border border-slate-201 dark:border-white/10 p-4 rounded-xl shadow-sm flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  
                  {/* Category select block */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-stone-500 font-bold">分类:</span>
                    <select 
                      value={filterCategory} 
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="bg-stone-50 dark:bg-[#252422] border border-stone-200 dark:border-white/10 px-3 py-1.5 rounded-lg text-xs outline-none focus:border-[#3d5a80] dark:focus:border-[#5c80a8] cursor-pointer"
                    >
                      <option value="全部">全部资产</option>
                      <option value="仪器设备">仪器设备</option>
                      <option value="电子设备">电子设备</option>
                      <option value="家具">家具</option>
                      <option value="其他">其他</option>
                    </select>
                  </div>

                  {/* Status select block */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-stone-500 font-bold">状态:</span>
                    <select 
                      value={filterStatus} 
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-stone-50 dark:bg-[#252422] border border-stone-200 dark:border-white/10 px-3 py-1.5 rounded-lg text-xs outline-none focus:border-[#3d5a80] dark:focus:border-[#5c80a8] cursor-pointer"
                    >
                      <option value="全部">全部状态</option>
                      <option value="在用">在用</option>
                      <option value="维修">维修</option>
                      <option value="封存">封存</option>
                      <option value="报废待处理">报废待处理</option>
                    </select>
                  </div>

                  {/* Clear button */}
                  {(filterCategory !== '全部' || filterStatus !== '全部' || searchQuery !== '') && (
                    <button 
                      onClick={() => {
                        setFilterCategory('全部');
                        setFilterStatus('全部');
                        setSearchQuery('');
                      }}
                      className="text-xs text-indigo-500 font-bold flex items-center gap-1 p-1 hover:underline"
                    >
                      <X size={12} />
                      <span>重置筛选</span>
                    </button>
                  )}

                </div>

                <div className="text-xs font-mono text-stone-400">
                  检索匹配到 <strong className="text-[#3d5a80] dark:text-[#5c80a8] font-bold">{filteredAssets.length}</strong> 项资产
                </div>
              </div>

              {/* Data table */}
              <div className="bg-[var(--card-bg)] border border-slate-201 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-50 dark:bg-stone-850 text-stone-500 dark:text-stone-400 text-[11px] font-bold uppercase border-b border-stone-100 dark:border-white/5">
                        <th className="py-3 px-4">资产编号</th>
                        <th className="py-3 px-4">资产资产名称</th>
                        <th className="py-3 px-4">设备类别</th>
                        <th className="py-3 px-4 text-right">原值(¥)</th>
                        <th className="py-3 px-4 text-right">净值(¥)</th>
                        <th className="py-3 px-4 text-center">状态Tag</th>
                        <th className="py-3 px-4">责任人</th>
                        <th className="py-3 px-4 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-white/5 text-xs">
                      {filteredAssets.length > 0 ? (
                        filteredAssets.map(item => (
                          <tr 
                            key={item.id} 
                            className="hover:bg-stone-50/50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                            onClick={() => openDrawer(item)}
                          >
                            <td className="py-3 px-4 font-mono font-bold text-stone-500 dark:text-stone-450 group-hover:text-[#3d5a80] dark:group-hover:text-[#5c80a8] transition-colors">
                              {item.id}
                            </td>
                            <td className="py-3 px-4 font-bold text-stone-800 dark:text-stone-200">
                              {item.name}
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-[11px] text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                                {item.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-stone-500">
                              {item.originalValue.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-[#3d5a80] dark:text-[#5c80a8]">
                              {item.netValue.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {item.status === '在用' && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-500/10 px-2.5 py-0.5 rounded-full">
                                  ● 在用
                                </span>
                              )}
                              {item.status === '维修' && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#f97316] bg-[#f97316]/10 px-2.5 py-0.5 rounded-full">
                                  ● 维修
                                </span>
                              )}
                              {item.status === '封存' && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-550 bg-stone-500/15 px-2.5 py-0.5 rounded-full">
                                  ● 封存
                                </span>
                              )}
                              {item.status === '报废待处理' && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 bg-red-500/10 px-2.5 py-0.5 rounded-full">
                                  ● 报废待处理
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-bold">
                              {item.owner}
                            </td>
                            <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="inline-flex items-center gap-2">
                                <button 
                                  onClick={() => openDrawer(item)}
                                  className="p-1 hover:bg-[#3d5a80]/10 hover:text-[#3d5a80] dark:hover:text-[#5c80a8] rounded text-stone-400 transition-colors"
                                  title="核实大卡详情"
                                >
                                  <Eye size={14} />
                                </button>
                                <button 
                                  onClick={(e) => openTransferModal(item, e)}
                                  className="p-1 hover:bg-[#3d5a80]/10 hover:text-[#3d5a80] dark:hover:text-[#5c80a8] rounded text-stone-400 transition-colors"
                                  title="所属调拨变更"
                                >
                                  <RefreshCw size={13} />
                                </button>
                                <button 
                                  onClick={(e) => openScrapModal(item, e)}
                                  className="p-1 hover:bg-red-500/10 hover:text-red-500 rounded text-stone-400 transition-colors"
                                  title="注销折旧报废"
                                  disabled={item.status === '报废待处理'}
                                  style={{ opacity: item.status === '报废待处理' ? 0.3 : 1 }}
                                >
                                  <Trash size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-stone-400">
                            没有查找到符合过滤条件的资产大卡记录
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 3: PURCHASE APPLY VIEW */}
          {/* ========================================================= */}
          {activeTab === 'purchase' && (
            <div className="space-y-6 animation-fade-in">
              
              {/* Horizontal Stepper indicator */}
              <div className="bg-[var(--card-bg)] border border-slate-201 dark:border-white/10 p-5 rounded-xl shadow-sm">
                <div className="flex justify-between items-center text-xs font-bold text-stone-400 mb-6">
                  <span>采购审批流跟踪调度条</span>
                  <span className="text-[#3d5a80] dark:text-[#5c80a8] bg-[#3d5a80]/10 px-2.5 py-0.5 rounded">
                    当前环节：资产管理员审批
                  </span>
                </div>

                {/* Progress bar layout */}
                <div className="relative">
                  {/* Gray guideline */}
                  <div className="absolute top-1/2 left-[5%] right-[5%] h-0.5 bg-stone-200 dark:bg-stone-800 -translate-y-1/2 -z-0"></div>
                  
                  {/* Steps list */}
                  <div className="relative flex justify-between items-center z-10 select-none">
                    
                    {/* Step 1 */}
                    <div className="flex flex-col items-center gap-1 px-2">
                      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center border-4 border-white dark:border-[#1e1d1b] text-xs font-bold shadow-sm">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span className="text-[11px] font-bold text-stone-500">2026-05-10</span>
                      <span className="text-[11px] text-[#28251d] dark:text-stone-300 font-bold">申请人提报</span>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center gap-1 px-2">
                      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center border-4 border-white dark:border-[#1e1d1b] text-xs font-bold shadow-sm">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span className="text-[11px] font-bold text-stone-500">2026-05-15</span>
                      <span className="text-[11px] text-[#28251d] dark:text-stone-300 font-bold">教研科室会签</span>
                    </div>

                    {/* Step 3 (ACTIVE) */}
                    <div className="flex flex-col items-center gap-1 px-2">
                      <div className="w-8.5 h-8.5 rounded-full bg-[#3d5a80] dark:bg-[#5c80a8] text-white flex items-center justify-center border-4 border-white dark:border-[#1e1d1b] text-xs font-extrabold shadow-md ring-4 ring-[#3d5a80]/25 animate-pulse">
                        3
                      </div>
                      <span className="text-[11px] text-[#3d5a80] dark:text-[#5c80a8] font-bold">进行中</span>
                      <span className="text-[11px] text-[#3d5a80] dark:text-[#5c80a8] font-black">资产处合规审核</span>
                    </div>

                    {/* Step 4 */}
                    <div className="flex flex-col items-center gap-1 px-2">
                      <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-400 dark:text-stone-500 flex items-center justify-center text-xs font-bold">
                        4
                      </div>
                      <span className="text-[11px] text-stone-400">下阶段</span>
                      <span className="text-[11px] text-stone-400 font-medium">分管校领导核签</span>
                    </div>

                    {/* Step 5 */}
                    <div className="flex flex-col items-center gap-1 px-2">
                      <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-400 dark:text-stone-500 flex items-center justify-center text-xs font-bold">
                        5
                      </div>
                      <span className="text-[11px] text-stone-400">下阶段</span>
                      <span className="text-[11px] text-stone-400 font-medium">政府采购执行</span>
                    </div>

                    {/* Step 6 */}
                    <div className="flex flex-col items-center gap-1 px-2">
                      <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-400 dark:text-stone-500 flex items-center justify-center text-xs font-bold">
                        6
                      </div>
                      <span className="text-[11px] text-stone-400">终期</span>
                      <span className="text-[11px] text-stone-400 font-medium">固定资产条码建账</span>
                    </div>

                  </div>
                </div>
              </div>

              {/* Table of pending approvals */}
              <div className="bg-[var(--card-bg)] border border-slate-201 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50/50 dark:bg-slate-800/40 flex justify-between items-center border-b border-slate-100 dark:border-white/5">
                  <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200">📋 本轮待审核采购申请 (核增预算)</h3>
                  <button 
                    onClick={() => setNewPurchaseModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#3d5a80] text-white rounded text-[11px] hover:bg-[#2e4360] font-bold transition-all"
                  >
                    <Plus size={12} />
                    <span>新建采购申请需求</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-stone-400 text-[10px] font-bold uppercase border-b border-stone-100 dark:border-white/5 bg-stone-50/50 dark:bg-stone-900/30">
                        <th className="py-2.5 px-4">申请批号</th>
                        <th className="py-2.5 px-4">申请人及教研室</th>
                        <th className="py-2.5 px-4">需求采购资产物品名称</th>
                        <th className="py-2.5 px-4 text-right">预算金额</th>
                        <th className="py-2.5 px-4">申报日期</th>
                        <th className="py-2.5 px-4">当前决策状态</th>
                        <th className="py-2.5 px-4 text-right">批量授权</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-white/5 text-xs">
                      {purchases.map(item => (
                        <tr key={item.id} className="hover:bg-stone-50/30 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-stone-400">{item.id}</td>
                          <td className="py-3 px-4 font-bold">{item.applicant}</td>
                          <td className="py-3 px-4">
                            <div className="space-y-0.5">
                              <p className="font-bold text-stone-800 dark:text-stone-100">{item.assetName}</p>
                              <p className="text-[10px] text-stone-400 truncate max-w-sm">{item.remark}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-[#3d5a80] dark:text-[#5c80a8]">{item.price}</td>
                          <td className="py-3 px-4 font-mono text-stone-400">{item.date}</td>
                          <td className="py-3 px-4">
                            {item.status === '待审批' && (
                              <span className="text-[10px] font-bold bg-[#f97316]/10 text-[#f97316] px-2 py-0.5 rounded">
                                待签核审核
                              </span>
                            )}
                            {item.status === '已通过' && (
                              <span className="text-[10px] font-bold bg-green-500/15 text-green-600 px-2 py-0.5 rounded">
                                ✓ 审批推荐通过
                              </span>
                            )}
                            {item.status === '已拒绝' && (
                              <span className="text-[10px] font-bold bg-red-500/10 text-red-500 px-2 py-0.5 rounded">
                                ✕ 驳回拒绝
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {item.status === '待审批' ? (
                              <div className="inline-flex gap-1">
                                <button 
                                  onClick={() => approvePurchase(item.id, item.assetName)}
                                  className="px-2 py-1 text-[10px] font-bold text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                                >
                                  推荐通过
                                </button>
                                <button 
                                  onClick={() => openRejectModal(item.id)}
                                  className="px-2 py-1 text-[10px] font-bold text-white bg-red-650 rounded hover:bg-red-750 transition-colors"
                                >
                                  驳回申请
                                </button>
                              </div>
                            ) : (
                              <span className="text-stone-400 text-[11px] font-medium italic">已流转完毕</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 4: ASSET INVENTORY VIEW */}
          {/* ========================================================= */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 animation-fade-in">
              
              {/* Summary of current inventory task status */}
              <div className="bg-[var(--card-bg)] border border-slate-201 dark:border-white/10 p-6 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 flex-1 max-w-xl">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#3d5a80]/10 text-[#3d5a80] dark:text-[#5c80a8] uppercase">
                    2026年度上半年固定资产大点验
                  </span>
                  <h3 className="text-base font-extrabold text-stone-800 dark:text-stone-100">核心实验室高附加值仪器核实率</h3>
                  
                  {/* Progress values */}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex-1 bg-stone-100 dark:bg-stone-800 h-3 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#3d5a80] dark:bg-[#5c80a8] rounded-full transition-all duration-500" 
                        style={{ width: `${Math.round((inventoryCount / 386) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-[#3d5a80] dark:text-[#5c80a8] font-mono shrink-0">
                      {Math.round((inventoryCount / 386) * 100)}%
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-450 mt-1">
                    进度状况：本院室累计已妥善盘点账目物品 <strong className="text-stone-900 dark:text-white font-extrabold">{inventoryCount}</strong> 件 / 应盘总数 386 件
                  </p>
                </div>

                <div className="shrink-0">
                  <button 
                    onClick={triggerScanSimulation}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#3d5a80] to-[#2e4360] text-white text-xs font-bold rounded-lg shadow hover:opacity-90 active:scale-95 transition-all"
                  >
                    ⚡ 点击模拟扫码识别 (增量登记)
                  </button>
                </div>
              </div>

              {/* Grid or Table list of specific line checks */}
              <div className="bg-[var(--card-bg)] border border-slate-201 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/40">
                  <h3 className="text-xs font-extrabold">抽样重点比对清单 (8项高值资产标本)</h3>
                  <span className="text-[10px] text-stone-400">模拟扫码将立即改变下面“未盘”列表的校验状态</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-stone-400 text-[10px] font-bold uppercase border-b border-stone-100 dark:border-white/5 bg-stone-50/25 dark:bg-stone-900/30">
                        <th className="py-2.5 px-4">资产编号</th>
                        <th className="py-2.5 px-4">需求盘点资产物品名称</th>
                        <th className="py-2.5 px-4">校准账面规划放置位置</th>
                        <th className="py-2.5 px-4 text-center">当前周期点验状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-white/5 text-xs">
                      {inventoryList.map(item => (
                        <tr key={item.id} className="hover:bg-stone-50/30 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-stone-400">{item.id}</td>
                          <td className="py-3 px-4 font-bold text-stone-800 dark:text-stone-200">{item.name}</td>
                          <td className="py-3 px-4 text-stone-500">{item.location}</td>
                          <td className="py-3 px-4 text-center">
                            {item.status === '已盘✓' && (
                              <span className="inline-flex text-[10px] font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded rounded-full border border-green-500/20">
                                已盘 ✓ (正常)
                              </span>
                            )}
                            {item.status === '未盘' && (
                              <span className="inline-flex text-[10px] font-bold text-stone-550 bg-stone-500/15 px-2 py-0.5 rounded rounded-full border border-stone-500/10">
                                待核对 未盘
                              </span>
                            )}
                            {item.status === '盘盈' && (
                              <span className="inline-flex text-[10px] font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded rounded-full border border-blue-500/20 animate-pulse">
                                盘盈 (账面无物)
                              </span>
                            )}
                            {item.status === '盘亏' && (
                              <span className="inline-flex text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded rounded-full border border-red-500/20 animate-pulse">
                                盘亏 (账留物缺)
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 5: SCRAP/DISPOSAL VIEW */}
          {/* ========================================================= */}
          {activeTab === 'scrap' && (
            <div className="space-y-6 animation-fade-in">
              
              {/* Disposal status summary and instructions */}
              <div className="bg-[var(--card-bg)] border border-slate-201 dark:border-white/10 p-4 rounded-xl shadow-sm text-xs space-y-1">
                <p className="font-extrabold text-stone-700 dark:text-stone-200 text-sm">🗑️ 国家教育科研资产报废审批登记说明</p>
                <p className="text-stone-400">
                  报废提报通过后，该项资产将核减总价值并变更标记。所有销毁，捐赠或公开拍卖物品的流转单据信息都必须严格遵照财务台账记录留底。
                </p>
              </div>

              {/* Data Table */}
              <div className="bg-[var(--card-bg)] border border-slate-201 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50/50 dark:bg-slate-800/40 border-b border-stone-100 dark:border-white/5">
                  <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200">待审批/处理资产报废计划清单</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-stone-400 text-[10px] font-bold uppercase border-b border-stone-100 dark:border-white/5 bg-stone-50/25 dark:bg-stone-900/30">
                        <th className="py-2.5 px-4">资产名称</th>
                        <th className="py-2.5 px-4">申报报废规划日</th>
                        <th className="py-2.5 px-4">申报人科室</th>
                        <th className="py-2.5 px-4">推荐处置流变方式</th>
                        <th className="py-2.5 px-4">当前流转状态</th>
                        <th className="py-2.5 px-4 text-right">方案审批</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-white/5 text-xs">
                      {scrapDisposals.map(item => (
                        <tr key={item.id} className="hover:bg-stone-50/30 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 font-bold text-stone-800 dark:text-stone-200">{item.assetName}</td>
                          <td className="py-3 px-4 font-mono text-stone-450">{item.date}</td>
                          <td className="py-3 px-4">{item.applicant}</td>
                          <td className="py-3 px-4">
                            {item.method === '公开拍卖' && (
                              <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded">
                                🔨 公开产权拍卖
                              </span>
                            )}
                            {item.method === '销毁' && (
                              <span className="text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded">
                                🔥 资质监督销毁
                              </span>
                            )}
                            {item.method === '捐赠' && (
                              <span className="text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2 py-0.5 rounded">
                                🤝 高教扶贫捐赠
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {item.status === '待审批' && (
                              <span className="text-[10px] font-bold text-[#f97316] bg-[#f97316]/10 px-2 py-0.5 rounded">
                                待核对方案
                              </span>
                            )}
                            {item.status === '已批准' && (
                              <span className="text-[10px] font-bold text-green-600 bg-green-500/15 px-2 py-0.5 rounded">
                                已核准备批
                              </span>
                            )}
                            {item.status === '已完成' && (
                              <span className="text-[10px] font-bold text-stone-400 bg-stone-500/10 px-2 py-0.5 rounded">
                                账面已除名销
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {item.status === '待审批' ? (
                              <button 
                                onClick={() => approveScrapDisposal(item.id, item.assetName)}
                                className="px-2 py-1 text-[10px] font-bold text-white bg-[#3d5a80] rounded hover:bg-[#2e4360] transition-colors"
                              >
                                核批通过
                              </button>
                            ) : (
                              <span className="text-stone-400 text-[11px] font-medium italic">免检已流转</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ========================================================= */}
      {/* GLOBAL TOASTS NOTIFICATIONS RENDERER */}
      {/* ========================================================= */}
      <div className="fixed top-6 right-6 flex flex-col gap-3 z-[9999] pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className={cn(
                "p-4 rounded-xl shadow-lg border text-xs font-bold w-80 flex gap-3 pointer-events-auto",
                toast.type === 'success' 
                  ? "bg-white dark:bg-[#1e1d1b] border-green-500/30 text-stone-850 dark:text-stone-150" 
                  : "bg-white dark:bg-[#1e1d1b] border-[#f97316]/30 text-stone-850 dark:text-stone-150"
              )}
            >
              <div className="shrink-0">
                {toast.type === 'success' ? (
                  <span className="text-green-500">✅</span>
                ) : (
                  <span className="text-amber-500">⚠️</span>
                )}
              </div>
              <div className="flex-1 text-stone-700 dark:text-stone-300 font-medium">
                {toast.message}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ========================================================= */}
      {/* RIGHT SIDE DRAWER: ASSET DETAIL PANEL */}
      {/* ========================================================= */}
      <AnimatePresence>
        {drawerOpen && selectedAsset && (
          <>
            {/* Backdrop layer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-[1px] z-[1000]"
            />

            {/* Slider container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[440px] bg-white dark:bg-[#1e1d1b] border-l border-[#28251d]/15 dark:border-white/5 shadow-2xl z-[1001] flex flex-col p-6 overflow-hidden text-xs"
            >
              <div className="flex justify-between items-center pb-4 border-b border-stone-100 dark:border-white/5 mb-4">
                <span className="text-sm font-black text-[#3d5a80] dark:text-[#5c80a8]">📋 资产完整建账卡片</span>
                <button 
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 hover:bg-stone-100 dark:hover:bg-white/10 rounded-full text-stone-400"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Slide Title */}
              <div className="space-y-1 mb-6">
                <h4 className="text-base font-extrabold text-stone-900 dark:text-white">{selectedAsset.name}</h4>
                <p className="font-mono text-stone-450 text-[11px] bg-stone-100 dark:bg-stone-850 px-2 py-0.5 rounded inline-block">
                  唯一财产编码: {selectedAsset.id}
                </p>
              </div>

              {/* Underlined Tab Switches */}
              <div className="flex border-b border-stone-105 dark:border-white/5 mb-4 text-xs font-bold">
                {[
                  { label: '基本大卡信息', idx: 0 },
                  { label: '财务历史折旧', idx: 1 },
                  { label: '维保修缮记录', idx: 2 }
                ].map(tab => (
                  <button
                    key={tab.idx}
                    onClick={() => switchDrawerTab(tab.idx)}
                    className={cn(
                      "flex-1 pb-2 flex justify-center border-b-2 transition-all",
                      drawerActiveTab === tab.idx 
                        ? "border-[#3d5a80] dark:border-[#5c80a8] text-[#3d5a80] dark:text-[#5c80a8]" 
                        : "border-transparent text-stone-450 hover:text-stone-800 dark:hover:text-stone-300"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Contents Viewport with transitions */}
              <div className="flex-1 overflow-y-auto pr-1">
                
                {/* Tab 0: Basic Card Information */}
                {drawerActiveTab === 0 && (
                  <div className="space-y-4 pt-1 animation-fade-in text-xs">
                    
                    {/* Visual pairs in two-column grid */}
                    <div className="grid grid-cols-2 gap-4 bg-stone-50/50 dark:bg-stone-900/30 p-4 rounded-xl border border-stone-100 dark:border-white/5">
                      <div className="space-y-1">
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">资产大类别</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200">{selectedAsset.category}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">品牌与规格型号</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200 truncate block" title={selectedAsset.brandModel}>
                          {selectedAsset.brandModel}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">财务原值(¥)</span>
                        <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{selectedAsset.originalValue.toLocaleString()}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">财务估算净值(¥)</span>
                        <span className="font-mono font-black text-[#3d5a80] dark:text-[#5c80a8]">{selectedAsset.netValue.toLocaleString()}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">资产购建入库日期</span>
                        <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{selectedAsset.purchaseDate}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">计划摊销折旧期数</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200">{selectedAsset.depreciationPeriod} 个月</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">账面归属责任人</span>
                        <span className="font-bold text-stone-850 dark:text-stone-150">{selectedAsset.owner}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">校区规划存放地址</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200 truncate block" title={selectedAsset.location}>
                          {selectedAsset.location}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-yellow-500/10 border border-yellow-500/20 text-stone-600 dark:text-stone-400 rounded-lg">
                      <p className="font-bold text-xs flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                        <span>🛡️ 实验室特种财物使用条例</span>
                      </p>
                      <p className="text-[11px] mt-1.5 leading-relaxed">
                        该资产已被系统赋予物联网溯源码。未经本院科研物资处处长，以及教研科研室管理组共同核准签发，禁止私自调整物理挪位。
                      </p>
                    </div>

                  </div>
                )}

                {/* Tab 1: Depreciation records table */}
                {drawerActiveTab === 1 && (
                  <div className="space-y-3 pt-1 animation-fade-in">
                    <table className="w-full text-left font-mono">
                      <thead>
                        <tr className="text-stone-400 text-[10px] font-bold uppercase border-b border-stone-100 dark:border-white/5">
                          <th className="py-2">折旧账期</th>
                          <th className="py-2 text-right">变动前(¥)</th>
                          <th className="py-2 text-right">摊销额</th>
                          <th className="py-2 text-right">余值</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-white/5 text-xs">
                        {selectedAsset.depreciationRecords.map((rec, i) => (
                          <tr key={i} className="hover:bg-stone-50 dark:hover:bg-white/5">
                            <td className="py-2 text-stone-500">{rec.period}</td>
                            <td className="py-2 text-right text-stone-400">{rec.prevVal.toLocaleString()}</td>
                            <td className="py-2 text-right text-red-500 font-bold">-{rec.amount.toLocaleString()}</td>
                            <td className="py-2 text-right font-bold text-stone-800 dark:text-stone-200">{rec.newVal.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Tab 2: Maintenance record Timeline */}
                {drawerActiveTab === 2 && (
                  <div className="space-y-4 pt-1 animation-fade-in pl-1.5">
                    <div className="relative border-l border-stone-200 dark:border-white/10 ml-1.5 pl-4 space-y-5">
                      {selectedAsset.maintenanceRecords.map((rep, idx) => (
                        <div key={idx} className="relative">
                          {/* Circle dot marker */}
                          <span className="absolute -left-[22px] top-1 w-2.5 h-2.5 rounded-full bg-[#3d5a80] dark:bg-[#5c80a8] ring-4 ring-white dark:ring-[#1e1d1b]" />
                          
                          <div className="space-y-0.5">
                            <span className="font-mono text-[10px] font-bold text-[#3d5a80] dark:text-[#5c80a8]">
                              {rep.date}
                            </span>
                            <p className="font-bold text-stone-800 dark:text-stone-200 text-xs">
                              {rep.type}
                            </p>
                            <p className="text-[10px] text-stone-450">
                              派单运维开支: <span className="font-mono text-red-500">¥{rep.cost}</span> | 厂商承修: {rep.engineer}
                            </p>
                            <p className="text-[10px] text-green-500 font-bold">
                              ✓ 维护验收结果: {rep.result}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 1: TRANSFER ASSET */}
      {/* ========================================================= */}
      <AnimatePresence>
        {transferModalOpen && selectedAsset && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-[1px] z-[1100] flex items-center justify-center p-4"
              onClick={() => setTransferModalOpen(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className="bg-white dark:bg-[#1e1d1b] border border-stone-200/50 dark:border-white/5 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-4 bg-stone-50 dark:bg-stone-850 flex justify-between items-center border-b border-stone-100 dark:border-white/5">
                  <h3 className="text-xs font-black text-stone-800 dark:text-stone-100">⚖️ 资产变更调薪变更管理</h3>
                  <button onClick={() => setTransferModalOpen(false)} className="text-stone-400 hover:bg-stone-100 dark:hover:bg-white/10 p-1 rounded-full">
                    <X size={16} />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] text-stone-400 font-bold block">调拨校对物品：</label>
                    <p className="font-bold text-stone-800 dark:text-stone-100 text-xs">
                      {selectedAsset.name} ({selectedAsset.id})
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-stone-400 font-bold block">原使用人或科区位置（只读）：</label>
                    <input 
                      type="text" 
                      value={`${selectedAsset.location} / ${selectedAsset.owner}`} 
                      readOnly 
                      className="w-full bg-stone-100 dark:bg-stone-850 border border-transparent rounded-lg p-2 text-xs italic opacity-75 outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-stone-450 font-bold block">业务调拨接受单位：</label>
                    <select 
                      value={transferTarget}
                      onChange={(e) => setTransferTarget(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-[#252422] border border-stone-200 dark:border-white/10 rounded-lg p-2 text-xs outline-none focus:border-[#3d5a80] dark:focus:border-[#5c80a8] cursor-pointer"
                    >
                      <option value="生物科技中心一馆">生物科技中心一馆</option>
                      <option value="先进化学合成所">先进化学合成所</option>
                      <option value="环境工程分析室">环境工程分析室</option>
                      <option value="核心数据分析部">核心数据分析部</option>
                      <option value="院内物资后勤组">院内物资后勤组</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-stone-450 font-bold block">申请调拨事由与业务佐证：</label>
                    <textarea 
                      rows={3} 
                      className="w-full bg-stone-50 dark:bg-[#252422] border border-stone-200 dark:border-white/10 pad-2 rounded-lg text-xs p-2 outline-none focus:border-[#3d5a80] dark:focus:border-[#5c80a8] placeholder:text-stone-400"
                      placeholder="请合理陈述将此资产进行组际内部调用的主客观工作安排与实验任务分配变动..."
                      value={transferReason}
                      onChange={(e) => setTransferReason(e.target.value)}
                    />
                  </div>

                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-850 flex justify-end gap-2 border-t border-stone-100 dark:border-white/5">
                  <button onClick={() => setTransferModalOpen(false)} className="px-3 py-1.5 text-xs text-stone-500 hover:bg-stone-200 dark:hover:bg-white/10 rounded font-bold">
                    取消流拨
                  </button>
                  <button onClick={submitTransfer} className="px-3.5 py-1.5 text-xs bg-[#3d5a80] text-white rounded font-bold hover:opacity-90">
                    核准并确认调拨
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 2: CONFIRM SCRAP */}
      {/* ========================================================= */}
      <AnimatePresence>
        {scrapModalOpen && selectedAsset && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-[1px] z-[1100] flex items-center justify-center p-4"
              onClick={() => setScrapModalOpen(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className="bg-white dark:bg-[#1e1d1b] border border-stone-200/50 dark:border-white/5 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-4 bg-stone-50 dark:bg-stone-850 flex items-center gap-1.5 border-b border-stone-100 dark:border-white/5">
                  <AlertTriangle className="text-red-500" size={18} />
                  <h3 className="text-xs font-black text-stone-855 dark:text-stone-155">危重警告！确认要报废此资产？</h3>
                </div>

                <div className="p-5 space-y-3 text-xs leading-relaxed">
                  <p>您正在对资产进行<strong className="text-red-500 text-bold">永久性折旧折废及账务核削注销</strong>操作！</p>
                  
                  <div className="bg-stone-50 dark:bg-stone-850 p-3 rounded-lg border border-stone-100 dark:border-white/5">
                    <p className="font-bold text-stone-900 dark:text-stone-100">{selectedAsset.name}</p>
                    <p className="font-mono text-[11px] text-stone-400 mt-0.5">编号: {selectedAsset.id}</p>
                  </div>

                  <p className="text-stone-450">
                    一经确认，该资产的当前标记状态将在列表里被强制更新为 <strong className="text-red-500 font-bold">报废待处理</strong>。随后提拟由清算小组完成物理实物注销。
                  </p>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-850 flex justify-end gap-2 border-t border-stone-100 dark:border-white/5">
                  <button onClick={() => setScrapModalOpen(false)} className="px-3 py-1.5 text-xs text-stone-500 rounded font-bold hover:bg-stone-200 dark:hover:bg-white/10">
                    保留本资产
                  </button>
                  <button onClick={submitScrap} className="px-3.5 py-1.5 text-xs bg-red-600 text-white rounded font-bold hover:bg-red-700">
                    确切注销报废
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 3: NEW PURCHASE REQUISITION */}
      {/* ========================================================= */}
      <AnimatePresence>
        {newPurchaseModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-[1px] z-[1100] flex items-center justify-center p-4"
              onClick={() => setNewPurchaseModalOpen(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className="bg-white dark:bg-[#1e1d1b] border border-stone-200/50 dark:border-white/5 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <form onSubmit={handleCreatePurchase}>
                  <div className="p-4 bg-stone-50 dark:bg-stone-850 flex justify-between items-center border-b border-stone-100 dark:border-white/5">
                    <h3 className="text-xs font-black text-stone-800 dark:text-stone-100">🛒 新建科研固定资产购置流转需求</h3>
                    <button type="button" onClick={() => setNewPurchaseModalOpen(false)} className="text-stone-450 hover:bg-stone-100 dark:hover:bg-white/10 p-1 rounded-full">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="p-5 space-y-3.5 text-xs">
                    
                    <div className="space-y-1">
                      <label className="text-[11px] text-stone-450 font-bold block">拟购置资产物品名称：</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-stone-50 dark:bg-[#252422] border border-stone-200 dark:border-white/10 rounded-lg p-2 text-xs outline-none focus:border-[#3d5a80] "
                        placeholder="例：大口径多级防静电无刷粉碎机"
                        value={newPurchaseName}
                        onChange={(e) => setNewPurchaseName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] text-stone-450 font-bold block">计划资产大类分类：</label>
                        <select 
                          value={newPurchaseCategory}
                          onChange={(e) => setNewPurchaseCategory(e.target.value as any)}
                          className="w-full bg-stone-50 dark:bg-[#252422] border border-stone-200 dark:border-white/10 p-2 text-xs rounded-lg outline-none cursor-pointer"
                        >
                          <option value="仪器设备">仪器设备</option>
                          <option value="电子设备">电子设备</option>
                          <option value="家具">家具</option>
                          <option value="其他">其他</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-stone-450 font-bold block">预计采购总金额 (¥)：</label>
                        <input 
                          type="number" 
                          required
                          className="w-full bg-stone-50 dark:bg-[#252422] border border-stone-200 dark:border-white/10 text-xs p-2 rounded-lg outline-none focus:border-[#3d5a80]"
                          placeholder="暂定估算(元)"
                          value={newPurchasePrice}
                          onChange={(e) => setNewPurchasePrice(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-stone-450 font-bold block">经费申报核算来源：</label>
                      <select 
                        value={newPurchaseFundSource}
                        onChange={(e) => setNewPurchaseFundSource(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-[#252422] border border-stone-200 dark:border-white/10 p-2 text-xs rounded-lg outline-none cursor-pointer"
                      >
                        <option value="科研配套专项经费">重点建设科研配套专项经费</option>
                        <option value="校友爱心捐赠基金">高教中坚爱心校友助学基金</option>
                        <option value="中央财政转移科管资金">中央财政预算内财政资产折拨款</option>
                        <option value="科室储备机动基金">各学院自主创收学科机动金</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-stone-450 font-bold block">采购申报科学理由及科研目的：</label>
                      <textarea 
                        rows={3} 
                        className="w-full bg-stone-50 dark:bg-[#252422] border border-stone-200 dark:border-white/10 text-xs p-2 rounded-lg outline-none focus:border-[#3d5a80]"
                        placeholder="请具体补充购置本特种高危财物理由：如满足某项国家或者省级自然科学项目结项前夕中后期实验数据的重构采集等..."
                        value={newPurchaseReason}
                        onChange={(e) => setNewPurchaseReason(e.target.value)}
                      />
                    </div>

                  </div>

                  <div className="p-4 bg-stone-50 dark:bg-stone-850 flex justify-end gap-2 border-t border-stone-100 dark:border-white/5">
                    <button type="button" onClick={() => setNewPurchaseModalOpen(false)} className="px-3 py-1.5 text-xs text-stone-500 hover:bg-stone-200 dark:hover:bg-white/10 rounded font-bold">
                      放弃本次提报
                    </button>
                    <button type="submit" className="px-3.5 py-1.5 text-xs bg-[#3d5a80] text-white rounded font-bold hover:opacity-90">
                      提交审批并流转
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 4: FILL REJECTION REASON */}
      {/* ========================================================= */}
      <AnimatePresence>
        {rejectModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-[1px] z-[1100] flex items-center justify-center p-4"
              onClick={() => setRejectModalOpen(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className="bg-white dark:bg-[#1e1d1b] border border-stone-200/50 dark:border-white/5 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-4 bg-stone-50 dark:bg-stone-850 flex justify-between items-center border-b border-stone-100 dark:border-white/5">
                  <h3 className="text-xs font-black text-stone-800 dark:text-stone-100">❌ 填写并提交驳回理由</h3>
                  <button onClick={() => setRejectModalOpen(false)} className="text-stone-400 hover:bg-stone-105 dark:hover:bg-white/10 p-1 rounded-full">
                    <X size={16} />
                  </button>
                </div>

                <div className="p-5 space-y-3.5 text-xs">
                  <p>驳回此采购申报需要录入存档的拒绝原由：</p>
                  <textarea 
                    rows={3} 
                    required
                    className="w-full bg-stone-50 dark:bg-[#252422] border border-stone-200 dark:border-white/10 rounded-lg p-2 text-xs outline-none focus:border-[#3d5a80]"
                    placeholder="例：经固定资产办资产清册查询，生科一馆目前仍有同型号闲置可调配仪器一台，属于重复建账性超支，退回本期追加..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-850 flex justify-end gap-2 border-t border-stone-100 dark:border-white/5">
                  <button onClick={() => setRejectModalOpen(false)} className="px-3 py-1.5 text-xs text-stone-500 hover:bg-stone-200 dark:hover:bg-white/10 rounded font-bold">
                    返回上一层
                  </button>
                  <button onClick={submitRejection} className="px-3.5 py-1.5 text-xs bg-red-650 text-white rounded font-bold hover:opacity-90">
                    确认签署驳回
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
