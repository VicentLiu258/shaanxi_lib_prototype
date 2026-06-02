import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Barcode, ClipboardList, PackagePlus,
  Printer, RotateCcw, Search, Scale, Trash2,
} from 'lucide-react';
import { getBottles, getChemicals } from '../mock/api';
import { BottleRecord, ChemicalCatalog } from '../types';
import { StatusBadge } from '../components/shared';
import { cn } from '../../../lib/utils';

interface PickItem {
  code: string;
  chemicalName: string;
  spec: string;
  location: string;
  expectedAmount: string;
  status: string;
}

export function BorrowPage() {
  const navigate = useNavigate();
  const [bottles, setBottles] = useState<BottleRecord[]>([]);
  const [chemicals, setChemicals] = useState<ChemicalCatalog[]>([]);
  const [kw, setKw] = useState('');
  const [picked, setPicked] = useState<PickItem[]>([]);
  const [borrower, setBorrower] = useState('张明');
  const [purpose, setPurpose] = useState('高二化学探究实验');

  useEffect(() => {
    Promise.all([getBottles(), getChemicals()]).then(([bottleRows, chemicalRows]) => {
      setBottles(bottleRows);
      setChemicals(chemicalRows);
    });
  }, []);

  const chemicalById = useMemo(() => new Map(chemicals.map(c => [c.id, c])), [chemicals]);

  const searchable = useMemo(() => bottles.filter(b => (
    !kw.trim()
    || b.chemicalName.includes(kw.trim())
    || chemicalById.get(b.chemicalId)?.cas.includes(kw.trim())
    || b.code.toLowerCase().includes(kw.trim().toLowerCase())
    || `${b.warehouse} ${b.cabinet} ${b.layer}`.includes(kw.trim())
  )).slice(0, 10), [bottles, chemicalById, kw]);

  const addToPickList = (bottle: BottleRecord) => {
    if (picked.some(item => item.code === bottle.code)) return;
    setPicked(prev => [...prev, {
      code: bottle.code,
      chemicalName: bottle.chemicalName,
      spec: bottle.spec,
      location: `${bottle.warehouse} / ${bottle.cabinet} / ${bottle.layer}`,
      expectedAmount: `${Math.max(5, Math.round(bottle.currentWeight * 0.2))}g`,
      status: bottle.status,
    }]);
  };

  const removePicked = (code: string) => {
    setPicked(prev => prev.filter(item => item.code !== code));
  };

  const printPickList = () => {
    if (!picked.length) {
      alert('请先添加需要取用的试剂。');
      return;
    }
    window.print();
  };

  const availableCount = bottles.filter(b => b.status === '在库').length;
  const borrowedCount = bottles.filter(b => b.status === '领用中').length;

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4">
        <section className="pro-card bg-white p-5 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">危化品领用备货</h2>
              <p className="text-sm text-slate-500 mt-1">先在电脑端检索需要的试剂，加入取用单并打印，现场再通过桌面终端统一称重核销。</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/hc-manage/terminal-simulator')}
              className="px-4 py-2 rounded-lg bg-[#1E3A8A] text-white text-sm font-bold flex items-center gap-2"
            >
              <Scale size={16} />
              打开桌面终端
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Metric label="在库可取" value={`${availableCount} 瓶`} />
            <Metric label="领用中" value={`${borrowedCount} 瓶`} />
            <Metric label="本次备货" value={`${picked.length} 件`} />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 flex-1">
              <Search size={16} className="text-slate-400" />
              <input
                value={kw}
                onChange={e => setKw(e.target.value)}
                placeholder="搜索试剂名称 / CAS / 瓶码 / 存放位置"
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
            <button
              type="button"
              onClick={() => setKw('')}
              className="px-3 py-2 rounded-lg border border-slate-200 text-slate-500 flex items-center gap-2 text-sm"
            >
              <RotateCcw size={16} />
              清空
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3 text-left">瓶码</th>
                  <th className="p-3 text-left">试剂</th>
                  <th className="p-3 text-left">位置</th>
                  <th className="p-3 text-left">当前重量</th>
                  <th className="p-3 text-left">状态</th>
                  <th className="p-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {searchable.map(b => (
                  <tr key={b.id} className="border-t hover:bg-slate-50">
                    <td className="p-3 font-mono text-xs text-blue-700">{b.code}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{b.chemicalName}</p>
                      <p className="text-xs text-slate-500">{b.spec} · CAS {chemicalById.get(b.chemicalId)?.cas || '-'}</p>
                    </td>
                    <td className="p-3 text-xs text-slate-600">{b.warehouse} / {b.cabinet} / {b.layer}</td>
                    <td className="p-3 font-mono font-bold">{b.currentWeight.toFixed(1)}g</td>
                    <td className="p-3"><StatusBadge status={b.status} /></td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        disabled={picked.some(item => item.code === b.code)}
                        onClick={() => addToPickList(b)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1',
                          picked.some(item => item.code === b.code)
                            ? 'bg-slate-100 text-slate-400'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
                        )}
                      >
                        <PackagePlus size={14} />
                        添加
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="pro-card bg-white p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                <ClipboardList size={18} />
                取用单预览
              </h3>
              <p className="text-xs text-slate-500 mt-1">打印后按位置取物，再到桌面终端逐件扫描称重。</p>
            </div>
            <button
              type="button"
              onClick={printPickList}
              className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-bold flex items-center gap-2"
            >
              <Printer size={16} />
              打印
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1 text-xs font-bold text-slate-500">
              领用人
              <input value={borrower} onChange={e => setBorrower(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm font-medium text-slate-900" />
            </label>
            <label className="space-y-1 text-xs font-bold text-slate-500">
              用途
              <input value={purpose} onChange={e => setPurpose(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm font-medium text-slate-900" />
            </label>
          </div>

          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-2 text-left">瓶码</th>
                  <th className="p-2 text-left">位置</th>
                  <th className="p-2 text-left">预计用量</th>
                  <th className="p-2 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {picked.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-sm text-slate-400">尚未添加试剂</td>
                  </tr>
                ) : picked.map(item => (
                  <tr key={item.code} className="border-t align-top">
                    <td className="p-2">
                      <p className="font-mono text-xs text-blue-700">{item.code}</p>
                      <p className="font-bold text-slate-900">{item.chemicalName}</p>
                    </td>
                    <td className="p-2 text-xs text-slate-500">{item.location}</td>
                    <td className="p-2">
                      <input
                        value={item.expectedAmount}
                        onChange={e => setPicked(prev => prev.map(p => p.code === item.code ? { ...p, expectedAmount: e.target.value } : p))}
                        className="w-16 border rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="p-2 text-right">
                      <button type="button" onClick={() => removePicked(item.code)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-600 space-y-2">
            <p className="font-bold text-slate-900 flex items-center gap-2"><Barcode size={16} /> 现场核销方式</p>
            <p>桌面终端像收银台一样逐件识别：放一瓶，自动扫瓶码和称重；拿下后再放下一瓶；最后统一借出或统一归还。</p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/hc-manage/terminal-simulator')}
            className="w-full py-3 bg-[#1E3A8A] text-white rounded-xl font-black flex items-center justify-center gap-2"
          >
            去桌面终端统一核销
            <ArrowRight size={16} />
          </button>
        </aside>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="text-xl font-black text-slate-900 mt-1">{value}</p>
    </div>
  );
}
