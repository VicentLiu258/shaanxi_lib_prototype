import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, CheckCircle2, Loader2 } from 'lucide-react';
import { DemoScenarioId, DemoRunResult } from '../types';
import { DEMO_SCENARIO_STEPS } from '../mock/demoScenarios';
import { runDemoScenario } from '../mock/api';
import { cn } from '../../../lib/utils';

interface Props {
  demoId: DemoScenarioId;
  label?: string;
  className?: string;
  onComplete?: (result: DemoRunResult) => void;
}

export function DemoTriggerButton({ demoId, label = '开始演示', className, onComplete }: Props) {
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(-1);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<DemoRunResult | null>(null);

  const steps = DEMO_SCENARIO_STEPS[demoId] || [{ title: '演示', detail: '执行中…' }];

  const startDemo = useCallback(async () => {
    setOpen(true);
    setDone(false);
    setResult(null);
    setRunning(true);
    for (let i = 0; i < steps.length; i++) {
      setStepIndex(i);
      await new Promise(r => setTimeout(r, 900));
    }
    try {
      const res = await runDemoScenario(demoId);
      setResult(res);
      setDone(true);
      onComplete?.(res);
    } finally {
      setRunning(false);
      setStepIndex(steps.length);
    }
  }, [demoId, steps.length, onComplete]);

  return (
    <>
      <button
        type="button"
        onClick={startDemo}
        disabled={running && open}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold',
          'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/20',
          'disabled:opacity-60 transition-all',
          className,
        )}
      >
        <Play size={16} fill="currentColor" />
        {label}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[150]"
              onClick={() => !running && setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-[151] overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b bg-[#1E3A8A] text-white">
                <span className="font-bold">模拟演示</span>
                <button type="button" onClick={() => !running && setOpen(false)} className="p-1 hover:bg-white/10 rounded">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
                {steps.map((s, i) => {
                  const active = stepIndex === i;
                  const finished = stepIndex > i || done;
                  return (
                    <div
                      key={s.title}
                      className={cn(
                        'flex gap-3 p-3 rounded-xl border transition-all',
                        active && 'border-blue-300 bg-blue-50',
                        finished && !active && 'border-emerald-200 bg-emerald-50/50',
                        !active && !finished && 'border-slate-100 opacity-50',
                      )}
                    >
                      <div className="shrink-0 mt-0.5">
                        {finished ? <CheckCircle2 size={18} className="text-emerald-600" /> :
                          active ? <Loader2 size={18} className="text-blue-600 animate-spin" /> :
                          <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-200" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{s.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{s.detail}</p>
                      </div>
                    </div>
                  );
                })}

                {done && result && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <p className="text-sm font-bold text-emerald-800">{result.message}</p>
                    {result.extra?.tree && (
                      <p className="text-xs text-emerald-700 mt-2">路径：{String(result.extra.tree)}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="px-5 py-4 border-t flex justify-end">
                <button
                  type="button"
                  disabled={running}
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium hover:bg-slate-200 disabled:opacity-50"
                >
                  {done ? '关闭' : '后台继续…'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function DemoResultPanel({
  result,
  columns,
}: {
  result: DemoRunResult | null;
  columns?: string[];
}) {
  if (!result?.rows?.length) return null;
  const cols = columns || result.columns || Object.keys(result.rows[0]);
  return (
    <div className="pro-card overflow-hidden bg-white mt-4 border-emerald-200 border-2">
      <div className="px-4 py-2 bg-emerald-50 text-sm font-bold text-emerald-800">演示结果</div>
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>{cols.map(c => <th key={c} className="p-3 text-left">{c}</th>)}</tr>
        </thead>
        <tbody>
          {result.rows.map((r, i) => (
            <tr key={i} className="border-t">
              {cols.map(c => <td key={c} className="p-3">{String(r[c] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
