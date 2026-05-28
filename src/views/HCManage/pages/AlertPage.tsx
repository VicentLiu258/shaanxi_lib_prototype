import React, { useEffect, useState } from 'react';
import { getAlerts } from '../mock/api';
import { AlertEvent } from '../types';
import { StatusBadge } from '../components/shared';
import { DemoTriggerButton } from '../components/DemoRunner';

export function AlertPage() {
  const [list, setList] = useState<AlertEvent[]>([]);
  const [detail, setDetail] = useState<AlertEvent | null>(null);

  const reload = () => getAlerts().then(setList);
  useEffect(() => { reload(); }, []);

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <DemoTriggerButton demoId="alert" onComplete={reload} />
      </div>
      <div className="pro-card overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50"><tr>
            <th className="p-3 text-left">等级</th><th className="p-3 text-left">类型</th><th className="p-3 text-left">来源</th>
            <th className="p-3 text-left">时间</th><th className="p-3 text-left">状态</th><th className="p-3 text-left">操作</th>
          </tr></thead>
          <tbody>
            {list.map(a => (
              <tr key={a.id} className="border-t">
                <td className="p-3"><span className={`font-bold ${a.level === '红' ? 'text-red-600' : a.level === '橙' ? 'text-orange-600' : 'text-amber-600'}`}>{a.level}</span></td>
                <td className="p-3">{a.type}</td>
                <td className="p-3 text-xs">{a.source}</td>
                <td className="p-3 text-xs">{a.time}</td>
                <td className="p-3"><StatusBadge status={a.status === '待处置' ? '待审核' : '审核通过'} /></td>
                <td className="p-3"><button type="button" className="text-blue-600 text-xs" onClick={() => setDetail(a)}>详情</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="font-bold mb-2">{detail.type}</h3>
            <p className="text-sm text-slate-600">触发快照：温度 28.1℃（阈值 25℃）</p>
            <ol className="text-xs mt-4 space-y-1"><li>10:00 系统自动触发</li><li>10:15 指派 {detail.handler || '待指派'}</li></ol>
            <button type="button" className="mt-4 w-full py-2 border rounded" onClick={() => setDetail(null)}>关闭</button>
          </div>
        </div>
      )}
    </div>
  );
}
