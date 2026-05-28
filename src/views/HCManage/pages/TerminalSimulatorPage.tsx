import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Thermometer, Droplets, Wind } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { DemoTriggerButton } from '../components/DemoRunner';

const GRID = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, occupied: i % 3 !== 0, hazard: ['腐蚀', '易燃', '氧化', '一般'][i % 4] }));

export function TerminalSimulatorPage() {
  const navigate = useNavigate();
  const [authTab, setAuthTab] = useState<'face' | 'card' | 'pwd'>('card');
  const [verified, setVerified] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <button type="button" onClick={() => navigate('/hc-manage/dashboard')} className="flex items-center gap-2 text-sm mb-4 text-slate-300 hover:text-white">
        <ArrowLeft size={16} /> 返回工作台
      </button>

      <div className="flex justify-end mb-4">
        <DemoTriggerButton
          demoId="terminal"
          onComplete={() => {
            setAuthTab('card');
            setVerified(true);
            setSelected(5);
          }}
        />
      </div>
      <div className="flex gap-4 text-sm mb-6">
        <span className="flex items-center gap-1"><Thermometer size={14} /> 24.6℃</span>
        <span className="flex items-center gap-1"><Droplets size={14} /> 42%</span>
        <span className="flex items-center gap-1"><Wind size={14} /> VOC 0.18ppm</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="font-bold mb-4">智能存储终端 · 4×3</h3>
          <div className="grid grid-cols-3 gap-3">
            {GRID.map(cell => (
              <button
                key={cell.id}
                type="button"
                disabled={!cell.occupied || !verified}
                onClick={() => setSelected(cell.id)}
                className={cn(
                  'aspect-square rounded-xl border-2 flex flex-col items-center justify-center text-xs transition-all',
                  !cell.occupied && 'opacity-30 border-slate-600',
                  cell.occupied && verified && 'border-emerald-500/50 hover:border-emerald-400',
                  selected === cell.id && 'ring-2 ring-[#00E5FF]',
                  cell.hazard === '易燃' && 'bg-orange-900/40',
                  cell.hazard === '腐蚀' && 'bg-blue-900/40',
                )}
              >
                <span className="text-2xl">🧪</span>
                <span>{cell.hazard}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="font-bold mb-4">身份验证</h3>
          <div className="flex gap-2 mb-4">
            {([['face', '人脸'], ['card', 'IC卡'], ['pwd', '账号']] as const).map(([k, l]) => (
              <button key={k} type="button" onClick={() => setAuthTab(k)} className={cn('px-3 py-1 rounded text-sm', authTab === k && 'bg-blue-600')}>{l}</button>
            ))}
          </div>
          {!verified ? (
            <button type="button" onClick={() => setVerified(true)} className="w-full py-3 bg-emerald-600 rounded-lg font-bold">模拟验证通过</button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-emerald-400">已验证 · 请选择格位领用</p>
              {selected && (
                <>
                  <p className="text-sm">格位 {selected} · 模拟称重 498.2g → 写入台账</p>
                  <button type="button" className="w-full py-2 bg-[#1E3A8A] rounded font-bold" onClick={() => alert('领用成功，已入账')}>确认领用</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
