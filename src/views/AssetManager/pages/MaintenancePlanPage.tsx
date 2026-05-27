import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, Wrench } from 'lucide-react';
import { Asset } from '../types';
import { getAssets, updateAssetStatus } from '../mock/api';
import { StatusBadge } from '../components/shared';

interface Props {
  showToast: (msg: string, type?: 'success' | 'warning' | 'error') => void;
}

const today = '2026-05-27';

function daysBetween(date?: string) {
  if (!date) return 999;
  const start = new Date(today).getTime();
  const end = new Date(date).getTime();
  return Math.ceil((end - start) / 86400000);
}

export function MaintenancePlanPage({ showToast }: Props) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const load = () => getAssets().then(setAssets);
  useEffect(() => { load(); }, []);

  const plans = useMemo(() => {
    return assets
      .filter(a => a.maintenanceContract || a.nextMaintainDate || a.status === '维保中')
      .map(a => ({ ...a, dueDays: daysBetween(a.nextMaintainDate) }))
      .sort((a, b) => a.dueDays - b.dueDays);
  }, [assets]);

  const overdue = plans.filter(a => a.dueDays < 0).length;
  const dueSoon = plans.filter(a => a.dueDays >= 0 && a.dueDays <= 30).length;
  const maintaining = plans.filter(a => a.status === '维保中').length;

  const changeStatus = async (asset: Asset, status: '维保中' | '在用') => {
    setLoadingId(asset.id);
    await updateAssetStatus(asset.id, status, {
      remark: status === '维保中' ? '维保计划派工' : '维保完成恢复使用',
    });
    showToast(status === '维保中' ? '已派工维保' : '已完成维保');
    await load();
    setLoadingId(null);
  };

  const cards = [
    { label: '超期维保', value: overdue, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-500/10' },
    { label: '30天内到期', value: dueSoon, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: '维保中', value: maintaining, icon: Wrench, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: '计划总数', value: plans.length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.label} className="pro-card p-5 bg-[var(--card-bg)]">
            <div className={`w-10 h-10 rounded-lg ${card.bg} ${card.color} flex items-center justify-center mb-3`}>
              <card.icon size={20} />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{card.value}</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="pro-card overflow-hidden bg-[var(--card-bg)]">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5">
          <h3 className="text-sm font-bold">重点设备维保台账</h3>
          <p className="text-xs text-slate-500 mt-1">基于合同、下次维保日期与资产状态生成待办队列。</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 text-xs uppercase">
                <th className="px-4 py-3 text-left">资产</th>
                <th className="px-4 py-3 text-left">状态</th>
                <th className="px-4 py-3 text-left">维保合同</th>
                <th className="px-4 py-3 text-left">下次维保</th>
                <th className="px-4 py-3 text-left">使用部门</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {plans.map(asset => {
                const urgent = asset.dueDays < 0;
                const warning = asset.dueDays >= 0 && asset.dueDays <= 30;
                return (
                  <tr key={asset.id} className="border-t border-slate-100 dark:border-white/5">
                    <td className="px-4 py-3">
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-xs text-slate-400 font-mono">{asset.assetNo}</div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={asset.status} /></td>
                    <td className="px-4 py-3 text-slate-500">{asset.maintenanceContract || '未签订'}</td>
                    <td className="px-4 py-3">
                      <div className={urgent ? 'text-red-600 font-semibold' : warning ? 'text-amber-600 font-semibold' : 'text-slate-600 dark:text-slate-300'}>
                        {asset.nextMaintainDate || '待排期'}
                      </div>
                      {asset.nextMaintainDate && (
                        <div className="text-xs text-slate-400">
                          {urgent ? `已超期 ${Math.abs(asset.dueDays)} 天` : `${asset.dueDays} 天后`}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{asset.useDept}</td>
                    <td className="px-4 py-3 text-right">
                      {asset.status === '维保中' ? (
                        <button
                          disabled={loadingId === asset.id}
                          onClick={() => changeStatus(asset, '在用')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-semibold hover:bg-emerald-200 disabled:opacity-50"
                        >
                          完成维保
                        </button>
                      ) : (
                        <button
                          disabled={loadingId === asset.id}
                          onClick={() => changeStatus(asset, '维保中')}
                          className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 disabled:opacity-50"
                        >
                          派工
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {plans.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">暂无维保计划</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
