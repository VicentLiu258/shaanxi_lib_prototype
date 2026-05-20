import React, { useState } from 'react';
import { 
  Search, 
  LayoutGrid, 
  Bell, 
  ChevronRight, 
  History, 
  ShieldCheck,
  Package,
  Zap,
  Star,
  FlaskConical,
  Activity,
  Box,
  Layout,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

const CATEGORIES = [
  '全部', '其他', '药品', '耗材', '实验', '实验部件', '实验箱', '采集器', '实验器', '传感器'
];

const MOCK_INSTRUMENTS = [
  { id: 'INS-001', name: '数字化激光位移传感器', type: '传感器', cover: 'https://images.unsplash.com/photo-1581091215367-9b6c01b22896?w=400', discipline: 'Phy' },
  { id: 'INS-002', name: '高精度数字化量角器', type: '传感器', cover: 'https://images.unsplash.com/photo-1532187875605-2fe358a3d4d2?w=400', discipline: 'Syn' },
  { id: 'INS-003', name: '数字化多功能采集器', type: '采集器', cover: 'https://images.unsplash.com/photo-1626684496076-02052445831f?w=400', discipline: 'Syn' },
  { id: 'INS-004', name: '电化学实验一体化箱', type: '实验箱', cover: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400', discipline: 'Che' },
  { id: 'INS-005', name: '数字化磁感应测量仪', type: '传感器', cover: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400', discipline: 'Phy' },
  { id: 'INS-006', name: '通用支架实验组件', type: '实验部件', cover: 'https://images.unsplash.com/photo-1544391682-1717343c39d4?w=400', discipline: 'Phy' },
  { id: 'INS-007', name: '数字化PH值探测计', type: '传感器', cover: 'https://images.unsplash.com/photo-1603126731702-509154ad9560?w=400', discipline: 'Che' },
  { id: 'INS-008', name: '初中物理光学实验包', type: '实验箱', cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400', discipline: 'Phy' },
];

const InstrumentLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInstruments = MOCK_INSTRUMENTS.filter(ins => {
    const matchCategory = activeCategory === '全部' || ins.type === activeCategory;
    const matchSearch = ins.name.toLowerCase().includes(searchTerm.toLowerCase()) || ins.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="flex gap-6 items-start">
      <div className="flex-1 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="text-slate-800 dark:text-slate-300 font-medium uppercase tracking-wider">系统仪器库</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <h1 className="text-2xl font-black text-slate-800 dark:text-white">系统仪器库</h1>
           <div className="relative w-full md:w-80">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="请输入仪器名称，仪器编号"
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 py-2">
           {CATEGORIES.map(cat => (
             <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-bold transition-all",
                activeCategory === cat 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                  : "bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
             >
               {cat}
             </button>
           ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {filteredInstruments.map((ins, idx) => (
             <motion.div 
               key={ins.id}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: idx * 0.05 }}
               onClick={() => navigate(`/resource-library/instruments/${ins.id}`)}
               className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer"
             >
                <div className="relative aspect-square overflow-hidden">
                   <img src={ins.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <div className="flex items-center gap-2 text-white text-xs font-bold">
                         <ExternalLink size={14} /> 查看详情
                      </div>
                   </div>
                </div>
                <div className="p-4 space-y-1">
                   <h3 className="font-bold text-slate-800 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                     {ins.name}
                   </h3>
                   <p className="text-xs font-mono text-slate-400">({ins.id})</p>
                   <div className="pt-2">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded text-[10px] font-bold">
                         {ins.type}
                      </span>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </div>

      {/* Dynamic Sidebar (Floating) */}
      <div className="hidden xl:block w-80 shrink-0 sticky top-4">
         <div className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-6 shadow-2xl text-white space-y-8 overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
            
            <div className="space-y-2 relative">
               <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <Activity size={20} className="text-blue-400" />
                  最新动态
               </h3>
               <div className="h-0.5 w-12 bg-blue-500"></div>
            </div>

            <div className="space-y-6 relative">
               {[
                 { time: '10分钟前', text: '张老师收藏了「激光点光源」', icon: Star, color: 'text-amber-400' },
                 { time: '1小时前', text: '「数字化PH值探测计」被用于最新的化学精品课', icon: Zap, color: 'text-blue-400' },
                 { time: '2小时前', text: '新增支持实验：「光的折射角度测量」', icon: ShieldCheck, color: 'text-green-400' },
                 { time: '昨天', text: '「高精度数字化量角器」系统固件已更新', icon: History, color: 'text-slate-400' }
               ].map((item, idx) => (
                 <div key={idx} className="flex gap-4 group">
                    <div className="shrink-0 mt-1">
                       <item.icon size={16} className={item.color} />
                    </div>
                    <div className="space-y-1">
                       <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{item.text}</p>
                       <p className="text-[10px] text-slate-500">{item.time}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4">
               <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">统计中心</p>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <p className="text-2xl font-black">128</p>
                     <p className="text-[10px] text-slate-500">在库仪器</p>
                  </div>
                  <div>
                     <p className="text-2xl font-black">42</p>
                     <p className="text-[10px] text-slate-500">关联实验</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default InstrumentLibrary;
