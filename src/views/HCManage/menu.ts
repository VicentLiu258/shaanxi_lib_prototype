export interface MenuItem {
  id: string;
  label: string;
  path?: string;
  children?: MenuItem[];
}

/** 危化品全生命周期菜单（路由前缀 /hc-manage） */
export const HC_MENU: MenuItem[] = [
  { id: 'dashboard', label: '综合分析看板', path: '/hc-manage/dashboard' },
  {
    id: 'chemicals', label: '化学品档案',
    children: [
      { id: 'catalog', label: '化学品名录', path: '/hc-manage/chemicals/catalog' },
      { id: 'bottles', label: '一瓶一码档案', path: '/hc-manage/chemicals/bottles' },
      { id: 'restricted', label: '易制毒易制爆目录', path: '/hc-manage/chemicals/restricted' },
      { id: 'hazard-map', label: '危险特性图谱', path: '/hc-manage/chemicals/hazard-map' },
    ],
  },
  {
    id: 'flow', label: '流程中枢',
    children: [
      { id: 'purchase', label: '申购管理', path: '/hc-manage/flow/purchase' },
      { id: 'inbound', label: '入库管理', path: '/hc-manage/flow/inbound' },
      { id: 'borrow', label: '领用归还', path: '/hc-manage/flow/borrow' },
      { id: 'transfer', label: '调拨流转', path: '/hc-manage/flow/transfer' },
      { id: 'discard', label: '报废处置', path: '/hc-manage/flow/discard' },
    ],
  },
  {
    id: 'storage', label: '智能库房',
    children: [
      { id: 'overview', label: '库房总览', path: '/hc-manage/storage/overview' },
      { id: 'consumables', label: '耗材库存清单', path: '/hc-manage/storage/consumables' },
      { id: 'cabinets', label: '智能存储终端', path: '/hc-manage/storage/cabinets' },
      { id: 'stocktake', label: '实时盘点', path: '/hc-manage/storage/stocktake' },
      { id: 'devices', label: '设备物联状态', path: '/hc-manage/storage/devices' },
    ],
  },
  {
    id: 'waste', label: '危废闭环',
    children: [
      { id: 'generate', label: '产废登记', path: '/hc-manage/waste/generate' },
      { id: 'waste-storage', label: '暂存监控', path: '/hc-manage/waste/storage' },
      { id: 'waste-transfer', label: '转移联单', path: '/hc-manage/waste/transfer' },
      { id: 'ledger', label: '处置台账', path: '/hc-manage/waste/ledger' },
    ],
  },
  {
    id: 'risk', label: '安全风控',
    children: [
      { id: 'rating', label: '风险评级', path: '/hc-manage/risk/rating' },
      { id: 'inspect', label: '检查与隐患', path: '/hc-manage/risk/inspect' },
      { id: 'alert', label: '预警中心', path: '/hc-manage/risk/alert' },
      { id: 'vision', label: '视觉感知', path: '/hc-manage/risk/vision' },
      { id: 'emergency', label: '应急预案', path: '/hc-manage/risk/emergency' },
    ],
  },
  {
    id: 'training', label: '培训与准入',
    children: [
      { id: 'access', label: '准入审核', path: '/hc-manage/training/access' },
      { id: 'learn', label: '在线学习', path: '/hc-manage/training/learn' },
      { id: 'exam', label: '安全考试', path: '/hc-manage/training/exam' },
      { id: 'cert', label: '资质证书', path: '/hc-manage/training/cert' },
    ],
  },
  {
    id: 'settings', label: '子系统设置',
    children: [
      { id: 'approval-template', label: '审批模板', path: '/hc-manage/settings/approval-template' },
      { id: 'dict', label: '业务字典', path: '/hc-manage/settings/dict' },
      { id: 'compliance', label: '合规与审计策略', path: '/hc-manage/settings/compliance' },
      { id: 'log', label: '操作日志', path: '/hc-manage/settings/log' },
    ],
  },
];

export function findMenuLabel(pathname: string): string[] {
  for (const g of HC_MENU) {
    if (g.path && pathname.includes(g.path.replace('/hc-manage/', ''))) return ['危化品全生命周期', g.label];
    for (const c of g.children || []) {
      if (c.path && pathname.startsWith(c.path)) return ['危化品全生命周期', g.label, c.label];
    }
  }
  return ['危化品全生命周期'];
}
