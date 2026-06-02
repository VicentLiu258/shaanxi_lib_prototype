export type HazardCategory = '腐蚀品' | '易燃液体' | '易制毒' | '易制爆' | '剧毒' | '其他';
export type ControlLevel = '一般' | '管控' | '严管' | '特管';
export type BottleStatus = '在库' | '领用中' | '已用完' | '已报废';
export type PurchaseStatus = '草稿' | '审批中' | '已驳回' | '已通过' | '采购中' | '已到货';
export type AlertLevel = '红' | '橙' | '黄' | '蓝';
export type LabRiskLevel = '一级' | '二级' | '三级' | '四级';

export interface ChemicalCatalog {
  id: string;
  cas: string;
  nameCn: string;
  nameEn: string;
  formula: string;
  hazardCategory: HazardCategory;
  controlLevel: ControlLevel;
  isPrecursor: boolean;
  isExplosive: boolean;
  unNo?: string;
  flashPoint?: string;
  storageCondition: string;
}

export interface BottleRecord {
  id: string;
  code: string;
  chemicalId: string;
  chemicalName: string;
  spec: string;
  status: BottleStatus;
  warehouse: string;
  cabinet: string;
  layer: string;
  owner: string;
  inboundDate: string;
  lastOpTime: string;
  initialWeight: number;
  currentWeight: number;
  weightUnit: 'g';
  lastBorrowWeight?: number;
  lastReturnWeight?: number;
}

export type ConsumableStatus = '正常' | '低库存' | '临期' | '已过期';

export interface ConsumableInventoryItem {
  id: string;
  name: string;
  code: string;
  packageSpec: string;
  location: string;
  stockQty: number;
  unit: string;
  safeStock: number;
  inboundTime: string;
  productionDate: string;
  expiryDate: string;
  status: ConsumableStatus;
  manufacturer: string;
  brand: string;
  supplier: string;
  purchaseTime: string;
  purchaseOrderNo: string;
  batchNo: string;
  buyer: string;
  acceptancePerson: string;
  storageCondition: string;
  material: string;
  application: string;
  introduction: string;
  remarks: string;
}

export type TerminalMode = 'borrow' | 'return';

export interface TerminalBatchItem {
  bottleId: string;
  code: string;
  chemicalName: string;
  location: string;
  previousWeight: number;
  measuredWeight: number;
  weightUnit: 'g';
  status: string;
}

export interface ReagentOperationRecord {
  id: string;
  type: '领用' | '归还';
  batchNo: string;
  bottleCode: string;
  chemicalName: string;
  operator: string;
  previousWeight: number;
  measuredWeight: number;
  weightDelta: number;
  resultStatus: BottleStatus;
  time: string;
}

export interface PurchaseOrder {
  id: string;
  orderNo: string;
  applicant: string;
  college: string;
  itemCount: number;
  purpose: string;
  budget: number;
  approvalNode: string;
  status: PurchaseStatus;
  createdAt: string;
  items: { name: string; spec: string; qty: number; price: number }[];
}

export interface ReviewRecord {
  id: string;
  applicant: string;
  batchNo: string;
  categoryCount: number;
  applyTime: string;
  status: '待审核' | '审核通过' | '不通过' | '全部';
  auditTime?: string;
  auditOpinion?: string;
  details: ChemicalDetail[];
}

export interface ChemicalDetail {
  name: string;
  specs: string;
  stock: number;
  unit: string;
  brand: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface CabinetDevice {
  id: string;
  code: string;
  model: string;
  room: string;
  capacity: number;
  bottleCount: number;
  temperature: number;
  humidity: number;
  voc: number;
  oxygen: number;
  lastOpen: string;
  status: '在线' | '离线' | '报警';
}

export interface WasteRecord {
  id: string;
  code: string;
  lab: string;
  hwCategory: string;
  form: '液' | '固' | '气';
  weight: number;
  date: string;
  reason: string;
  status: string;
}

export interface AlertEvent {
  id: string;
  level: AlertLevel;
  type: string;
  source: string;
  time: string;
  status: string;
  handler?: string;
}

export interface LabRoom {
  id: string;
  name: string;
  college: string;
  building: string;
  riskLevel: LabRiskLevel;
  score: number;
}

export interface DashboardStats {
  bottleCount: number;
  wasteKg: number;
  pendingPurchase: number;
  weeklyAlerts: number;
}

export interface HcUser {
  id: string;
  name: string;
  college: string;
  role: string;
}

export interface TodoItem {
  id: string;
  title: string;
  module: string;
  time: string;
}

export interface TransferOrder {
  id: string;
  orderNo: string;
  fromWarehouse: string;
  toWarehouse: string;
  itemCount: number;
  reason: string;
  status: '申请' | '审批' | '出库' | '在途' | '入库确认';
  applicant: string;
  updatedAt: string;
}

export interface DiscardItem {
  id: string;
  bottleCode: string;
  chemicalName: string;
  reason: string;
  status: '待报废' | '已转入危废';
}

export interface StocktakeDiff {
  id: string;
  code: string;
  bookStatus: string;
  actualStatus: string;
  diffType: '盘盈' | '盘亏' | '状态异常';
}

export interface HazardTicket {
  id: string;
  title: string;
  lab: string;
  level: '重大' | '一般';
  status: '待整改' | '整改中' | '复核' | '已关闭';
  reporter: string;
  createdAt: string;
}

export interface VisionEvent {
  id: string;
  camera: string;
  eventType: string;
  confidence: number;
  time: string;
}

export interface EmergencyPlan {
  id: string;
  category: string;
  title: string;
  contact: string;
}

export interface TrainingAccessRecord {
  id: string;
  name: string;
  college: string;
  level: string;
  studyHours: number;
  examScore: number;
  certExpiry: string;
  status: '已准入' | '待考试' | '已过期';
}

export interface CourseItem {
  id: string;
  title: string;
  category: string;
  progress: number;
  duration: string;
}

export interface ExamPaper {
  id: string;
  title: string;
  questionCount: number;
  duration: number;
  passScore: number;
}

export interface CertRecord {
  id: string;
  holder: string;
  type: string;
  expiry: string;
  status: '有效' | '即将到期' | '已过期';
}

export interface ApprovalTemplate {
  id: string;
  name: string;
  type: string;
  nodeCount: number;
  enabled: boolean;
}

export interface DictEntry {
  id: string;
  category: string;
  code: string;
  label: string;
}

export interface OperationLogEntry {
  id: string;
  operator: string;
  module: string;
  action: string;
  ip: string;
  result: string;
  time: string;
  detail?: string;
}

export interface WasteTransferSlip {
  id: string;
  slipNo: string;
  producer: string;
  receiver: string;
  transport: string;
  plateNo: string;
  status: '草稿' | '已发起' | '运输中' | '已接收';
  weight: number;
}

export interface HazardMapLink {
  from: string;
  to: string;
  relation: string;
}

export interface DemoStepConfig {
  title: string;
  detail: string;
}

export interface DemoRunResult {
  message: string;
  rows?: Record<string, unknown>[];
  columns?: string[];
  extra?: Record<string, unknown>;
}

export type DemoScenarioId =
  | 'restricted' | 'hazard-map' | 'transfer' | 'discard'
  | 'storage-overview' | 'stocktake' | 'devices'
  | 'waste-generate' | 'waste-storage' | 'waste-transfer' | 'waste-ledger'
  | 'risk-rating' | 'risk-inspect' | 'risk-vision' | 'risk-emergency'
  | 'training-access' | 'training-learn' | 'training-exam' | 'training-cert'
  | 'settings-approval' | 'settings-dict' | 'settings-log'
  | 'catalog' | 'bottles' | 'purchase' | 'inbound' | 'borrow'
  | 'cabinets' | 'alert' | 'dashboard' | 'screen' | 'terminal';
