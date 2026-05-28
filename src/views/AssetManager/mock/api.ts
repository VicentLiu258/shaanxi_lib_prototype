import {
  Asset, CategoryNode, AreaNode, Supplier, OperationLog, User,
  DashboardStats, MonthlyNewAsset, BusinessDistribution, AssetFilter,
  InboundPayload, ReceivePayload, AssetStatus, PurchaseApplication,
  InventoryItem, ScrapRecord, DamageRecord, WarrantyRecord, TransferRecord,
} from '../types';
import {
  MOCK_DATA_KEY, MOCK_CURRENT_USER_KEY, FAKE_DELAY_MIN, FAKE_DELAY_MAX,
  BUSINESS_TYPES, SAMPLE_USERS,
} from './constants';
import { createInitialSeed, resetToSeed, MockDatabase, flattenCategories, flattenAreas } from './seed';

let db: MockDatabase | null = null;
let currentUser: User | null = null;

function delay(ms?: number) {
  const d = ms ?? (FAKE_DELAY_MIN + Math.random() * (FAKE_DELAY_MAX - FAKE_DELAY_MIN));
  return new Promise(res => setTimeout(res, d));
}

function loadDB(): MockDatabase {
  if (db) return db;
  const raw = localStorage.getItem(MOCK_DATA_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<MockDatabase>;
      const seeded = createInitialSeed();
      const shouldBackfillNewModules = (parsed.version ?? 0) < 2;
      // Backward-compatible migration for old localStorage snapshots.
      db = {
        ...seeded,
        ...parsed,
        purchases: parsed.purchases ?? [],
        inventory: parsed.inventory ?? [],
        scraps: parsed.scraps ?? [],
        damages: parsed.damages ?? (shouldBackfillNewModules ? seeded.damages : []),
        warranties: parsed.warranties ?? (shouldBackfillNewModules ? seeded.warranties : []),
        transfers: parsed.transfers ?? (shouldBackfillNewModules ? seeded.transfers : []),
        version: Math.max(parsed.version ?? 1, 2),
      };

      // If previous migration accidentally persisted empty arrays, backfill once.
      if (shouldBackfillNewModules) {
        if (!db.damages?.length) db.damages = seeded.damages;
        if (!db.warranties?.length) db.warranties = seeded.warranties;
        if (!db.transfers?.length) db.transfers = seeded.transfers;
      }

      localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(db));
      return db!;
    } catch { /* fall through */ }
  }
  db = createInitialSeed();
  localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(db));
  return db;
}

function persist() {
  if (db) localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(db));
}

function getCurrentUser(): User {
  if (currentUser) return currentUser;
  const raw = localStorage.getItem(MOCK_CURRENT_USER_KEY);
  if (raw) {
    currentUser = JSON.parse(raw);
    return currentUser!;
  }
  currentUser = SAMPLE_USERS[0];
  localStorage.setItem(MOCK_CURRENT_USER_KEY, JSON.stringify(currentUser));
  return currentUser;
}

function setCurrentUser(u: User) {
  currentUser = u;
  localStorage.setItem(MOCK_CURRENT_USER_KEY, JSON.stringify(u));
}

function addLog(log: Omit<OperationLog, 'id' | 'operateTime' | 'operator'>) {
  const user = getCurrentUser();
  const entry: OperationLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    operator: user.name,
    operateTime: new Date().toISOString(),
    ...log,
  };
  db!.logs.unshift(entry);
  if (db!.logs.length > 600) db!.logs.length = 600;
  persist();
  return entry;
}

export async function getCurrentUserAsync(): Promise<User> {
  await delay(60);
  return getCurrentUser();
}

export async function switchUser(userId: string): Promise<User> {
  await delay(120);
  const user = SAMPLE_USERS.find(u => u.id === userId) || SAMPLE_USERS[0];
  setCurrentUser(user);
  return getCurrentUser();
}

export async function resetDemoData(): Promise<void> {
  await delay(200);
  db = resetToSeed();
  currentUser = null;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay();
  const { assets } = loadDB();
  const total = assets.length;
  const inUse = assets.filter(a => a.status === '在用').length;
  const idle = assets.filter(a => a.status === '闲置').length;
  const maintenanceDue = assets.filter(a => a.nextMaintainDate && a.nextMaintainDate < '2026-06-01').length;
  const totalValue = assets.reduce((s, a) => s + (a.netValue || a.purchasePrice || 0), 0);
  return { total, inUse, idle, maintenanceDue, utilization: Math.round((inUse / total) * 100), totalValue };
}

export async function getMonthlyNewAssets(): Promise<MonthlyNewAsset[]> {
  await delay(180);
  return [
    { month: '2024-06', count: 7 }, { month: '2024-07', count: 11 }, { month: '2024-08', count: 9 },
    { month: '2024-09', count: 14 }, { month: '2024-10', count: 8 }, { month: '2024-11', count: 19 },
    { month: '2024-12', count: 12 }, { month: '2025-01', count: 6 }, { month: '2025-02', count: 15 },
  ];
}

export async function getBusinessDistribution(): Promise<BusinessDistribution[]> {
  await delay(220);
  const { logs } = loadDB();
  const counts: Record<string, number> = {};
  BUSINESS_TYPES.forEach(t => { counts[t] = 0; });
  logs.slice(0, 120).forEach(log => {
    if (log.type === '领用') counts['资产领用']++;
    else if (log.type === '清理报废') counts['清理报废']++;
    else if (log.type === '维保变更' || log.type === '保养') counts['维保变更']++;
    else if (log.type === '报损') counts['资产报损']++;
    else if (log.type === '入库') counts['资产入库']++;
    else if (log.type === '退库') counts['资产退库']++;
    else counts['资产转移']++;
  });
  const total = Object.values(counts).reduce((s, v) => s + v, 0) || 1;
  return BUSINESS_TYPES.map(t => ({
    type: t,
    count: counts[t] || 4,
    percent: Math.round(((counts[t] || 4) / total) * 100),
  }));
}

export async function getRecentLogs(limit = 8): Promise<OperationLog[]> {
  await delay(100);
  return loadDB().logs.slice(0, limit);
}

export async function getAssets(filter: AssetFilter = {}): Promise<Asset[]> {
  await delay();
  let { assets } = loadDB();
  if (filter.keyword) {
    const kw = filter.keyword.toLowerCase();
    assets = assets.filter(a =>
      a.assetNo.toLowerCase().includes(kw) ||
      a.name.toLowerCase().includes(kw) ||
      a.usePerson.toLowerCase().includes(kw)
    );
  }
  if (filter.categoryId) assets = assets.filter(a => a.categoryId === filter.categoryId);
  if (filter.status) assets = assets.filter(a => a.status === filter.status);
  if (filter.useDept) assets = assets.filter(a => a.useDept === filter.useDept);
  if (filter.usePerson) assets = assets.filter(a => a.usePerson.includes(filter.usePerson!));
  if (filter.locationId) assets = assets.filter(a => a.locationId === filter.locationId);
  if (filter.maintenanceDue) {
    assets = assets.filter(a => a.nextMaintainDate && a.nextMaintainDate <= '2026-06-01');
  }
  return [...assets].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getAssetById(id: string): Promise<Asset | undefined> {
  await delay(90);
  return loadDB().assets.find(a => a.id === id);
}

export async function getAssetLogs(assetId: string): Promise<OperationLog[]> {
  await delay(110);
  return loadDB().logs.filter(l => l.assetId === assetId).slice(0, 30);
}

export async function getAllLogs(limit = 50): Promise<OperationLog[]> {
  await delay(100);
  return loadDB().logs.slice(0, limit);
}

export async function createAssetInbound(payload: InboundPayload): Promise<Asset> {
  await delay(450);
  const dbNow = loadDB();
  const flatCats = flattenCategories(dbNow.categories).filter(c => c.level >= 1);
  const flatAreas = flattenAreas(dbNow.areas);
  const cat = flatCats.find(c => c.id === payload.categoryId)!;
  const sup = dbNow.suppliers.find(s => s.id === payload.supplierId)!;
  const area = flatAreas.find(a => a.id === payload.locationId)!;
  const assetNo = payload.assetNo || `GD-${new Date().getFullYear()}${String(120 + dbNow.assets.length).padStart(3, '0')}`;

  const newAsset: Asset = {
    id: 'ast_new_' + Date.now(),
    assetNo, name: payload.name,
    categoryId: cat.id, categoryName: cat.name,
    modelSpec: payload.modelSpec, status: '闲置',
    useOrg: '陕西实验室', useDept: payload.useDept, usePerson: payload.usePerson,
    locationId: area.id, locationPath: area.fullPath,
    supplierId: sup.id, supplierName: sup.name,
    purchasePrice: payload.purchasePrice, purchaseDate: payload.purchaseDate,
    originalValue: payload.purchasePrice, netValue: payload.purchasePrice,
    depreciationPeriod: 60,
    maintenanceContract: payload.maintenanceContract, maintenanceEnd: payload.maintenanceEnd,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
  dbNow.assets.unshift(newAsset);
  addLog({
    assetId: newAsset.id, assetNo: newAsset.assetNo, assetName: newAsset.name,
    type: '入库', afterStatus: '闲置',
    remark: `购入价 ${payload.purchasePrice}元，存放 ${area.fullPath}`,
  });
  persist();
  return newAsset;
}

export async function updateAssetStatus(
  id: string, newStatus: AssetStatus,
  extra?: { remark?: string; targetPerson?: string; targetDept?: string },
): Promise<Asset> {
  await delay(320);
  const dbNow = loadDB();
  const asset = dbNow.assets.find(a => a.id === id);
  if (!asset) throw new Error('资产不存在');
  const old = asset.status;
  asset.status = newStatus;
  asset.updatedAt = new Date().toISOString();
  addLog({
    assetId: asset.id, assetNo: asset.assetNo, assetName: asset.name,
    type: extra?.remark?.includes('领用') ? '领用' : (newStatus === '已报废' ? '清理报废' : '资产变更'),
    beforeStatus: old, afterStatus: newStatus,
    remark: extra?.remark, targetPerson: extra?.targetPerson, targetDept: extra?.targetDept,
  });
  persist();
  return { ...asset };
}

export async function batchReceive(payload: ReceivePayload): Promise<{ updated: number }> {
  await delay(580);
  const dbNow = loadDB();
  let updated = 0;
  payload.assetIds.forEach(id => {
    const asset = dbNow.assets.find(a => a.id === id);
    if (asset && asset.status === '闲置') {
      const old = asset.status;
      asset.status = '在用';
      asset.usePerson = payload.receiver;
      asset.useDept = payload.receiveDept;
      asset.updatedAt = new Date().toISOString();
      updated++;
      addLog({
        assetId: asset.id, assetNo: asset.assetNo, assetName: asset.name,
        type: '领用', beforeStatus: old, afterStatus: '在用',
        remark: `预计归还 ${payload.expectedReturnDate} ${payload.remark || ''}`,
        targetPerson: payload.receiver, targetDept: payload.receiveDept,
      });
    }
  });
  persist();
  return { updated };
}

export async function getCategories(): Promise<CategoryNode[]> {
  await delay(70);
  return loadDB().categories;
}

export async function getAreas(): Promise<AreaNode[]> {
  await delay(70);
  return loadDB().areas;
}

export async function getSuppliers(): Promise<Supplier[]> {
  await delay(60);
  return loadDB().suppliers;
}

export async function addSupplier(s: Omit<Supplier, 'id' | 'createdAt'>): Promise<Supplier> {
  await delay(210);
  const dbNow = loadDB();
  const news: Supplier = { ...s, id: 'sup_' + Date.now().toString(36), createdAt: new Date().toISOString().slice(0, 10) };
  dbNow.suppliers.push(news);
  persist();
  return news;
}

export async function getPurchases(): Promise<PurchaseApplication[]> {
  await delay(80);
  return loadDB().purchases;
}

export async function updatePurchaseStatus(id: string, status: PurchaseApplication['status']): Promise<void> {
  await delay(200);
  const dbNow = loadDB();
  const p = dbNow.purchases.find(x => x.id === id);
  if (p) { p.status = status; persist(); }
}

export async function getInventoryItems(): Promise<InventoryItem[]> {
  await delay(80);
  return loadDB().inventory;
}

export async function scanInventoryItem(id: string): Promise<InventoryItem | null> {
  await delay(300);
  const dbNow = loadDB();
  const item = dbNow.inventory.find(i => i.id === id);
  if (item && item.status === '未盘') {
    item.status = '已盘';
    persist();
    return item;
  }
  return null;
}

export async function getScrapRecords(): Promise<ScrapRecord[]> {
  await delay(80);
  return loadDB().scraps ?? [];
}

export async function getDamageRecords(): Promise<DamageRecord[]> {
  await delay(80);
  return loadDB().damages ?? [];
}

export async function createDamageRecord(payload: {
  assetId: string;
  reason: string;
  reporter: string;
  note?: string;
}): Promise<DamageRecord> {
  await delay(180);
  const dbNow = loadDB();
  const asset = dbNow.assets.find(a => a.id === payload.assetId);
  if (!asset) throw new Error('资产不存在');
  const rec: DamageRecord = {
    id: 'DM-' + Date.now().toString().slice(-6),
    assetId: asset.id,
    assetNo: asset.assetNo,
    assetName: asset.name,
    reason: payload.reason,
    reporter: payload.reporter,
    reportDate: new Date().toISOString().slice(0, 10),
    status: '待审批',
    note: payload.note,
  };
  dbNow.damages.unshift(rec);
  addLog({
    assetId: asset.id, assetNo: asset.assetNo, assetName: asset.name,
    type: '报损',
    beforeStatus: asset.status,
    afterStatus: asset.status,
    remark: `发起报损：${payload.reason}`,
  });
  persist();
  return rec;
}

export async function approveDamageRecord(id: string, approved: boolean): Promise<void> {
  await delay(180);
  const dbNow = loadDB();
  const rec = dbNow.damages.find(d => d.id === id);
  if (!rec) throw new Error('报损记录不存在');
  rec.status = approved ? '已通过' : '已驳回';
  const asset = dbNow.assets.find(a => a.id === rec.assetId);
  if (asset) {
    const old = asset.status;
    if (approved) asset.status = '维保中';
    asset.updatedAt = new Date().toISOString();
    addLog({
      assetId: asset.id, assetNo: asset.assetNo, assetName: asset.name,
      type: '报损',
      beforeStatus: old,
      afterStatus: asset.status,
      remark: approved ? '报损审批通过，转入维保中' : '报损审批驳回',
    });
  }
  persist();
}

export async function getWarrantyRecords(): Promise<WarrantyRecord[]> {
  await delay(80);
  return loadDB().warranties ?? [];
}

export async function createWarrantyRecord(payload: {
  assetId: string;
  issue: string;
  vendor: string;
  requester: string;
  note?: string;
}): Promise<WarrantyRecord> {
  await delay(180);
  const dbNow = loadDB();
  const asset = dbNow.assets.find(a => a.id === payload.assetId);
  if (!asset) throw new Error('资产不存在');
  const rec: WarrantyRecord = {
    id: 'WR-' + Date.now().toString().slice(-6),
    assetId: asset.id,
    assetNo: asset.assetNo,
    assetName: asset.name,
    issue: payload.issue,
    vendor: payload.vendor,
    requester: payload.requester,
    requestDate: new Date().toISOString().slice(0, 10),
    status: '待处理',
    note: payload.note,
  };
  dbNow.warranties.unshift(rec);
  const old = asset.status;
  asset.status = '维保中';
  asset.updatedAt = new Date().toISOString();
  addLog({
    assetId: asset.id, assetNo: asset.assetNo, assetName: asset.name,
    type: '维保变更',
    beforeStatus: old,
    afterStatus: asset.status,
    remark: `发起保修：${payload.issue}`,
  });
  persist();
  return rec;
}

export async function progressWarrantyRecord(id: string, status: WarrantyRecord['status']): Promise<void> {
  await delay(180);
  const dbNow = loadDB();
  const rec = dbNow.warranties.find(w => w.id === id);
  if (!rec) throw new Error('保修记录不存在');
  rec.status = status;
  const asset = dbNow.assets.find(a => a.id === rec.assetId);
  if (asset) {
    const old = asset.status;
    if (status === '已完成') {
      asset.status = '在用';
      asset.lastMaintainDate = new Date().toISOString().slice(0, 10);
      const next = new Date();
      next.setMonth(next.getMonth() + 6);
      asset.nextMaintainDate = next.toISOString().slice(0, 10);
    } else if (status === '维修中') {
      asset.status = '维保中';
    }
    asset.updatedAt = new Date().toISOString();
    addLog({
      assetId: asset.id, assetNo: asset.assetNo, assetName: asset.name,
      type: status === '已完成' ? '保养' : '维保变更',
      beforeStatus: old,
      afterStatus: asset.status,
      remark: status === '已完成' ? '保修完成，恢复在用' : '保修处理中',
    });
  }
  persist();
}

export async function getTransferRecords(): Promise<TransferRecord[]> {
  await delay(80);
  return loadDB().transfers ?? [];
}

export async function createTransferRecord(payload: {
  assetId: string;
  toDept: string;
  toLocationId: string;
  toLocationPath: string;
  requester: string;
  note?: string;
}): Promise<TransferRecord> {
  await delay(180);
  const dbNow = loadDB();
  const asset = dbNow.assets.find(a => a.id === payload.assetId);
  if (!asset) throw new Error('资产不存在');
  const rec: TransferRecord = {
    id: 'TR-' + Date.now().toString().slice(-6),
    assetId: asset.id,
    assetNo: asset.assetNo,
    assetName: asset.name,
    fromDept: asset.useDept,
    toDept: payload.toDept,
    fromLocation: asset.locationPath,
    toLocationId: payload.toLocationId,
    toLocationPath: payload.toLocationPath,
    requester: payload.requester,
    requestDate: new Date().toISOString().slice(0, 10),
    status: '待确认',
    note: payload.note,
  };
  dbNow.transfers.unshift(rec);
  addLog({
    assetId: asset.id, assetNo: asset.assetNo, assetName: asset.name,
    type: '转移',
    beforeStatus: asset.status,
    afterStatus: asset.status,
    remark: `发起转移：${asset.useDept} -> ${payload.toDept}`,
  });
  persist();
  return rec;
}

export async function completeTransferRecord(id: string, cancel = false): Promise<void> {
  await delay(180);
  const dbNow = loadDB();
  const rec = dbNow.transfers.find(t => t.id === id);
  if (!rec) throw new Error('转移记录不存在');
  rec.status = cancel ? '已取消' : '已完成';
  const asset = dbNow.assets.find(a => a.id === rec.assetId);
  if (asset && !cancel) {
    asset.useDept = rec.toDept;
    asset.locationId = rec.toLocationId;
    asset.locationPath = rec.toLocationPath;
    asset.updatedAt = new Date().toISOString();
    addLog({
      assetId: asset.id, assetNo: asset.assetNo, assetName: asset.name,
      type: '转移',
      beforeStatus: asset.status,
      afterStatus: asset.status,
      targetDept: rec.toDept,
      remark: `资产转移完成：${rec.fromLocation} -> ${rec.toLocationPath}`,
    });
  }
  persist();
}

export async function importAssetsFromRows(rows: Record<string, unknown>[]): Promise<{ added: number; errors: string[] }> {
  await delay(600);
  const dbNow = loadDB();
  let added = 0;
  const errors: string[] = [];
  rows.forEach((r, idx) => {
    const name = r['资产名称'] || r['name'];
    const categoryName = r['分类'] || r['categoryName'];
    if (!name || !categoryName) { errors.push(`第${idx + 1}行：名称或分类缺失`); return; }
    const price = Number(r['购入价格'] || r['purchasePrice']) || 0;
    dbNow.assets.unshift({
      id: 'imp_' + Date.now() + idx,
      assetNo: String(r['资产编号'] || r['assetNo'] || `IMP-${Date.now().toString().slice(-6)}`),
      name: String(name),
      categoryId: 'cat_00101', categoryName: String(categoryName),
      modelSpec: String(r['规格型号'] || r['modelSpec'] || '导入型号'),
      status: '闲置', useOrg: '陕西实验室',
      useDept: String(r['使用部门'] || r['useDept'] || '仓储部'),
      usePerson: String(r['使用人'] || r['usePerson'] || '系统导入'),
      locationId: 'area_bio_f3_302',
      locationPath: String(r['存放位置'] || r['locationPath'] || '陕西实验室/生物研发一馆/3层/302室'),
      purchasePrice: price, originalValue: price, netValue: price, depreciationPeriod: 60,
      purchaseDate: String(r['购入日期'] || r['purchaseDate'] || '2024-12-01'),
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    added++;
  });
  if (added > 0) {
    addLog({ assetId: 'batch', assetNo: '-', assetName: '批量导入', type: '入库', remark: `通过Excel成功导入 ${added} 条资产` });
  }
  persist();
  return { added, errors };
}

export function exportAssetsToXlsxData(assets: Asset[]) {
  return assets.map(a => ({
    资产编号: a.assetNo, 资产名称: a.name, 分类: a.categoryName,
    规格型号: a.modelSpec, 状态: a.status, 使用部门: a.useDept,
    使用人: a.usePerson, 存放位置: a.locationPath, 供应商: a.supplierName || '',
    购入价格: a.purchasePrice || '', 净值: a.netValue || '', 购入日期: a.purchaseDate || '',
  }));
}

export async function getCategoryStats(): Promise<Array<{ category: string; count: number; value: number }>> {
  await delay(150);
  const { assets } = loadDB();
  const map = new Map<string, { count: number; value: number }>();
  assets.forEach(a => {
    const key = a.categoryName;
    const cur = map.get(key) || { count: 0, value: 0 };
    cur.count++;
    cur.value += a.netValue || a.purchasePrice || 0;
    map.set(key, cur);
  });
  return Array.from(map.entries()).map(([category, { count, value }]) => ({ category, count, value }));
}
