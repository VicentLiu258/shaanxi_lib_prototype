import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCcw, 
  Plus, 
  Upload,
  Download,
  Building2,
  Globe,
  Phone,
  User,
  ChevronRight,
  ExternalLink,
  Edit2,
  Trash2
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const SupplierManage: React.FC = () => {
  const records = [
    { name: '咸阳教学仪器有限公司', website: 'www.xy-instr.com', contact: '张三', phone: '138-xxxx-xxxx', createTime: '2024-05-19' },
    { name: '晨光文具', website: 'www.m-g.com.cn', contact: '李四', phone: '139-xxxx-xxxx', createTime: '2024-05-18' },
    { name: '戴尔(中国)有限公司', website: 'www.dell.com.cn', contact: '王五', phone: '400-xxxx-xxxx', createTime: '2024-05-10' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-500/20">
               <Building2 size={20} />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">供应商档案管理</h2>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Vendor Master Data & Partner Directory</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
             <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                <Download size={16} /> 导出
             </button>
             <button className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2">
                <Upload size={16} /> 导入
             </button>
             <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
                <Plus size={16} /> 新增
             </button>
         </div>
      </div>

      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm font-sans">
        <div className="flex items-center gap-4">
           <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                 type="text" 
                 placeholder="搜索供應商名稱、聯繫人、核心經營範圍..." 
                 className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold outline-none border-dashed hover:border-slate-300 focus:border-slate-400 focus:bg-white transition-all shadow-inner"
              />
           </div>
           <button className="p-3.5 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all">
              <RotateCcw size={20} />
           </button>
           <button className="px-8 h-[52px] bg-[#1B6BE5] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/10 transition-all">
              查询
           </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {records.map((r, i) => (
           <div key={i} className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden">
              <div className="absolute -top-10 -right-10 bg-slate-50 w-32 h-32 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 z-0" />
              
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                       <Building2 size={24} />
                    </div>
                    <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                       <ExternalLink size={18} />
                    </button>
                 </div>

                 <div>
                    <h3 className="text-lg font-black text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">{r.name}</h3>
                    <div className="flex items-center gap-2 mt-1 py-1 px-3 bg-slate-50 rounded-lg w-max border border-slate-100">
                       <Globe size={10} className="text-slate-400" />
                       <span className="text-[10px] font-mono font-bold text-slate-400">{r.website}</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                    <div className="space-y-1">
                       <label className="text-[8px] font-black text-slate-300 uppercase tracking-widest">聯繫人</label>
                       <div className="flex items-center gap-2">
                          <User size={12} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-600 uppercase">{r.contact}</span>
                       </div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[8px] font-black text-slate-300 uppercase tracking-widest">服務熱線</label>
                       <div className="flex items-center gap-2">
                          <Phone size={12} className="text-slate-400" />
                          <span className="text-xs font-mono font-bold text-slate-600">{r.phone}</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between pt-4">
                    <span className="text-[10px] font-bold text-slate-300 italic">建立於: {r.createTime}</span>
                    <div className="flex items-center gap-2">
                       <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="编辑">
                          <Edit2 size={16} />
                       </button>
                       <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="删除">
                          <Trash2 size={16} />
                       </button>
                    </div>
                 </div>
              </div>
           </div>
         ))}
      </div>
    </motion.div>
  );
};
