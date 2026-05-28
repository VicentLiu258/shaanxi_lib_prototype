import React, { useEffect, useState } from 'react';
import { Asset, WarrantyRecord } from '../types';
import { createWarrantyRecord, getAssets, getWarrantyRecords, progressWarrantyRecord } from '../mock/api';
import { StatusBadge } from '../components/shared';

interface Props {
  showToast: (msg: string, type?: 'success' | 'warning' | 'error') => void;
}

const statusClass: Record<WarrantyRecord['status'], string> = {
  '待处理': 'bg-amber-100 text-amber-700',
  '维修中': 'bg-blue-100 text-blue-700',
  '已完成': 'bg-emerald-100 text-emerald-700',
};

export function AssetWarrantyPage({ showToast }: Props) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [records, setRecords] = useState<WarrantyRecord[]>([]);
  const [form, setForm] = useState({ assetId: '', issue: '', vendor: '', requester: '', note: '' });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [allAssets, allRecords] = await Promise.all([getAssets(), getWarrantyRecords()]);
    setAssets(allAssets.filter(a => a.status !== '已报废'));
    setRecords(allRecords);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.assetId || !form.issue || !form.vendor || !form.requester) {
      showToast('请填写完整保修信息', 'warning');
      return;
    }
    setLoading(true);
    await createWarrantyRecord(form);
    await load();
    setForm({ assetId: '', issue: '', vendor: '', requester: '', note: '' });
    showToast('保修工单已创建');
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 pro-card overflow-hidden bg-[var(--card-bg)]">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 text-sm font-bold">保修工单列表</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 text-xs uppercase">
                <th className="px-4 py-3 text-left">资产</th>
                <th className="px-4 py-3 text-left">当前状态</th>
                <th className="px-4 py-3 text-left">故障问题</th>
                <th className="px-4 py-3 text-left">服务商</th>
                <th className="px-4 py-3 text-left">申请人</th>
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
                  <td className="px-4 py-3 text-slate-500">{r.issue}</td>
                  <td className="px-4 py-3">{r.vendor}</td>
                  <td className="px-4 py-3">{r.requester}</td>
                  <td className="px-4 py-3 text-right">
                    {r.status === '待处理' && (
                      <button onClick={async () => { await progressWarrantyRecord(r.id, '维修中'); await load(); showToast('已进入维修中'); }} className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">开始维修</button>
                    )}
                    {r.status === '维修中' && (
                      <button onClick={async () => { await progressWarrantyRecord(r.id, '已完成'); await load(); showToast('保修已完成'); }} className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-semibold">完成</button>
                    )}
                  </td>
                </tr>
              ))}
              {records.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">暂无保修工单</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <form onSubmit={submit} className="pro-card p-5 bg-[var(--card-bg)] space-y-4 h-fit">
        <h3 className="font-bold">新增保修</h3>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">资产</label>
          <select value={form.assetId} onChange={e => setForm(f => ({ ...f, assetId: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm">
            <option value="">请选择资产</option>
            {assets.map(a => (
              <option key={a.id} value={a.id}>{a.assetNo} · {a.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">故障描述</label>
          <input value={form.issue} onChange={e => setForm(f => ({ ...f, issue: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">服务商</label>
          <input value={form.vendor} onChange={e => setForm(f => ({ ...f, vendor: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">申请人</label>
          <input value={form.requester} onChange={e => setForm(f => ({ ...f, requester: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm" />
        </div>
        <button disabled={loading} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
          {loading ? '提交中...' : '创建保修工单'}
        </button>
      </form>
    </div>
  );
}
