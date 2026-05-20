import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  ThumbsUp, 
  Eye, 
  Download,
  PlayCircle,
  FileText,
  Package,
  Heart,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const STAGES = ['全部', '小学', '初中', '高中'];
const TO_EXPAND_FILTERS = [
  { label: '年级', key: 'grade', options: ['全部', '一年级', '二年级', '三年级', '四年级', '五年级', '六级', '七年级', '八年级', '九年级', '高一', '高二', '高三'] },
  { label: '学科', key: 'subject', options: ['全部', '物理', '化学', '生物'] },
  { label: '版本', key: 'version', options: ['全部', '人教版', '苏教版'] },
  { label: '册次', key: 'volume', options: ['全部', '上册', '下册'] },
  { label: '类型', key: 'type', options: ['全部', 'PPT', '课前预习', '实验报告', '课后练习', '视频', '实验指导手册', '课程包'] },
  { label: '资源库', key: 'library', options: ['全部', '苏威尔', '教师研修', '优质资源'] },
  { label: '标签', key: 'tag', options: ['全部', '必修课程', '选修课程', '课外资源', '培训资料'] },
];

const MOCK_RESOURCES = [
  { 
    id: '1', 
    title: '初中物理-光的反射实验全流程教学课件及指导手册建议版', 
    stage: '初中', subject: '物理', grade: '八年级', 
    source: '系统 提供', 
    type: 'PPT',
    cover: 'https://images.unsplash.com/photo-1544391682-1717343c39d4?w=400&q=80',
    discipline: 'Phy',
    likes: 128, views: 2450, isCollected: false
  },
  { 
    id: '2', 
    title: '高二化学-电解原理深度解析与实验装置展示视频专集', 
    stage: '高中', subject: '化学', grade: '高二', 
    source: '教师研修 提供', 
    type: '视频',
    cover: 'https://images.unsplash.com/photo-1603126731702-509154ad9560?w=400&q=80',
    discipline: 'Che',
    likes: 85, views: 1820, isCollected: true
  },
  { 
    id: '3', 
    title: '小学科学-种子的萌发观察记录实验报告模板通用款', 
    stage: '小学', subject: '生物', grade: '五年级', 
    source: '苏威尔 提供', 
    type: '实验报告',
    cover: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=400&q=80',
    discipline: 'Syn',
    likes: 56, views: 940, isCollected: false
  },
  { 
    id: '4', 
    title: '九年级化学-酸碱中和反应数字化实验操作手册', 
    stage: '初中', subject: '化学', grade: '九年级', 
    source: '系统 提供', 
    type: '实验指导手册',
    cover: 'https://images.unsplash.com/photo-1492052722242-2554d0f98e0a?w=400&q=80',
    discipline: 'Che',
    likes: 210, views: 3200, isCollected: false
  },
  { 
    id: '5', 
    title: '高一物理-匀变速直线运动规律应用课后练习精选', 
    stage: '高中', subject: '物理', grade: '高一', 
    source: '教师研修 提供', 
    type: '课后练习',
    cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80',
    discipline: 'Phy',
    likes: 42, views: 780, isCollected: false
  },
  { 
    id: '6', 
    title: '实验教学精品资源包-声学综合研究系列课程', 
    stage: '初中', subject: '物理', grade: '七年级', 
    source: '优质资源 提供', 
    type: '课程包',
    cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80',
    discipline: 'Phy',
    likes: 156, views: 2100, isCollected: true
  }
];

const HomeResourceLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [activeRootTab, setActiveRootTab] = useState<'校本资源' | '区域资源'>('校本资源');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [selectedStage, setSelectedStage] = useState('全部');
  const [activeSort, setActiveSort] = useState('默认');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    grade: '全部',
    subject: '全部',
    version: '全部',
    volume: '全部',
    type: '全部',
    library: '全部',
    tag: '全部'
  });

  const [resources, setResources] = useState(MOCK_RESOURCES);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setResources(prev => prev.map(res => 
      res.id === id ? { ...res, isCollected: !res.isCollected } : res
    ));
  };

  const handleFilterChange = (key: string, value: string) => {
     setFilterValues(prev => ({ ...prev, [key]: value }));
     // In a real app, trigger refresh
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PPT': return <Package size={14} className="text-orange-500" />;
      case '视频': return <PlayCircle size={14} className="text-red-500" />;
      case '实验报告': return <FileText size={14} className="text-blue-500" />;
      case '课程包': return <Package size={14} className="text-purple-500" />;
      default: return <FileText size={14} className="text-slate-400" />;
    }
  };

  const getDisciplineColor = (disc: string) => {
     switch(disc) {
        case 'Phy': return 'bg-blue-600';
        case 'Che': return 'bg-teal-600';
        case 'Syn': return 'bg-amber-600';
        default: return 'bg-slate-600';
     }
  };

  return (
    <div className="space-y-6">
      {/* Root Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {['校本资源', '区域资源'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveRootTab(tab as any)}
            className={cn(
              "px-8 py-3 text-sm font-bold transition-all relative",
              activeRootTab === tab 
                ? "text-blue-600" 
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            )}
          >
            {tab}
            {activeRootTab === tab && (
              <motion.div 
                layoutId="rootTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" 
              />
            )}
          </button>
        ))}
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="space-y-4">
          {/* Main Filter Row: Stage + Search */}
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-500 min-w-[3rem]">学段：</span>
              <div className="flex flex-wrap gap-2">
                {STAGES.map(stage => (
                  <button
                    key={stage}
                    onClick={() => setSelectedStage(stage)}
                    className={cn(
                      "px-3 py-1 rounded text-sm transition-all",
                      selectedStage === stage 
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    )}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1 max-w-sm">
              <div className="relative flex-1">
                 <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                  type="text" 
                  placeholder="请输入内容"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                 />
              </div>
              <button 
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline shrink-0"
              >
                {isFilterExpanded ? (
                  <>收起更多 <ChevronUp size={16} /></>
                ) : (
                  <>显示更多 <ChevronDown size={16} /></>
                )}
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {isFilterExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pt-4 space-y-4 border-t border-slate-100 dark:border-slate-800"
              >
                {TO_EXPAND_FILTERS.map(group => (
                  <div key={group.key} className="flex items-start gap-4">
                    <span className="text-sm font-bold text-slate-500 min-w-[3rem] mt-1">{group.label}：</span>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleFilterChange(group.key, opt)}
                          className={cn(
                            "px-3 py-1 rounded text-sm transition-all",
                            filterValues[group.key] === opt 
                              ? "bg-blue-600 text-white" 
                              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sort Section */}
      <div className="flex gap-4">
         {['默认', '最新', '评分'].map(sort => (
           <button
            key={sort}
            onClick={() => setActiveSort(sort)}
            className={cn(
              "px-6 py-1.5 rounded-full text-sm font-bold transition-all",
              activeSort === sort 
                ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm border border-blue-200 dark:border-blue-800" 
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            )}
           >
             {sort}
           </button>
         ))}
      </div>

      {/* Resource List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map(res => (
          <motion.div 
            key={res.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-800 transition-all cursor-pointer"
            onClick={() => navigate(`/resource-library/detail/${res.id}`)}
          >
            <div className="relative aspect-video overflow-hidden">
               <img 
                src={res.cover} 
                alt={res.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
               />
               <div className={cn(
                 "absolute top-0 right-0 px-2 py-1 text-[10px] font-black text-white rounded-bl-lg tracking-wider",
                 getDisciplineColor(res.discipline)
               )}>
                 {res.discipline}
               </div>
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                     <ExternalLink size={24} />
                  </div>
               </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-2">
                <div className="mt-1 shrink-0">{getTypeIcon(res.type)}</div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {res.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded uppercase font-bold tracking-tight">
                  {res.stage} / {res.subject} / {res.grade}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                 <span>{res.source}</span>
                 <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1"><ThumbsUp size={12} /> {res.likes}</div>
                   <div className="flex items-center gap-1"><Eye size={12} /> {res.views}</div>
                 </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button 
                  onClick={(e) => toggleFavorite(res.id, e)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg border text-xs font-bold transition-all",
                    res.isCollected 
                      ? "bg-amber-50 border-amber-200 text-amber-600" 
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-200 hover:text-blue-600"
                  )}
                >
                  {res.isCollected ? <Star size={14} fill="currentColor" /> : <Star size={14} />}
                  {res.isCollected ? '已收藏' : '收藏'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-8 pb-12 border-t border-slate-200 dark:border-slate-800">
        <div className="text-xs text-slate-400 font-medium">共 120 条 显示</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-100 disabled:opacity-30">
               &lt;
            </button>
            {[1, 2, 3, '...', 12].map((p, i) => (
              <button 
                key={i}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all",
                  p === 1 
                    ? "bg-blue-600 text-white" 
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                {p}
              </button>
            ))}
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-100">
               &gt;
            </button>
          </div>

          <div className="flex items-center gap-2">
             <select className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs outline-none">
                <option>10条/页</option>
                <option>20条/页</option>
                <option>50条/页</option>
             </select>
             <div className="flex items-center gap-1 text-xs text-slate-500">
                前往第 <input type="text" defaultValue="1" className="w-10 h-7 text-center border border-slate-200 dark:border-slate-800 rounded mx-1 dark:bg-slate-900" /> 页
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeResourceLibrary;
