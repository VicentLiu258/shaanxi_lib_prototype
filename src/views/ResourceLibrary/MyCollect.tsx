import React, { useState } from 'react';
import { 
  Search, 
  PlusCircle, 
  FolderPlus, 
  LayoutGrid, 
  Star, 
  Trash2, 
  PlayCircle,
  FileText,
  Package,
  HeartOff,
  ExternalLink,
  X,
  Send,
  MoreVertical,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_COLLECTED = [
  { 
    id: 'c1', 
    title: '高二化学-电解原理深度解析与实验装置展示视频专集', 
    stage: '高中', subject: '化学', grade: '高二', 
    source: '教师研修 提供', 
    type: '视频',
    cover: 'https://images.unsplash.com/photo-1603126731702-509154ad9560?w=400&q=80',
    discipline: 'Che'
  },
  { 
    id: 'c2', 
    title: '初中物理-光的反射实验全流程教学课件及指导手册建议版', 
    stage: '初中', subject: '物理', grade: '八年级', 
    source: '系统 提供', 
    type: 'PPT',
    cover: 'https://images.unsplash.com/photo-1544391682-1717343c39d4?w=400&q=80',
    discipline: 'Phy'
  },
];

const MyCollect: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('全部');
  const [sourceTab, setSourceTab] = useState('全部');
  const [folders, setFolders] = useState(['我的课程', '精品实验']);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState(MOCK_COLLECTED);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      setFolders(prev => [...prev, newFolderName.trim()]);
      setNewFolderName('');
      setShowCreateFolder(false);
    }
  };

  const handleUncollect = (id: string, e: React.MouseEvent) => {
     e.stopPropagation();
     setItems(prev => prev.filter(i => i.id !== id));
  };

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
        <span className="text-slate-800 dark:text-slate-300 font-medium">我的收藏</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
         <div className="relative flex-1 max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="请输入实验名称"
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <button 
           onClick={() => setShowCreateFolder(true)}
           className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all font-bold"
         >
            <FolderPlus size={18} /> 创建收藏夹
         </button>
      </div>

      {/* Folders Tab */}
      <div className="flex flex-wrap gap-2 pt-2">
         {['全部', ...folders].map(folder => (
           <button
            key={folder}
            onClick={() => setActiveTab(folder)}
            className={cn(
               "px-6 py-2 rounded-xl text-sm font-black transition-all",
               activeTab === folder 
                ? "bg-slate-900 dark:bg-blue-600 text-white shadow-lg" 
                : "bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
           >
             {folder}
           </button>
         ))}
      </div>

      {/* Source Tab */}
      <div className="flex gap-4 p-1 bg-slate-200/50 dark:bg-slate-800/50 w-fit rounded-xl">
         {['全部', '校本资源', '区域资源'].map(src => (
           <button
            key={src}
            onClick={() => setSourceTab(src)}
            className={cn(
               "px-6 py-1.5 rounded-lg text-xs font-black transition-all",
               sourceTab === src 
                ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-400"
            )}
           >
             {src}
           </button>
         ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {items.map(item => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-800 transition-all cursor-pointer"
            >
               <div className="relative aspect-video overflow-hidden">
                  <img src={item.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-0 right-0 px-2 py-1 bg-blue-600 text-white text-[10px] font-black rounded-bl-xl uppercase tracking-widest">
                     {item.discipline}
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:scale-110 transition-transform">
                        <ExternalLink size={24} />
                     </button>
                  </div>
               </div>
               
               <div className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                     <div className="mt-1 shrink-0">{getTypeIcon(item.type)}</div>
                     <h3 className="font-bold text-slate-800 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {item.title}
                     </h3>
                  </div>

                  <div className="flex flex-col gap-2">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {item.stage} / {item.grade}
                     </span>
                     <p className="text-[10px] font-bold text-slate-400">来源：{item.source}</p>
                  </div>

                  <div className="pt-2">
                     <button 
                       onClick={(e) => handleUncollect(item.id, e)}
                       className="w-full py-2.5 rounded-xl border border-red-100 dark:border-red-900/30 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center justify-center gap-2"
                     >
                        <HeartOff size={16} /> 取消收藏
                     </button>
                  </div>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
         <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <LayoutGrid size={64} className="mb-4 opacity-10" />
            <p className="text-lg font-medium italic">哎呀，这里空空如也~</p>
         </div>
      )}

      {/* Dialog */}
      <AnimatePresence>
         {showCreateFolder && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
             >
               <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                  <h3 className="text-lg font-black border-l-4 border-blue-600 pl-4 uppercase tracking-tight text-slate-800 dark:text-white">创建收藏夹</h3>
                  <button onClick={() => setShowCreateFolder(false)} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full">
                     <X size={20} />
                  </button>
               </div>
               <div className="p-8 space-y-6">
                  <div className="space-y-2">
                     <div className="flex justify-between">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">收藏夹名称 (必填)</label>
                        <span className="text-[10px] text-slate-400">{newFolderName.length}/20</span>
                     </div>
                     <input 
                        type="text" 
                        placeholder="请输入名称"
                        maxLength={20}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-black outline-none focus:ring-2 focus:ring-blue-500"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                     />
                  </div>
                  <div className="flex gap-4 pt-2">
                     <button onClick={() => setShowCreateFolder(false)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-3xl transition-all">取消</button>
                     <button 
                        onClick={handleCreateFolder}
                        className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-3xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all"
                     >
                        确定
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

export default MyCollect;
