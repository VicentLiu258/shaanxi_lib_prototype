import { nanoid } from 'nanoid';
import {
  Asset, CategoryNode, AreaNode, Supplier, OperationLog, User,
  AssetStatus, OperationType, PurchaseApplication, InventoryItem, ScrapRecord,
  DamageRecord, WarrantyRecord, TransferRecord,
} from '../types';
import { DEPARTMENTS, SAMPLE_USERS } from './constants';

let seedCounter = 0;
function nextId(prefix: string) {
  seedCounter += 1;
  return `${prefix}_${seedCounter}_${nanoid(6)}`;
}

export function buildCategoryTree(): CategoryNode[] {
  return [{
    id: 'cat_root', name: '全部资产', code: '000', level: 0,
    children: [
      {
        id: 'cat_001', name: '仪器设备', code: '001', parentId: 'cat_root', level: 1,
        children: [
          { id: 'cat_00101', name: '分析检测仪器', code: '00101', parentId: 'cat_001', level: 2, children: [] },
          { id: 'cat_00102', name: '生命科学仪器', code: '00102', parentId: 'cat_001', level: 2, children: [] },
          { id: 'cat_00103', name: '物理测量仪器', code: '00103', parentId: 'cat_001', level: 2, children: [] },
        ],
      },
      {
        id: 'cat_002', name: '电子设备', code: '002', parentId: 'cat_root', level: 1,
        children: [
          { id: 'cat_00201', name: '电脑及外设', code: '00201', parentId: 'cat_002', level: 2, children: [] },
          { id: 'cat_00202', name: '网络及服务器', code: '00202', parentId: 'cat_002', level: 2, children: [] },
        ],
      },
      {
        id: 'cat_003', name: '家具', code: '003', parentId: 'cat_root', level: 1,
        children: [
          { id: 'cat_00301', name: '实验台柜', code: '00301', parentId: 'cat_003', level: 2, children: [] },
          { id: 'cat_00302', name: '办公桌椅', code: '00302', parentId: 'cat_003', level: 2, children: [] },
        ],
      },
      { id: 'cat_004', name: '安防监控', code: '004', parentId: 'cat_root', level: 1, children: [] },
      { id: 'cat_005', name: '其他', code: '005', parentId: 'cat_root', level: 1, children: [] },
    ],
  }];
}

export function buildAreaTree(): AreaNode[] {
  return [{
    id: 'area_lab', name: '陕西实验室', code: 'LAB', level: 1, fullPath: '陕西实验室',
    children: [
      {
        id: 'area_bio', name: '生物研发一馆', code: 'BIO', parentId: 'area_lab', level: 2, fullPath: '陕西实验室/生物研发一馆',
        children: [
          {
            id: 'area_bio_f3', name: '3层', code: 'F3', parentId: 'area_bio', level: 3, fullPath: '陕西实验室/生物研发一馆/3层',
            children: [
              { id: 'area_bio_f3_302', name: '302室', code: '302', parentId: 'area_bio_f3', level: 4, fullPath: '陕西实验室/生物研发一馆/3层/302室' },
              { id: 'area_bio_f3_305', name: '305室', code: '305', parentId: 'area_bio_f3', level: 4, fullPath: '陕西实验室/生物研发一馆/3层/305室' },
            ],
          },
        ],
      },
      {
        id: 'area_chem', name: '先进化学分析室', code: 'CHEM', parentId: 'area_lab', level: 2, fullPath: '陕西实验室/先进化学分析室',
        children: [
          {
            id: 'area_chem_f1', name: '1层', code: 'F1', parentId: 'area_chem', level: 3, fullPath: '陕西实验室/先进化学分析室/1层',
            children: [
              { id: 'area_chem_f1_105', name: '105室', code: '105', parentId: 'area_chem_f1', level: 4, fullPath: '陕西实验室/先进化学分析室/1层/105室' },
            ],
          },
        ],
      },
      {
        id: 'area_phy', name: '物理实验中心', code: 'PHY', parentId: 'area_lab', level: 2, fullPath: '陕西实验室/物理实验中心',
        children: [
          {
            id: 'area_phy_f2', name: '2层', code: 'F2', parentId: 'area_phy', level: 3, fullPath: '陕西实验室/物理实验中心/2层',
            children: [
              { id: 'area_phy_f2_201', name: '201室', code: '201', parentId: 'area_phy_f2', level: 4, fullPath: '陕西实验室/物理实验中心/2层/201室' },
            ],
          },
        ],
      },
      {
        id: 'area_it', name: '数据中心', code: 'IT', parentId: 'area_lab', level: 2, fullPath: '陕西实验室/数据中心',
        children: [
          { id: 'area_it_room', name: '机房', code: 'RM', parentId: 'area_it', level: 3, fullPath: '陕西实验室/数据中心/机房', children: [] },
        ],
      },
    ],
  }];
}

export function buildSuppliers(): Supplier[] {
  return [
    { id: 'sup_001', name: 'Beckman Coulter', contact: '张经理', phone: '010-8288xxxx', address: '北京市', status: '启用', createdAt: '2024-01-10' },
    { id: 'sup_002', name: 'Sartorius 赛多利斯', contact: '李总监', phone: '021-6103xxxx', address: '上海市', status: '启用', createdAt: '2024-02-15' },
    { id: 'sup_003', name: 'Thermo Fisher 赛默飞', contact: '王先生', phone: '021-6865xxxx', address: '上海市', status: '启用', createdAt: '2023-11-20' },
    { id: 'sup_004', name: '陕西计量检测院', contact: '赵女士', phone: '029-8550xxxx', address: '西安市', status: '启用', createdAt: '2024-03-01' },
    { id: 'sup_005', name: '联想（北京）有限公司', contact: '孙工', phone: '010-5885xxxx', address: '北京市', status: '启用', createdAt: '2023-08-12' },
  ];
}

export function flattenCategories(tree: CategoryNode[]): CategoryNode[] {
  const list: CategoryNode[] = [];
  function walk(nodes: CategoryNode[]) {
    nodes.forEach(n => { list.push(n); if (n.children?.length) walk(n.children); });
  }
  walk(tree);
  return list;
}

export function flattenAreas(tree: AreaNode[]): AreaNode[] {
  const list: AreaNode[] = [];
  function walk(nodes: AreaNode[]) {
    nodes.forEach(n => { list.push(n); if (n.children?.length) walk(n.children); });
  }
  walk(tree);
  return list;
}

function randomFrom<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export function generateAssets(cats: CategoryNode[], areas: AreaNode[], suppliers: Supplier[]): Asset[] {
  const flatCats = flattenCategories(cats).filter(c => c.level >= 2);
  const flatAreas = flattenAreas(areas).filter(a => a.level === 4);
  const statuses: AssetStatus[] = ['闲置', '在用', '维保中', '借用中', '已报废'];
  const names = [
    '高速离心机', '电子分析天平', '紫外可见分光光度计', 'PCR扩增仪', '荧光显微镜',
    'ThinkPad X1 Carbon', 'Dell OptiPlex 7090', '华为 MateStation', 'HP LaserJet Pro',
    'CNC五轴加工中心', '三坐标测量仪', 'UPS不间断电源', '网络核心交换机',
    '人体工学实验椅', '通风柜组', '投影仪会议系统', '服务器机柜', '条码打印机',
    '原子吸收光谱仪', '气相色谱仪', '液相色谱仪', '恒温培养箱',
  ];
  const persons = ['王教授', '赵教授', '李研究员', '张伟', '刘芳', '陈明', '杨静', '周杰'];

  return Array.from({ length: 85 }, (_, i) => {
    const cat = randomFrom(flatCats, i + 7);
    const area = randomFrom(flatAreas, i * 3 + 11);
    const sup = randomFrom(suppliers, i + 2);
    const status = statuses[i % statuses.length];
    const dept = randomFrom(DEPARTMENTS, i + 5);
    const price = Math.round((2800 + (i % 7) * 4200) / 100) * 100;
    const purchaseDate = `2023-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}`;
    const created = `2024-${String((i % 9) + 1).padStart(2, '0')}-15`;
    const depreciationPeriod = 48 + (i % 3) * 12;
    const monthsUsed = Math.min(24, i % 30);
    const monthlyDep = Math.round(price / depreciationPeriod);
    const netValue = Math.max(0, price - monthlyDep * monthsUsed);

    return {
      id: nextId('ast'),
      assetNo: `GD-${2024}${(100 + i).toString().padStart(3, '0')}`,
      name: names[i % names.length],
      categoryId: cat.id,
      categoryName: cat.name,
      modelSpec: `${cat.name} 标准配置 ${2023 + (i % 3)}`,
      status,
      useOrg: '陕西实验室',
      useDept: dept,
      usePerson: randomFrom(persons, i),
      locationId: area.id,
      locationPath: area.fullPath,
      supplierId: sup.id,
      supplierName: sup.name,
      purchasePrice: price,
      purchaseDate,
      originalValue: price,
      netValue,
      depreciationPeriod,
      maintenanceContract: i % 3 === 0 ? '年度维保合同-2024' : undefined,
      maintenanceEnd: i % 3 === 0 ? '2025-02-28' : undefined,
      nextMaintainDate: i % 4 === 0 ? '2025-04-01' : undefined,
      remarks: i % 7 === 0 ? '重点设备，已投保' : undefined,
      createdAt: created,
      updatedAt: created,
    };
  });
}

export function generateLogs(assets: Asset[], users: User[]): OperationLog[] {
  const logs: OperationLog[] = [];
  const ops: OperationType[] = ['入库', '领用', '退库', '借用', '归还', '转移', '保养', '维保变更', '报损'];
  const baseDate = new Date('2024-06-01');

  assets.forEach((asset, idx) => {
    const opCount = 2 + (idx % 4);
    for (let k = 0; k < opCount; k++) {
      const op = ops[(idx + k) % ops.length];
      const daysAgo = 30 + k * 18 + (idx % 11);
      logs.push({
        id: nextId('log'),
        assetId: asset.id,
        assetNo: asset.assetNo,
        assetName: asset.name,
        type: op,
        operator: users[(idx + k) % users.length].name,
        operateTime: new Date(baseDate.getTime() - daysAgo * 86400000).toISOString(),
        remark: op === '领用' ? `领用给${asset.usePerson}` : op === '入库' ? '首次入库登记' : undefined,
        beforeStatus: k === 0 ? '闲置' : asset.status,
        afterStatus: asset.status,
      });
    }
  });

  logs.push({
    id: nextId('log'), assetId: assets[0].id, assetNo: assets[0].assetNo, assetName: assets[0].name,
    type: '盘点', operator: '张明', operateTime: new Date(Date.now() - 3600000 * 5).toISOString(),
    remark: '2024年度资产盘点 - 正常',
  });

  return logs.sort((a, b) => b.operateTime.localeCompare(a.operateTime));
}

export function buildPurchaseApplications(): PurchaseApplication[] {
  return [
    { id: 'PA-001', title: '生物研发部离心机采购', applicant: '王教授', dept: '生物研发部', amount: 120000, status: '待审批', applyDate: '2026-05-20', items: '高速离心机 × 1' },
    { id: 'PA-002', title: '化学分析室天平更新', applicant: '赵教授', dept: '化学分析部', amount: 45000, status: '已通过', applyDate: '2026-05-15', items: '电子分析天平 × 2' },
    { id: 'PA-003', title: 'IT运维部服务器扩容', applicant: '王强', dept: 'IT运维部', amount: 86000, status: '待审批', applyDate: '2026-05-22', items: '金蝶云服务器 × 1' },
    { id: 'PA-004', title: '物理实验中心示波器', applicant: '李研究员', dept: '物理实验部', amount: 32000, status: '已驳回', applyDate: '2026-05-10', items: '数字示波器 × 3' },
  ];
}

export function buildInventoryItems(assets: Asset[]): InventoryItem[] {
  return assets.slice(0, 12).map((a, i) => ({
    id: a.id,
    assetNo: a.assetNo,
    name: a.name,
    location: a.locationPath,
    status: i < 8 ? '已盘' : '未盘',
  }));
}

export function buildScrapRecords(assets: Asset[]): ScrapRecord[] {
  const scrapped = assets.filter(a => a.status === '已报废').slice(0, 5);
  return scrapped.map((a, i) => ({
    id: `SC-${i + 1}`,
    assetNo: a.assetNo,
    name: a.name,
    reason: ['设备老化', '维修成本过高', '技术淘汰', '损坏无法修复'][i % 4],
    applyDate: '2026-04-' + String(10 + i).padStart(2, '0'),
    status: i < 2 ? '待审批' : '已通过',
    originalValue: a.originalValue || a.purchasePrice || 0,
  }));
}

export function buildDamageRecords(assets: Asset[]): DamageRecord[] {
  const pick = assets.filter(a => a.status !== '已报废').slice(3, 8);
  return pick.map((a, i) => ({
    id: `DM-${i + 1}`,
    assetId: a.id,
    assetNo: a.assetNo,
    assetName: a.name,
    reason: ['外壳损坏', '精度异常', '关键部件磨损', '电路故障'][i % 4],
    reporter: ['王教授', '张伟', '李研究员'][i % 3],
    reportDate: `2026-05-${String(10 + i).padStart(2, '0')}`,
    status: i < 2 ? '待审批' : '已通过',
    note: i % 2 === 0 ? '建议尽快处理' : undefined,
  }));
}

export function buildWarrantyRecords(assets: Asset[]): WarrantyRecord[] {
  const pick = assets.filter(a => a.status !== '已报废').slice(8, 13);
  return pick.map((a, i) => ({
    id: `WR-${i + 1}`,
    assetId: a.id,
    assetNo: a.assetNo,
    assetName: a.name,
    issue: ['启动失败', '温控异常', '数据采集中断', '噪音偏高'][i % 4],
    vendor: a.supplierName || '原厂',
    requester: ['赵教授', '陈明', '杨静'][i % 3],
    requestDate: `2026-05-${String(5 + i).padStart(2, '0')}`,
    status: i === 0 ? '维修中' : (i === 1 ? '已完成' : '待处理'),
    note: i === 1 ? '已更换故障模块' : undefined,
  }));
}

export function buildTransferRecords(assets: Asset[]): TransferRecord[] {
  const pick = assets.filter(a => a.status === '在用' || a.status === '闲置').slice(0, 6);
  return pick.map((a, i) => ({
    id: `TR-${i + 1}`,
    assetId: a.id,
    assetNo: a.assetNo,
    assetName: a.name,
    fromDept: a.useDept,
    toDept: DEPARTMENTS[(i + 2) % DEPARTMENTS.length],
    fromLocation: a.locationPath,
    toLocationId: 'area_phy_f2_201',
    toLocationPath: '陕西实验室/物理实验中心/2层/201室',
    requester: ['王强', '刘芳', '周杰'][i % 3],
    requestDate: `2026-05-${String(12 + i).padStart(2, '0')}`,
    status: i < 2 ? '待确认' : '已完成',
    note: i % 2 ? '教学任务调整' : undefined,
  }));
}

export interface MockDatabase {
  assets: Asset[];
  categories: CategoryNode[];
  areas: AreaNode[];
  suppliers: Supplier[];
  logs: OperationLog[];
  users: User[];
  purchases: PurchaseApplication[];
  inventory: InventoryItem[];
  scraps: ScrapRecord[];
  damages: DamageRecord[];
  warranties: WarrantyRecord[];
  transfers: TransferRecord[];
  version: number;
}

export function createInitialSeed(): MockDatabase {
  const categories = buildCategoryTree();
  const areas = buildAreaTree();
  const suppliers = buildSuppliers();
  const users: User[] = SAMPLE_USERS.map(u => ({ ...u, phone: '138****' + (1000 + parseInt(u.id.slice(-1)) * 3) }));
  const assets = generateAssets(categories, areas, suppliers);
  const logs = generateLogs(assets, users);

  return {
    assets, categories, areas, suppliers, logs, users,
    purchases: buildPurchaseApplications(),
    inventory: buildInventoryItems(assets),
    scraps: buildScrapRecords(assets),
    damages: buildDamageRecords(assets),
    warranties: buildWarrantyRecords(assets),
    transfers: buildTransferRecords(assets),
    version: 1,
  };
}

export function resetToSeed(): MockDatabase {
  const db = createInitialSeed();
  localStorage.setItem('shaanxi-asset-mock-data-v1', JSON.stringify(db));
  localStorage.removeItem('shaanxi-asset-current-user');
  return db;
}
