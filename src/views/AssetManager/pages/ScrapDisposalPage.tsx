import React, { useEffect, useState } from 'react';
import { ScrapRecord } from '../types';
import { getScrapRecords } from '../mock/api';
import { cn } from '../../../lib/utils';

const STATUS_STYLE: Record<string, string> = {
  '待审批': 'bg-amber-100 text-amber-700',
  '已通过': 'bg-emerald-100 text-emerald-700',
  '已驳回': 'bg-red-100 text-red-700',
};

export function ScrapDisposalPage() {
  const [records, setRecords] = useState<ScrapRecord[]>([]);

  useEffect(() => { getScrapRecords().then(setRecords); }, []);

  return (
    <div className="pro-card overflow-hidden bg-[var(--card-bg)]">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 font-bold text-sm">报废处置审批列表</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 text-xs uppercase">
            <th className="px-4 py-3 text-left">资产编号</th>
            <th className="px-4 py-3 text-left">名称</th>
            <th className="px-4 py-3 text-left">报废原因</th>
            <th className="px-4 py-3 text-right">原值</th>
            <th className="px-4 py-3 text-left">申请日期</th>
            <th className="px-4 py-3 text-left">状态</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.id} className="border-t border-slate-100 dark:border-white/5">
              <td className="px-4 py-3 font-mono text-xs">{r.assetNo}</td>
              <td className="px-4 py-3 font-medium">{r.name}</td>
              <td className="px-4 py-3 text-slate-500">{r.reason}</td>
              <td className="px-4 py-3 text-right">¥{r.originalValue.toLocaleString()}</td>
              <td className="px-4 py-3 text-slate-500">{r.applyDate}</td>
              <td className="px-4 py-3">
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', STATUS_STYLE[r.status])}>{r.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
