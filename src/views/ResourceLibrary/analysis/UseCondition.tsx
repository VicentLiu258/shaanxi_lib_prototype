import React, { useState } from 'react';
import { 
  BarChart3, 
  ArrowUpDown,
  TrendingDown,
  ChevronDown,
  LayoutGrid,
  Heart,
  ThumbsUp,
  Download,
  Eye,
  Settings2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../../lib/utils';

const MOCK_RESOURCES = [
  { id: 1, name: '初中物理-力的合成实验精化版', subject: '物理', teacher: '李明', collect: 450, like: 1200, download: 890, view: 15400 },
  { id: 2, name: '高二化学-电解原理演示视频', subject: '化学', teacher: '张英', collect: 320, like: 980, download: 450, view: 12000 },
  { id: 3, name: '初中生物-观察细胞结构实验引导', subject: '生物', teacher: '王伟', collect: 210, like: 560, download: 300, view: 8900 },
  { id: 4, name: '小学科学-水的循环动画课件', subject: '科学', teacher: '陈诚', collect: 180, like: 420, download: 280, view: 7600 },
  { id: 5, name: '高一物理-匀变速直线运动习题集', subject: '物理', teacher: '赵六', collect: 150, like: 380, download: 560, view: 9200 },
];

const UseCondition: React.FC = () => {
  const [activeTab, setActiveTab] = useState('资源浏览排名');
  const [sortField, setSortField] = useState('view');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const tabs = [
    { label: '资源浏览排名', field: 'view' },
    { label: '收藏量排名', field: 'collect' },
    { label: '点赞量排名', field: 'like' },
    { label: '下载量排名', field: 'download' },
  ];

  const handleTabChange = (tab: any) => {
    setActiveTab(tab.label);
    setSortField(tab.field);
    setSortOrder('desc');
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedData = [...MOCK_RESOURCES].sort((a: any, b: any) => {
    const factor = sortOrder === 'asc' ? 1 : -1;
    return (a[sortField] > b[sortField] ? 1 : -1) * factor;
  });

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>资源分析</span>
        <span>&gt;</span>
        <span className="text-slate-800 dark:text-slate-300 font-medium">资源库使用情况</span>
      </div>

      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">学校资源库情况</h1>
         <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => handleTabChange(tab)}
                className={cn(
                  "px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                  activeTab === tab.label 
                    ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                )}
              >
                {tab.label}
              </button>
            ))}
         </div>
      </div>

      {/* Hero Stats (Visual decoration) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
           { icon: Eye, label: 'TOTAL VIEWS', value: '542K', color: 'text-blue-500' },
           { icon: Heart, label: 'TOTAL COLLECTS', value: '12.4K', color: 'text-rose-500' },
           { icon: ThumbsUp, label: 'TOTAL LIKES', value: '86.2K', color: 'text-emerald-500' },
           { icon: Download, label: 'TOTAL DOWNLOADS', value: '45.1K', color: 'text-amber-500' },
         ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between aspect-square md:aspect-auto">
               <div className={cn("w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4", stat.color)}>
                  <stat.icon size={20} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{stat.value}</p>
               </div>
            </div>
         ))}
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">资源名称</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">学科</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">创建教师</th>
                     {[
                        { label: '收藏量', field: 'collect' },
                        { label: '点赞量', field: 'like' },
                        { label: '下载量', field: 'download' },
                        { label: '浏览量', field: 'view' },
                     ].map((col) => (
                        <th 
                           key={col.field}
                           className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer group text-center"
                           onClick={() => handleSort(col.field)}
                        >
                           <div className="flex items-center justify-center gap-2">
                              {col.label}
                              <ArrowUpDown size={12} className={cn("transition-colors", sortField === col.field ? "text-blue-600" : "text-slate-300 group-hover:text-slate-500")} />
                           </div>
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <AnimatePresence>
                    {sortedData.length > 0 ? (
                      sortedData.map((res, idx) => (
                        <motion.tr 
                          key={res.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                        >
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                 <div className="w-2 h-2 rounded-full bg-blue-600 transition-transform group-hover:scale-150" />
                                 <span className="text-sm font-bold text-slate-800 dark:text-white">{res.name}</span>
                              </div>
                           </td>
                           <td className="px-8 py-5 text-center">
                              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black rounded uppercase">
                                {res.subject}
                              </span>
                           </td>
                           <td className="px-8 py-5 text-sm font-bold text-slate-700 dark:text-slate-300">{res.teacher}</td>
                           <td className="px-6 py-5 text-sm font-black text-slate-900 dark:text-white text-center">{res.collect}</td>
                           <td className="px-6 py-5 text-sm font-black text-slate-900 dark:text-white text-center">{res.like}</td>
                           <td className="px-6 py-5 text-sm font-black text-slate-900 dark:text-white text-center">{res.download}</td>
                           <td className="px-6 py-5 text-sm font-black text-blue-600 text-center">{res.view.toLocaleString()}</td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                         <td colSpan={7} className="px-8 py-12 text-center text-slate-400 italic">
                            暂无资源使用记录
                         </td>
                      </tr>
                    )}
                  </AnimatePresence>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default UseCondition;
