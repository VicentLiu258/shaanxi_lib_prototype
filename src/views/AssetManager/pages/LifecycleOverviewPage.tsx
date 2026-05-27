import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ClipboardCheck, Database, PackagePlus, ShoppingCart, Trash2, UserCheck, Wrench } from 'lucide-react';
import { Asset, OperationLog, PurchaseApplication, ScrapRecord } from '../types';
import { getAllLogs, getAssets, getPurchases, getScrapRecords } from '../mock/api';
import { StatusBadge } from '../components/shared';

interface Props {
  onNavigate: (key: string) => void;
}

export function LifecycleOverviewPage({ onNavigate }: Props) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [logs, setLogs] = useState<OperationLog[]>([]);
  const [purchases, setPurchases] = useState<PurchaseApplication[]>([]);
  const [scraps, setScraps] = useState<ScrapRecord[]>([]);

  useEffect(() => {
    Promise.all([getAssets(), getAllLogs(12), getPurchases(), getScrapRecords()])
      .then(([assetRows, logRows, purchaseRows, scrapRows]) => {
        setAssets(assetRows);
        setLogs(logRows);
        setPurchases(purchaseRows);
        setScraps(scrapRows);
      });
  }, []);

  const stages = useMemo(() => [
    {
      key: 'purchase',
      title: '采购申请',
      desc: '需求提出、预算审核、审批流转',
      count: purchases.filter(p => p.status === '待审批').length,
      icon: ShoppingCart,
      action: '查看申请',
    },
    {
      key: 'asset-inbound',
      title: '资产入库',
      desc: '验收建账、编号生成、位置绑定',
      count: logs.filter(l => l.type === '入库').length,
      icon: PackagePlus,
      action: '登记入库',
    },
    {
      key: 'asset-list',
      title: '台账管理',
      desc: '资产清单、批量导入、状态维护',
      count: assets.length,
      icon: Database,
      action: '打开清单',
    },
    {
      key: 'asset-receive',
      title: '领用借用',
      desc: '人员部门绑定、预计归还、履历留痕',
      count: assets.filter(a => a.status === '在用' || a.status === '借用中').length,
      icon: UserCheck,
      action: '办理领用',
    },
    {
      key: 'asset-maintenance',
      title: '维保巡检',
      desc: '维保到期、派工处理、恢复使用',
      count: assets.filter(a => a.status === '维保中' || a.nextMaintainDate).length,
      icon: Wrench,
      action: '查看计划',
    },
    {
      key: 'asset-inventory',
      title: '盘点核验',
      desc: '扫码盘点、盘盈盘亏、差异追踪',
      count: logs.filter(l => l.type === '盘点').length || 1,
      icon: ClipboardCheck,
      action: '发起盘点',
    },
    {
      key: 'scrap',
      title: '报废处置',
      desc: '报废申请、审批、资产状态闭环',
      count: scraps.length,
      icon: Trash2,
      action: '查看处置',
    },
  ], [assets, logs, purchases, scraps]);

  const riskAssets = assets
    .filter(a => a.status === '已报废' || a.status === '维保中' || (a.nextMaintainDate && a.nextMaintainDate < '2026-06-01'))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="pro-card p-5 bg-[var(--card-bg)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-lg text-slate-900 dark:text-white">资产全生命周期闭环</h3>
            <p className="text-sm text-slate-500 mt-1">覆盖采购、入库、领用、维保、盘点、报废与财务折旧，所有动作沉淀到资产履历。</p>
          </div>
          <button onClick={() => onNavigate('asset-history')} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">
            查看履历
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-3">
        {stages.map((stage, index) => (
          <div key={stage.key} className="relative">
            <button
              onClick={() => onNavigate(stage.key)}
              className="w-full h-full pro-card p-4 bg-[var(--card-bg)] text-left hover:border-blue-200 dark:hover:border-blue-500/40 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
                <stage.icon size={19} />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{stage.count}</div>
              <h4 className="font-bold text-sm mt-1">{stage.title}</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed min-h-12">{stage.desc}</p>
              <div className="text-xs font-bold text-blue-600 mt-4">{stage.action}</div>
            </button>
            {index < stages.length - 1 && (
              <ArrowRight size={16} className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-slate-300 z-10" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="pro-card bg-[var(--card-bg)] overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 font-bold text-sm">风险资产提醒</div>
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {riskAssets.map(asset => (
              <div key={asset.id} className="px-4 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{asset.name}</div>
                  <div className="text-xs text-slate-500 font-mono">{asset.assetNo} · {asset.useDept}</div>
                </div>
                <StatusBadge status={asset.status} />
              </div>
            ))}
            {riskAssets.length === 0 && <div className="p-8 text-center text-slate-400 text-sm">暂无风险资产</div>}
          </div>
        </div>

        <div className="pro-card bg-[var(--card-bg)] overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 font-bold text-sm">最近业务流转</div>
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {logs.map(log => (
              <div key={log.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="font-medium text-sm">{log.assetName}</div>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold">{log.type}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {log.operator} · {new Date(log.operateTime).toLocaleString()} {log.remark ? `· ${log.remark}` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
