import React, { useEffect, useState, useCallback } from 'react';
import { DemoScenarioId, DemoRunResult } from '../types';
import { DemoTriggerButton } from '../components/DemoRunner';

interface Props {
  title: string;
  description: string;
  demoId: DemoScenarioId;
  columns?: string[];
  fetchRows?: () => Promise<Record<string, unknown>[]>;
}

export function PlaceholderPage({ title, description, demoId, columns, fetchRows }: Props) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(!!fetchRows);
  const [demoResult, setDemoResult] = useState<DemoRunResult | null>(null);

  const load = useCallback(() => {
    if (fetchRows) {
      setLoading(true);
      fetchRows().then(setRows).finally(() => setLoading(false));
    }
  }, [fetchRows]);

  useEffect(() => { load(); }, [load]);

  const handleDemoComplete = (result: DemoRunResult) => {
    setDemoResult(result);
    if (result.rows?.length) {
      setRows(result.rows);
    } else {
      load();
    }
  };

  const displayColumns = demoResult?.columns || columns;
  const displayRows = demoResult?.rows?.length ? demoResult.rows : rows;

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <p className="text-sm text-slate-500 flex-1">{description}</p>
        <DemoTriggerButton demoId={demoId} onComplete={handleDemoComplete} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">加载中...</div>
      ) : displayColumns && displayRows.length > 0 ? (
        <>
          <div className="pro-card overflow-hidden bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>{displayColumns.map(c => <th key={c} className="p-3 text-left">{c}</th>)}</tr>
              </thead>
              <tbody>
                {displayRows.slice(0, 20).map((r, i) => (
                  <tr key={i} className="border-t hover:bg-slate-50">
                    {displayColumns.map(c => <td key={c} className="p-3">{String(r[c] ?? '')}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : demoResult ? (
        <div className="pro-card p-8 bg-emerald-50 border border-emerald-200 text-center">
          <p className="font-bold text-emerald-800">{demoResult.message}</p>
          {demoResult.extra && (
            <pre className="text-xs text-left mt-4 p-3 bg-white rounded-lg overflow-auto text-slate-600">
              {JSON.stringify(demoResult.extra, null, 2)}
            </pre>
          )}
        </div>
      ) : (
        <div className="pro-card p-12 text-center bg-white border-dashed">
          <p className="font-bold text-slate-700">{title}</p>
          <p className="text-sm text-slate-500 mt-2">点击「开始演示」触发完整汇报脚本场景。</p>
        </div>
      )}
    </div>
  );
}
