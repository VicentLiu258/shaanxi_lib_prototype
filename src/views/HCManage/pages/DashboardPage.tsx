import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Trash2, ShoppingCart, AlertTriangle, Monitor, ArrowRight } from 'lucide-react';
import { EchartsWrapper } from '../../../components/visualization/EchartsWrapper';
import {
  getDashboardStats, getAlerts, getCategoryDistribution, getTopChemicalsInStock, getBorrowReturnTrend,
} from '../mock/api';
import { DashboardStats, AlertEvent } from '../types';
import { StatusBadge } from '../components/shared';
import { DemoTriggerButton } from '../components/DemoRunner';

export function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = () => {
    setLoading(true);
    Promise.all([getDashboardStats(), getAlerts()])
      .then(([s, a]) => { setStats(s); setAlerts(a.slice(0, 8)); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, []);

  const pieData = getCategoryDistribution();
  const topChem = getTopChemicalsInStock();
  const trend = getBorrowReturnTrend();

  const statCards = stats ? [
    { label: '在管化学品瓶数', value: stats.bottleCount.toLocaleString(), icon: FlaskConical, color: 'text-blue-600' },
    { label: '当月危废产生量', value: `${stats.wasteKg} kg`, icon: Trash2, color: 'text-emerald-600' },
    { label: '待办申购', value: stats.pendingPurchase, icon: ShoppingCart, color: 'text-amber-600' },
    { label: '本周预警', value: stats.weeklyAlerts, icon: AlertTriangle, color: 'text-red-600' },
  ] : [];

  if (loading) return <div className="p-8 text-center text-slate-400">加载中...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-3">
        <DemoTriggerButton demoId="dashboard" onComplete={reload} />
        <button
          type="button"
          onClick={() => navigate('/hc-manage/screen')}
          className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg text-sm font-bold hover:bg-blue-800"
        >
          <Monitor size={16} /> 查看大屏
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(c => (
          <div key={c.label} className="pro-card p-5 bg-white border border-slate-100">
            <div className="flex justify-between mb-2"><span className="text-xs text-slate-500">{c.label}</span><c.icon size={18} className={c.color} /></div>
            <div className="text-2xl font-black text-slate-800">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="pro-card p-4 bg-white">
          <h3 className="text-sm font-bold mb-2">化学品分类占比</h3>
          <EchartsWrapper height="220px" option={{
            tooltip: { trigger: 'item' },
            series: [{ type: 'pie', radius: ['40%', '65%'], data: pieData.map(d => ({ name: d.name, value: d.value })) }],
          }} />
        </div>
        <div className="pro-card p-4 bg-white">
          <h3 className="text-sm font-bold mb-2">重点危化品 TOP10 在库量</h3>
          <EchartsWrapper height="220px" option={{
            grid: { left: 100, right: 20, top: 10, bottom: 30 },
            xAxis: { type: 'value' },
            yAxis: { type: 'category', data: topChem.map(t => t.name).reverse() },
            series: [{ type: 'bar', data: topChem.map(t => t.count).reverse(), itemStyle: { color: '#10B981' } }],
          }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 pro-card p-4 bg-white">
          <h3 className="text-sm font-bold mb-2">近30天领用 / 归还趋势</h3>
          <EchartsWrapper height="200px" option={{
            tooltip: { trigger: 'axis' },
            legend: { data: ['领用', '归还'] },
            xAxis: { type: 'category', data: trend.map(t => t.day) },
            yAxis: { type: 'value' },
            series: [
              { name: '领用', type: 'line', smooth: true, data: trend.map(t => t.borrow), color: '#1E3A8A' },
              { name: '归还', type: 'line', smooth: true, data: trend.map(t => t.return), color: '#10B981' },
            ],
          }} />
        </div>
        <div className="pro-card p-4 bg-white overflow-hidden">
          <h3 className="text-sm font-bold mb-3">预警事件</h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {alerts.map(a => (
              <div key={a.id} className="flex items-start gap-2 text-xs border-b pb-2">
                <StatusBadge status={a.level === '红' ? '报警' : '审批中'} />
                <div className="flex-1"><p className="font-medium">{a.type}</p><p className="text-slate-400">{a.source} · {a.time}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { path: '/hc-manage/flow/purchase', label: '申购管理' },
          { path: '/hc-manage/terminal-simulator', label: '智能终端模拟' },
          { path: '/hc-manage/waste/generate', label: '产废登记' },
          { path: '/hc-manage/risk/alert', label: '预警中心' },
        ].map(item => (
          <button
            key={item.path}
            type="button"
            onClick={() => navigate(item.path)}
            className="pro-card p-4 text-left hover:border-blue-300 flex items-center justify-between"
          >
            <span className="text-sm font-bold">{item.label}</span>
            <ArrowRight size={16} className="text-blue-600" />
          </button>
        ))}
      </div>
    </div>
  );
}
