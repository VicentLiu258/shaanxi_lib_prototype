import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { EchartsWrapper } from '../../../components/visualization/EchartsWrapper';
import { getDashboardStats, getCategoryDistribution, getTopChemicalsInStock } from '../mock/api';
import { DashboardStats } from '../types';
import { DemoTriggerButton } from '../components/DemoRunner';

export function ScreenPage() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    getDashboardStats().then(setStats);
    const t1 = setInterval(() => setTime(new Date()), 1000);
    const t2 = setInterval(() => setTick(v => v + 1), 5000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  const jitter = (n: number) => Math.round(n * (1 + (Math.random() - 0.5) * 0.04 * (tick % 2 === 0 ? 1 : -1)));
  const pieData = getCategoryDistribution();
  const topChem = getTopChemicalsInStock();

  return (
    <div className="min-h-screen bg-[#0B1426] text-[#00E5FF] p-6">
      <header className="flex items-center justify-between mb-8 border-b border-[#00E5FF]/30 pb-4">
        <div className="text-sm font-mono">{time.toLocaleString('zh-CN')}</div>
        <h1 className="text-xl md:text-2xl font-black text-center text-white tracking-wider">
          示范大学 · 实验室危化品全生命周期监管驾驶舱
        </h1>
        <div className="flex items-center gap-3">
          <DemoTriggerButton demoId="screen" label="刷新演示" onComplete={() => setTick(v => v + 1)} className="!bg-[#00E5FF] !text-[#0B1426]" />
          <button
            type="button"
            onClick={() => navigate('/hc-manage/dashboard')}
            className="flex items-center gap-2 px-4 py-2 border border-[#00E5FF]/50 rounded text-sm hover:bg-[#00E5FF]/10"
          >
            <ArrowLeft size={16} /> 返回工作台
          </button>
        </div>
      </header>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: '在管瓶数', value: jitter(stats.bottleCount) },
            { label: '危废 kg', value: jitter(stats.wasteKg) },
            { label: '待办申购', value: jitter(stats.pendingPurchase) },
            { label: '本周预警', value: jitter(stats.weeklyAlerts) },
          ].map(c => (
            <div key={c.label} className="border border-[#00E5FF]/40 rounded-xl p-6 text-center bg-[#0B1426]/80">
              <div className="text-3xl font-black text-white">{c.value.toLocaleString()}</div>
              <div className="text-xs mt-2 text-[#00E5FF]/80">{c.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-[#00E5FF]/30 rounded-xl p-4">
          <EchartsWrapper height="280px" option={{
            backgroundColor: 'transparent',
            textStyle: { color: '#00E5FF' },
            series: [{ type: 'pie', radius: ['45%', '70%'], label: { color: '#fff' }, data: pieData.map(d => ({ name: d.name, value: d.value })) }],
          }} />
        </div>
        <div className="border border-[#00E5FF]/30 rounded-xl p-4">
          <EchartsWrapper height="280px" option={{
            backgroundColor: 'transparent',
            grid: { left: 90, right: 20 },
            xAxis: { type: 'value', axisLabel: { color: '#00E5FF' } },
            yAxis: { type: 'category', data: topChem.map(t => t.name).reverse(), axisLabel: { color: '#fff' } },
            series: [{ type: 'bar', data: topChem.map(t => jitter(t.count)).reverse(), itemStyle: { color: '#00E5FF' } }],
          }} />
        </div>
      </div>
    </div>
  );
}
