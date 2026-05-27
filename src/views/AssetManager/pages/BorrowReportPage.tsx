import React, { useEffect, useMemo, useState } from 'react';
import { Download, Search } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Asset } from '../types';
import { getAssets, exportAssetsToXlsxData } from '../mock/api';
import { StatusBadge, downloadBlob } from '../components/shared';

export function BorrowReportPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [keyword, setKeyword] = useState('');
  const [scope, setScope] = useState<'all' | 'borrow' | 'inuse'>('all');

  useEffect(() => { getAssets().then(setAssets); }, []);

  const rows = useMemo(() => {
    return assets
      .filter(asset => asset.status === '借用中' || asset.status === '在用')
      .filter(asset => scope === 'all' || (scope === 'borrow' ? asset.status === '借用中' : asset.status === '在用'))
      .filter(asset => {
        const value = `${asset.assetNo} ${asset.name} ${asset.usePerson} ${asset.useDept} ${asset.locationPath}`.toLowerCase();
        return value.includes(keyword.toLowerCase());
      });
  }, [assets, keyword, scope]);

  const exportRows = () => {
    const ws = XLSX.utils.json_to_sheet(exportAssetsToXlsxData(rows));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '借用账');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    downloadBlob(new Blob([buf]), `资产借用账_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const stats = [
    { label: '账内资产', value: rows.length },
    { label: '借用中', value: rows.filter(a => a.status === '借用中').length },
    { label: '在用', value: rows.filter(a => a.status === '在用').length },
    { label: '涉及部门', value: new Set(rows.map(a => a.useDept)).size },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(item => (
          <div key={item.label} className="pro-card p-4 bg-[var(--card-bg)]">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{item.value}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="pro-card p-4 bg-[var(--card-bg)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="编号/名称/使用人/部门"
              className="w-64 pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm"
            />
          </div>
          <select
            value={scope}
            onChange={e => setScope(e.target.value as typeof scope)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm"
          >
            <option value="all">全部领用/借用</option>
            <option value="borrow">仅借用中</option>
            <option value="inuse">仅在用</option>
          </select>
        </div>
        <button onClick={exportRows} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">
          <Download size={16} /> 导出借用账
        </button>
      </div>

      <div className="pro-card overflow-hidden bg-[var(--card-bg)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 text-xs uppercase">
                <th className="px-4 py-3 text-left">状态</th>
                <th className="px-4 py-3 text-left">资产编号</th>
                <th className="px-4 py-3 text-left">资产名称</th>
                <th className="px-4 py-3 text-left">使用人</th>
                <th className="px-4 py-3 text-left">部门</th>
                <th className="px-4 py-3 text-left">位置</th>
                <th className="px-4 py-3 text-right">净值</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(asset => (
                <tr key={asset.id} className="border-t border-slate-100 dark:border-white/5">
                  <td className="px-4 py-3"><StatusBadge status={asset.status} /></td>
                  <td className="px-4 py-3 font-mono text-xs">{asset.assetNo}</td>
                  <td className="px-4 py-3 font-medium">{asset.name}</td>
                  <td className="px-4 py-3">{asset.usePerson}</td>
                  <td className="px-4 py-3 text-slate-500">{asset.useDept}</td>
                  <td className="px-4 py-3 text-slate-500 max-w-[220px] truncate">{asset.locationPath}</td>
                  <td className="px-4 py-3 text-right">¥{(asset.netValue || 0).toLocaleString()}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">暂无借用账数据</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
