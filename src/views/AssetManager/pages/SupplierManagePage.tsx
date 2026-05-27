import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Supplier } from '../types';
import { getSuppliers, addSupplier } from '../mock/api';
import { cn } from '../../../lib/utils';

interface Props {
  showToast: (msg: string, type?: 'success' | 'warning' | 'error') => void;
}

export function SupplierManagePage({ showToast }: Props) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '', phone: '', address: '', status: '启用' as const });

  const load = () => getSuppliers().then(setSuppliers);
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { showToast('请填写供应商名称', 'warning'); return; }
    await addSupplier(form);
    showToast('供应商添加成功');
    setShowForm(false);
    setForm({ name: '', contact: '', phone: '', address: '', status: '启用' });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-500">共 {suppliers.length} 家供应商</span>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold">
          <Plus size={16} /> 新增供应商
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="pro-card p-4 bg-[var(--card-bg)] grid grid-cols-2 md:grid-cols-4 gap-3">
          <input placeholder="供应商名称 *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="px-3 py-2 rounded-xl border text-sm" />
          <input placeholder="联系人" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} className="px-3 py-2 rounded-xl border text-sm" />
          <input placeholder="电话" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="px-3 py-2 rounded-xl border text-sm" />
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold">保存</button>
        </form>
      )}

      <div className="pro-card overflow-hidden bg-[var(--card-bg)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 text-xs uppercase">
              <th className="px-4 py-3 text-left">供应商名称</th>
              <th className="px-4 py-3 text-left">联系人</th>
              <th className="px-4 py-3 text-left">电话</th>
              <th className="px-4 py-3 text-left">地址</th>
              <th className="px-4 py-3 text-left">状态</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(s => (
              <tr key={s.id} className="border-t border-slate-100 dark:border-white/5">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3">{s.contact}</td>
                <td className="px-4 py-3 font-mono text-xs">{s.phone}</td>
                <td className="px-4 py-3 text-slate-500">{s.address}</td>
                <td className="px-4 py-3">
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', s.status === '启用' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700')}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
