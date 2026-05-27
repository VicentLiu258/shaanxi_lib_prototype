import React, { useEffect, useState } from 'react';
import { getCategoryStats } from '../mock/api';
import { EchartsWrapper } from '../../../components/visualization/EchartsWrapper';

export function CategoryReportPage() {
  const [stats, setStats] = useState<Array<{ category: string; count: number; value: number }>>([]);

  useEffect(() => { getCategoryStats().then(setStats); }, []);

  const barOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 80, right: 20, top: 30, bottom: 30 },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: stats.map(s => s.category) },
    series: [
      { name: '数量', type: 'bar', data: stats.map(s => s.count), color: '#2563eb' },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="pro-card p-4 bg-[var(--card-bg)]">
          <h3 className="font-bold text-sm mb-4">分类数量分布</h3>
          <EchartsWrapper option={barOption} height="320px" />
        </div>
        <div className="pro-card overflow-hidden bg-[var(--card-bg)]">
          <h3 className="font-bold text-sm p-4 border-b border-slate-100 dark:border-white/5">分类统计明细</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 text-xs">
                <th className="px-4 py-2 text-left">分类</th>
                <th className="px-4 py-2 text-right">数量</th>
                <th className="px-4 py-2 text-right">净值合计</th>
              </tr>
            </thead>
            <tbody>
              {stats.map(s => (
                <tr key={s.category} className="border-t border-slate-100 dark:border-white/5">
                  <td className="px-4 py-3 font-medium">{s.category}</td>
                  <td className="px-4 py-3 text-right">{s.count}</td>
                  <td className="px-4 py-3 text-right text-blue-600">¥{s.value.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
