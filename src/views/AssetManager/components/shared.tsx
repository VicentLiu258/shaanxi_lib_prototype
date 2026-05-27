import React from 'react';
import { AssetStatus } from '../types';
import { STATUS_COLORS } from '../mock/constants';
import { cn } from '../../../lib/utils';

export function StatusBadge({ status }: { status: AssetStatus }) {
  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', STATUS_COLORS[status])}>
      {status}
    </span>
  );
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

interface ToastProps {
  toasts: Array<{ id: string; type: 'success' | 'warning' | 'error'; message: string }>;
}

export function ToastContainer({ toasts }: ToastProps) {
  if (!toasts.length) return null;
  return (
    <div className="fixed top-20 right-6 z-[100] space-y-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={cn(
            'px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-right',
            t.type === 'success' && 'bg-emerald-600 text-white',
            t.type === 'warning' && 'bg-amber-500 text-white',
            t.type === 'error' && 'bg-red-600 text-white',
          )}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = React.useState<Array<{ id: string; type: 'success' | 'warning' | 'error'; message: string }>>([]);
  const show = (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };
  return { toasts, showToast: show };
}
