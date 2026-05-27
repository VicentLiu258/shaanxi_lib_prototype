import { AssetStatus } from '../types';

export const ASSET_STATUSES: AssetStatus[] = ['闲置', '在用', '维保中', '借用中', '已报废'];

export const STATUS_COLORS: Record<AssetStatus, string> = {
  '闲置': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  '在用': 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  '维保中': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  '借用中': 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
  '已报废': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
};

export const BUSINESS_TYPES = [
  '资产领用', '清理报废', '维保变更', '资产报损', '保养记录',
  '资产导入', '资产转移', '资产处置', '资产退库', '资产入库',
];

export const DEPARTMENTS = [
  '总经办', '财务部', '人力资源部', '采购部', '仓储部',
  'IT运维部', '生物研发部', '化学分析部', '物理实验部', '品质部',
];

export const LAB_DEPTS = ['生物研发部', '化学分析部', '物理实验部', 'IT运维部', '仓储部'];

export const SAMPLE_USERS = [
  { id: 'u1', name: '张明', dept: '仓储部', role: '资产管理员' },
  { id: 'u2', name: '李晓燕', dept: '财务部', role: '财务主管' },
  { id: 'u3', name: '王强', dept: 'IT运维部', role: '系统管理员' },
  { id: 'u4', name: '陈静', dept: '总经办', role: '资产使用人' },
];

export const MOCK_CURRENT_USER_KEY = 'shaanxi-asset-current-user';
export const MOCK_DATA_KEY = 'shaanxi-asset-mock-data-v1';

export const FAKE_DELAY_MIN = 200;
export const FAKE_DELAY_MAX = 500;
