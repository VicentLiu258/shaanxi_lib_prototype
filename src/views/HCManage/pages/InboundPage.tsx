import React, { useEffect, useState } from 'react';
import { getInboundReviews, updateInboundReview } from '../mock/api';
import { ReviewRecord } from '../types';
import { ReviewDrawer } from '../components/ReviewDrawer';
import { StatusBadge, FilterInput } from '../components/shared';
import { DemoTriggerButton } from '../components/DemoRunner';

export function InboundPage({ showToast }: { showToast: (m: string) => void }) {
  const [list, setList] = useState<ReviewRecord[]>([]);
  const [status, setStatus] = useState('全部');
  const [kw, setKw] = useState('');
  const [record, setRecord] = useState<ReviewRecord | null>(null);
  const [mode, setMode] = useState<'audit' | 'view'>('view');
  const [open, setOpen] = useState(false);
  const [scanRows, setScanRows] = useState<string[]>([]);
  const [scanInput, setScanInput] = useState('');

  const load = () => getInboundReviews().then(setList);
  useEffect(() => { load(); }, []);

  const filtered = list.filter(r =>
    (status === '全部' || r.status === status) &&
    (!kw || r.applicant.includes(kw) || r.batchNo?.includes(kw)),
  );

  const handleScan = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && scanInput.trim()) {
      setScanRows(prev => [...prev, `LC-2026-SCAN-${prev.length + 1}`]);
      setScanInput('');
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-end">
        <DemoTriggerButton demoId="inbound" onComplete={() => {
          load();
          setScanRows(['LC-2026-SCAN-001', 'LC-2026-SCAN-002', 'LC-2026-SCAN-003']);
          showToast('演示：扫码 3 件并完成验收赋码');
        }} />
      </div>
      <div className="pro-card p-4 bg-white">
        <h3 className="font-bold mb-3">验收赋码（模拟扫码）</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <input
              value={scanInput}
              onChange={e => setScanInput(e.target.value)}
              onKeyDown={handleScan}
              placeholder="扫描枪输入后回车追加"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
            <p className="text-xs text-slate-500 mt-2">已扫 {scanRows.length} 件</p>
          </div>
          <ul className="text-xs space-y-1 max-h-32 overflow-y-auto border rounded-lg p-2">
            {scanRows.map(c => <li key={c} className="font-mono">{c} · 合格</li>)}
          </ul>
        </div>
        <button type="button" className="mt-3 text-sm text-blue-600 font-bold" onClick={() => showToast('标签预览已打开（4张 50×30mm）')}>批量打印标签</button>
      </div>

      <FilterInput value={kw} onChange={setKw} placeholder="申请人 / 批次" />
      <select value={status} onChange={e => setStatus(e.target.value)} className="ml-2 border rounded-lg px-3 py-2 text-sm">
        {['全部', '待审核', '审核通过', '不通过'].map(s => <option key={s}>{s}</option>)}
      </select>

      <div className="pro-card overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50"><tr>
            <th className="p-3 text-left">批次</th><th className="p-3 text-left">申请人</th><th className="p-3 text-left">品种</th>
            <th className="p-3 text-left">时间</th><th className="p-3 text-left">状态</th><th className="p-3 text-left">操作</th>
          </tr></thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-3 font-mono text-xs">{r.batchNo}</td>
                <td className="p-3">{r.applicant}</td>
                <td className="p-3">{r.categoryCount}</td>
                <td className="p-3 text-xs">{r.applyTime}</td>
                <td className="p-3"><StatusBadge status={r.status} /></td>
                <td className="p-3 space-x-2">
                  {r.status === '待审核' && (
                    <button type="button" className="text-blue-600 text-xs" onClick={() => { setRecord(r); setMode('audit'); setOpen(true); }}>审核</button>
                  )}
                  <button type="button" className="text-slate-600 text-xs" onClick={() => { setRecord(r); setMode('view'); setOpen(true); }}>查看</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReviewDrawer
        isOpen={open}
        onClose={() => setOpen(false)}
        record={record}
        mode={mode}
        onSave={async (id, st, op) => {
          await updateInboundReview(id, st, op);
          showToast('审核已保存');
          setOpen(false);
          load();
        }}
      />
    </div>
  );
}
