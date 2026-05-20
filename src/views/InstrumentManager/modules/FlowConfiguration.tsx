import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  GitBranch, 
  Settings2,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  ChevronRight,
  Plus,
  Trash2,
  UserCheck
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const FlowConfiguration: React.FC = () => {
  const [flows, setFlows] = useState([
    { id: 'instr-add', category: '仪器业务', name: '仪器入库审批', enabled: true, nodes: 3 },
    { id: 'instr-del', category: '仪器业务', name: '仪器删除审批', enabled: false, nodes: 2 },
    { id: 'instr-borrow', category: '仪器业务', name: '仪器借用审批', enabled: true, nodes: 2 },
    { id: 'instr-dispose', category: '仪器业务', name: '仪器报废审批', enabled: true, nodes: 4 },
    { id: 'cons-claim', category: '耗材业务', name: '耗材领用审批', enabled: true, nodes: 1 },
    { id: 'cons-dispose', category: '耗材业务', name: '耗材处置审批', enabled: true, nodes: 2 },
    { id: 'proc-apply', category: '通用业务', name: '采购申请审批', enabled: true, nodes: 3 },
  ]);

  const toggleFlow = (id: string) => {
    setFlows(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1B6BE5] rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
               <GitBranch size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">业务审批流配置</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Workflow Customization & Approval Chains</p>
            </div>
         </div>
         <button className="px-8 py-3 bg-[#1B6BE5] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all flex items-center gap-2">
            <Plus size={16} /> 创建新流程
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {['仪器业务', '耗材业务', '通用业务'].map(cat => (
           <div key={cat} className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2 px-2">
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> {cat}
              </h4>
              <div className="space-y-3">
                 {flows.filter(f => f.category === cat).map(flow => (
                   <div key={flow.id} className={cn(
                     "bg-white border rounded-2xl p-5 transition-all group",
                     flow.enabled ? "border-slate-200 shadow-sm" : "border-slate-100 opacity-60"
                   )}>
                      <div className="flex items-center justify-between mb-4">
                         <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{flow.name}</span>
                         <button 
                            onClick={() => toggleFlow(flow.id)}
                            className={cn(
                              "transition-colors",
                              flow.enabled ? "text-blue-600" : "text-slate-300"
                            )}
                         >
                            {flow.enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                         </button>
                      </div>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <UserCheck size={14} className="text-slate-400" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{flow.nodes} 节点审批</span>
                         </div>
                         <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100">
                            <Settings2 size={16} />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
         ))}
      </div>

      {/* Editor Panel (Preview/Mock) */}
      <section className="bg-slate-900 rounded-3xl p-10 mt-10 overflow-hidden relative">
         <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
            <GitBranch size={200} className="text-white" />
         </div>
         <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400">
                  <ShieldCheck size={28} />
               </div>
               <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-widest">可视化流程编辑器</h3>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Drag & Drop nodes to build complex approval logic</p>
               </div>
            </div>

            <div className="flex items-center gap-6 overflow-x-auto pb-6 custom-scrollbar">
               <div className="shrink-0 bg-white/5 border border-white/10 p-6 rounded-2xl w-48 text-center space-y-3">
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">开始节点</div>
                  <div className="text-xs font-bold text-white">发起申请</div>
               </div>
               <ChevronRight className="text-white/20 shrink-0" />
               <div className="shrink-0 bg-white/5 border border-white/10 p-6 rounded-2xl w-48 text-center space-y-3 relative group cursor-pointer hover:border-blue-500 transition-all">
                  <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest">科室负责人</div>
                  <div className="text-xs font-bold text-white">一级审批</div>
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-black text-white">2</div>
               </div>
               <ChevronRight className="text-white/20 shrink-0" />
               <div className="shrink-0 bg-white/5 border border-white/10 p-6 rounded-2xl w-48 text-center space-y-3 border-dashed opacity-50">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">实验中心主任</div>
                  <div className="text-xs font-bold text-slate-400 italic">等待添加...</div>
               </div>
               <div className="shrink-0 w-48 h-24 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/5 transition-all cursor-pointer">
                  <Plus className="text-white/20" />
               </div>
            </div>
         </div>
      </section>
    </motion.div>
  );
};
