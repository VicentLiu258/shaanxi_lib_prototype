import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Gem, 
  Calendar,
  User,
  LayoutGrid,
  ChevronDown,
  X,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

const MOCK_AUDIT_DATA = [
  {
    id: 'A001',
    title: '初中生物-观察植物细胞结构实验方案',
    teacher: '张美琳',
    type: '课程包',
    stage: '初中',
    subject: '生物',
    grade: '七年级',
    version: '人教版',
    volume: '上册',
    createdAt: '2024-03-12 14:30',
    createWay: '创建',
    status: '加入待审核',
    cover: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400',
    isElite: true
  },
  {
    id: 'A002',
    title: '高一物理-自由落体运动规律解析课件',
    teacher: '李伟强',
    type: 'PPT',
    stage: '高中',
    subject: '物理',
    grade: '高一',
    version: '苏教版',
    volume: '必修一',
    createdAt: '2024-03-11 09:12',
    createWay: '上传',
    status: '已加入校本资源',
    cover: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
    isElite: false
  },
  {
    id: 'A003',
    title: '小学科学-液体的热胀冷缩现象观察视频',
    teacher: '王小红',
    type: '视频',
    stage: '小学',
    subject: '一般科学',
    grade: '四年级',
    version: '人教版',
    volume: '下册',
    createdAt: '2024-03-10 16:45',
    createWay: '创建',
    status: '加入待审核',
    cover: 'https://images.unsplash.com/photo-1544391682-1717343c39d4?w=400',
    isElite: false
  }
];

const ResourceAudit: React.FC = () => {
  const [resources, setResources] = useState(MOCK_AUDIT_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAuditDialog, setShowAuditDialog] = useState(false);
  const [currentResource, setCurrentResource] = useState<any>(null);
  
  // Audit Form State
  const [auditResult, setAuditResult] = useState<'pass' | 'fail'>('pass');
  const [isEliteResource, setIsEliteResource] = useState('否');
  const [auditComment, setAuditComment] = useState('');

  const openAudit = (res: any) => {
    setCurrentResource(res);
    setShowAuditDialog(true);
  };

  const handleRemove = (id: string) => {
    if (confirm('确定要移除该资源吗？')) {
      setResources(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleSubmitAudit = () => {
     // In real app, call API
     setResources(prev => prev.map(r => 
        r.id === currentResource.id ? { ...r, status: auditResult === 'pass' ? '已加入校本资源' : '审核未通过' } : r
     ));
     setShowAuditDialog(false);
     setAuditComment('');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>我的资源库</span>
        <span>&gt;</span>
        <span className="text-slate-800 dark:text-slate-300 font-medium">校本资源审核</span>
      </div>

      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-black text-slate-800 dark:text-white">校本资源审核</h1>
         <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg text-sm font-bold border border-blue-100 dark:border-blue-800">
            当前共有 {resources.length} 份资源
         </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4">
         <div className="relative flex-1 min-w-[240px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="请输入资源名称"
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <select className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm text-slate-600 border-none outline-none focus:ring-2 focus:ring-blue-500 appearance-none min-w-[140px]">
            <option value="">请选择资源类型</option>
            <option>PPT</option>
            <option>视频</option>
            <option>课程包</option>
         </select>
         <select className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm text-slate-600 border-none outline-none focus:ring-2 focus:ring-blue-500 appearance-none min-w-[140px]">
            <option value="">请选择状态</option>
            <option>加入待审核</option>
            <option>已加入校本资源</option>
         </select>
      </div>

      {/* List */}
      <div className="space-y-4">
         {resources.map(res => (
           <motion.div 
            key={res.id}
            layout
            className="group bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex gap-6 items-center"
           >
              <div className="relative w-48 aspect-video rounded-xl overflow-hidden shrink-0">
                 <img src={res.cover} className="w-full h-full object-cover" />
                 <div className="absolute top-0 right-0 px-2 py-1 bg-blue-600 text-white text-[10px] font-black rounded-bl-lg">
                    {res.subject === '物理' ? 'PHY' : res.subject === '化学' ? 'CHE' : 'SYN'}
                 </div>
                 {res.isElite && (
                    <div className="absolute top-2 left-2 p-1 bg-amber-400 rounded-full text-white shadow-lg shadow-amber-400/30">
                       <Gem size={14} />
                    </div>
                 )}
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                 <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-800 dark:text-white truncate text-lg group-hover:text-blue-600 transition-colors">
                      {res.title}
                    </h3>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                      res.status === '已加入校本资源' ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                    )}>
                      {res.status}
                    </span>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-1.5"><User size={14} /> {res.teacher}</div>
                    <div className="flex items-center gap-1.5 truncate">适用：{res.stage}, {res.grade}</div>
                    <div className="flex items-center gap-1.5">类型：{res.type}</div>
                    <div className="flex items-center gap-1.5"><Calendar size={14} /> {res.createdAt}</div>
                    <div className="flex items-center gap-1.5">版本：{res.version} - {res.volume}</div>
                    <div className="flex items-center gap-1.5">方式：{res.createWay}</div>
                 </div>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                 {res.status === '加入待审核' ? (
                   <button 
                    onClick={() => openAudit(res)}
                    className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all text-sm"
                   >
                     <CheckCircle2 size={16} /> 审核
                   </button>
                 ) : (
                   <button 
                    onClick={() => handleRemove(res.id)}
                    className="flex items-center justify-center gap-2 px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all text-sm"
                   >
                     <Trash2 size={16} /> 移除
                   </button>
                 )}
              </div>
           </motion.div>
         ))}
      </div>

      {/* Pagination (Simplified) */}
      <div className="flex items-center justify-center pt-6">
         <div className="flex items-center gap-2">
            {[1, 2, 3].map(p => (
              <button key={p} className={cn(
                "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                p === 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}>{p}</button>
            ))}
         </div>
      </div>

      {/* Audit Dialog */}
      <AnimatePresence>
        {showAuditDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                 <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">资源审核</h3>
                 <button onClick={() => setShowAuditDialog(false)} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors">
                    <X size={20} />
                 </button>
              </div>

              <div className="p-8 space-y-6">
                 {/* Summary Info */}
                 <div className="flex gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                    <div className="w-20 h-14 rounded-lg overflow-hidden shrink-0">
                       <img src={currentResource?.cover} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                       <p className="font-bold text-slate-800 dark:text-white truncate text-sm">{currentResource?.title}</p>
                       <p className="text-[10px] text-slate-500 mt-1">提交人：{currentResource?.teacher}</p>
                    </div>
                 </div>

                 {/* Results */}
                 <div className="space-y-4">
                    <div>
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">审核结果：</label>
                       <div className="flex gap-4">
                          <button 
                            onClick={() => setAuditResult('pass')}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border",
                              auditResult === 'pass' 
                                ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-500/20" 
                                : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800"
                            )}
                          >
                             <CheckCircle2 size={18} /> 通过
                          </button>
                          <button 
                            onClick={() => setAuditResult('fail')}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border",
                              auditResult === 'fail' 
                                ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-500/20" 
                                : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800"
                            )}
                          >
                             <XCircle size={18} /> 不通过
                          </button>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                       <div>
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">是否推荐为优质资源：</label>
                          <select 
                            value={isEliteResource}
                            onChange={(e) => setIsEliteResource(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm font-bold outline-none ring-offset-2 focus:ring-2 focus:ring-blue-500"
                          >
                             <option>否</option>
                             <option>是</option>
                          </select>
                       </div>
                    </div>

                    <div>
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">审核意见：</label>
                       <textarea 
                          placeholder="请输入审核意见（选填）"
                          className="w-full h-32 p-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
                          value={auditComment}
                          onChange={(e) => setAuditComment(e.target.value)}
                       />
                    </div>
                 </div>

                 <div className="flex gap-4 pt-2">
                    <button 
                      onClick={() => setShowAuditDialog(false)}
                      className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all"
                    >
                      取消
                    </button>
                    <button 
                      onClick={handleSubmitAudit}
                      className="flex-1 py-4 bg-slate-900 dark:bg-blue-600 text-white font-bold rounded-2xl shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Send size={18} /> 提交审核结果
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResourceAudit;
