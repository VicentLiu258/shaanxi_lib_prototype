import React, { useEffect, useState } from 'react';
import { getPurchases } from '../mock/api';
import { PurchaseOrder } from '../types';
import { StatusBadge, FilterInput } from '../components/shared';
import { DemoTriggerButton } from '../components/DemoRunner';

export function PurchasePage() {
  const [list, setList] = useState<PurchaseOrder[]>([]);
  const [tab, setTab] = useState<'mine' | 'pending' | 'all'>('all');
  const [kw, setKw] = useState('');
  const [showForm, setShowForm] = useState(false);

  const reload = () => getPurchases().then(setList);
  useEffect(() => { reload(); }, []);

  const filtered = list.filter(p => {
    if (tab === 'pending' && p.status !== '审批中') return false;
    if (tab === 'mine' && p.applicant !== '张明') return false;
    return !kw || p.orderNo.includes(kw) || p.applicant.includes(kw);
  });

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">
        <div className="flex gap-2">
          {([['mine', '我的申购'], ['pending', '待审批'], ['all', '全部订单']] as const).map(([k, l]) => (
            <button key={k} type="button" onClick={() => setTab(k)} className={`px-4 py-2 rounded-lg text-sm font-bold ${tab === k ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>{l}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <DemoTriggerButton demoId="purchase" onComplete={() => { reload(); setTab('pending'); }} />
          <button type="button" onClick={() => setShowForm(true)} className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg text-sm font-bold">新增申购</button>
        </div>
      </div>
      <FilterInput value={kw} onChange={setKw} placeholder="单号 / 申请人" />

      <div className="pro-card mt-4 overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50"><tr>
            <th className="p-3 text-left">申购单号</th><th className="p-3 text-left">申请人</th><th className="p-3 text-left">学院</th>
            <th className="p-3 text-left">品种数</th><th className="p-3 text-left">预算</th><th className="p-3 text-left">审批节点</th><th className="p-3 text-left">状态</th>
          </tr></thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-3 font-mono text-xs">{p.orderNo}</td>
                <td className="p-3">{p.applicant}</td>
                <td className="p-3">{p.college}</td>
                <td className="p-3">{p.itemCount}</td>
                <td className="p-3">¥{p.budget}</td>
                <td className="p-3 text-xs">{p.approvalNode}</td>
                <td className="p-3"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <div className="w-[520px] bg-white h-full p-6 overflow-y-auto">
            <h3 className="font-bold text-lg mb-4">新增申购</h3>
            <label className="block text-sm mb-1">用途说明（≥20字）</label>
            <textarea rows={4} className="w-full border rounded-lg p-3 text-sm mb-4" defaultValue="本科教学实验使用，已落实双人双锁与通风橱操作规范，预计本周内完成领用。" />
            <p className="text-xs text-amber-600 mb-4">风险评估：含管控品种，需院级 + 校级多级审批</p>
            <div className="flex gap-2 justify-end">
              <button type="button" className="px-4 py-2 border rounded" onClick={() => setShowForm(false)}>取消</button>
              <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setShowForm(false)}>提交</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
