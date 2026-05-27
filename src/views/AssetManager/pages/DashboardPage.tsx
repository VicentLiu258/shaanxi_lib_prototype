import React, { useEffect, useState } from 'react';
import { Database, PlayCircle, PauseCircle, AlertTriangle, Percent, ArrowRight, TrendingUp, GitBranch, WalletCards, Wrench } from 'lucide-react';
import { EchartsWrapper } from '../../../components/visualization/EchartsWrapper';
import { DashboardStats, MonthlyNewAsset, BusinessDistribution, OperationLog } from '../types';
import { getDashboardStats, getMonthlyNewAssets, getBusinessDistribution, getRecentLogs } from '../mock/api';
import { cn } from '../../../lib/utils';

interface Props {
  onNavigate: (key: string) => void;
}

export function DashboardPage({ onNavigate }: Props) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthly, setMonthly] = useState<MonthlyNewAsset[]>([]);
  const [bizDist, setBizDist] = useState<BusinessDistribution[]>([]);
  const [recentLogs, setRecentLogs] = useState<OperationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getMonthlyNewAssets(), getBusinessDistribution(), getRecentLogs()])
      .then(([s, m, b, logs]) => { setStats(s); setMonthly(m); setBizDist(b); setRecentLogs(logs); })
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: '资产总量', value: stats.total, icon: Database, color: 'text-blue-600' },
    { label: '在用资产', value: stats.inUse, icon: PlayCircle, color: 'text-emerald-600' },
    { label: '闲置资产', value: stats.idle, icon: PauseCircle, color: 'text-amber-600' },
    { label: '维保到期', value: stats.maintenanceDue, icon: AlertTriangle, color: 'text-red-600' },
    { label: '使用率', value: `${stats.utilization}%`, icon: Percent, color: 'text-purple-600' },
  ] : [];

  const lineOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 30, bottom: 30 },
    xAxis: { type: 'category', data: monthly.map(m => m.month) },
    yAxis: { type: 'value' },
    series: [{ name: '新增资产', data: monthly.map(m => m.count), type: 'line', smooth: true, areaStyle: { opacity: 0.15 }, color: '#2563eb' }],
  };

  const pieOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, left: 'center', textStyle: { fontSize: 10 } },
    series: [{
      name: '业务分布', type: 'pie', radius: ['42%', '68%'],
      data: bizDist.map(d => ({ name: d.type, value: d.count })),
    }],
  };

  const quickEntries = [
    { key: 'asset-inbound', label: '资产入库', icon: TrendingUp },
    { key: 'asset-list', label: '资产清单', icon: Database },
    { key: 'asset-receive', label: '资产领用', icon: ArrowRight },
    { key: 'asset-maintenance', label: '维保计划', icon: Wrench },
    { key: 'lifecycle', label: '流转总览', icon: GitBranch },
    { key: 'report-finance', label: '财务折旧', icon: WalletCards },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-400">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="pro-card p-5 bg-[var(--card-bg)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-medium">{card.label}</span>
              <card.icon size={18} className={card.color} />
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-white">{card.value}</div>
          </div>
        ))}
      </div>

      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 pro-card p-4 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20">
            <span className="text-sm text-blue-700 dark:text-blue-300">
              资产净值合计：<strong className="text-lg">¥{stats.totalValue.toLocaleString()}</strong>
            </span>
            <p className="text-xs text-blue-600/80 dark:text-blue-300/70 mt-1">
              当前演示数据覆盖入库、领用、维保、盘点、报废和折旧口径，可通过左侧菜单切换完整业务。
            </p>
          </div>
          <button
            onClick={() => onNavigate('lifecycle')}
            className="pro-card p-4 bg-[var(--card-bg)] text-left hover:border-blue-200 dark:hover:border-blue-500/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">生命周期总览</span>
              <ArrowRight size={18} className="text-blue-600" />
            </div>
            <p className="text-xs text-slate-500 mt-2">从采购到报废的一张流程图，适合汇报和联调。</p>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 pro-card p-4 bg-[var(--card-bg)]">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">每月新增资产趋势</h3>
          <EchartsWrapper option={lineOption} height="280px" />
        </div>
        <div className="lg:col-span-2 pro-card p-4 bg-[var(--card-bg)]">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">业务分布</h3>
          <EchartsWrapper option={pieOption} height="280px" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="pro-card p-4 bg-[var(--card-bg)]">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">快捷入口</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickEntries.map(entry => (
              <button
                key={entry.key}
                onClick={() => onNavigate(entry.key)}
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                <entry.icon size={16} className="text-blue-600" />
                {entry.label}
              </button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 pro-card p-4 bg-[var(--card-bg)]">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">最近操作</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {recentLogs.map(log => (
              <div key={log.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={cn('px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400')}>
                    {log.type}
                  </span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">{log.assetName}</span>
                </div>
                <span className="text-xs text-slate-400">{log.operator} · {new Date(log.operateTime).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
