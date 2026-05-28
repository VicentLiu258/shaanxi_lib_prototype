import React, { useEffect, useMemo, useState } from 'react';
import { Asset, AreaNode, TransferRecord } from '../types';
import { completeTransferRecord, createTransferRecord, getAreas, getAssets, getTransferRecords } from '../mock/api';
import { DEPARTMENTS } from '../mock/constants';
import { flattenAreas } from '../mock/seed';
import { StatusBadge } from '../components/shared';

interface Props {
  showToast: (msg: string, type?: 'success' | 'warning' | 'error') => void;
}

const statusClass: Record<TransferRecord['status'], string> = {
  '待确认': 'bg-amber-100 text-amber-700',
  '已完成': 'bg-emerald-100 text-emerald-700',
  '已取消': 'bg-slate-200 text-slate-700',
};

export function AssetTransferPage({ showToast }: Props) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [areas, setAreas] = useState<AreaNode[]>([]);
  const [records, setRecords] = useState<TransferRecord[]>([]);
  const [form, setForm] = useState({ assetId: '', toDept: DEPARTMENTS[0], toLocationId: '', requester: '', note: '' });
  const [loading, setLoading] = useState(false);

  const flatRooms = useMemo(() => flattenAreas(areas).filter(a => a.level === 4), [areas]);

  const load = async () => {
    const [allAssets, allAreas, allRecords] = await Promise.all([getAssets(), getAreas(), getTransferRecords()]);
    setAssets(allAssets.filter(a => a.status !== '已报废'));
    setAreas(allAreas);
    setRecords(allRecords);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetArea = flatRooms.find(a => a.id === form.toLocationId);
    if (!form.assetId || !form.toDept || !targetArea || !form.requester) {
      showToast('请填写完整转移信息', 'warning');
      return;
    }
    setLoading(true);
    await createTransferRecord({
      assetId: form.assetId,
      toDept: form.toDept,
      toLocationId: targetArea.id,
      toLocationPath: targetArea.fullPath,
      requester: form.requester,
      note: form.note,
    });
    await load();
    setForm({ assetId: '', toDept: DEPARTMENTS[0], toLocationId: '', requester: '', note: '' });
    showToast('转移申请已提交');
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 pro-card overflow-hidden bg-[var(--card-bg)]">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 text-sm font-bold">资产转移申请</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 text-xs uppercase">
                <th className="px-4 py-3 text-left">资产</th>
                <th className="px-4 py-3 text-left">原部门/位置</th>
                <th className="px-4 py-3 text-left">目标部门/位置</th>
                <th className="px-4 py-3 text-left">状态</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id} className="border-t border-slate-100 dark:border-white/5">
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.assetName}</div>
                    <div className="text-xs text-slate-500 font-mono">{r.assetNo}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{r.fromDept}<div className="text-xs">{r.fromLocation}</div></td>
                  <td className="px-4 py-3 text-slate-500">{r.toDept}<div className="text-xs">{r.toLocationPath}</div></td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusClass[r.status]}`}>{r.status}</span></td>
                  <td className="px-4 py-3 text-right">
                    {r.status === '待确认' && (
                      <div className="inline-flex gap-2">
                        <button onClick={async () => { await completeTransferRecord(r.id, false); await load(); showToast('转移已完成'); }} className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-semibold">确认</button>
                        <button onClick={async () => { await completeTransferRecord(r.id, true); await load(); showToast('转移已取消', 'warning'); }} className="px-2 py-1 rounded bg-slate-200 text-slate-700 text-xs font-semibold">取消</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {records.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400">暂无转移记录</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <form onSubmit={submit} className="pro-card p-5 bg-[var(--card-bg)] space-y-4 h-fit">
        <h3 className="font-bold">发起转移</h3>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">资产</label>
          <select value={form.assetId} onChange={e => setForm(f => ({ ...f, assetId: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm">
            <option value="">请选择资产</option>
            {assets.map(a => (
              <option key={a.id} value={a.id}>{a.assetNo} · {a.name}（{a.useDept}）</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">目标部门</label>
          <select value={form.toDept} onChange={e => setForm(f => ({ ...f, toDept: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm">
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">目标位置</label>
          <select value={form.toLocationId} onChange={e => setForm(f => ({ ...f, toLocationId: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm">
            <option value="">请选择位置</option>
            {flatRooms.map(r => <option key={r.id} value={r.id}>{r.fullPath}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">申请人</label>
          <input value={form.requester} onChange={e => setForm(f => ({ ...f, requester: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm" />
        </div>
        <button disabled={loading} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
          {loading ? '提交中...' : '提交转移申请'}
        </button>
      </form>
    </div>
  );
}
