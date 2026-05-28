import React, { useEffect, useState } from 'react';
import { Asset, DamageRecord } from '../types';
import { approveDamageRecord, createDamageRecord, getAssets, getDamageRecords } from '../mock/api';
import { StatusBadge } from '../components/shared';

interface Props {
  showToast: (msg: string, type?: 'success' | 'warning' | 'error') => void;
}

const statusClass: Record<DamageRecord['status'], string> = {
  '待审批': 'bg-amber-100 text-amber-700',
  '已通过': 'bg-emerald-100 text-emerald-700',
  '已驳回': 'bg-red-100 text-red-700',
};

export function AssetDamagePage({ showToast }: Props) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [records, setRecords] = useState<DamageRecord[]>([]);
  const [form, setForm] = useState({ assetId: '', reason: '', reporter: '', note: '' });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [allAssets, allRecords] = await Promise.all([getAssets(), getDamageRecords()]);
    setAssets(allAssets.filter(a => a.status !== '已报废'));
    setRecords(allRecords);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.assetId || !form.reason || !form.reporter) {
      showToast('请填写完整报损信息', 'warning');
      return;
    }
    setLoading(true);
    await createDamageRecord(form);
    await load();
    setForm({ assetId: '', reason: '', reporter: '', note: '' });
    showToast('报损申请已提交');
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 pro-card overflow-hidden bg-[var(--card-bg)]">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 text-sm font-bold">报损申请列表</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 text-xs uppercase">
                <th className="px-4 py-3 text-left">资产</th>
                <th className="px-4 py-3 text-left">状态</th>
                <th className="px-4 py-3 text-left">报损原因</th>
                <th className="px-4 py-3 text-left">报损人</th>
                <th className="px-4 py-3 text-left">日期</th>
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
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusClass[r.status]}`}>{r.status}</span></td>
                  <td className="px-4 py-3 text-slate-500">{r.reason}</td>
                  <td className="px-4 py-3">{r.reporter}</td>
                  <td className="px-4 py-3 text-slate-500">{r.reportDate}</td>
                  <td className="px-4 py-3 text-right">
                    {r.status === '待审批' && (
                      <div className="inline-flex gap-2">
                        <button onClick={async () => { await approveDamageRecord(r.id, true); await load(); showToast('报损已通过'); }} className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-semibold">通过</button>
                        <button onClick={async () => { await approveDamageRecord(r.id, false); await load(); showToast('报损已驳回', 'warning'); }} className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold">驳回</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {records.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">暂无报损记录</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <form onSubmit={submit} className="pro-card p-5 bg-[var(--card-bg)] space-y-4 h-fit">
        <h3 className="font-bold">新增报损</h3>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">资产</label>
          <select value={form.assetId} onChange={e => setForm(f => ({ ...f, assetId: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm">
            <option value="">请选择资产</option>
            {assets.map(a => <option key={a.id} value={a.id}>{a.assetNo} · {a.name}（{a.useDept}）</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">报损原因</label>
          <input value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">报损人</label>
          <input value={form.reporter} onChange={e => setForm(f => ({ ...f, reporter: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">备注</label>
          <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm" />
        </div>
        <button disabled={loading} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
          {loading ? '提交中...' : '提交报损'}
        </button>
      </form>
    </div>
  );
}
