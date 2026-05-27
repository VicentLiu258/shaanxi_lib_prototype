export type AssetStatus = '闲置' | '在用' | '维保中' | '借用中' | '已报废';

export type OperationType =
  | '入库' | '领用' | '退库' | '借用' | '归还'
  | '转移' | '报损' | '维保变更' | '保养' | '巡检'
  | '清理报废' | '资产变更' | '盘点';

export interface CategoryNode {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  children?: CategoryNode[];
  level: number;
}

export interface AreaNode {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  level: number;
  children?: AreaNode[];
  fullPath: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  address: string;
  status: '启用' | '禁用';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  dept: string;
  role: string;
  phone?: string;
}

export interface Asset {
  id: string;
  assetNo: string;
  name: string;
  categoryId: string;
  categoryName: string;
  modelSpec: string;
  status: AssetStatus;
  useOrg: string;
  useDept: string;
  usePerson: string;
  locationId: string;
  locationPath: string;
  supplierId?: string;
  supplierName?: string;
  purchasePrice?: number;
  purchaseDate?: string;
  originalValue?: number;
  netValue?: number;
  depreciationPeriod?: number;
  maintenanceContract?: string;
  maintenanceStart?: string;
  maintenanceEnd?: string;
  lastMaintainDate?: string;
  nextMaintainDate?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OperationLog {
  id: string;
  assetId: string;
  assetNo: string;
  assetName: string;
  type: OperationType;
  operator: string;
  operateTime: string;
  remark?: string;
  beforeStatus?: AssetStatus;
  afterStatus?: AssetStatus;
  targetPerson?: string;
  targetDept?: string;
}

export interface DashboardStats {
  total: number;
  inUse: number;
  idle: number;
  maintenanceDue: number;
  utilization: number;
  totalValue: number;
}

export interface MonthlyNewAsset {
  month: string;
  count: number;
}

export interface BusinessDistribution {
  type: string;
  count: number;
  percent: number;
}

export interface AssetFilter {
  keyword?: string;
  categoryId?: string;
  status?: AssetStatus | '';
  useDept?: string;
  usePerson?: string;
  locationId?: string;
  supplierId?: string;
  maintenanceDue?: boolean;
}

export interface InboundPayload {
  name: string;
  categoryId: string;
  modelSpec: string;
  assetNo?: string;
  supplierId: string;
  purchasePrice: number;
  purchaseDate: string;
  useDept: string;
  usePerson: string;
  locationId: string;
  maintenanceContract?: string;
  maintenanceEnd?: string;
}

export interface ReceivePayload {
  assetIds: string[];
  receiver: string;
  receiveDept: string;
  expectedReturnDate: string;
  remark?: string;
}

export interface PurchaseApplication {
  id: string;
  title: string;
  applicant: string;
  dept: string;
  amount: number;
  status: '待审批' | '已通过' | '已驳回';
  applyDate: string;
  items: string;
}

export interface InventoryItem {
  id: string;
  assetNo: string;
  name: string;
  location: string;
  status: '未盘' | '已盘' | '盘亏';
}

export interface ScrapRecord {
  id: string;
  assetNo: string;
  name: string;
  reason: string;
  applyDate: string;
  status: '待审批' | '已通过' | '已驳回';
  originalValue: number;
}
