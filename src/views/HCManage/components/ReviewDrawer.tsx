import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { ReviewRecord } from '../types';
import { cn } from '../../../lib/utils';

interface ReviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: ReviewRecord | null;
  mode: 'audit' | 'view';
  title?: string;
  onSave?: (id: string, status: '审核通过' | '不通过', opinion: string) => void;
}

export const ReviewDrawer: React.FC<ReviewDrawerProps> = ({ isOpen, onClose, record, mode, title = '入库明细', onSave }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [auditResult, setAuditResult] = useState<'审核通过' | '不通过'>('审核通过');
  const [auditOpinion, setAuditOpinion] = useState('');

  if (!record) return null;

  const handleSave = () => {
    onSave?.(record.id, auditResult, auditOpinion);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/30 z-[100]" />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[600px] bg-white shadow-2xl z-[101] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">{title}</h2>
              <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-4"><div className="w-1 h-4 bg-blue-600" /><h3 className="font-bold">申请信息</h3></div>
                <div className="grid gap-y-3 text-sm">
                  <div><span className="text-slate-500 w-24 inline-block">申请人</span><span className="font-bold">{record.applicant}</span></div>
                  <div><span className="text-slate-500 w-24 inline-block">申请时间</span><span className="font-bold">{record.applyTime}</span></div>
                  {record.batchNo && <div><span className="text-slate-500 w-24 inline-block">批次号</span><span className="font-bold">{record.batchNo}</span></div>}
                  <button type="button" onClick={() => setShowDetails(!showDetails)} className="text-blue-600 text-sm font-bold flex items-center gap-1">
                    查看明细 {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {showDetails && record.details.length > 0 && (
                    <table className="w-full text-xs border rounded-lg overflow-hidden">
                      <thead className="bg-slate-50"><tr><th className="p-2">名称</th><th className="p-2">规格</th><th className="p-2">数量</th><th className="p-2">总价</th></tr></thead>
                      <tbody>{record.details.map((d, i) => (
                        <tr key={i} className="border-t"><td className="p-2">{d.name}</td><td className="p-2">{d.specs}</td><td className="p-2">{d.quantity}</td><td className="p-2">{d.totalPrice}</td></tr>
                      ))}</tbody>
                    </table>
                  )}
                </div>
              </section>
              {mode === 'audit' && (
                <section className="space-y-3">
                  <div className="flex gap-4">
                    {(['审核通过', '不通过'] as const).map(s => (
                      <label key={s} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" checked={auditResult === s} onChange={() => setAuditResult(s)} />
                        <span className={cn('text-sm font-bold', auditResult === s && 'text-blue-600')}>{s}</span>
                      </label>
                    ))}
                  </div>
                  <textarea rows={3} placeholder="审核意见" className="w-full border rounded-lg p-3 text-sm" value={auditOpinion} onChange={e => setAuditOpinion(e.target.value)} />
                </section>
              )}
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-sm">关闭</button>
              {mode === 'audit' && <button type="button" onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded text-sm">保存</button>}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
