import React, { useEffect, useState } from 'react';
import { getChemicals } from '../mock/api';
import { ChemicalCatalog } from '../types';
import { FilterInput, PageToolbar, StatusBadge } from '../components/shared';
import { HAZARD_CATEGORIES } from '../mock/constants';
import { DemoTriggerButton } from '../components/DemoRunner';

export function CatalogPage() {
  const [list, setList] = useState<ChemicalCatalog[]>([]);
  const [kw, setKw] = useState('');
  const [cat, setCat] = useState('');
  const [drawer, setDrawer] = useState<ChemicalCatalog | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const reload = () => getChemicals().then(setList);
  useEffect(() => { reload(); }, []);

  const onDemo = async () => {
    setKw('甲醇');
    const data = await getChemicals();
    setList(data);
    const methanol = data.find(c => c.nameCn.includes('甲醇'));
    if (methanol) setDrawer(methanol);
  };

  const filtered = list.filter(c =>
    (!kw || c.nameCn.includes(kw) || c.cas.includes(kw)) &&
    (!cat || c.hazardCategory === cat),
  );
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-4">
      <PageToolbar onRefresh={reload} onExport={() => alert('已生成导出任务（演示）')}>
        <DemoTriggerButton demoId="catalog" onComplete={onDemo} />
        <FilterInput value={kw} onChange={setKw} placeholder="化学品名称 / CAS" />
        <select value={cat} onChange={e => setCat(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
          <option value="">全部危险类别</option>
          {HAZARD_CATEGORIES.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </PageToolbar>

      <div className="pro-card overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50"><tr>
            <th className="p-3 text-left">CAS</th><th className="p-3 text-left">中文名</th><th className="p-3 text-left">分子式</th>
            <th className="p-3 text-left">危险类别</th><th className="p-3 text-left">管控级别</th><th className="p-3 text-left">操作</th>
          </tr></thead>
          <tbody>
            {pageData.map((c, i) => (
              <tr key={c.id} className="border-t hover:bg-slate-50">
                <td className="p-3 font-mono text-xs">{c.cas}</td>
                <td className="p-3 font-bold">{c.nameCn}</td>
                <td className="p-3">{c.formula}</td>
                <td className="p-3"><StatusBadge status={c.hazardCategory} /></td>
                <td className="p-3">{c.controlLevel}</td>
                <td className="p-3"><button type="button" className="text-blue-600 text-xs font-bold" onClick={() => setDrawer(c)}>查看 MSDS</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 flex justify-between text-xs text-slate-500">
          <span>共 {filtered.length} 条</span>
          <div className="flex gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>上一页</button>
            <span>{page}</span>
            <button type="button" disabled={page * pageSize >= filtered.length} onClick={() => setPage(p => p + 1)}>下一页</button>
          </div>
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setDrawer(null)} />
          <div className="w-[480px] bg-white h-full shadow-xl flex flex-col">
            <div className="p-4 border-b font-bold">MSDS · {drawer.nameCn}</div>
            <div className="flex flex-1 overflow-hidden">
              <div className="w-36 border-r text-xs overflow-y-auto p-2 bg-slate-50">
                {['标识', '危害', '成分', '急救', '消防', '泄漏', '操作', '防护', '理化', '稳定', '毒理', '生态', '废弃', '运输', '法规', '其他'].map((s, i) => (
                  <div key={s} className="py-1.5 px-2 hover:bg-blue-50 cursor-pointer">{i + 1}. {s}</div>
                ))}
              </div>
              <div className="flex-1 p-4 text-sm text-slate-600 overflow-y-auto">
                <p className="font-bold text-slate-800 mb-2">{drawer.nameCn}（{drawer.cas}）</p>
                <p>本章节为演示占位说明：请在通风良好处操作，佩戴防护装备，远离火源热源。详细理化参数与应急措施以实验室安全手册为准。</p>
              </div>
            </div>
            <button type="button" className="m-4 py-2 border rounded" onClick={() => setDrawer(null)}>关闭</button>
          </div>
        </div>
      )}
    </div>
  );
}
