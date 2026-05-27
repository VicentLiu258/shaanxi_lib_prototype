import React, { useEffect, useMemo, useState } from 'react';
import { PieChart, TrendingDown, WalletCards } from 'lucide-react';
import { EchartsWrapper } from '../../../components/visualization/EchartsWrapper';
import { Asset } from '../types';
import { getAssets } from '../mock/api';

function sum(rows: Asset[], pick: (asset: Asset) => number) {
  return rows.reduce((total, row) => total + pick(row), 0);
}

export function FinanceReportPage() {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => { getAssets().then(setAssets); }, []);

  const summary = useMemo(() => {
    const originalValue = sum(assets, a => a.originalValue || a.purchasePrice || 0);
    const netValue = sum(assets, a => a.netValue || 0);
    const depreciation = Math.max(0, originalValue - netValue);
    const activeAssets = assets.filter(a => a.status !== '已报废');
    return {
      originalValue,
      netValue,
      depreciation,
      rate: originalValue ? Math.round((depreciation / originalValue) * 100) : 0,
      activeCount: activeAssets.length,
    };
  }, [assets]);

  const deptRows = useMemo(() => {
    const map = new Map<string, { count: number; original: number; net: number }>();
    assets.forEach(asset => {
      const item = map.get(asset.useDept) || { count: 0, original: 0, net: 0 };
      item.count += 1;
      item.original += asset.originalValue || asset.purchasePrice || 0;
      item.net += asset.netValue || 0;
      map.set(asset.useDept, item);
    });
    return Array.from(map.entries())
      .map(([dept, value]) => ({ dept, ...value, depreciation: value.original - value.net }))
      .sort((a, b) => b.original - a.original);
  }, [assets]);

  const chartOption = {
    tooltip: { trigger: 'axis' },
    legend: { top: 0 },
    grid: { left: 70, right: 20, top: 44, bottom: 24 },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: deptRows.map(row => row.dept) },
    series: [
      { name: '原值', type: 'bar', data: deptRows.map(row => row.original), color: '#2563eb' },
      { name: '净值', type: 'bar', data: deptRows.map(row => row.net), color: '#10b981' },
    ],
  };

  const cards = [
    { label: '资产原值', value: `¥${summary.originalValue.toLocaleString()}`, icon: WalletCards, color: 'text-blue-600' },
    { label: '当前净值', value: `¥${summary.netValue.toLocaleString()}`, icon: PieChart, color: 'text-emerald-600' },
    { label: '累计折旧', value: `¥${summary.depreciation.toLocaleString()}`, icon: TrendingDown, color: 'text-amber-600' },
    { label: '折旧率', value: `${summary.rate}%`, icon: TrendingDown, color: 'text-red-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.label} className="pro-card p-5 bg-[var(--card-bg)]">
            <card.icon size={20} className={card.color} />
            <div className="text-xl font-black text-slate-900 dark:text-white mt-3">{card.value}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 pro-card p-4 bg-[var(--card-bg)]">
          <h3 className="font-bold text-sm mb-4">部门资产原值/净值对比</h3>
          <EchartsWrapper option={chartOption} height="360px" />
        </div>

        <div className="xl:col-span-2 pro-card bg-[var(--card-bg)] overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5">
            <h3 className="font-bold text-sm">部门折旧明细</h3>
            <p className="text-xs text-slate-500 mt-1">当前入账资产 {summary.activeCount} 件，不含已报废资产的使用口径可在后续接入财务接口。</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 text-xs">
                <th className="px-4 py-3 text-left">部门</th>
                <th className="px-4 py-3 text-right">数量</th>
                <th className="px-4 py-3 text-right">净值</th>
                <th className="px-4 py-3 text-right">折旧</th>
              </tr>
            </thead>
            <tbody>
              {deptRows.map(row => (
                <tr key={row.dept} className="border-t border-slate-100 dark:border-white/5">
                  <td className="px-4 py-3 font-medium">{row.dept}</td>
                  <td className="px-4 py-3 text-right">{row.count}</td>
                  <td className="px-4 py-3 text-right text-emerald-600">¥{row.net.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-amber-600">¥{row.depreciation.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
