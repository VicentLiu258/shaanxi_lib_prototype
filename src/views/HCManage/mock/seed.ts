import {
  ChemicalCatalog, BottleRecord, PurchaseOrder, CabinetDevice,
  WasteRecord, AlertEvent, LabRoom, ReviewRecord, DashboardStats, TodoItem,
  TransferOrder, DiscardItem, StocktakeDiff, HazardTicket, VisionEvent,
  EmergencyPlan, TrainingAccessRecord, CourseItem, ExamPaper, CertRecord,
  ApprovalTemplate, DictEntry, OperationLogEntry, WasteTransferSlip, HazardMapLink,
} from '../types';
import {
  COLLEGES, SAMPLE_NAMES, CHEMICAL_SAMPLES, HAZARD_CATEGORIES, CONTROL_LEVELS,
  BOTTLE_STATUSES, PURCHASE_STATUSES, ALERT_LEVELS,
} from './constants';

function pick<T>(arr: T[], i: number) { return arr[i % arr.length]; }

export function buildChemicals(): ChemicalCatalog[] {
  const list: ChemicalCatalog[] = CHEMICAL_SAMPLES.map((c, i) => ({
    id: `chem-${i + 1}`,
    cas: c.cas,
    nameCn: c.nameCn,
    nameEn: c.nameEn,
    formula: c.formula,
    hazardCategory: c.cat as ChemicalCatalog['hazardCategory'],
    controlLevel: c.ctrl as ChemicalCatalog['controlLevel'],
    isPrecursor: c.cat === '易制毒',
    isExplosive: !!(c as { explosive?: boolean }).explosive || c.cat === '易制爆',
    unNo: `UN${1000 + i}`,
    flashPoint: c.cat === '易燃液体' ? `${12 + i}℃` : undefined,
    storageCondition: '阴凉通风、远离火源',
  }));
  for (let i = list.length; i < 50; i++) {
    const base = CHEMICAL_SAMPLES[i % CHEMICAL_SAMPLES.length];
    list.push({
      id: `chem-${i + 1}`,
      cas: `${1000 + i}-${20 + i}-${30 + i}`,
      nameCn: `${base.nameCn}（试剂级${i}）`,
      nameEn: base.nameEn,
      formula: base.formula,
      hazardCategory: pick(HAZARD_CATEGORIES, i),
      controlLevel: pick(CONTROL_LEVELS, i),
      isPrecursor: i % 7 === 0,
      isExplosive: i % 11 === 0,
      storageCondition: '按化学品相容性分区存放',
    });
  }
  return list;
}

export function buildBottles(chemicals: ChemicalCatalog[]): BottleRecord[] {
  return Array.from({ length: 120 }, (_, i) => {
    const chem = chemicals[i % chemicals.length];
    return {
      id: `bottle-${i + 1}`,
      code: `LC-2026-${String(i + 1).padStart(6, '0')}`,
      chemicalId: chem.id,
      chemicalName: chem.nameCn,
      spec: `${(i % 5 + 1) * 100}ml/瓶`,
      status: pick(BOTTLE_STATUSES, i),
      warehouse: `LH-A${String((i % 8) + 1).padStart(2, '0')}`,
      cabinet: `柜-${(i % 6) + 1}`,
      layer: `第${(i % 4) + 1}层`,
      owner: pick(SAMPLE_NAMES, i),
      inboundDate: `2026-0${(i % 4) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
      lastOpTime: `2026-05-${String((i % 20) + 1).padStart(2, '0')} ${10 + (i % 8)}:00`,
    };
  });
}

export function buildPurchases(): PurchaseOrder[] {
  return Array.from({ length: 40 }, (_, i) => ({
    id: `po-${i + 1}`,
    orderNo: `PO-2026-${String(i + 1).padStart(4, '0')}`,
    applicant: pick(SAMPLE_NAMES, i),
    college: pick(COLLEGES, i),
    itemCount: (i % 5) + 1,
    purpose: '本科教学实验及科研小试，已落实双人双锁与通风橱操作规范。',
    budget: 500 + (i % 20) * 120,
    approvalNode: ['课题组负责人', '院级安全员', '校级审核', '采购执行', '到货验收'][i % 5],
    status: pick(PURCHASE_STATUSES, i),
    createdAt: `2026-05-${String((i % 20) + 1).padStart(2, '0')} 09:00`,
    items: [{ name: '甲醇', spec: '500ml', qty: 2, price: 45 }],
  }));
}

export function buildInboundReviews(): ReviewRecord[] {
  return Array.from({ length: 18 }, (_, i) => ({
    id: `in-${i + 1}`,
    applicant: pick(SAMPLE_NAMES, i),
    batchNo: `WHS202605${String(i + 1).padStart(3, '0')}`,
    categoryCount: (i % 4) + 1,
    applyTime: `2026-05-${String((i % 20) + 1).padStart(2, '0')} 10:00:00`,
    status: i % 3 === 0 ? '待审核' : '审核通过',
    details: [
      { name: '盐酸', specs: '500ml/瓶', stock: 10, unit: '瓶', brand: '国药', quantity: 5, price: 25, totalPrice: 125 },
    ],
  }));
}

export function buildCabinets(): CabinetDevice[] {
  return Array.from({ length: 24 }, (_, i) => ({
    id: `cab-${i + 1}`,
    code: `STX-${['G', 'B', 'T'][i % 3]}-${String(i + 1).padStart(2, '0')}`,
    model: ['STX-G 系列', 'STX-B 防爆系列', 'STX-T 通风型'][i % 3],
    room: `实验楼${(i % 5) + 1} · ${101 + i}室`,
    capacity: 48,
    bottleCount: 12 + (i % 30),
    temperature: 18 + (i % 8) * 0.5,
    humidity: 40 + (i % 15),
    voc: 0.1 + (i % 10) * 0.05,
    oxygen: 20.5 + (i % 3) * 0.1,
    lastOpen: `2026-05-27 ${14 + (i % 6)}:${10 + i}`,
    status: i % 9 === 0 ? '报警' : i % 7 === 0 ? '离线' : '在线',
  }));
}

export function buildWastes(): WasteRecord[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: `waste-${i + 1}`,
    code: `WC-2026-${String(i + 1).padStart(6, '0')}`,
    lab: `实验室 ${101 + (i % 10)}`,
    hwCategory: ['HW49 实验室废物', 'HW06 废有机溶剂', 'HW01 医疗废物'][i % 3],
    form: (['液', '固', '气'] as const)[i % 3],
    weight: 2 + (i % 15) * 1.5,
    date: `2026-05-${String((i % 20) + 1).padStart(2, '0')}`,
    reason: ['使用完毕', '过期', '破损', '实验室退出'][i % 4],
    status: ['暂存中', '待转移', '已转出'][i % 3],
  }));
}

export function buildAlerts(): AlertEvent[] {
  const types = ['环境超限', '试剂超期未归还', '视频识别异常', '设备离线', '库存告罄', '准入异常'];
  return Array.from({ length: 25 }, (_, i) => ({
    id: `alert-${i + 1}`,
    level: pick(ALERT_LEVELS, i),
    type: types[i % types.length],
    source: `LH-A${String((i % 6) + 1).padStart(2, '0')} / ${pick(COLLEGES, i)}`,
    time: `2026-05-27 ${8 + (i % 10)}:${20 + i}`,
    status: i % 4 === 0 ? '待处置' : '已处置',
    handler: i % 4 === 0 ? undefined : pick(SAMPLE_NAMES, i),
  }));
}

export function buildLabs(): LabRoom[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: `lab-${i + 1}`,
    name: `实验室 ${201 + i}`,
    college: pick(COLLEGES, i),
    building: `实验楼 ${(i % 5) + 1}`,
    riskLevel: (['一级', '二级', '三级', '四级'] as const)[i % 4],
    score: 60 + (i % 35),
  }));
}

export function buildDashboardStats(): DashboardStats {
  return { bottleCount: 12348, wasteKg: 326, pendingPurchase: 28, weeklyAlerts: 7 };
}

export function buildTodos(): TodoItem[] {
  return [
    { id: 't1', title: '申购单 PO-2026-0028 待院级审批', module: '申购管理', time: '10 分钟前' },
    { id: 't2', title: '隐患工单 #H-1042 待复核', module: '检查与隐患', time: '1 小时前' },
    { id: 't3', title: '危废转移联单 WC-T-008 待签收', module: '转移联单', time: '2 小时前' },
  ];
}

export function buildTransfers(): TransferOrder[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `tr-${i + 1}`,
    orderNo: `TF-2026-${String(i + 1).padStart(4, '0')}`,
    fromWarehouse: `LH-A0${(i % 4) + 1}`,
    toWarehouse: `LH-A0${((i + 2) % 4) + 1}`,
    itemCount: (i % 3) + 2,
    reason: '跨楼宇教学资源共享调拨',
    status: (['申请', '审批', '出库', '在途', '入库确认'] as const)[i % 5],
    applicant: pick(SAMPLE_NAMES, i),
    updatedAt: `2026-05-27 ${10 + i}:30`,
  }));
}

export function buildDiscards(bottles: BottleRecord[]): DiscardItem[] {
  return bottles.filter(b => b.status === '已用完' || b.status === '已报废').slice(0, 12).map((b, i) => ({
    id: `dc-${i + 1}`,
    bottleCode: b.code,
    chemicalName: b.chemicalName,
    reason: ['使用完毕', '过期', '破损'][i % 3],
    status: i % 2 === 0 ? '待报废' : '已转入危废',
  }));
}

export function buildStocktakeDiffs(): StocktakeDiff[] {
  return [
    { id: 'st-1', code: 'LC-2026-000042', bookStatus: '在库', actualStatus: '缺失', diffType: '盘亏' },
    { id: 'st-2', code: 'LC-2026-000088', bookStatus: '领用中', actualStatus: '在库', diffType: '状态异常' },
    { id: 'st-3', code: 'LC-2026-000201', bookStatus: '无账', actualStatus: '在库', diffType: '盘盈' },
  ];
}

export function buildHazardTickets(): HazardTicket[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: `hz-${i + 1}`,
    title: ['通风橱风速不足', '废液桶未密闭', '危化品未双人双锁', '灭火器压力不足'][i % 4],
    lab: `实验室 ${201 + i}`,
    level: i % 3 === 0 ? '重大' : '一般',
    status: (['待整改', '整改中', '复核', '已关闭'] as const)[i % 4],
    reporter: pick(SAMPLE_NAMES, i),
    createdAt: `2026-05-${20 - (i % 10)} 14:00`,
  }));
}

export function buildVisionEvents(): VisionEvent[] {
  return [
    { id: 've-1', camera: '化学楼-201-东', eventType: '未穿实验服', confidence: 0.92, time: '2026-05-27 15:02' },
    { id: 've-2', camera: '材料楼-105-西', eventType: '单人值守违规', confidence: 0.87, time: '2026-05-27 14:48' },
    { id: 've-3', camera: '化学楼-302-中', eventType: '明火疑似', confidence: 0.76, time: '2026-05-27 14:30' },
  ];
}

export function buildEmergencyPlans(): EmergencyPlan[] {
  return ['化学灼伤', '中毒', '火灾', '爆炸', '泄漏', '触电', '辐射'].map((cat, i) => ({
    id: `ep-${i + 1}`,
    category: cat,
    title: `${cat}应急处置预案`,
    contact: `应急值班 ${800 + i}000`,
  }));
}

export function buildTrainingAccess(): TrainingAccessRecord[] {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `ta-${i + 1}`,
    name: pick(SAMPLE_NAMES, i),
    college: pick(COLLEGES, i),
    level: ['特级', '一级', '二级'][i % 3],
    studyHours: 8 + (i % 6) * 2,
    examScore: 72 + (i % 25),
    certExpiry: `2026-${String(12 - (i % 6)).padStart(2, '0')}-30`,
    status: (['已准入', '待考试', '已过期'] as const)[i % 3],
  }));
}

export function buildCourses(): CourseItem[] {
  const cats = ['通识安全', '化学安全', '生物安全', '辐射安全', '消防', '特种设备', '机电'];
  return cats.map((cat, i) => ({
    id: `co-${i + 1}`,
    title: `${cat}培训课程`,
    category: cat,
    progress: [100, 65, 30, 0][i % 4],
    duration: `${45 + i * 10} 分钟`,
  }));
}

export function buildExams(): ExamPaper[] {
  return [
    { id: 'ex-1', title: '化学安全准入考试', questionCount: 30, duration: 45, passScore: 80 },
    { id: 'ex-2', title: '易制毒易制爆专项考', questionCount: 20, duration: 30, passScore: 90 },
  ];
}

export function buildCerts(): CertRecord[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `ce-${i + 1}`,
    holder: pick(SAMPLE_NAMES, i),
    type: '危化品操作准入证',
    expiry: `2026-0${(i % 6) + 1}-15`,
    status: (['有效', '即将到期', '已过期'] as const)[i % 3],
  }));
}

export function buildApprovalTemplates(): ApprovalTemplate[] {
  return [
    { id: 'at-1', name: '申购多级审批', type: '申购审批', nodeCount: 5, enabled: true },
    { id: 'at-2', name: '领用快速审批', type: '领用审批', nodeCount: 2, enabled: true },
    { id: 'at-3', name: '报废审批', type: '报废审批', nodeCount: 3, enabled: true },
    { id: 'at-4', name: '危废转移审批', type: '危废转移审批', nodeCount: 4, enabled: true },
    { id: 'at-5', name: '调拨审批', type: '调拨审批', nodeCount: 3, enabled: false },
  ];
}

export function buildDictEntries(): DictEntry[] {
  const items: DictEntry[] = [];
  HAZARD_CATEGORIES.forEach((c, i) => items.push({ id: `d-h-${i}`, category: '危险类别', code: `H${i}`, label: c }));
  CONTROL_LEVELS.forEach((c, i) => items.push({ id: `d-c-${i}`, category: '管控级别', code: `C${i}`, label: c }));
  ['常温库', '防爆库', '通风柜'].forEach((c, i) => items.push({ id: `d-w-${i}`, category: '库房类型', code: `W${i}`, label: c }));
  return items;
}

export function buildOperationLogs(): OperationLogEntry[] {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `log-${i + 1}`,
    operator: pick(SAMPLE_NAMES, i),
    module: ['领用归还', '申购管理', '危废转移', '远程开柜'][i % 4],
    action: ['领用', '提交审批', '发起联单', '解锁'][i % 4],
    ip: `10.12.${20 + (i % 5)}.${100 + i}`,
    result: '成功',
    time: `2026-05-27 ${9 + (i % 8)}:${10 + i}`,
    detail: JSON.stringify({ bottleCode: `LC-2026-${String(i + 1).padStart(6, '0')}` }),
  }));
}

export function buildWasteTransfers(): WasteTransferSlip[] {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `wt-${i + 1}`,
    slipNo: `WC-T-2026-${String(i + 1).padStart(4, '0')}`,
    producer: '示范大学化学与材料学院',
    receiver: '省危废处置中心（演示）',
    transport: '陕西环保运输公司',
    plateNo: `陕A·${8800 + i}`,
    status: (['草稿', '已发起', '运输中', '已接收'] as const)[i % 4],
    weight: 45 + i * 12,
  }));
}

export function buildHazardMapLinks(): HazardMapLink[] {
  return [
    { from: '浓硫酸', to: '氢氧化钠', relation: '剧烈中和' },
    { from: '乙醇', to: '高锰酸钾', relation: '氧化反应' },
    { from: '丙酮', to: '浓硝酸', relation: '禁混存' },
  ];
}

export interface HcMockStore {
  chemicals: ChemicalCatalog[];
  bottles: BottleRecord[];
  purchases: PurchaseOrder[];
  inboundReviews: ReviewRecord[];
  cabinets: CabinetDevice[];
  wastes: WasteRecord[];
  alerts: AlertEvent[];
  labs: LabRoom[];
  dashboard: DashboardStats;
  todos: TodoItem[];
  transfers: TransferOrder[];
  discards: DiscardItem[];
  stocktakeDiffs: StocktakeDiff[];
  hazardTickets: HazardTicket[];
  visionEvents: VisionEvent[];
  emergencyPlans: EmergencyPlan[];
  trainingAccess: TrainingAccessRecord[];
  courses: CourseItem[];
  exams: ExamPaper[];
  certs: CertRecord[];
  approvalTemplates: ApprovalTemplate[];
  dictEntries: DictEntry[];
  operationLogs: OperationLogEntry[];
  wasteTransfers: WasteTransferSlip[];
  hazardMapLinks: HazardMapLink[];
}

export function createInitialStore(): HcMockStore {
  const chemicals = buildChemicals();
  const bottles = buildBottles(chemicals);
  return {
    chemicals,
    bottles,
    purchases: buildPurchases(),
    inboundReviews: buildInboundReviews(),
    cabinets: buildCabinets(),
    wastes: buildWastes(),
    alerts: buildAlerts(),
    labs: buildLabs(),
    dashboard: buildDashboardStats(),
    todos: buildTodos(),
    transfers: buildTransfers(),
    discards: buildDiscards(bottles),
    stocktakeDiffs: buildStocktakeDiffs(),
    hazardTickets: buildHazardTickets(),
    visionEvents: buildVisionEvents(),
    emergencyPlans: buildEmergencyPlans(),
    courses: buildCourses(),
    exams: buildExams(),
    certs: buildCerts(),
    trainingAccess: buildTrainingAccess(),
    approvalTemplates: buildApprovalTemplates(),
    dictEntries: buildDictEntries(),
    operationLogs: buildOperationLogs(),
    wasteTransfers: buildWasteTransfers(),
    hazardMapLinks: buildHazardMapLinks(),
  };
}
