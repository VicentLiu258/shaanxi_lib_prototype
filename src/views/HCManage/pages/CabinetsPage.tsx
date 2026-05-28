import React, { useEffect, useState } from 'react';
import { getCabinets } from '../mock/api';
import { CabinetDevice } from '../types';
import { StatusBadge } from '../components/shared';
import { DemoTriggerButton } from '../components/DemoRunner';

export function CabinetsPage() {
  const [list, setList] = useState<CabinetDevice[]>([]);
  const [sel, setSel] = useState<CabinetDevice | null>(null);

  const reload = () => getCabinets().then(data => {
    setList(data);
    if (data[1]) setSel(data[1]);
  });
  useEffect(() => { getCabinets().then(data => { setList(data); setSel(data[1] || null); }); }, []);

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <DemoTriggerButton demoId="cabinets" onComplete={reload} />
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 pro-card overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50"><tr>
            <th className="p-3 text-left">编号</th><th className="p-3 text-left">型号</th><th className="p-3 text-left">房间</th>
            <th className="p-3 text-left">在存</th><th className="p-3 text-left">温湿度</th><th className="p-3 text-left">状态</th>
          </tr></thead>
          <tbody>
            {list.map(c => (
              <tr key={c.id} className="border-t cursor-pointer hover:bg-blue-50" onClick={() => setSel(c)}>
                <td className="p-3 font-mono text-xs">{c.code}</td>
                <td className="p-3">{c.model}</td>
                <td className="p-3 text-xs">{c.room}</td>
                <td className="p-3">{c.bottleCount}/{c.capacity}</td>
                <td className="p-3 text-xs">{c.temperature.toFixed(1)}℃ / {c.humidity}%</td>
                <td className="p-3"><StatusBadge status={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sel && (
        <div className="pro-card p-4 bg-white space-y-3">
          <h3 className="font-bold">{sel.code}</h3>
          <p className="text-xs text-slate-500">VOC {sel.voc.toFixed(2)}ppm · O₂ {sel.oxygen}%</p>
          <p className="text-xs">最近开门：{sel.lastOpen}</p>
          <div className="flex flex-wrap gap-2">
            {['远程锁定', '解锁', '启动排风', '查看摄像头'].map(a => (
              <button key={a} type="button" className="px-3 py-1.5 border rounded text-xs hover:bg-slate-50">{a}</button>
            ))}
          </div>
          <div className="h-24 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-400">摄像头占位画面</div>
        </div>
      )}
      </div>
    </div>
  );
}
