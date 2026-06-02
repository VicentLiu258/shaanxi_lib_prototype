import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, Archive, CalendarClock, ClipboardList, Factory,
  FileText, PackageCheck, RotateCcw, Search, ShieldCheck,
  ShoppingCart, Truck, UserCheck, X,
} from 'lucide-react';
import { getConsumables } from '../mock/api';
import { ConsumableInventoryItem } from '../types';
import { StatusBadge } from '../components/shared';
import { cn } from '../../../lib/utils';

const statusOptions = ['全部状态', '正常', '低库存', '临期', '已过期'];

export function ConsumablesPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ConsumableInventoryItem[]>([]);
  const [kw, setKw] = useState('');
  const [status, setStatus] = useState('全部状态');
  const [detail, setDetail] = useState<ConsumableInventoryItem | null>(null);

  const reload = () => getConsumables().then(setRows);
  useEffect(() => { reload(); }, []);

  const filtered = useMemo(() => rows.filter(item => {
    const hitKw = !kw.trim()
      || item.name.includes(kw.trim())
      || item.code.toLowerCase().includes(kw.trim().toLowerCase())
      || item.location.includes(kw.trim());
    const hitStatus = status === '全部状态' || item.status === status;
    return hitKw && hitStatus;
  }), [kw, rows, status]);

  const lowCount = rows.filter(item => item.stockQty < item.safeStock).length;
  const expiringCount = rows.filter(item => item.status === '临期' || item.status === '已过期').length;
  const totalStock = rows.reduce((sum, item) => sum + item.stockQty, 0);

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SummaryCard icon={Archive} label="耗材品类" value={`${rows.length} 类`} tone="blue" />
        <SummaryCard icon={PackageCheck} label="库存总量" value={String(totalStock)} tone="emerald" />
        <SummaryCard icon={AlertTriangle} label="预警项" value={`${lowCount + expiringCount} 项`} tone="amber" />
      </div>

      <div className="pro-card bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900">耗材库存清单</h2>
            <p className="text-xs text-slate-500 mt-1">库存与清单合并展示，作为危化品子系统内的耗材台账入口。</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/hc-manage/flow/borrow')}
            className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg text-sm font-bold flex items-center gap-2"
          >
            <ClipboardList size={16} />
            去领用备货
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 min-w-[260px] flex-1">
            <Search size={16} className="text-slate-400" />
            <input
              value={kw}
              onChange={e => setKw(e.target.value)}
              placeholder="搜索名称 / 耗材编码 / 位置"
              className="bg-transparent outline-none border-none text-sm w-full"
            />
          </div>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            {statusOptions.map(s => <option key={s}>{s}</option>)}
          </select>
          <button
            type="button"
            onClick={() => { setKw(''); setStatus('全部状态'); reload(); }}
            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center gap-2 text-sm"
          >
            <RotateCcw size={16} />
            重置
          </button>
        </div>
      </div>

      <div className="pro-card overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1480px]">
            <thead className="bg-slate-50">
              <tr>
                {['序号', '名称', '耗材编码', '包装规格', '耗材位置', '库存数量', '单位', '安全库存', '入库时间', '生成日期', '有效期', '当前状态', '操作'].map(col => (
                  <th key={col} className="p-3 text-left font-bold text-slate-600 whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => (
                <tr key={item.id} className="border-t hover:bg-slate-50/80">
                  <td className="p-3 text-slate-500 font-mono">{index + 1}</td>
                  <td className="p-3">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.brand} · {item.manufacturer}</p>
                  </td>
                  <td className="p-3 font-mono text-xs text-blue-700">{item.code}</td>
                  <td className="p-3">
                    <p className="text-slate-700">{item.packageSpec}</p>
                    <p className="text-xs text-slate-500 mt-1">批号 {item.batchNo}</p>
                  </td>
                  <td className="p-3">
                    <p className="text-slate-700">{item.location}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.storageCondition}</p>
                  </td>
                  <td className={cn('p-3 font-black', item.stockQty < item.safeStock ? 'text-amber-600' : 'text-slate-900')}>{item.stockQty}</td>
                  <td className="p-3 text-slate-500">{item.unit}</td>
                  <td className="p-3 text-slate-500">{item.safeStock}</td>
                  <td className="p-3 text-xs text-slate-500">{item.inboundTime}</td>
                  <td className="p-3 text-xs text-slate-500">{item.productionDate}</td>
                  <td className="p-3 text-xs text-slate-500">{item.expiryDate}</td>
                  <td className="p-3"><StatusBadge status={item.status} /></td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setDetail(item)}
                        className="text-xs font-bold text-[#1E3A8A] hover:underline"
                      >
                        详情
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/hc-manage/flow/borrow')}
                        className="text-xs font-bold text-slate-500 hover:text-[#1E3A8A]"
                      >
                        备货
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
          <span>共 {filtered.length} 条耗材库存记录</span>
          <span className="flex items-center gap-1"><CalendarClock size={14} /> mock 数据更新时间 2026-06-01</span>
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            aria-label="关闭详情"
            className="flex-1 bg-slate-950/40"
            onClick={() => setDetail(null)}
          />
          <aside className="w-full max-w-[560px] bg-white h-full shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-start justify-between gap-4 z-10">
              <div>
                <p className="text-xs font-black text-blue-700 uppercase tracking-[0.2em]">Consumable Detail</p>
                <h3 className="text-xl font-black text-slate-900 mt-1">{detail.name}</h3>
                <p className="text-xs font-mono text-slate-500 mt-1">{detail.code}</p>
              </div>
              <button type="button" onClick={() => setDetail(null)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <section className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-sm leading-7 text-slate-700">{detail.introduction}</p>
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DetailItem icon={Factory} label="生产厂家" value={detail.manufacturer} />
                <DetailItem icon={ShieldCheck} label="品牌 / 材质" value={`${detail.brand} · ${detail.material}`} />
                <DetailItem icon={ShoppingCart} label="购入时间" value={detail.purchaseTime} />
                <DetailItem icon={Truck} label="供应商" value={detail.supplier} />
                <DetailItem icon={FileText} label="采购单号" value={detail.purchaseOrderNo} />
                <DetailItem icon={Archive} label="生产批号" value={detail.batchNo} />
                <DetailItem icon={UserCheck} label="采购 / 验收" value={`${detail.buyer} / ${detail.acceptancePerson}`} />
                <DetailItem icon={CalendarClock} label="生产 / 有效期" value={`${detail.productionDate} / ${detail.expiryDate}`} />
              </section>

              <section className="rounded-2xl border border-slate-100 overflow-hidden">
                <div className="grid grid-cols-2 bg-slate-50 text-sm">
                  <InfoCell label="包装规格" value={detail.packageSpec} />
                  <InfoCell label="当前状态" value={detail.status} />
                  <InfoCell label="库存数量" value={`${detail.stockQty}${detail.unit}`} />
                  <InfoCell label="安全库存" value={`${detail.safeStock}${detail.unit}`} />
                  <InfoCell label="入库时间" value={detail.inboundTime} />
                  <InfoCell label="耗材位置" value={detail.location} />
                </div>
              </section>

              <section className="space-y-3">
                <TextBlock title="用途说明" content={detail.application} />
                <TextBlock title="存放要求" content={detail.storageCondition} />
                <TextBlock title="备注与风险提示" content={detail.remarks} />
              </section>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/hc-manage/flow/borrow')}
                  className="flex-1 py-3 rounded-xl bg-[#1E3A8A] text-white font-black text-sm"
                >
                  去领用备货
                </button>
                <button
                  type="button"
                  onClick={() => setDetail(null)}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm"
                >
                  关闭
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone: 'blue' | 'emerald' | 'amber';
}) {
  const toneClass = {
    blue: 'bg-blue-50 text-blue-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
  }[tone];

  return (
    <div className="pro-card bg-white p-4 flex items-center gap-4">
      <div className={cn('w-11 h-11 rounded-lg flex items-center justify-center', toneClass)}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-bold">{label}</p>
        <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 p-3 bg-white">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
        <Icon size={14} className="text-blue-600" />
        {label}
      </div>
      <p className="text-sm font-bold text-slate-900 mt-2 leading-6">{value}</p>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 border-b border-r border-slate-100 bg-white">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="text-sm font-black text-slate-900 mt-1">{value}</p>
    </div>
  );
}

function TextBlock({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <p className="text-sm font-black text-slate-900">{title}</p>
      <p className="text-sm text-slate-600 leading-7 mt-2">{content}</p>
    </div>
  );
}
