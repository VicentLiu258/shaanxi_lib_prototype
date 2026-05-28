import { HazardCategory, ControlLevel, BottleStatus, PurchaseStatus, AlertLevel, LabRiskLevel } from '../types';

export const COLLEGES = [
  '化学与材料学院',
  '生命科学学院',
  '物理与电子学院',
  '环境与工程学院',
  '医学院',
];

export const SAMPLE_NAMES = ['张明', '李娜', '王浩', '陈雪', '刘洋', '赵强', '孙琳', '周晨', '吴博', '郑薇'];

export const HAZARD_CATEGORIES: HazardCategory[] = ['腐蚀品', '易燃液体', '易制毒', '易制爆', '剧毒', '其他'];
export const CONTROL_LEVELS: ControlLevel[] = ['一般', '管控', '严管', '特管'];
export const BOTTLE_STATUSES: BottleStatus[] = ['在库', '领用中', '已用完', '已报废'];
export const PURCHASE_STATUSES: PurchaseStatus[] = ['草稿', '审批中', '已驳回', '已通过', '采购中', '已到货'];
export const ALERT_LEVELS: AlertLevel[] = ['红', '橙', '黄', '蓝'];
export const LAB_RISK_LEVELS: LabRiskLevel[] = ['一级', '二级', '三级', '四级'];

export const HC_MOCK_DATA_KEY = 'shaanxi-hc-mock-data-v3';
export const HC_CURRENT_USER_KEY = 'shaanxi-hc-current-user';

export const SAMPLE_HC_USERS = [
  { id: 'hc-u1', name: '张明', college: '化学与材料学院', role: '校级安全员' },
  { id: 'hc-u2', name: '李娜', college: '生命科学学院', role: '院级安全员' },
  { id: 'hc-u3', name: '王浩', college: '物理与电子学院', role: '实验室负责人' },
  { id: 'hc-u4', name: '陈雪', college: '化学与材料学院', role: '学生' },
];

export const CHEMICAL_SAMPLES = [
  { cas: '67-56-1', nameCn: '甲醇', nameEn: 'Methanol', formula: 'CH4O', cat: '易燃液体' as HazardCategory, ctrl: '管控' as ControlLevel },
  { cas: '64-17-5', nameCn: '乙醇', nameEn: 'Ethanol', formula: 'C2H6O', cat: '易燃液体', ctrl: '一般' },
  { cas: '7664-93-9', nameCn: '浓硫酸', nameEn: 'Sulfuric acid', formula: 'H2SO4', cat: '腐蚀品', ctrl: '严管' },
  { cas: '7647-01-0', nameCn: '浓盐酸', nameEn: 'Hydrochloric acid', formula: 'HCl', cat: '腐蚀品', ctrl: '管控' },
  { cas: '67-64-1', nameCn: '丙酮', nameEn: 'Acetone', formula: 'C3H6O', cat: '易燃液体', ctrl: '管控' },
  { cas: '67-66-3', nameCn: '三氯甲烷', nameEn: 'Chloroform', formula: 'CHCl3', cat: '其他', ctrl: '严管' },
  { cas: '7722-64-7', nameCn: '高锰酸钾', nameEn: 'Potassium permanganate', formula: 'KMnO4', cat: '易制爆', ctrl: '特管', explosive: true },
  { cas: '1310-73-2', nameCn: '氢氧化钠', nameEn: 'Sodium hydroxide', formula: 'NaOH', cat: '腐蚀品', ctrl: '一般' },
  { cas: '71-43-2', nameCn: '苯', nameEn: 'Benzene', formula: 'C6H6', cat: '易燃液体', ctrl: '严管' },
  { cas: '7761-88-8', nameCn: '硝酸银', nameEn: 'Silver nitrate', formula: 'AgNO3', cat: '其他', ctrl: '管控' },
];

export const STATUS_COLORS: Record<string, string> = {
  '在库': 'bg-emerald-100 text-emerald-700',
  '领用中': 'bg-blue-100 text-blue-700',
  '已用完': 'bg-slate-100 text-slate-600',
  '已报废': 'bg-red-100 text-red-700',
  '待审核': 'bg-amber-100 text-amber-700',
  '审核通过': 'bg-emerald-100 text-emerald-700',
  '不通过': 'bg-red-100 text-red-700',
  '草稿': 'bg-slate-100 text-slate-600',
  '审批中': 'bg-blue-100 text-blue-700',
  '已驳回': 'bg-red-100 text-red-700',
  '已通过': 'bg-emerald-100 text-emerald-700',
  '采购中': 'bg-purple-100 text-purple-700',
  '已到货': 'bg-teal-100 text-teal-700',
  '在线': 'bg-emerald-100 text-emerald-700',
  '离线': 'bg-slate-100 text-slate-600',
  '报警': 'bg-red-100 text-red-700',
};

export const FAKE_DELAY = () => 200 + Math.floor(Math.random() * 200);
