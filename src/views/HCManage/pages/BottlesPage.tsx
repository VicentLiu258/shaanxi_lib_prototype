import React, { useEffect, useState } from 'react';
import { getBottles } from '../mock/api';
import { BottleRecord } from '../types';
import { FilterInput, StatusBadge } from '../components/shared';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { DemoTriggerButton } from '../components/DemoRunner';

export function BottlesPage() {
  const [list, setList] = useState<BottleRecord[]>([]);
  const [kw, setKw] = useState('');
  const [view, setView] = useState<'table' | 'card'>('table');
  const [detail, setDetail] = useState<BottleRecord | null>(null);

  const reload = () => getBottles().then(setList);
  useEffect(() => { reload(); }, []);

  const filtered = list.filter(b => !kw || b.code.includes(kw) || b.chemicalName.includes(kw));

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-3 items-center flex-wrap">
        <DemoTriggerButton demoId="bottles" onComplete={async () => {
          const data = await getBottles();
          setList(data);
          setKw('LC-2026-000001');
          const b = data.find(x => x.code === 'LC-2026-000001') || data[0];
          if (b) setDetail(b);
        }} />
        <FilterInput value={kw} onChange={setKw} placeholder="瓶码 / 化学品名" />
        <button type="button" onClick={() => setView('table')} className={cn('p-2 rounded', view === 'table' && 'bg-blue-100')}><List size={18} /></button>
        <button type="button" onClick={() => setView('card')} className={cn('p-2 rounded', view === 'card' && 'bg-blue-100')}><LayoutGrid size={18} /></button>
      </div>

      {view === 'table' ? (
        <div className="pro-card overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50"><tr>
              <th className="p-3 text-left">电子码</th><th className="p-3 text-left">化学品</th><th className="p-3 text-left">规格</th>
              <th className="p-3 text-left">状态</th><th className="p-3 text-left">位置</th><th className="p-3 text-left">操作</th>
            </tr></thead>
            <tbody>
              {filtered.slice(0, 20).map(b => (
                <tr key={b.id} className="border-t">
                  <td className="p-3 font-mono text-xs">{b.code}</td>
                  <td className="p-3">{b.chemicalName}</td>
                  <td className="p-3">{b.spec}</td>
                  <td className="p-3"><StatusBadge status={b.status} /></td>
                  <td className="p-3 text-xs">{b.warehouse} / {b.cabinet}</td>
                  <td className="p-3"><button type="button" className="text-blue-600 text-xs" onClick={() => setDetail(b)}>详情</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {filtered.slice(0, 12).map(b => (
            <button key={b.id} type="button" onClick={() => setDetail(b)} className="pro-card p-4 text-left bg-white hover:border-blue-300">
              <div className="font-mono text-xs text-blue-600">{b.code}</div>
              <div className="font-bold mt-1">{b.chemicalName}</div>
              <StatusBadge status={b.status} />
            </button>
          ))}
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 p-6">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
            <h3 className="font-bold text-lg mb-4">{detail.code}</h3>
            <div className="flex gap-2 border-b mb-4 text-sm">
              {['基本信息', '生命周期', '用量曲线', '关联文档'].map(t => (
                <span key={t} className="px-3 py-2 border-b-2 border-blue-600 font-bold">{t}</span>
              ))}
            </div>
            <div className="space-y-2 text-sm">
              <p>化学品：{detail.chemicalName}</p>
              <p>责任人：{detail.owner}</p>
              <p>入库：{detail.inboundDate}</p>
            </div>
            <ol className="mt-4 text-xs space-y-2 border-l-2 border-blue-200 pl-4">
              {['申购', '到货', '验收', '赋码', '上架', '领用', '归还', '报废登记'].map(s => (
                <li key={s}>{s} · 2026-05-01 10:00</li>
              ))}
            </ol>
            <button type="button" className="mt-6 w-full py-2 border rounded" onClick={() => setDetail(null)}>关闭</button>
          </div>
        </div>
      )}
    </div>
  );
}
