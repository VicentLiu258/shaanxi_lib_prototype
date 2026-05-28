import React from 'react';
import { cn } from '../../../lib/utils';
import { STATUS_COLORS } from '../mock/constants';

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', STATUS_COLORS[status] || 'bg-slate-100 text-slate-600')}>
      {status}
    </span>
  );
}

export function ToastContainer({ toasts }: { toasts: Array<{ id: string; type: string; message: string }> }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed top-20 right-6 z-[200] space-y-2">
      {toasts.map(t => (
        <div key={t.id} className="px-4 py-3 rounded-xl shadow-lg text-sm font-medium bg-emerald-600 text-white">
          {t.message}
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = React.useState<Array<{ id: string; type: string; message: string }>>([]);
  const showToast = (message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type: 'success', message }]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 2500);
  };
  return { toasts, showToast };
}

export function DataTable({
  columns,
  data,
  rowKey,
}: {
  columns: { key: string; title: string; render?: (row: Record<string, unknown>) => React.ReactNode }[];
  data: Record<string, unknown>[];
  rowKey: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50 dark:bg-white/5">
            {columns.map(c => (
              <th key={c.key} className="text-left px-4 py-3 font-bold text-slate-600">{c.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={String(row[rowKey])} className="border-b border-slate-100 hover:bg-slate-50/80">
              {columns.map(c => (
                <td key={c.key} className="px-4 py-3">
                  {c.render ? c.render(row) : String(row[c.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PageToolbar({
  children,
  onRefresh,
  onExport,
}: {
  children?: React.ReactNode;
  onRefresh?: () => void;
  onExport?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
      <div className="flex flex-wrap items-center gap-3 flex-1">{children}</div>
      <div className="flex gap-2 text-xs text-slate-500">
        {onRefresh && <button type="button" onClick={onRefresh} className="hover:text-blue-600">刷新</button>}
        {onExport && <button type="button" onClick={onExport} className="hover:text-blue-600">导出</button>}
      </div>
    </div>
  );
}

export function FilterInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-48 bg-white dark:bg-slate-900"
    />
  );
}
