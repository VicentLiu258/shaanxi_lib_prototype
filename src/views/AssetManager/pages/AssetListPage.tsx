import React, { useEffect, useState, useRef } from 'react';
import { Search, Plus, Upload, Download, Printer, X, Clock, CheckSquare, Trash2, Wrench } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Asset, AssetFilter, OperationLog } from '../types';
import { getAssets, getAssetLogs, updateAssetStatus, importAssetsFromRows, exportAssetsToXlsxData } from '../mock/api';
import { ASSET_STATUSES, DEPARTMENTS } from '../mock/constants';
import { StatusBadge, downloadBlob } from '../components/shared';
import { cn } from '../../../lib/utils';

interface Props {
  onOpenInbound: () => void;
  showToast: (msg: string, type?: 'success' | 'warning' | 'error') => void;
  initialKeyword?: string;
}

export function AssetListPage({ onOpenInbound, showToast, initialKeyword }: Props) {
  const [data, setData] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<AssetFilter>({ keyword: initialKeyword || '' });
  const [drawerAsset, setDrawerAsset] = useState<Asset | null>(null);
  const [logs, setLogs] = useState<OperationLog[]>([]);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const pageSize = 15;
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async (f: AssetFilter = filter) => {
    setLoading(true);
    setData(await getAssets(f));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { if (initialKeyword) load({ ...filter, keyword: initialKeyword }); }, [initialKeyword]);

  const openDetail = async (asset: Asset) => {
    setDrawerAsset(asset);
    setLogs(await getAssetLogs(asset.id));
  };

  const quickReceive = async (asset: Asset) => {
    if (asset.status !== '闲置') { showToast('仅闲置资产可直接领用', 'warning'); return; }
    await updateAssetStatus(asset.id, '在用', { remark: '快捷领用', targetPerson: asset.usePerson });
    showToast('领用成功');
    load();
  };

  const quickScrap = async (asset: Asset) => {
    await updateAssetStatus(asset.id, '已报废', { remark: '快捷报废清理' });
    showToast('已标记报废');
    load();
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const togglePageSelect = () => {
    const ids = paged.map(row => row.id);
    const allSelected = ids.every(id => selectedIds.includes(id));
    setSelectedIds(prev => allSelected ? prev.filter(id => !ids.includes(id)) : Array.from(new Set([...prev, ...ids])));
  };

  const batchChangeStatus = async (status: '维保中' | '已报废', remark: string) => {
    if (!selectedIds.length) {
      showToast('请先选择资产', 'warning');
      return;
    }
    await Promise.all(selectedIds.map(id => updateAssetStatus(id, status, { remark })));
    showToast(`已批量处理 ${selectedIds.length} 项资产`);
    setSelectedIds([]);
    load();
  };

  const doExport = () => {
    const rows = exportAssetsToXlsxData(data);
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '资产清单');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    downloadBlob(new Blob([buf]), `资产清单_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast(`已导出 ${data.length} 条`);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const wb = XLSX.read(ev.target?.result, { type: 'array' });
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) as Record<string, unknown>[];
        const { added, errors } = await importAssetsFromRows(rows);
        showToast(`成功导入 ${added} 条`);
        if (errors.length) showToast(errors.join('; '), 'warning');
        load();
      } catch {
        showToast('导入失败，请检查Excel格式', 'error');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const paged = data.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(data.length / pageSize);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button onClick={onOpenInbound} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">
            <Plus size={16} /> 新增入库
          </button>
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium hover:bg-slate-50">
            <Upload size={16} /> Excel导入
          </button>
          <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImport} />
          <button onClick={doExport} className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium hover:bg-slate-50">
            <Download size={16} /> 导出列表
          </button>
          <button
            onClick={() => batchChangeStatus('维保中', '批量维保派工')}
            disabled={!selectedIds.length}
            className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium hover:bg-slate-50 disabled:opacity-40"
          >
            <Wrench size={16} /> 批量维保
          </button>
          <button
            onClick={() => batchChangeStatus('已报废', '批量报废清理')}
            disabled={!selectedIds.length}
            className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-40"
          >
            <Trash2 size={16} /> 批量报废
          </button>
          <button disabled className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-400 rounded-xl text-sm font-medium cursor-not-allowed">
            <Printer size={16} /> 打印标签
          </button>
        </div>
        <span className="text-sm text-slate-500">共 {data.length} 条资产，已选 {selectedIds.length} 项</span>
      </div>

      <div className="pro-card p-4 bg-[var(--card-bg)]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="编号/名称/使用人"
              defaultValue={filter.keyword}
              onChange={e => { const next = { ...filter, keyword: e.target.value }; setFilter(next); load(next); }}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm"
            />
          </div>
          <select
            onChange={e => { const next = { ...filter, status: e.target.value as AssetFilter['status'] }; setFilter(next); load(next); }}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm"
          >
            <option value="">全部状态</option>
            {ASSET_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            onChange={e => { const next = { ...filter, useDept: e.target.value }; setFilter(next); load(next); }}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm"
          >
            <option value="">全部部门</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button onClick={() => { setFilter({}); load({}); setPage(1); }} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-sm hover:bg-slate-50 dark:hover:bg-white/5">
            重置筛选
          </button>
        </div>
      </div>

      <div className="pro-card overflow-hidden bg-[var(--card-bg)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 text-xs uppercase">
                <th className="px-4 py-3 text-left">状态</th>
                <th className="px-4 py-3 text-left">
                  <button onClick={togglePageSelect} className="flex items-center gap-1 text-slate-500 hover:text-blue-600">
                    <CheckSquare size={14} /> 选择
                  </button>
                </th>
                <th className="px-4 py-3 text-left">资产编号</th>
                <th className="px-4 py-3 text-left">资产名称</th>
                <th className="px-4 py-3 text-left">分类</th>
                <th className="px-4 py-3 text-left">使用人/部门</th>
                <th className="px-4 py-3 text-left">存放位置</th>
                <th className="px-4 py-3 text-left">净值</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-slate-400">加载中...</td></tr>
              ) : paged.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-slate-400">暂无数据</td></tr>
              ) : paged.map(row => (
                <tr key={row.id} className="border-t border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                  <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedIds.includes(row.id)} onChange={() => toggleSelect(row.id)} className="rounded" />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{row.assetNo}</td>
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-slate-500">{row.categoryName}</td>
                  <td className="px-4 py-3">{row.usePerson} / {row.useDept}</td>
                  <td className="px-4 py-3 text-slate-500 max-w-[160px] truncate">{row.locationPath}</td>
                  <td className="px-4 py-3">¥{(row.netValue || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openDetail(row)} className="text-blue-600 hover:underline text-xs font-semibold">查</button>
                    <button onClick={() => quickReceive(row)} className="text-emerald-600 hover:underline text-xs font-semibold">领用</button>
                    <button onClick={() => quickScrap(row)} className="text-red-600 hover:underline text-xs font-semibold">报废</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-white/5">
            <span className="text-xs text-slate-500">第 {page}/{totalPages} 页</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded-lg border text-xs disabled:opacity-40">上一页</button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded-lg border text-xs disabled:opacity-40">下一页</button>
            </div>
          </div>
        )}
      </div>

      {drawerAsset && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerAsset(null)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-between">
              <div>
                <div className="font-bold text-lg">{drawerAsset.name}</div>
                <div className="text-sm text-slate-500 font-mono">{drawerAsset.assetNo}</div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={drawerAsset.status} />
                <button onClick={() => setDrawerAsset(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg"><X size={20} /></button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-slate-500">分类</span><div className="font-medium">{drawerAsset.categoryName}</div></div>
                <div><span className="text-slate-500">规格型号</span><div className="font-medium">{drawerAsset.modelSpec}</div></div>
                <div><span className="text-slate-500">存放位置</span><div className="font-medium">{drawerAsset.locationPath}</div></div>
                <div><span className="text-slate-500">使用人</span><div className="font-medium">{drawerAsset.usePerson} / {drawerAsset.useDept}</div></div>
                <div><span className="text-slate-500">购入日期</span><div className="font-medium">{drawerAsset.purchaseDate}</div></div>
                <div><span className="text-slate-500">购入价格</span><div className="font-medium">¥{(drawerAsset.purchasePrice || 0).toLocaleString()}</div></div>
                <div><span className="text-slate-500">原值</span><div className="font-medium">¥{(drawerAsset.originalValue || 0).toLocaleString()}</div></div>
                <div><span className="text-slate-500">净值</span><div className="font-medium text-blue-600">¥{(drawerAsset.netValue || 0).toLocaleString()}</div></div>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><Clock size={16} /> 操作履历</h4>
                <div className="space-y-3 border-l-2 border-blue-200 dark:border-blue-500/30 pl-4 ml-2">
                  {logs.map(l => (
                    <div key={l.id} className="relative">
                      <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <div className="text-sm font-medium">{l.type} · {l.operator}</div>
                      <div className="text-xs text-slate-500">{new Date(l.operateTime).toLocaleString()}{l.remark ? ` · ${l.remark}` : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
