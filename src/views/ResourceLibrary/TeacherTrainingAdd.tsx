import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Upload, 
  Image as ImageIcon, 
  FileVideo, 
  Plus, 
  X,
  Search,
  User,
  History
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const TeacherTrainingAdd: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    stage: '',
    subject: '',
    topic: '',
    teacher: '',
    intro: '',
    type: 'role' // role or person
  });

  const [charCount, setCharCount] = useState(0);

  const handleInputChange = (field: string, value: string) => {
    if (field === 'intro' && value.length > 50) return;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'intro') setCharCount(value.length);
  };

  const handleSubmit = () => {
     if (!formData.name || !formData.stage || !formData.subject) {
        alert('请填写必填字段');
        return;
     }
     // In real app, call API
     navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/resource-library/training" className="hover:text-blue-600 font-medium">教师研修</Link>
        <span>&gt;</span>
        <span className="text-slate-800 dark:text-slate-300 font-medium">新增资源</span>
      </div>

      {/* Header operations */}
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">新增研修资源</h1>
         <div className="flex gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-sm hover:shadow-lg transition-all text-slate-500"
            >
              <ArrowLeft size={18} /> 返回
            </button>
            <button 
              onClick={handleSubmit}
              className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all"
            >
              <Check size={18} /> 确定
            </button>
         </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Basic Info */}
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">资源名称 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="请输入资源名称"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">资源学段 <span className="text-red-500">*</span></label>
                     <select 
                       className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                       value={formData.stage}
                       onChange={(e) => handleInputChange('stage', e.target.value)}
                     >
                        <option value="">请选择</option>
                        <option>小学</option>
                        <option>初中</option>
                        <option>高中</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">资源学科 <span className="text-red-500">*</span></label>
                     <select 
                       className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                       value={formData.subject}
                       onChange={(e) => handleInputChange('subject', e.target.value)}
                     >
                        <option value="">请选择</option>
                        <option>物理</option>
                        <option>化学</option>
                        <option>生物</option>
                     </select>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">加入专题</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    value={formData.topic}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                  >
                     <option value="">请选择专题</option>
                     <option>技能学习</option>
                     <option>安全学习</option>
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">来源教师</label>
                  <div className="relative">
                     <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input 
                        type="text" 
                        placeholder="请选择创造资源的教师"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.teacher}
                        onChange={(e) => handleInputChange('teacher', e.target.value)}
                     />
                  </div>
               </div>
            </div>

            {/* Right Column: Cover & Intro */}
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">封面图片</label>
                  <div className="relative aspect-video rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden group cursor-pointer">
                     <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400" className="w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity" />
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon size={32} className="mb-2" />
                        <span className="text-xs font-bold">点击更换图片</span>
                     </div>
                  </div>
               </div>

               <div className="space-y-2">
                  <div className="flex justify-between">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">资源简介</label>
                     <span className="text-[10px] text-slate-400 font-bold">{charCount}/50</span>
                  </div>
                  <textarea 
                     placeholder="请输入资源简介..."
                     maxLength={50}
                     className="w-full h-28 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                     value={formData.intro}
                     onChange={(e) => handleInputChange('intro', e.target.value)}
                  />
               </div>
            </div>
         </div>

         {/* Type & Personnel selection */}
         <div className="space-y-6 pt-8 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">指定类型 <span className="text-red-500">*</span></label>
               <div className="flex gap-8">
                  <button 
                    onClick={() => setFormData(p => ({ ...p, type: 'role' }))}
                    className="flex items-center gap-3 group"
                  >
                     <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        formData.type === 'role' ? "border-blue-600 bg-blue-600" : "border-slate-300"
                     )}>
                        {formData.type === 'role' && <div className="w-2 h-2 bg-white rounded-full" />}
                     </div>
                     <span className={cn("text-sm font-bold transition-colors", formData.type === 'role' ? "text-slate-800 dark:text-white" : "text-slate-400")}>指定角色</span>
                  </button>
                  <button 
                    onClick={() => setFormData(p => ({ ...p, type: 'person' }))}
                    className="flex items-center gap-3 group"
                  >
                     <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        formData.type === 'person' ? "border-blue-600 bg-blue-600" : "border-slate-300"
                     )}>
                        {formData.type === 'person' && <div className="w-2 h-2 bg-white rounded-full" />}
                     </div>
                     <span className={cn("text-sm font-bold transition-colors", formData.type === 'person' ? "text-slate-800 dark:text-white" : "text-slate-400")}>指定人员</span>
                  </button>
               </div>
               
               <div className="max-w-md">
                 {formData.type === 'role' ? (
                    <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                       <option>请选择角色</option>
                       <option>全体教师</option>
                       <option>任课教师</option>
                       <option>管理员</option>
                    </select>
                 ) : (
                    <div className="relative">
                       <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input type="text" placeholder="请输入并选择具体人员" className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                 )}
               </div>
            </div>
         </div>

         {/* File Upload */}
         <div className="space-y-4 pt-8 border-t border-slate-100 dark:border-slate-800">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">资源文件上传区</label>
            <div className="relative h-64 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border-4 border-dashed border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center p-8 group transition-all hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-200">
               <div className="w-20 h-20 rounded-3xl bg-white dark:bg-slate-700 shadow-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                  <Plus size={32} strokeWidth={3} />
               </div>
               <p className="text-sm font-black text-slate-800 dark:text-white mb-2 uppercase tracking-wide">点击或拖拽上传视频文件</p>
               <p className="text-[10px] font-bold text-slate-400 text-center max-w-xs leading-relaxed">
                  支持格式：.mp4 / .wmv / .avi / .mov / .3gp / .rmvb<br/>
                  单文件大小限制：1G 以内
               </p>
               <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default TeacherTrainingAdd;
