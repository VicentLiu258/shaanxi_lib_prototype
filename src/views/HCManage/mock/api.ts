import { HcMockStore, createInitialStore } from './seed';
import { HC_MOCK_DATA_KEY, HC_CURRENT_USER_KEY, SAMPLE_HC_USERS, FAKE_DELAY } from './constants';
import { HcUser, ReviewRecord, DemoScenarioId, DemoRunResult } from '../types';
import { executeDemoScenario } from './demoActions';

function delay<T>(data: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), FAKE_DELAY()));
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
    return parsed as HcMockStore;
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
