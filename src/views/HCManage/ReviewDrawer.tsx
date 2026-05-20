
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { ReviewRecord, ChemicalDetail } from './types.ts';
import { cn } from '../../lib/utils';

interface ReviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: ReviewRecord | null;
  mode: 'audit' | 'view';
  onSave?: (id: string, status: '审核通过' | '不通过', opinion: string) => void;
}

export const ReviewDrawer: React.FC<ReviewDrawerProps> = ({ isOpen, onClose, record, mode, onSave }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [auditResult, setAuditResult] = useState<'审核通过' | '不通过'>('审核通过');
  const [auditOpinion, setAuditOpinion] = useState('');

  if (!record) return null;

  const handleSave = () => {
    if (onSave) {
      onSave(record.id, auditResult, auditOpinion);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[600px] bg-white shadow-2xl z-[101] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">入库明细</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Info Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-4 bg-blue-600" />
                  <h3 className="font-bold text-gray-800">入库信息</h3>
                </div>
                <div className="grid grid-cols-1 gap-y-3 text-sm">
                  <div className="flex">
                    <span className="text-slate-600 font-bold w-24">申请人：</span>
                    <span className="text-slate-900 font-bold">{record.applicant}</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-600 font-bold w-24">申请时间：</span>
                    <span className="text-slate-900 font-bold">{record.applyTime}</span>
                  </div>
                  {record.batchNo && (
                    <div className="flex">
                      <span className="text-slate-600 font-bold w-24">入库批次：</span>
                      <span className="text-slate-900 font-bold">{record.batchNo}</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                      <span className="text-slate-700 font-bold">申请明细：</span>
                      <button 
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-blue-600 font-bold flex items-center gap-1 hover:underline"
                      >
                        查看明细 {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 px-3 font-bold">
                      本次入库危化品共 {record.categoryCount} 种，参考总价为 {record.details.reduce((acc, d) => acc + d.totalPrice, 0).toFixed(2)} 元
                    </p>
                    {showDetails && (
                      <div className="mt-2 border rounded-lg overflow-hidden overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 border-b">危化品名称</th>
                              <th className="px-3 py-2 border-b">规格属性</th>
                              <th className="px-3 py-2 border-b">存量</th>
                              <th className="px-3 py-2 border-b">单位</th>
                              <th className="px-3 py-2 border-b">品牌</th>
                              <th className="px-3 py-2 border-b">入库数量</th>
                              <th className="px-3 py-2 border-b">单价</th>
                              <th className="px-3 py-2 border-b">总价</th>
                            </tr>
                          </thead>
                          <tbody>
                            {record.details.map((detail, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-3 py-2 border-b">{detail.name}</td>
                                <td className="px-3 py-2 border-b">{detail.specs}</td>
                                <td className="px-3 py-2 border-b">{detail.stock}</td>
                                <td className="px-3 py-2 border-b">{detail.unit}</td>
                                <td className="px-3 py-2 border-b">{detail.brand}</td>
                                <td className="px-3 py-2 border-b text-blue-600 font-medium">{detail.quantity}</td>
                                <td className="px-3 py-2 border-b">{detail.price}</td>
                                <td className="px-3 py-2 border-b">{detail.totalPrice}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Audit Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-4 bg-blue-600" />
                  <h3 className="font-bold text-gray-800">入库审核</h3>
                </div>
                {mode === 'audit' ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-6">
                      <span className="text-sm text-slate-600 font-bold w-24">申请结果：</span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className={cn(
                            "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                            auditResult === '审核通过' ? "border-blue-600" : "border-slate-300 group-hover:border-blue-400"
                          )}>
                            {auditResult === '审核通过' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                          </div>
                          <input 
                            type="radio" 
                            name="auditResult" 
                            className="hidden" 
                            checked={auditResult === '审核通过'} 
                            onChange={() => setAuditResult('审核通过')} 
                          />
                          <span className={cn("text-sm font-bold", auditResult === '审核通过' ? "text-blue-600" : "text-slate-600")}>通过</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className={cn(
                            "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                            auditResult === '不通过' ? "border-blue-600" : "border-slate-300 group-hover:border-blue-400"
                          )}>
                            {auditResult === '不通过' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                          </div>
                          <input 
                            type="radio" 
                            name="auditResult" 
                            className="hidden" 
                            checked={auditResult === '不通过'} 
                            onChange={() => setAuditResult('不通过')} 
                          />
                          <span className={cn("text-sm font-bold", auditResult === '不通过' ? "text-blue-600" : "text-slate-600")}>不通过</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                       <span className="text-sm text-slate-600 font-bold">审核意见：</span>
                       <textarea 
                         placeholder="请输入"
                         rows={4}
                         className="w-full text-sm border rounded-lg p-3 outline-none focus:border-blue-600 transition-colors text-slate-700 font-medium"
                         value={auditOpinion}
                         onChange={(e) => setAuditOpinion(e.target.value)}
                       />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-y-3 text-sm">
                    <div className="flex">
                      <span className="text-slate-600 font-bold w-24">审核时间：</span>
                      <span className="text-slate-900 font-bold">{record.auditTime}</span>
                    </div>
                    <div className="flex">
                      <span className="text-slate-600 font-bold w-24">申请结果：</span>
                      <span className="text-slate-900 font-bold">{record.status}</span>
                    </div>
                    <div className="flex">
                      <span className="text-slate-600 font-bold w-24">审核意见：</span>
                      <span className="text-slate-900 font-bold">{record.auditOpinion || '--'}</span>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <div className="p-4 border-t flex justify-end gap-3">
              {mode === 'audit' ? (
                <>
                  <button 
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    关闭
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    保存
                  </button>
                </>
              ) : (
                <button 
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  关闭
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
