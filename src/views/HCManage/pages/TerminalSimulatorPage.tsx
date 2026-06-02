import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, ClipboardCheck, LogOut,
  PackageCheck, RotateCcw, ScanLine, Scale, Trash2,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { getBottles, getReagentOperations, processTerminalBatch } from '../mock/api';
import { BottleRecord, ReagentOperationRecord, TerminalBatchItem, TerminalMode } from '../types';

const modeConfig = {
  borrow: {
    title: '领用出库',
    action: '统一借出',
    sourceStatus: '在库',
    pending: '待借出',
    done: '已借出',
    tone: 'blue',
  },
  return: {
    title: '归还入库',
    action: '统一归还',
    sourceStatus: '领用中',
    pending: '待归还',
    done: '已归还',
    tone: 'emerald',
  },
} as const;

export function TerminalSimulatorPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<TerminalMode>('borrow');
  const [bottles, setBottles] = useState<BottleRecord[]>([]);
  const [operations, setOperations] = useState<ReagentOperationRecord[]>([]);
  const [queue, setQueue] = useState<TerminalBatchItem[]>([]);
  const [scanCode, setScanCode] = useState('');
  const [current, setCurrent] = useState<TerminalBatchItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('台面空闲，放入第一瓶试剂开始识别。');

  const load = () => {
    getBottles().then(setBottles);
    getReagentOperations().then(setOperations);
  };

  useEffect(() => { load(); }, []);

  const config = modeConfig[mode];
  const candidatePool = useMemo(() => bottles.filter(b => (
    b.status === config.sourceStatus && !queue.some(item => item.code === b.code)
  )), [bottles, config.sourceStatus, queue]);

  const totalDelta = queue.reduce((sum, item) => sum + (item.measuredWeight - item.previousWeight), 0);

  const buildBatchItem = (bottle: BottleRecord): TerminalBatchItem => {
    const previousWeight = Number(bottle.currentWeight.toFixed(1));
    const drift = mode === 'borrow'
      ? ((queue.length % 3) - 1) * 0.4
      : -(18 + (queue.length % 5) * 7 + (bottle.code.charCodeAt(bottle.code.length - 1) % 4));
    const measuredWeight = Math.max(0, Number((previousWeight + drift).toFixed(1)));
    return {
      bottleId: bottle.id,
      code: bottle.code,
      chemicalName: bottle.chemicalName,
      location: `${bottle.warehouse} / ${bottle.cabinet} / ${bottle.layer}`,
      previousWeight,
      measuredWeight,
      weightUnit: 'g',
      status: config.pending,
    };
  };

  const detectBottle = (bottle?: BottleRecord | null) => {
    const target = bottle || candidatePool[0];
    if (!target || busy) {
      setMessage(target ? '识别中，请稍候。' : `没有可用于${config.title}的试剂。`);
      return;
    }
    setBusy(true);
    const detected = buildBatchItem(target);
    setCurrent(detected);
    setMessage('正在读取瓶码、危险分类和重量...');
    window.setTimeout(() => {
      setQueue(prev => prev.some(item => item.code === detected.code) ? prev : [...prev, detected]);
      setMessage(`${detected.code} 已加入待处理清单，请拿下后放入下一瓶。`);
      setBusy(false);
      setScanCode('');
    }, 650);
  };

  const detectByCode = () => {
    const code = scanCode.trim();
    const target = code
      ? bottles.find(b => b.code.toLowerCase() === code.toLowerCase())
      : candidatePool[0];
    if (!target) {
      setMessage(code ? `未找到瓶码 ${code}，请重新扫描。` : `没有可用于${config.title}的试剂。`);
      return;
    }
    if (target.status !== config.sourceStatus) {
      setMessage(`${target.code} 当前状态为「${target.status}」，不能执行${config.title}。`);
      return;
    }
    if (queue.some(item => item.code === target.code)) {
      setMessage(`${target.code} 已在清单中。`);
      return;
    }
    detectBottle(target);
  };

  const confirmBatch = async () => {
    if (!queue.length) {
      setMessage('请先放入至少一瓶试剂完成识别。');
      return;
    }
    setBusy(true);
    const result = await processTerminalBatch(mode, queue);
    setMessage(`${config.action}完成：${result.batchNo}，共 ${result.count} 件。`);
    setQueue([]);
    setCurrent(null);
    setBusy(false);
    load();
  };

  const switchMode = (next: TerminalMode) => {
    setMode(next);
    setQueue([]);
    setCurrent(null);
    setScanCode('');
    setMessage(`已切换为${modeConfig[next].title}，台面空闲。`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button type="button" onClick={() => navigate('/hc-manage/flow/borrow')} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
          <ArrowLeft size={16} />
          返回领用工作台
        </button>
        <div className="flex items-center gap-2 rounded-full bg-white/10 p-1">
          {(['borrow', 'return'] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-bold transition-colors',
                mode === m ? 'bg-white text-slate-950' : 'text-slate-300 hover:text-white',
              )}
            >
              {modeConfig[m].title}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
        <section className="rounded-2xl border border-white/10 bg-slate-900 p-5 space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300 font-black">Desktop Checkout Terminal</p>
            <h1 className="text-2xl font-black mt-2">桌面扫码称重终端</h1>
            <p className="text-sm text-slate-400 mt-2">像超市结算一样逐件放上台面，自动识别瓶码和重量，最后统一确认。</p>
          </div>

          <div className="rounded-2xl border border-cyan-400/30 bg-cyan-950/20 p-5 min-h-[280px] flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className={cn(
              'absolute inset-x-8 h-px bg-cyan-300/70 shadow-[0_0_24px_rgba(103,232,249,0.9)] transition-all',
              busy ? 'animate-pulse top-1/2' : 'top-8',
            )} />
            <div className={cn(
              'w-28 h-28 rounded-3xl flex items-center justify-center mb-4 border',
              busy ? 'bg-cyan-400/20 border-cyan-300 text-cyan-200' : 'bg-white/5 border-white/10 text-slate-300',
            )}>
              <Scale size={46} />
            </div>
            <p className="font-black text-lg">{busy ? '识别称重中' : '台面检测区'}</p>
            <p className="text-sm text-slate-400 mt-2 max-w-xs">{message}</p>
            {current && (
              <div className="mt-4 w-full rounded-xl bg-slate-950/70 border border-white/10 p-3 text-left">
                <p className="text-xs font-mono text-cyan-300">{current.code}</p>
                <p className="font-bold mt-1">{current.chemicalName}</p>
                <p className="text-xs text-slate-400 mt-1">{current.location}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <span>原重量：{current.previousWeight.toFixed(1)}g</span>
                  <span>本次：{current.measuredWeight.toFixed(1)}g</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                value={scanCode}
                onChange={e => setScanCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && detectByCode()}
                placeholder="可输入/扫描瓶码，留空则自动取下一瓶"
                className="flex-1 rounded-lg bg-slate-950 border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-300"
              />
              <button
                type="button"
                onClick={detectByCode}
                disabled={busy}
                className="px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 font-black text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <ScanLine size={16} />
                放上识别
              </button>
            </div>
            <button
              type="button"
              onClick={() => detectBottle()}
              disabled={busy}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <PackageCheck size={16} />
              模拟放入下一瓶
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <TerminalMetric label="可识别" value={`${candidatePool.length}`} />
            <TerminalMetric label="待处理" value={`${queue.length}`} />
            <TerminalMetric label="差值" value={`${totalDelta.toFixed(1)}g`} />
          </div>
        </section>

        <section className="space-y-5">
          <div className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden">
            <div className="p-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
              <div>
                <h2 className="text-xl font-black flex items-center gap-2">
                  <ClipboardCheck size={20} />
                  {config.title}清单
                </h2>
                <p className="text-sm text-slate-400 mt-1">逐件识别后进入清单，确认前可移除；确认后写入 mock 台账。</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setQueue([]); setCurrent(null); setMessage('清单已清空，台面空闲。'); }}
                  className="px-3 py-2 rounded-lg bg-white/10 text-slate-200 text-sm font-bold flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  清空
                </button>
                <button
                  type="button"
                  onClick={confirmBatch}
                  disabled={busy || !queue.length}
                  className={cn(
                    'px-5 py-2 rounded-lg text-sm font-black flex items-center gap-2 disabled:opacity-50',
                    mode === 'borrow' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white',
                  )}
                >
                  <LogOut size={16} />
                  {config.action}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[860px]">
                <thead className="bg-white/5 text-slate-300">
                  <tr>
                    {['序号', '瓶码', '试剂', '位置', '原重量', '本次重量', '差值', '状态', '操作'].map(col => (
                      <th key={col} className="p-3 text-left">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {queue.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-12 text-center text-slate-500">等待试剂放入台面...</td>
                    </tr>
                  ) : queue.map((item, index) => {
                    const delta = item.measuredWeight - item.previousWeight;
                    return (
                      <tr key={item.code} className="border-t border-white/10 hover:bg-white/[0.03]">
                        <td className="p-3 text-slate-400">{index + 1}</td>
                        <td className="p-3 font-mono text-cyan-300">{item.code}</td>
                        <td className="p-3 font-bold">{item.chemicalName}</td>
                        <td className="p-3 text-xs text-slate-400">{item.location}</td>
                        <td className="p-3 font-mono">{item.previousWeight.toFixed(1)}g</td>
                        <td className="p-3 font-mono">{item.measuredWeight.toFixed(1)}g</td>
                        <td className={cn('p-3 font-mono font-black', delta < 0 ? 'text-amber-300' : delta > 0 ? 'text-emerald-300' : 'text-slate-300')}>
                          {delta > 0 ? '+' : ''}{delta.toFixed(1)}g
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold">{item.status}</span>
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => setQueue(prev => prev.filter(q => q.code !== item.code))}
                            className="p-1.5 rounded text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <h3 className="font-black flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-300" />
              最近终端流水
            </h3>
            <div className="mt-4 grid gap-2">
              {operations.slice(0, 6).map(op => (
                <div key={op.id} className="rounded-xl bg-white/5 border border-white/10 p-3 grid grid-cols-1 md:grid-cols-[120px_1fr_160px_140px] gap-2 text-sm">
                  <span className={cn('font-black', op.type === '领用' ? 'text-blue-300' : 'text-emerald-300')}>{op.type}</span>
                  <span><span className="font-mono text-cyan-300">{op.bottleCode}</span> · {op.chemicalName}</span>
                  <span className="font-mono text-slate-300">{op.previousWeight.toFixed(1)}g → {op.measuredWeight.toFixed(1)}g</span>
                  <span className="text-xs text-slate-500">{op.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function TerminalMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
      <p className="text-xs text-slate-400 font-bold">{label}</p>
      <p className="text-2xl font-black mt-1">{value}</p>
    </div>
  );
}
