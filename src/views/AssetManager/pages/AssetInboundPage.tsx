import React, { useEffect, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { InboundPayload } from '../types';
import { createAssetInbound, getCategories, getAreas, getSuppliers } from '../mock/api';
import { flattenCategories, flattenAreas } from '../mock/seed';
import { CategoryNode, AreaNode, Supplier } from '../types';
import { DEPARTMENTS } from '../mock/constants';

interface Props {
  onDone: () => void;
  onBack: () => void;
  showToast: (msg: string, type?: 'success' | 'warning' | 'error') => void;
}

export function AssetInboundPage({ onDone, onBack, showToast }: Props) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [areas, setAreas] = useState<AreaNode[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [form, setForm] = useState<InboundPayload>({
    name: '', categoryId: '', modelSpec: '', supplierId: '',
    purchasePrice: 0, purchaseDate: new Date().toISOString().slice(0, 10),
    useDept: '生物研发部', usePerson: '', locationId: '',
  });

  useEffect(() => {
    Promise.all([getCategories(), getAreas(), getSuppliers()])
      .then(([c, a, s]) => { setCategories(c); setAreas(a); setSuppliers(s.filter(x => x.status === '启用')); });
  }, []);

  const flatCats = flattenCategories(categories).filter(c => c.level >= 2);
  const flatAreas = flattenAreas(areas).filter(a => a.level === 4);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.categoryId || !form.supplierId || !form.locationId) {
      showToast('请填写必填项', 'warning');
      return;
    }
    setLoading(true);
    try {
      await createAssetInbound(form);
      showToast('入库成功，资产已加入清单');
      onDone();
    } catch {
      showToast('入库失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const set = (key: keyof InboundPayload, val: string | number) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="max-w-3xl">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-6">
        <ArrowLeft size={16} /> 返回清单
      </button>

      <form onSubmit={handleSubmit} className="pro-card p-6 bg-[var(--card-bg)] space-y-5">
        <h3 className="text-lg font-bold">资产入库登记</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">资产名称 <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={e => set('name', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm" placeholder="如：高速离心机" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">资产编号</label>
            <input value={form.assetNo || ''} onChange={e => set('assetNo', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm" placeholder="留空自动生成" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">资产分类 <span className="text-red-500">*</span></label>
            <select value={form.categoryId} onChange={e => set('categoryId', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm">
              <option value="">请选择分类</option>
              {flatCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">规格型号 <span className="text-red-500">*</span></label>
            <input value={form.modelSpec} onChange={e => set('modelSpec', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">供应商 <span className="text-red-500">*</span></label>
            <select value={form.supplierId} onChange={e => set('supplierId', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm">
              <option value="">请选择供应商</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">购入价格（元）</label>
            <input type="number" value={form.purchasePrice} onChange={e => set('purchasePrice', Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">购入日期</label>
            <input type="date" value={form.purchaseDate} onChange={e => set('purchaseDate', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">存放位置 <span className="text-red-500">*</span></label>
            <select value={form.locationId} onChange={e => set('locationId', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm">
              <option value="">请选择存放区域</option>
              {flatAreas.map(a => <option key={a.id} value={a.id}>{a.fullPath}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">使用部门</label>
            <select value={form.useDept} onChange={e => set('useDept', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm">
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">使用人</label>
            <input value={form.usePerson} onChange={e => set('usePerson', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm" placeholder="领用人姓名" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
            <Save size={16} /> {loading ? '提交中...' : '确认入库'}
          </button>
          <button type="button" onClick={onBack} className="px-6 py-2.5 border border-slate-200 dark:border-white/10 rounded-xl text-sm">取消</button>
        </div>
      </form>
    </div>
  );
}
