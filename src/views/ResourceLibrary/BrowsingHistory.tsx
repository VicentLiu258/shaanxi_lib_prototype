import React, { useState } from 'react';
import { 
  PlayCircle, 
  FileText, 
  Package, 
  Gem,
  ExternalLink,
  ChevronRight,
  History,
  LayoutGrid
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_HISTORY = [
  { 
    id: 'h1', 
    title: '实验室化学品安全存放与应急处理规范', 
    stage: '初中,高中', subject: '化学', grade: '通用', 
    source: '王专家 提供', 
    type: '视频',
    cover: 'https://images.unsplash.com/photo-1603126731702-509154ad9560?w=400&q=80',
    discipline: 'Che',
    isElite: true,
    viewedAt: '2024-05-18 14:30'
  },
  { 
    id: 'h2', 
    title: '数字化物理探究实验教学研修班 (第一期)', 
    stage: '初中', subject: '物理', grade: '八年级', 
    source: '陈教授 提供', 
    type: '直播课',
    cover: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80',
    discipline: 'Phy',
    isElite: true,
    viewedAt: '2024-05-17 09:12'
  },
  { 
    id: 'h3', 
    title: '初中物理-光的反射实验全流程教学课件及指导手册建议版', 
    stage: '初中', subject: '物理', grade: '八年级', 
    source: '系统 提供', 
    type: 'PPT',
    cover: 'https://images.unsplash.com/photo-1544391682-1717343c39d4?w=400&q=80',
    discipline: 'Phy',
    isElite: false,
    viewedAt: '2024-05-16 16:45'
  }
];

const BrowsingHistory: React.FC = () => {
  const navigate = useNavigate();
  const [sourceTab, setSourceTab] = useState('全部');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PPT': return <Package size={14} className="text-orange-500" />;
      case '视频': return <PlayCircle size={14} className="text-red-500" />;
      default: return <FileText size={14} className="text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="text-slate-800 dark:text-slate-300 font-medium">浏览历史</span>
      </div>

      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">浏览历史</h1>
         <div className="flex items-center gap-4">
            <History size={20} className="text-blue-600" />
            <span className="text-xs font-bold text-slate-400">最近浏览的 {MOCK_HISTORY.length} 条记录</span>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 p-1 bg-slate-100 dark:bg-slate-900 w-fit rounded-xl border border-slate-200 dark:border-slate-800">
         {['全部', '校本资源', '区域资源'].map(src => (
           <button
            key={src}
            onClick={() => setSourceTab(src)}
            className={cn(
               "px-8 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
               sourceTab === src 
                ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            )}
           >
             {src}
           </button>
         ))}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {MOCK_HISTORY.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group flex gap-6 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-50 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all cursor-pointer"
            onClick={() => navigate(`/resource-library/detail/${item.id}`)}
          >
             <div className="relative w-48 aspect-video rounded-2xl overflow-hidden shrink-0">
                <img src={item.cover} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-0 right-0 px-2 py-1 bg-blue-600 text-white text-[10px] font-black rounded-bl-xl uppercase tracking-widest">
                   {item.discipline}
                </div>
                {item.isElite && (
                   <div className="absolute top-2 left-2 p-1 bg-amber-400 rounded-full text-white shadow-xl shadow-amber-400/30">
                      <Gem size={14} />
                   </div>
                )}
             </div>
             
             <div className="flex-1 py-1 flex flex-col justify-between min-w-0">
                <div>
                   <div className="flex items-start gap-3">
                      <div className="mt-1 shrink-0">{getTypeIcon(item.type)}</div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                         {item.title}
                      </h3>
                   </div>
                   <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>{item.stage} / {item.grade}</span>
                      <span>来源：{item.source}</span>
                   </div>
                </div>
                <div className="flex items-center justify-between pt-4">
                   <div className="text-[10px] font-bold text-slate-400 italic">
                      上次浏览：{item.viewedAt}
                   </div>
                </div>
             </div>

             <div className="flex items-center justify-center w-12 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-2xl transition-all group-hover:text-blue-600 text-slate-300">
                <PlayCircle size={32} />
             </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {MOCK_HISTORY.length === 0 && (
         <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <LayoutGrid size={64} className="mb-4 opacity-10" />
            <p className="text-lg font-medium italic">最近没有浏览记录</p>
         </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between pt-8 pb-12 border-t border-slate-200 dark:border-slate-800">
         <div className="text-xs text-slate-400 font-medium">共 {MOCK_HISTORY.length} 条 显示</div>
         <div className="flex items-center gap-2">
            {[1].map(p => (
              <button key={p} className="w-8 h-8 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/20">1</button>
            ))}
         </div>
      </div>
    </div>
  );
};

export default BrowsingHistory;
