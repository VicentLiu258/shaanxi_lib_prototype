import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { OperationLog } from '../types';
import { getAllLogs } from '../mock/api';

export function AssetHistoryPage() {
  const [logs, setLogs] = useState<OperationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllLogs(50).then(l => { setLogs(l); setLoading(false); });
  }, []);

  return (
    <div className="pro-card bg-[var(--card-bg)] overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 font-bold text-sm flex items-center gap-2">
        <Clock size={16} /> 资产操作履历（最近 50 条）
      </div>
      {loading ? (
        <div className="p-12 text-center text-slate-400">加载中...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 text-xs uppercase">
                <th className="px-4 py-3 text-left">操作类型</th>
                <th className="px-4 py-3 text-left">资产</th>
                <th className="px-4 py-3 text-left">操作人</th>
                <th className="px-4 py-3 text-left">状态变更</th>
                <th className="px-4 py-3 text-left">时间</th>
                <th className="px-4 py-3 text-left">备注</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id} className="border-t border-slate-100 dark:border-white/5">
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold">{l.type}</span></td>
                  <td className="px-4 py-3"><div className="font-medium">{l.assetName}</div><div className="text-xs text-slate-400 font-mono">{l.assetNo}</div></td>
                  <td className="px-4 py-3">{l.operator}</td>
                  <td className="px-4 py-3 text-xs">{l.beforeStatus && l.afterStatus ? `${l.beforeStatus} → ${l.afterStatus}` : '-'}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{new Date(l.operateTime).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 max-w-[200px] truncate">{l.remark || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
