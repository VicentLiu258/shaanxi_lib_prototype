import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Layers, 
  BookOpen, 
  Video, 
  Clock, 
  Star,
  Users,
  LayoutGrid,
  Calendar,
  ChevronRight,
  TrendingUp,
  Award,
  Gem,
  MoreHorizontal,
  Trash2,
  Settings2,
  X,
  Send,
  PlusCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const MOCK_TRAINING = [
  { 
    id: 1, 
    title: '数字化物理探究实验教学研修班 (第一期)', 
    type: '直播课', 
    teacher: '陈教授', 
    date: '2024-04-15', 
    enrolled: 450, 
    rate: 4.9, 
    thumb: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
    stage: '初中',
    topic: '技能学习',
    method: '创建',
    isElite: true
  },
  { 
    id: 2, 
    title: '初中化学高效课堂构建：传感器应用实务', 
    type: '系列课', 
    teacher: '李导师', 
    date: '2024-03-20', 
    enrolled: 1200, 
    rate: 4.8, 
    thumb: 'https://images.unsplash.com/photo-1532187875605-2fe358a3d4d2?w=400',
    stage: '初中',
    topic: '技能学习',
    method: '创建',
    isElite: false
  },
  { 
    id: 3, 
    title: '精品课视频录制：从脚本策划到后期剪辑', 
    type: '技能课', 
    teacher: '张主任', 
    date: '2024-05-02', 
    enrolled: 890, 
    rate: 4.7, 
    thumb: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=400',
    stage: '高中',
    topic: '技能学习',
    method: '上传',
    isElite: false
  },
  { 
    id: 4, 
    title: '实验室化学品安全存放与应急处理规范', 
    type: '研讨会', 
    teacher: '王专家', 
    date: '2024-04-22', 
    enrolled: 300, 
    rate: 5.0, 
    thumb: 'https://images.unsplash.com/photo-1603126731702-509154ad9560?w=400',
    stage: '初中,高中',
    topic: '安全学习',
    method: '创建',
    isElite: true
  },
];

const TeacherTraining: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('全部');
  const [resources, setResources] = useState(MOCK_TRAINING);
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [showChangeTopic, setShowChangeTopic] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [newTopicName, setNewTopicName] = useState('');
  const [topics, setTopics] = useState(['技能学习', '安全学习']);
  const [tempTopic, setTempTopic] = useState('');

  const filteredResources = resources.filter(res => 
    activeTab === '全部' || res.topic === activeTab
  );

  const handleRemove = (id: number) => {
    if (confirm('确定要移除该资源吗？')) {
      setResources(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleCreateTopic = () => {
    if (newTopicName.trim()) {
      setTopics(prev => [...prev, newTopicName.trim()]);
      setNewTopicName('');
      setShowCreateTopic(false);
    }
  };

  const handleChangeTopic = () => {
     if (selectedResource && tempTopic) {
        setResources(prev => prev.map(r => 
           r.id === selectedResource.id ? { ...r, topic: tempTopic } : r
        ));
        setShowChangeTopic(false);
     }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="text-slate-800 dark:text-slate-300 font-medium">教师研修</span>
      </div>

      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">教师研修</h1>
         <div className="flex gap-3">
            <button 
              onClick={() => navigate('add')}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all shrink-0"
            >
               <Plus size={18} /> 新增资源
            </button>
            <button 
              onClick={() => setShowCreateTopic(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-sm hover:shadow-lg transition-all text-blue-600 shrink-0"
            >
               <Layers size={18} /> 创建专题
            </button>
         </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
         <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="请输入实验名称"
              onKeyDown={(e) => e.key === 'Enter' && console.log('Search')}
              className="w-full pl-12 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            />
         </div>
         <div className="flex items-center gap-2">
            {['全部', ...topics].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-5 py-2 text-xs font-black uppercase tracking-widest transition-all rounded-lg",
                  activeTab === tab ? "bg-blue-600 text-white" : "text-slate-500 hover:text-blue-600"
                )}
              >
                 {tab}
              </button>
            ))}
         </div>
         <div className="text-xs font-bold text-slate-400">
            当前共有 <span className="text-blue-600">{filteredResources.length}</span> 份资源
         </div>
      </div>

      {/* Resource List */}
      <div className="grid grid-cols-1 gap-4">
         <AnimatePresence mode="popLayout">
           {filteredResources.length > 0 ? (
             filteredResources.map((item) => (
                <motion.div 
                 key={item.id}
                 layout
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="group flex gap-6 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
                >
                   <div className="relative w-48 aspect-video rounded-xl overflow-hidden shrink-0">
                      <img src={item.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-0 right-0 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-bl-lg">
                         PHY
                      </div>
                      {item.isElite && (
                         <div className="absolute top-2 right-2 p-1 bg-amber-400 rounded-full text-white shadow-lg">
                            <Gem size={14} />
                         </div>
                      )}
                   </div>
                   
                   <div className="flex-1 py-1 flex flex-col justify-between min-w-0">
                      <div>
                         <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                            {item.title}
                         </h3>
                         <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-1.5 truncate">适用学段：{item.stage}</span>
                            <span className="flex items-center gap-1.5">所属专题：{item.topic}</span>
                            <span className="flex items-center gap-1.5"><Clock size={14} /> {item.date}</span>
                            <span className="flex items-center gap-1.5">方式：{item.method}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold text-blue-600">
                         <span className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
                            <Users size={14} /> {item.enrolled}人已学习
                         </span>
                      </div>
                   </div>

                   <div className="flex flex-col justify-center gap-2 shrink-0">
                      <button 
                        onClick={() => {
                           setSelectedResource(item);
                           setTempTopic(item.topic);
                           setShowChangeTopic(true);
                        }}
                        className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                      >
                         更换专题
                      </button>
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all"
                      >
                         移除
                      </button>
                   </div>
                </motion.div>
             ))
           ) : (
             <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <LayoutGrid size={64} className="mb-4 opacity-10" />
                <p className="text-lg font-medium italic">哎呀，这里空空如也~</p>
             </div>
           )}
         </AnimatePresence>
      </div>

      {/* Pagination */}
      {filteredResources.length > 0 && (
         <div className="flex items-center justify-between pt-8 pb-12 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-400 font-medium">共 {filteredResources.length} 条 显示</div>
            <div className="flex items-center gap-2">
               {[1].map(p => (
                 <button key={p} className="w-8 h-8 rounded-lg bg-blue-600 text-white text-xs font-bold">1</button>
               ))}
            </div>
         </div>
      )}

      {/* Create Topic Dialog */}
      <AnimatePresence>
         {showCreateTopic && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
             >
               <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                  <h3 className="text-lg font-black border-l-4 border-blue-600 pl-4 uppercase tracking-tight text-slate-800 dark:text-white">创建专题</h3>
                  <button onClick={() => setShowCreateTopic(false)} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full">
                     <X size={20} />
                  </button>
               </div>
               <div className="p-8 space-y-6">
                  <div className="space-y-2">
                     <div className="flex justify-between">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">专题名称 (必填)</label>
                        <span className="text-[10px] text-slate-400">{newTopicName.length}/20</span>
                     </div>
                     <input 
                        type="text" 
                        placeholder="专题名称（必填）"
                        maxLength={20}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                        value={newTopicName}
                        onChange={(e) => setNewTopicName(e.target.value)}
                     />
                  </div>
                  <div className="flex gap-4 pt-2">
                     <button onClick={() => setShowCreateTopic(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all">取消</button>
                     <button 
                        onClick={handleCreateTopic}
                        className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                     >
                        <PlusCircle size={18} /> 确定
                     </button>
                  </div>
               </div>
             </motion.div>
           </div>
         )}
      </AnimatePresence>

      {/* Change Topic Dialog */}
      <AnimatePresence>
         {showChangeTopic && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
             >
               <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                  <h3 className="text-lg font-black border-l-4 border-blue-600 pl-4 uppercase tracking-tight text-slate-800 dark:text-white">更换专题</h3>
                  <button 
                    onClick={() => {
                        setShowChangeTopic(false);
                        setShowCreateTopic(true);
                    }}
                    className="flex items-center gap-1 text-xs font-black text-blue-600 hover:underline px-2"
                  >
                     <PlusCircle size={14} /> 创建专题
                  </button>
               </div>
               <div className="p-8 space-y-6">
                  <div className="space-y-3">
                     {topics.map(topic => (
                        <button 
                           key={topic}
                           onClick={() => setTempTopic(topic)}
                           className={cn(
                              "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all group",
                              tempTopic === topic 
                                 ? "bg-blue-600 border-blue-600 text-white" 
                                 : "bg-slate-50 dark:bg-slate-800 border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 text-slate-600 dark:text-slate-400"
                           )}
                        >
                           <span className="font-bold">{topic}</span>
                           <div className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                              tempTopic === topic ? "border-white bg-white" : "border-slate-300"
                           )}>
                              {tempTopic === topic && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                           </div>
                        </button>
                     ))}
                  </div>
                  <div className="flex gap-4 pt-2">
                     <button onClick={() => setShowChangeTopic(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all">取消</button>
                     <button 
                        onClick={handleChangeTopic}
                        className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                     >
                        <Send size={18} /> 确定
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

export default TeacherTraining;

