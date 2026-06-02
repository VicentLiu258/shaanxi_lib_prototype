import { HcMockStore, createInitialStore } from './seed';
import { HC_MOCK_DATA_KEY, HC_CURRENT_USER_KEY, SAMPLE_HC_USERS, FAKE_DELAY } from './constants';
import {
  HcUser, ReviewRecord, DemoScenarioId, DemoRunResult,
  BottleRecord, ConsumableInventoryItem, TerminalBatchItem, TerminalMode,
} from '../types';
import { executeDemoScenario } from './demoActions';

function delay<T>(data: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), FAKE_DELAY()));
}

function ensureBottleWeights(bottle: BottleRecord, index: number): BottleRecord {
  const specValue = Number(bottle.spec.match(/\d+/)?.[0] || 500);
  const initialWeight = bottle.initialWeight ?? specValue + 86 + (index % 6) * 4;
  const currentWeight = bottle.currentWeight ?? (
    bottle.status === '已用完'
      ? 0
      : bottle.status === '领用中'
        ? Math.max(18, initialWeight - 70 - (index % 9) * 8)
        : bottle.status === '已报废'
          ? Math.max(0, initialWeight - 120 - (index % 7) * 12)
          : initialWeight - (index % 5) * 6
  );
  return {
    ...bottle,
    initialWeight,
    currentWeight,
    weightUnit: bottle.weightUnit ?? 'g',
    lastBorrowWeight: bottle.lastBorrowWeight ?? (bottle.status === '领用中' ? currentWeight : undefined),
    lastReturnWeight: bottle.lastReturnWeight ?? (bottle.status === '在库' ? currentWeight : undefined),
  };
}

function ensureConsumableDetails(
  item: ConsumableInventoryItem,
  index: number,
  freshRows: ConsumableInventoryItem[],
): ConsumableInventoryItem {
  const fallback = freshRows.find(row => row.code === item.code) || freshRows[index % freshRows.length];
  return { ...fallback, ...item } as ConsumableInventoryItem;
}

function normalizeStore(parsed: Partial<HcMockStore>): HcMockStore {
  const fresh = createInitialStore();
  const store = { ...fresh, ...parsed } as HcMockStore;
  store.bottles = (store.bottles || fresh.bottles).map(ensureBottleWeights);
  store.consumables = (store.consumables || fresh.consumables).map((item, index) => (
    ensureConsumableDetails(item, index, fresh.consumables)
  ));
  store.reagentOperations = store.reagentOperations || fresh.reagentOperations;
  return store;
}

function loadStore(): HcMockStore {
  const raw = localStorage.getItem(HC_MOCK_DATA_KEY);
  if (raw) {
    const parsed = JSON.parse(raw) as Partial<HcMockStore>;
    if (!parsed.transfers) {
      const fresh = createInitialStore();
      localStorage.setItem(HC_MOCK_DATA_KEY, JSON.stringify(fresh));
      return fresh;
    }
    const store = normalizeStore(parsed);
    saveStore(store);
    return store;
  }
  const store = createInitialStore();
  localStorage.setItem(HC_MOCK_DATA_KEY, JSON.stringify(store));
  return store;
}

function saveStore(store: HcMockStore) {
  localStorage.setItem(HC_MOCK_DATA_KEY, JSON.stringify(store));
}

export async function resetDemoData(): Promise<void> {
  localStorage.removeItem(HC_MOCK_DATA_KEY);
  createInitialStore();
  localStorage.setItem(HC_MOCK_DATA_KEY, JSON.stringify(createInitialStore()));
}

export async function getCurrentUserAsync(): Promise<HcUser> {
  const id = localStorage.getItem(HC_CURRENT_USER_KEY) || 'hc-u1';
  const u = SAMPLE_HC_USERS.find(x => x.id === id) || SAMPLE_HC_USERS[0];
  return delay(u);
}

export async function switchUser(userId: string): Promise<HcUser> {
  localStorage.setItem(HC_CURRENT_USER_KEY, userId);
  return getCurrentUserAsync();
}

export async function getDashboardStats() {
  return delay(loadStore().dashboard);
}

export async function getChemicals() {
  return delay(loadStore().chemicals);
}

export async function getBottles() {
  return delay(loadStore().bottles);
}

export async function getConsumables() {
  return delay(loadStore().consumables);
}

export async function getReagentOperations() {
  return delay(loadStore().reagentOperations);
}

export async function getPurchases() {
  return delay(loadStore().purchases);
}

export async function getInboundReviews() {
  return delay(loadStore().inboundReviews);
}

export async function getCabinets() {
  return delay(loadStore().cabinets);
}

export async function getWastes() {
  return delay(loadStore().wastes);
}

export async function getAlerts() {
  return delay(loadStore().alerts);
}

export async function getLabs() {
  return delay(loadStore().labs);
}

export async function getTodos() {
  return delay(loadStore().todos);
}

export async function updateInboundReview(id: string, status: '审核通过' | '不通过', opinion: string) {
  const store = loadStore();
  store.inboundReviews = store.inboundReviews.map(r =>
    r.id === id ? { ...r, status, auditOpinion: opinion, auditTime: new Date().toLocaleString() } : r,
  );
  saveStore(store);
  return delay(true);
}

export async function getBottleByCode(code: string) {
  const store = loadStore();
  return delay(store.bottles.find(b => b.code === code) || null);
}

export async function processTerminalBatch(
  mode: TerminalMode,
  items: TerminalBatchItem[],
  operator = '张明',
) {
  const store = loadStore();
  const batchNo = `TERM-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(store.reagentOperations.length + 1).padStart(3, '0')}`;
  const now = new Date().toLocaleString();
  const updatedCodes: string[] = [];

  items.forEach(item => {
    const bottle = store.bottles.find(b => b.code === item.code);
    if (!bottle) return;

    const measured = Number(item.measuredWeight.toFixed(1));
    const previous = Number(bottle.currentWeight.toFixed(1));
    if (mode === 'borrow') {
      bottle.status = '领用中';
      bottle.lastBorrowWeight = measured;
      bottle.currentWeight = measured;
    } else {
      bottle.lastReturnWeight = measured;
      bottle.currentWeight = measured;
      bottle.status = measured <= 20 ? '已用完' : '在库';
    }
    bottle.lastOpTime = now;
    updatedCodes.push(bottle.code);

    store.reagentOperations.unshift({
      id: `ro-${Date.now()}-${item.code}`,
      type: mode === 'borrow' ? '领用' : '归还',
      batchNo,
      bottleCode: bottle.code,
      chemicalName: bottle.chemicalName,
      operator,
      previousWeight: previous,
      measuredWeight: measured,
      weightDelta: Number((measured - previous).toFixed(1)),
      resultStatus: bottle.status,
      time: now,
    });
  });

  if (updatedCodes.length) {
    store.operationLogs.unshift({
      id: `log-terminal-${Date.now()}`,
      operator,
      module: '领用归还',
      action: mode === 'borrow' ? '桌面终端统一借出' : '桌面终端统一归还',
      ip: '10.12.20.8',
      result: '成功',
      time: now,
      detail: JSON.stringify({ batchNo, codes: updatedCodes }),
    });
  }

  saveStore(store);
  return delay({
    batchNo,
    count: updatedCodes.length,
    mode,
    updatedCodes,
  });
}

export function getCategoryDistribution() {
  const store = loadStore();
  const map: Record<string, number> = {};
  store.chemicals.forEach(c => { map[c.hazardCategory] = (map[c.hazardCategory] || 0) + 1; });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export function getTopChemicalsInStock() {
  const store = loadStore();
  const map: Record<string, number> = {};
  store.bottles.filter(b => b.status === '在库').forEach(b => {
    map[b.chemicalName] = (map[b.chemicalName] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));
}

export function getBorrowReturnTrend() {
  return Array.from({ length: 30 }, (_, i) => ({
    day: `5/${i + 1}`,
    borrow: 8 + Math.floor(Math.random() * 12),
    return: 6 + Math.floor(Math.random() * 10),
  }));
}

export async function runDemoScenario(id: DemoScenarioId): Promise<DemoRunResult> {
  const store = loadStore();
  const result = await executeDemoScenario(store, id);
  saveStore(store);
  return result;
}

export async function getTransfers() { return delay(loadStore().transfers); }
export async function getDiscards() { return delay(loadStore().discards); }
export async function getStocktakeDiffs() { return delay(loadStore().stocktakeDiffs); }
export async function getHazardTickets() { return delay(loadStore().hazardTickets); }
export async function getVisionEvents() { return delay(loadStore().visionEvents); }
export async function getEmergencyPlans() { return delay(loadStore().emergencyPlans); }
export async function getTrainingAccess() { return delay(loadStore().trainingAccess); }
export async function getCourses() { return delay(loadStore().courses); }
export async function getExams() { return delay(loadStore().exams); }
export async function getCerts() { return delay(loadStore().certs); }
export async function getApprovalTemplates() { return delay(loadStore().approvalTemplates); }
export async function getDictEntries() { return delay(loadStore().dictEntries); }
export async function getOperationLogs() { return delay(loadStore().operationLogs); }
export async function getWasteTransfers() { return delay(loadStore().wasteTransfers); }
export async function getHazardMapLinks() { return delay(loadStore().hazardMapLinks); }

export type { ReviewRecord };
