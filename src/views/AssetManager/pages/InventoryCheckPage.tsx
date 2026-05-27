import React, { useEffect, useState } from 'react';
import { QrCode } from 'lucide-react';
import { InventoryItem } from '../types';
import { getInventoryItems, scanInventoryItem } from '../mock/api';
import { cn } from '../../../lib/utils';

interface Props {
  showToast: (msg: string, type?: 'success' | 'warning' | 'error') => void;
}

export function InventoryCheckPage({ showToast }: Props) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [scanning, setScanning] = useState(false);

  const load = () => getInventoryItems().then(setItems);
  useEffect(() => { load(); }, []);

  const checked = items.filter(i => i.status === '已盘').length;
  const total = items.length;
  const pct = total ? Math.round((checked / total) * 100) : 0;

  const simulateScan = async () => {
    setScanning(true);
    const uninspected = items.find(i => i.status === '未盘');
    if (!uninspected) {
      showToast('所有资产已盘点完毕', 'warning');
      setScanning(false);
      return;
    }
    await new Promise(r => setTimeout(r, 800));
    const result = await scanInventoryItem(uninspected.id);
    if (result) showToast(`扫码成功：${result.name}`);
    load();
    setScanning(false);
  };

  const STATUS_STYLE: Record<string, string> = {
    '未盘': 'bg-slate-100 text-slate-600',
    '已盘': 'bg-emerald-100 text-emerald-700',
    '盘亏': 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <div className="pro-card p-6 bg-[var(--card-bg)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold">2026年度资产盘点</h3>
            <p className="text-sm text-slate-500 mt-1">已盘 {checked} / {total} 件</p>
          </div>
          <button
            onClick={simulateScan}
            disabled={scanning}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            <QrCode size={18} /> {scanning ? '扫描中...' : '模拟扫码盘点'}
          </button>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="text-right text-sm font-bold text-blue-600 mt-1">{pct}%</div>
      </div>

      <div className="pro-card overflow-hidden bg-[var(--card-bg)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 text-xs uppercase">
              <th className="px-4 py-3 text-left">资产编号</th>
              <th className="px-4 py-3 text-left">名称</th>
              <th className="px-4 py-3 text-left">位置</th>
              <th className="px-4 py-3 text-left">盘点状态</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-t border-slate-100 dark:border-white/5">
                <td className="px-4 py-3 font-mono text-xs">{item.assetNo}</td>
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3 text-slate-500">{item.location}</td>
                <td className="px-4 py-3">
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', STATUS_STYLE[item.status])}>{item.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
