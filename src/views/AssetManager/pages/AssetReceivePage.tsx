import React, { useEffect, useState } from 'react';
import { CheckSquare } from 'lucide-react';
import { Asset } from '../types';
import { getAssets, batchReceive } from '../mock/api';
import { DEPARTMENTS } from '../mock/constants';
import { StatusBadge } from '../components/shared';

interface Props {
  showToast: (msg: string, type?: 'success' | 'warning' | 'error') => void;
}

export function AssetReceivePage({ showToast }: Props) {
  const [idleAssets, setIdleAssets] = useState<Asset[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ receiver: '', receiveDept: '生物研发部', expectedReturnDate: '', remark: '' });

  useEffect(() => {
    getAssets({ status: '闲置' }).then(setIdleAssets);
  }, []);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected.length) { showToast('请选择要领用的资产', 'warning'); return; }
    if (!form.receiver) { showToast('请填写领用人', 'warning'); return; }
    setLoading(true);
    const { updated } = await batchReceive({ assetIds: selected, ...form });
    showToast(`成功领用 ${updated} 项资产`);
    setSelected([]);
    setIdleAssets(await getAssets({ status: '闲置' }));
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 pro-card bg-[var(--card-bg)] overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 font-bold text-sm">
          闲置资产列表（已选 {selected.length} 项）
        </div>
        <div className="max-h-[480px] overflow-y-auto">
          {idleAssets.length === 0 ? (
            <div className="p-12 text-center text-slate-400">暂无闲置资产</div>
          ) : idleAssets.map(a => (
            <label key={a.id} className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] cursor-pointer">
              <input type="checkbox" checked={selected.includes(a.id)} onChange={() => toggle(a.id)} className="rounded" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{a.name}</div>
                <div className="text-xs text-slate-500 font-mono">{a.assetNo} · {a.locationPath}</div>
              </div>
              <StatusBadge status={a.status} />
            </label>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="pro-card p-5 bg-[var(--card-bg)] space-y-4 h-fit">
        <h3 className="font-bold flex items-center gap-2"><CheckSquare size={18} /> 领用信息</h3>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">领用人 *</label>
          <input value={form.receiver} onChange={e => setForm(f => ({ ...f, receiver: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">领用部门</label>
          <select value={form.receiveDept} onChange={e => setForm(f => ({ ...f, receiveDept: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm">
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">预计归还日期</label>
          <input type="date" value={form.expectedReturnDate} onChange={e => setForm(f => ({ ...f, expectedReturnDate: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">备注</label>
          <textarea value={form.remark} onChange={e => setForm(f => ({ ...f, remark: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm" />
        </div>
        <button type="submit" disabled={loading} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
          {loading ? '提交中...' : '确认领用'}
        </button>
      </form>
    </div>
  );
}
