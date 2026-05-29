import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Archive,
  BellRing,
  BookOpenCheck,
  Boxes,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FlaskConical,
  Gauge,
  History,
  LockKeyhole,
  MapPin,
  RadioTower,
  RefreshCw,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound,
} from 'lucide-react';
import { cn } from '../../lib/utils';

type RiskLevel = '低' | '中' | '高' | '重大';
type DeviceStatus = '在线' | '离线' | '告警' | '维护中';
type BusinessStatus = '待处理' | '已通过' | '已驳回' | '执行中' | '已完成';

const riskTone: Record<RiskLevel, string> = {
  低: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  中: 'bg-amber-50 text-amber-700 border-amber-100',
  高: 'bg-orange-50 text-orange-700 border-orange-100',
  重大: 'bg-red-50 text-red-700 border-red-100',
};

const statusTone: Record<DeviceStatus | BusinessStatus, string> = {
  在线: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  离线: 'bg-slate-100 text-slate-600 border-slate-200',
  告警: 'bg-red-50 text-red-700 border-red-100',
  维护中: 'bg-blue-50 text-blue-700 border-blue-100',
  待处理: 'bg-amber-50 text-amber-700 border-amber-100',
  已通过: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  已驳回: 'bg-red-50 text-red-700 border-red-100',
  执行中: 'bg-blue-50 text-blue-700 border-blue-100',
  已完成: 'bg-slate-100 text-slate-700 border-slate-200',
};

const devices = [
  { id: 'DEV-A-019', name: '化学楼一层智能暂存柜', room: '化学楼 101', status: '在线' as DeviceStatus, temp: '22.4°C', humidity: '47%', manager: '黄老师', cells: '42/48', lastSignal: '2分钟前' },
  { id: 'DEV-A-021', name: '实验楼北侧防爆储存柜', room: '实验楼 B108', status: '告警' as DeviceStatus, temp: '27.1°C', humidity: '69%', manager: '张老师', cells: '36/40', lastSignal: '刚刚' },
  { id: 'DEV-B-006', name: '废液暂存称重柜', room: '危废暂存间', status: '维护中' as DeviceStatus, temp: '21.8°C', humidity: '52%', manager: '李老师', cells: '18/24', lastSignal: '16分钟前' },
  { id: 'DEV-C-002', name: '易制毒试剂专柜', room: '药品库 02', status: '离线' as DeviceStatus, temp: '--', humidity: '--', manager: '周老师', cells: '30/36', lastSignal: '3小时前' },
];

const inventory = [
  { code: 'HC-2026-0001', name: '盐酸', cas: '7647-01-0', className: '腐蚀性', storage: '酸类专区', room: '化学楼 101', cell: 'A-03', amount: 380, unit: 'ml', min: 100, expiry: '2026-08-16', risk: '中' as RiskLevel, status: '在库' },
  { code: 'HC-2026-0002', name: '过氧化氢', cas: '7722-84-1', className: '氧化性', storage: '氧化剂专区', room: '药品库 02', cell: 'B-11', amount: 82, unit: 'ml', min: 100, expiry: '2026-06-10', risk: '高' as RiskLevel, status: '低量预警' },
  { code: 'HC-2026-0003', name: '乙醇', cas: '64-17-5', className: '易燃液体', storage: '防火柜', room: '实验楼 B108', cell: 'F-07', amount: 1200, unit: 'ml', min: 300, expiry: '2027-01-09', risk: '中' as RiskLevel, status: '在库' },
  { code: 'HC-2026-0004', name: '硝酸银', cas: '7761-88-8', className: '环境危害', storage: '避光专区', room: '化学楼 101', cell: 'D-02', amount: 15, unit: 'g', min: 20, expiry: '2026-05-31', risk: '高' as RiskLevel, status: '临期预警' },
];

const reagentRules = [
  { left: '强氧化剂', right: '易燃液体', verdict: '禁止同柜', action: '分柜存放并启用距离校验' },
  { left: '酸类', right: '碱类', verdict: '禁止同格', action: '入库时阻断同格选择' },
  { left: '避光试剂', right: '常规无机盐', verdict: '条件允许', action: '需满足遮光包装与标签完整' },
  { left: '剧毒管控品', right: '普通试剂', verdict: '单独管控', action: '强制双人审批与独立台账' },
];

const approvals = [
  { no: 'AP-IN-26052901', type: '入库授权', applicant: '黄老师 / 陈老师', target: '盐酸等 3 项', status: '待处理' as BusinessStatus, risk: '中' as RiskLevel, due: '2026-05-29 18:00', check: '双人认证、采购单、SDS附件' },
  { no: 'AP-USE-26052904', type: '领用申请', applicant: '高二化学备课组', target: '乙醇 200ml', status: '执行中' as BusinessStatus, risk: '中' as RiskLevel, due: '2026-05-30 09:00', check: '用途说明、归还称重、课堂记录' },
  { no: 'AP-WST-26052802', type: '危废处置', applicant: '实验员李老师', target: '含银废液 6L', status: '已通过' as BusinessStatus, risk: '高' as RiskLevel, due: '2026-06-01 17:00', check: '废液类别、处置单位、转运单' },
  { no: 'AP-BUY-26052708', type: '请购申请', applicant: '化学教研组', target: '过氧化氢 500ml x 2', status: '已驳回' as BusinessStatus, risk: '高' as RiskLevel, due: '2026-05-28 12:00', check: '库存余量、替代试剂、预算来源' },
];

const auditLogs = [
  { time: '2026-05-29 09:32:18', user: '系统管理员', action: '调整领用审批策略', target: '高风险试剂需二级审批', ip: '10.12.8.24' },
  { time: '2026-05-29 09:12:44', user: '黄老师', action: '完成入库复核', target: 'HC-2026-0001', ip: '10.12.8.31' },
  { time: '2026-05-28 17:40:09', user: '李老师', action: '提交危废暂存记录', target: '含银废液 6L', ip: '10.12.8.36' },
];

const TabButton = ({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      'px-4 py-2 text-sm font-bold border-b-2 transition-colors',
      active ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-blue-600'
    )}
  >
    {children}
  </button>
);

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={cn('inline-flex items-center rounded border px-2 py-0.5 text-xs font-bold', className)}>
    {children}
  </span>
);

const ToolBar = ({ placeholder = '搜索名称、编号或负责人' }: { placeholder?: string }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
    <div className="relative w-full max-w-sm">
      <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
      <input className="w-full rounded border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-600" placeholder={placeholder} />
    </div>
    <div className="flex items-center gap-2">
      <button className="flex items-center gap-1.5 rounded border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:text-blue-600">
        <SlidersHorizontal size={16} /> 筛选
      </button>
      <button className="flex items-center gap-1.5 rounded border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:text-blue-600">
        <RefreshCw size={16} /> 刷新
      </button>
      <button className="flex items-center gap-1.5 rounded bg-blue-600 px-3 py-2 text-sm font-bold text-white hover:bg-blue-700">
        <Download size={16} /> 导出
      </button>
    </div>
  </div>
);

const SectionTitle = ({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc?: string }) => (
  <div className="mb-4 flex items-center gap-3">
    <div className="flex h-9 w-9 items-center justify-center rounded bg-blue-50 text-blue-600">
      <Icon size={19} />
    </div>
    <div>
      <h3 className="font-bold text-slate-900">{title}</h3>
      {desc && <p className="text-xs font-medium text-slate-500">{desc}</p>}
    </div>
  </div>
);

export const HazardDashboard: React.FC = () => {
  const metrics = [
    { label: '在库试剂', value: '1,286', delta: '4 项临期', icon: FlaskConical, tone: 'text-blue-600 bg-blue-50' },
    { label: '在线设备', value: '23 / 26', delta: '1 台告警', icon: RadioTower, tone: 'text-emerald-600 bg-emerald-50' },
    { label: '待办审批', value: '12', delta: '4 项高风险', icon: ClipboardCheck, tone: 'text-amber-600 bg-amber-50' },
    { label: '整改闭环率', value: '91%', delta: '本月 +6%', icon: ShieldCheck, tone: 'text-cyan-700 bg-cyan-50' },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => (
          <div key={item.label} className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500">{item.label}</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{item.value}</p>
                <p className="mt-2 text-xs font-bold text-slate-500">{item.delta}</p>
              </div>
              <div className={cn('flex h-11 w-11 items-center justify-center rounded', item.tone)}>
                <item.icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
          <SectionTitle icon={Activity} title="全生命周期看板" desc="从请购、入库、在库、领用、归还、危废到审计的闭环状态" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {['请购', '入库复核', '在库监测', '领用归还', '危废处置', '隐患整改', '日志审计', '数据备案'].map((step, idx) => (
              <div key={step} className="rounded border border-slate-100 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400">0{idx + 1}</span>
                  <CheckCircle2 size={16} className={idx < 5 ? 'text-emerald-600' : 'text-amber-500'} />
                </div>
                <p className="font-bold text-slate-900">{step}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{idx < 5 ? '流程可追溯' : '需要持续跟进'}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
          <SectionTitle icon={BellRing} title="风险提醒" desc="按业务优先级聚合设备、库存和审批风险" />
          <div className="space-y-3">
            {[
              ['重大', '实验楼 B108 湿度超过阈值，建议复核通风与密封状态'],
              ['高', '硝酸银将在 2 天内到期，需确认继续使用或发起报废'],
              ['中', '过氧化氢低于最小库存，采购申请已进入复核'],
              ['低', '本周安全检查还有 2 个库房未提报'],
            ].map(([level, text]) => (
              <div key={text} className="flex gap-3 rounded border border-slate-100 p-3">
                <Badge className={riskTone[level as RiskLevel]}>{level}</Badge>
                <span className="text-sm font-medium text-slate-700">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const DeviceLedger: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <ToolBar placeholder="搜索设备名称、编号、库房或负责人" />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {devices.map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-black text-slate-900">{item.name}</h3>
                <p className="mt-1 text-xs font-bold text-slate-500">{item.id}</p>
              </div>
              <Badge className={statusTone[item.status]}>{item.status}</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 font-medium text-slate-600"><MapPin size={15} /> {item.room}</p>
              <p className="flex items-center gap-2 font-medium text-slate-600"><UsersRound size={15} /> {item.manager}</p>
              <p className="flex items-center gap-2 font-medium text-slate-600"><Gauge size={15} /> 温湿度 {item.temp} / {item.humidity}</p>
              <p className="flex items-center gap-2 font-medium text-slate-600"><Boxes size={15} /> 宫格占用 {item.cells}</p>
            </div>
            <div className="mt-4 border-t pt-3 text-xs font-bold text-slate-400">最后通信：{item.lastSignal}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
          <SectionTitle icon={Archive} title="宫格与存储位" desc="按设备、门号、宫格容量和兼容规则管理存储位" />
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr><th className="px-3 py-3">设备</th><th className="px-3 py-3">宫格</th><th className="px-3 py-3">容量</th><th className="px-3 py-3">当前品类</th><th className="px-3 py-3">规则</th></tr>
            </thead>
            <tbody>
              {['A-03', 'B-11', 'D-02', 'F-07'].map((cell, idx) => (
                <tr key={cell} className="border-b last:border-0">
                  <td className="px-3 py-3 font-bold text-slate-800">{devices[idx % devices.length].id}</td>
                  <td className="px-3 py-3 text-blue-600 font-bold">{cell}</td>
                  <td className="px-3 py-3 text-slate-600">{idx % 2 ? '12 瓶位' : '8 瓶位'}</td>
                  <td className="px-3 py-3 text-slate-600">{inventory[idx]?.className}</td>
                  <td className="px-3 py-3"><Badge className="border-blue-100 bg-blue-50 text-blue-700">自动校验</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
          <SectionTitle icon={AlertTriangle} title="报警与巡检" desc="设备报警、人工巡检、异常处理统一沉淀" />
          <div className="space-y-3">
            {[
              ['湿度报警', '实验楼 B108', '已通知负责人，待现场复核'],
              ['离线提醒', '药品库 02', '需要检查网关或设备电源'],
              ['巡检异常', '危废暂存间', '废液称重柜处于维护模式'],
            ].map(([title, room, desc]) => (
              <div key={title} className="rounded border border-slate-100 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900">{title}</p>
                  <Badge className="border-amber-100 bg-amber-50 text-amber-700">待处理</Badge>
                </div>
                <p className="mt-1 text-xs font-bold text-slate-500">{room}</p>
                <p className="mt-2 text-sm font-medium text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const InventoryLifecycle: React.FC = () => {
  const [tab, setTab] = useState('库存台账');
  const visibleRows = useMemo(() => {
    if (tab === '低量预警') return inventory.filter((item) => item.amount < item.min);
    if (tab === '临期预警') return inventory.filter((item) => item.status.includes('临期'));
    return inventory;
  }, [tab]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap border-b">
        {['库存台账', '入库记录', '领用归还', '危废报废', '低量预警', '临期预警'].map((item) => (
          <TabButton key={item} active={tab === item} onClick={() => setTab(item)}>{item}</TabButton>
        ))}
      </div>
      <ToolBar placeholder="搜索试剂名称、CAS号、内部编号或库房" />
      <div className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">内部编号</th>
              <th className="px-4 py-3">试剂</th>
              <th className="px-4 py-3">分类</th>
              <th className="px-4 py-3">位置</th>
              <th className="px-4 py-3">当前量</th>
              <th className="px-4 py-3">过期日</th>
              <th className="px-4 py-3">风险</th>
              <th className="px-4 py-3">状态</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((item) => (
              <tr key={item.code} className="border-b last:border-0 hover:bg-blue-50/30">
                <td className="px-4 py-3 font-bold text-slate-800">{item.code}</td>
                <td className="px-4 py-3"><p className="font-black text-slate-900">{item.name}</p><p className="text-xs font-bold text-slate-400">CAS {item.cas}</p></td>
                <td className="px-4 py-3 text-slate-700">{item.className}</td>
                <td className="px-4 py-3 text-slate-600">{item.room} / {item.cell}</td>
                <td className="px-4 py-3 font-bold text-slate-900">{item.amount}{item.unit}</td>
                <td className="px-4 py-3 text-slate-600">{item.expiry}</td>
                <td className="px-4 py-3"><Badge className={riskTone[item.risk]}>{item.risk}</Badge></td>
                <td className="px-4 py-3"><Badge className={item.status === '在库' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-amber-100 bg-amber-50 text-amber-700'}>{item.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ReagentKnowledgeBase: React.FC = () => {
  const [tab, setTab] = useState('试剂目录');
  return (
    <div className="space-y-6 p-6">
      <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
        <div className="flex gap-3">
          <LockKeyhole size={20} className="mt-0.5 shrink-0 text-amber-700" />
          <div>
            <p className="font-black text-amber-900">资料合规策略</p>
            <p className="mt-1 text-sm font-medium leading-6 text-amber-800">
              系统只内置演示级分类和字段结构；正式化学品目录、SDS、配伍规则需通过学校自有资料、公开许可数据或已授权供应商资料导入，并记录来源、版本和授权凭据。
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap border-b">
        {['试剂目录', '危险分类', '存储类别', '包装规格', '配伍规则', '供应商'].map((item) => (
          <TabButton key={item} active={tab === item} onClick={() => setTab(item)}>{item}</TabButton>
        ))}
      </div>
      <ToolBar placeholder="搜索名称、CAS号、分类、来源或供应商" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr><th className="px-4 py-3">名称</th><th className="px-4 py-3">CAS</th><th className="px-4 py-3">危险分类</th><th className="px-4 py-3">资料来源</th><th className="px-4 py-3">状态</th></tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.code} className="border-b last:border-0">
                  <td className="px-4 py-3 font-black text-slate-900">{item.name}</td>
                  <td className="px-4 py-3 text-slate-600">{item.cas}</td>
                  <td className="px-4 py-3">{item.className}</td>
                  <td className="px-4 py-3 text-slate-600">校内备案 / 供应商授权</td>
                  <td className="px-4 py-3"><Badge className="border-emerald-100 bg-emerald-50 text-emerald-700">已备案</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
          <SectionTitle icon={BookOpenCheck} title="配伍禁忌规则" desc="用于入库选柜、领用提醒和巡检核查" />
          <div className="space-y-3">
            {reagentRules.map((rule) => (
              <div key={`${rule.left}-${rule.right}`} className="rounded border border-slate-100 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900">{rule.left} + {rule.right}</p>
                  <Badge className={rule.verdict.includes('禁止') ? 'border-red-100 bg-red-50 text-red-700' : 'border-blue-100 bg-blue-50 text-blue-700'}>{rule.verdict}</Badge>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-600">{rule.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ApprovalCenter: React.FC = () => {
  const [tab, setTab] = useState('全部单据');
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap border-b">
        {['全部单据', '入库授权', '领用申请', '请购申请', '危废处置', '工作室加入'].map((item) => (
          <TabButton key={item} active={tab === item} onClick={() => setTab(item)}>{item}</TabButton>
        ))}
      </div>
      <ToolBar placeholder="搜索单号、申请人、试剂或用途" />
      <div className="grid grid-cols-1 gap-4">
        {approvals.map((item) => (
          <div key={item.no} className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge className="border-blue-100 bg-blue-50 text-blue-700">{item.type}</Badge>
                  <Badge className={riskTone[item.risk]}>{item.risk}风险</Badge>
                  <Badge className={statusTone[item.status]}>{item.status}</Badge>
                </div>
                <h3 className="font-black text-slate-900">{item.target}</h3>
                <p className="mt-1 text-xs font-bold text-slate-400">{item.no}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{item.applicant}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">截止：{item.due}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded bg-slate-50 p-3">
              <p className="text-sm font-medium text-slate-600">核查项：{item.check}</p>
              <div className="flex gap-2">
                <button className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-blue-600">查看</button>
                <button className="rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700">办理</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ComplianceControl: React.FC = () => {
  const [settings, setSettings] = useState([
    ['入库双人复核', true],
    ['高风险领用二级审批', true],
    ['危废处置审批', true],
    ['开柜二次确认', false],
    ['设备报警短信提醒', true],
    ['导入资料版权确认', true],
  ] as [string, boolean][]);

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
          <SectionTitle icon={Settings2} title="工作室策略" desc="按学校、库房或实验室配置认证、审批和提醒策略" />
          <div className="space-y-3">
            {settings.map(([label, enabled], idx) => (
              <button
                key={label}
                onClick={() => setSettings((prev) => prev.map((item, i) => i === idx ? [item[0], !item[1]] : item))}
                className="flex w-full items-center justify-between rounded border border-slate-100 p-3 text-left hover:bg-slate-50"
              >
                <span className="font-bold text-slate-800">{label}</span>
                <span className={cn('h-6 w-11 rounded-full p-0.5 transition-colors', enabled ? 'bg-blue-600' : 'bg-slate-300')}>
                  <span className={cn('block h-5 w-5 rounded-full bg-white transition-transform', enabled && 'translate-x-5')} />
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
          <SectionTitle icon={ShieldAlert} title="侵权风险规避清单" desc="把参考系统转化为自有业务方案时必须保留的约束" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {[
              ['不复刻外部界面', '导航、布局、字段组合、示例数据均使用自有表达。'],
              ['资料来源备案', '试剂库、SDS、配伍规则必须记录来源、版本和授权。'],
              ['导入前确认', '批量导入时要求上传人确认拥有合法使用权。'],
              ['品牌隔离', '不使用参考系统名称、域名、商标、截图或原始数据。'],
              ['可替换数据层', '演示数据只用于原型，生产环境接入学校自有台账。'],
              ['审计可追溯', '关键操作保留人员、时间、IP、设备与变更前后值。'],
            ].map(([title, text]) => (
              <div key={title} className="rounded border border-slate-100 bg-slate-50 p-4">
                <p className="font-black text-slate-900">{title}</p>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
        <SectionTitle icon={History} title="系统审计日志" desc="关键配置、审批、库存和设备操作留痕" />
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr><th className="px-4 py-3">时间</th><th className="px-4 py-3">用户</th><th className="px-4 py-3">操作</th><th className="px-4 py-3">对象</th><th className="px-4 py-3">IP</th></tr>
          </thead>
          <tbody>
            {auditLogs.map((item) => (
              <tr key={`${item.time}-${item.action}`} className="border-b last:border-0">
                <td className="px-4 py-3 font-bold text-slate-700">{item.time}</td>
                <td className="px-4 py-3">{item.user}</td>
                <td className="px-4 py-3 text-blue-600 font-bold">{item.action}</td>
                <td className="px-4 py-3">{item.target}</td>
                <td className="px-4 py-3 text-slate-500">{item.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
