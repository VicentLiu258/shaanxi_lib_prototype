import React, { useState } from 'react';
import { 
  ArrowLeft, 
  QrCode, 
  Plus, 
  Star, 
  Hammer,
  ThumbsUp, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  Table, 
  LayoutGrid, 
  Download,
  FileText,
  PlayCircle,
  FileVideo,
  FileCheck,
  BookOpen,
  X,
  Send
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

const ResourceDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isInstrumentsExpanded, setIsInstrumentsExpanded] = useState(false);
  const [instrumentView, setInstrumentView] = useState<'table' | 'card'>('table');
  const [isCollected, setIsCollected] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');

  const resource = {
    title: '初中物理-光的反射实验全流程教学课件及指导手册建议版',
    stage: '初中',
    subject: '物理',
    grade: '八年级',
    intro: '本资源旨在帮助学生深入理解光的反射定律，通过数字化实验设备（如受光感应系统、激光阵列等）进行精确测量。课件包含了完整的实验步骤视频、原理深度解析及课后拓展思考题。',
    source: '苏威尔数字化实验室 提供',
    rating: 4.8,
    ratingCount: 125,
    likes: 128,
    views: 2450
  };

  const learningItems = [
    { name: '背景资料', type: 'doc', size: '1.2MB' },
    { name: '实验介绍', type: 'video', size: '45MB' },
    { name: '预习习题', type: 'doc', size: '450KB' },
    { name: '指导手册', type: 'doc', size: '2.1MB' },
    { name: '演示课件', type: 'ppt', size: '15MB' },
    { name: '实验报告', type: 'doc', size: '800KB' },
    { name: '课后练习', type: 'doc', size: '1.5MB' },
    { name: '视频讲解', type: 'video', size: '120MB' },
  ];

  const instruments = [
    { id: 'I001', name: '激光点光源', specs: '5mW, 650nm', count: 1 },
    { id: 'I002', name: '平面镜组件', specs: '100x100mm', count: 1 },
    { id: 'I003', name: '数字化量角器', specs: '精度0.1度', count: 1 },
    { id: 'I004', name: '光学支架', specs: '铝合金, 30cm', count: 2 },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'doc': return <FileText size={16} className="text-blue-500" />;
      case 'video': return <FileVideo size={16} className="text-red-500" />;
      case 'ppt': return <BookOpen size={16} className="text-orange-500" />;
      default: return <Download size={16} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/resource-library/home" className="hover:text-blue-600">资源管理</Link>
        <span>&gt;</span>
        <Link to="/resource-library/home" className="hover:text-blue-600">资源首页</Link>
        <span>&gt;</span>
        <span className="text-slate-800 dark:text-slate-300 font-medium truncate max-w-xs">{resource.title}</span>
      </div>

      {/* Top Operations */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:shadow-md transition-all text-slate-600">
             <QrCode size={20} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
             <Plus size={18} /> 加入到我的备课
          </button>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all text-sm font-bold"
        >
          <ArrowLeft size={18} /> 返回
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
              <h1 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">
                {resource.title}
              </h1>

              <div className="flex flex-wrap gap-2">
                 {[resource.stage, resource.subject, resource.grade].map(tag => (
                   <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-bold">
                     {tag}
                   </span>
                 ))}
              </div>

              <div className="space-y-4">
                 <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider opacity-50">资源简介：</h4>
                 <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                   {resource.intro}
                 </p>
                 <p className="text-sm text-slate-400">来源：{resource.source}</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={16} fill={s <= 4.5 ? "#EAB308" : "none"} className={s <= 4.5 ? "text-yellow-500" : "text-slate-300"} />
                          ))}
                       </div>
                       <span className="text-lg font-bold text-slate-800 dark:text-white">{resource.rating}</span>
                       <span className="text-xs text-slate-400">({resource.ratingCount}人评价)</span>
                    </div>
                    <button 
                      onClick={() => setShowRatingDialog(true)}
                      className="text-sm font-bold text-blue-600 hover:underline"
                    >
                      去评价
                    </button>
                 </div>

                 <div className="flex items-center gap-6">
                    <button 
                      onClick={() => setIsCollected(!isCollected)}
                      className={cn(
                        "flex items-center gap-2 text-sm font-bold transition-colors",
                        isCollected ? "text-amber-500" : "text-slate-400 hover:text-blue-600"
                      )}
                    >
                      {isCollected ? <Star size={20} fill="currentColor" /> : <Star size={20} />}
                      {isCollected ? '已收藏' : '收藏'}
                    </button>
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                       <ThumbsUp size={18} /> {resource.likes}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                       <Eye size={18} /> {resource.views}
                    </div>
                 </div>
              </div>
           </div>

           {/* Instrument Section */}
           <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <button 
                onClick={() => setIsInstrumentsExpanded(!isInstrumentsExpanded)}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  < Hammer size={20} className="text-blue-600" />
                  仪器清单：
                </h3>
                {isInstrumentsExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              <AnimatePresence>
                {isInstrumentsExpanded && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden bg-slate-50 dark:bg-slate-900/50"
                  >
                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                       <div className="flex justify-end">
                          <button 
                            onClick={() => setInstrumentView(instrumentView === 'table' ? 'card' : 'table')}
                            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600"
                          >
                            {instrumentView === 'table' ? <LayoutGrid size={16} /> : <Table size={16} />}
                            切换仪器查看形式
                          </button>
                       </div>

                       {instrumentView === 'table' ? (
                         <div className="overflow-x-auto">
                           <table className="w-full text-sm">
                             <thead>
                               <tr className="text-slate-400 border-b border-slate-200 dark:border-slate-800">
                                 <th className="pb-3 text-left font-bold">序号</th>
                                 <th className="pb-3 text-left font-bold">仪器编号</th>
                                 <th className="pb-3 text-left font-bold">仪器名称</th>
                                 <th className="pb-3 text-left font-bold">仪器规格</th>
                                 <th className="pb-3 text-right font-bold">数量</th>
                               </tr>
                             </thead>
                             <tbody>
                               {instruments.map((item, idx) => (
                                 <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800/50 group">
                                   <td className="py-4 text-slate-500">{idx + 1}</td>
                                   <td className="py-4 font-mono text-blue-600 cursor-pointer hover:underline">#{item.id}</td>
                                   <td className="py-4 font-bold text-slate-800 dark:text-slate-200">{item.name}</td>
                                   <td className="py-4 text-slate-500">{item.specs}</td>
                                   <td className="py-4 text-right font-bold">{item.count}</td>
                                 </tr>
                               ))}
                             </tbody>
                           </table>
                         </div>
                       ) : (
                         <div className="grid grid-cols-2 gap-4">
                            {instruments.map((item) => (
                              <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col gap-2">
                                 <div className="flex justify-between">
                                    <span className="text-xs font-mono text-blue-600">#{item.id}</span>
                                    <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-0.5 rounded">x{item.count}</span>
                                 </div>
                                 <h4 className="font-bold">{item.name}</h4>
                                 <p className="text-xs text-slate-400">{item.specs}</p>
                              </div>
                            ))}
                         </div>
                       )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           {/* Content Sections */}
           <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-12">
              <section className="space-y-4">
                 <h2 className="text-xl font-black text-slate-800 dark:text-white border-l-4 border-blue-600 pl-4">第一章节：实验准备</h2>
                 <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                   在开始实验之前，请确保所有数字化感应设备已正确充电并连接至教学主机。检查激光光源是否在正常发射范围内，并确保背景板平面无遮挡且洁净。
                 </p>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
                       <img src="https://images.unsplash.com/photo-1544391682-1717343c39d4?w=400" className="w-full h-full object-cover opacity-80" />
                    </div>
                    <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
                       <img src="https://images.unsplash.com/photo-1603126731702-509154ad9560?w=400" className="w-full h-full object-cover opacity-80" />
                    </div>
                 </div>
              </section>

              <section className="space-y-4">
                 <h2 className="text-xl font-black text-slate-800 dark:text-white border-l-4 border-blue-600 pl-4">第二章节：实验原理与现象</h2>
                 <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                   光的反射分为镜面反射和漫反射。本实验重点研究镜面反射的量化规律。通过改变入射角（θi），实时记录反射角（θr）。利用受光感应器的极低延迟反馈，我们可以瞬时绘制出θi-θr的函数曲线，验证在实验误差范围内反馈的一致性。
                 </p>
              </section>
           </div>
        </div>

        {/* Floating Sidebar Content */}
        <div className="sticky top-4 space-y-6">
           <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-lg p-6">
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                 <FileCheck size={18} className="text-blue-600" />
                 学习清单
              </h3>
              <div className="space-y-3">
                 {learningItems.map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-100 transition-all group">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                            {getFileIcon(item.type)}
                         </div>
                         <div>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.name}</p>
                            <p className="text-[10px] text-slate-400">{item.size}</p>
                         </div>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                         <Download size={16} />
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Rating Dialog */}
      <AnimatePresence>
        {showRatingDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                 <h3 className="text-lg font-bold">资源评价</h3>
                 <button onClick={() => setShowRatingDialog(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                    <X size={20} />
                 </button>
              </div>
              <div className="p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">星级评分</label>
                    <div className="flex items-center gap-3">
                       {[1, 2, 3, 4, 5].map(s => (
                         <button 
                          key={s} 
                          onClick={() => setUserRating(s)}
                          className={cn(
                            "transition-all transform hover:scale-110",
                            userRating >= s ? "text-yellow-500" : "text-slate-200"
                          )}
                         >
                            <Star size={32} fill={userRating >= s ? "currentColor" : "none"} />
                         </button>
                       ))}
                       <span className="ml-4 text-xl font-black text-slate-800 dark:text-white">{userRating > 0 ? `${userRating}.0` : '-'}</span>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">评价内容</label>
                    <textarea 
                      placeholder="请输入您的使用反馈，这将帮助我们改进资源质量..."
                      className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                    />
                 </div>

                 <div className="flex gap-4">
                    <button 
                      onClick={() => setShowRatingDialog(false)}
                      className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                    >
                      取消
                    </button>
                    <button 
                      onClick={() => setShowRatingDialog(false)}
                      className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Send size={18} /> 提交评价
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

export default ResourceDetail;
