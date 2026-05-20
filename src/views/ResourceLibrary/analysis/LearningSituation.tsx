import React, { useState } from 'react';
import { 
  Search, 
  BarChart3, 
  GraduationCap, 
  ArrowUpDown,
  LayoutGrid,
  TrendingDown,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LINE_DATA = [
  { name: 'Mon', hours: 40 },
  { name: 'Tue', hours: 30 },
  { name: 'Wed', hours: 200 },
  { name: 'Thu', hours: 278 },
  { name: 'Fri', hours: 189 },
  { name: 'Sat', hours: 239 },
  { name: 'Sun', hours: 349 },
];

const MOCK_TEACHERS = [
  { id: 1, school: '咸阳市实验中学', name: '李明', subject: '物理', hours: 128, rank: 1 },
  { id: 2, school: '咸阳市实验中学', name: '张英', subject: '化学', hours: 112, rank: 2 },
  { id: 3, school: '咸阳市实验中学', name: '王伟', subject: '生物', hours: 94, rank: 3 },
  { id: 4, school: '咸阳市第一附属小学', name: '陈诚', subject: '科学', hours: 88, rank: 4 },
  { id: 5, school: '咸阳市实验高级中学', name: '赵六', subject: '物理', hours: 72, rank: 5 },
];

const LearningSituation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('hours');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredTeachers = MOCK_TEACHERS.filter(t => 
    t.name.includes(searchTerm) || t.subject.includes(searchTerm)
  ).sort((a: any, b: any) => {
    const factor = sortOrder === 'asc' ? 1 : -1;
    return (a[sortField] > b[sortField] ? 1 : -1) * factor;
  });

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>资源分析</span>
        <span>&gt;</span>
        <span className="text-slate-800 dark:text-slate-300 font-medium">学习情况分析</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
         <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">学习情况分析</h1>
         <div className="relative w-full max-w-sm">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="请输入资源名称、教师名称"
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      {/* Hero Chart Section */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
         <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
               <GraduationCap size={20} />
            </div>
            <div>
               <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">教师学习时间分布</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Teacher Study Time Distribution</p>
            </div>
         </div>
         
         <div className="h-64">
           {LINE_DATA.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={LINE_DATA}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                   <Tooltip />
                   <Line type="monotone" dataKey="hours" stroke="#f59e0b" strokeWidth={4} dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
             </ResponsiveContainer>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-slate-300 italic">
                <LayoutGrid size={48} className="mb-4 opacity-10" />
                <p className="text-sm font-bold">暂无学习时间分布分析</p>
             </div>
           )}
         </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
               教师学习数据看板
               <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">RAW DATA</span>
            </h3>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                     <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">学校名称</th>
                     <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">教师名称</th>
                     <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">执教学科</th>
                     <th 
                        className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer group text-center"
                        onClick={() => handleSort('hours')}
                     >
                        <div className="flex items-center justify-center gap-2">
                           学习课时
                           <ArrowUpDown size={12} className={cn("transition-colors", sortField === 'hours' ? "text-blue-600" : "text-slate-300 group-hover:text-slate-500")} />
                        </div>
                     </th>
                     <th 
                        className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer group text-center"
                        onClick={() => handleSort('rank')}
                     >
                        <div className="flex items-center justify-center gap-2">
                           排名
                           <ArrowUpDown size={12} className={cn("transition-colors", sortField === 'rank' ? "text-blue-600" : "text-slate-300 group-hover:text-slate-500")} />
                        </div>
                     </th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <AnimatePresence>
                    {filteredTeachers.length > 0 ? (
                      filteredTeachers.map((t) => (
                        <motion.tr 
                          key={t.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                           <td className="px-8 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">{t.school}</td>
                           <td className="px-8 py-4 text-sm font-bold text-slate-900 dark:text-white">{t.name}</td>
                           <td className="px-8 py-4 text-center">
                              <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[10px] font-black rounded uppercase">
                                {t.subject}
                              </span>
                           </td>
                           <td className="px-8 py-4 text-sm font-black text-slate-900 dark:text-white text-center">{t.hours} H</td>
                           <td className="px-8 py-4 text-center">
                              <div className={cn(
                                "inline-flex items-center justify-center w-8 h-8 rounded-xl font-black text-xs",
                                t.rank === 1 ? "bg-amber-100 text-amber-600" : 
                                t.rank === 2 ? "bg-slate-100 text-slate-600" : 
                                t.rank === 3 ? "bg-orange-100 text-orange-600" : "bg-slate-50 text-slate-400"
                              )}>
                                {t.rank}
                              </div>
                           </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                         <td colSpan={5} className="px-8 py-12 text-center text-slate-400 italic">
                            暂无教学数据，请尝试搜索关键词
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

export default LearningSituation;
