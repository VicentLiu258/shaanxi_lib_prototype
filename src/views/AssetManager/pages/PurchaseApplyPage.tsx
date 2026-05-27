import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { PurchaseApplication } from '../types';
import { getPurchases, updatePurchaseStatus } from '../mock/api';
import { cn } from '../../../lib/utils';

interface Props {
  showToast: (msg: string, type?: 'success' | 'warning' | 'error') => void;
}

const STATUS_STYLE: Record<string, string> = {
  '待审批': 'bg-amber-100 text-amber-700',
  '已通过': 'bg-emerald-100 text-emerald-700',
  '已驳回': 'bg-red-100 text-red-700',
};

export function PurchaseApplyPage({ showToast }: Props) {
  const [purchases, setPurchases] = useState<PurchaseApplication[]>([]);

  const load = () => getPurchases().then(setPurchases);
  useEffect(() => { load(); }, []);

  const handleAction = async (id: string, status: '已通过' | '已驳回') => {
    await updatePurchaseStatus(id, status);
    showToast(status === '已通过' ? '采购申请已通过' : '采购申请已驳回');
    load();
  };

  return (
    <div className="pro-card overflow-hidden bg-[var(--card-bg)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 text-xs uppercase">
            <th className="px-4 py-3 text-left">申请编号</th>
            <th className="px-4 py-3 text-left">标题</th>
            <th className="px-4 py-3 text-left">申请人</th>
            <th className="px-4 py-3 text-right">金额</th>
            <th className="px-4 py-3 text-left">状态</th>
            <th className="px-4 py-3 text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map(p => (
            <tr key={p.id} className="border-t border-slate-100 dark:border-white/5">
              <td className="px-4 py-3 font-mono text-xs">{p.id}</td>
              <td className="px-4 py-3"><div className="font-medium">{p.title}</div><div className="text-xs text-slate-400">{p.items}</div></td>
              <td className="px-4 py-3">{p.applicant} / {p.dept}</td>
              <td className="px-4 py-3 text-right font-semibold">¥{p.amount.toLocaleString()}</td>
              <td className="px-4 py-3"><span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', STATUS_STYLE[p.status])}>{p.status}</span></td>
              <td className="px-4 py-3 text-right">
                {p.status === '待审批' && (
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleAction(p.id, '已通过')} className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200"><Check size={14} /></button>
                    <button onClick={() => handleAction(p.id, '已驳回')} className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"><X size={14} /></button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
