import React from 'react';
import { 
  ArrowLeft, 
  QrCode, 
  Box, 
  Info, 
  FlaskConical, 
  Table,
  Cpu,
  Layers
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const InstrumentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const instrument = {
    name: '数字化激光位移传感器',
    type: '传感器',
    id: id || 'INS-001',
    specs: '测量范围: 0-200mm; 分辨率: 0.01mm; 采样速率: 1000Hz',
    intro: '该数字化激光位移传感器采用了高精度激光三角测量技术。它能够实时采集微小的位移变化，并通过USB或蓝牙即时传输至数据采集系统。适用于固体线膨胀、简谐运动位移检测及多种物理力学实验。',
    icon: <Cpu size={48} className="text-blue-600" />
  };

  const supportExperiments = [
    { id: 1, lib: '系统实验库', subject: '物理', name: '金属线膨胀系数测定', code: 'PHY-EXP-024', image: 'https://images.unsplash.com/photo-1544391682-1717343c39d4?w=100' },
    { id: 2, lib: '系统实验库', subject: '物理', name: '单摆周期与摆长关系的精确验证', code: 'PHY-EXP-015', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=100' },
    { id: 3, lib: '教师研修', subject: '综合', name: '微小位移感应器教学演示', code: 'TRN-EXP-008', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/resource-library/instruments" className="hover:text-blue-600">系统仪器库</Link>
        <span>&gt;</span>
        <span className="text-slate-800 dark:text-slate-300 font-medium">{instrument.name}</span>
      </div>

      {/* Header operations */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{instrument.name}</h1>
         </div>
         <div className="flex items-center gap-3">
            <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:text-blue-600 transition-all">
               <QrCode size={20} />
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all font-bold text-sm"
            >
              <ArrowLeft size={18} /> 返回
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Main Info Card */}
         <div className="lg:col-span-12">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-12">
               <div className="md:w-1/3 aspect-square rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700">
                  <img src="https://images.unsplash.com/photo-1581091215367-9b6c01b22896?w=600" className="w-full h-full object-cover" />
               </div>

               <div className="flex-1 flex flex-col gap-8 justify-center">
                  <div className="space-y-4">
                     <div className="flex gap-2">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs font-black uppercase tracking-widest rounded-full">{instrument.type}</span>
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-mono rounded-full">{instrument.id}</span>
                     </div>
                     <h2 className="text-xl font-bold flex items-center gap-2">
                        <Info size={20} className="text-blue-500" />
                         仪器规格与介绍
                     </h2>
                     <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 font-mono text-sm text-slate-600 dark:text-slate-400">
                        {instrument.specs}
                     </div>
                     <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium">
                        {instrument.intro}
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Associated Experiments */}
         <div className="lg:col-span-12">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                     <FlaskConical size={20} className="text-blue-600" />
                     支持实验库
                  </h3>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Connected Experiments: {supportExperiments.length}</span>
               </div>
               
               <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left border-b border-slate-100 dark:border-slate-800">
                           <th className="px-8 py-5">序号</th>
                           <th className="px-4 py-5">实验库</th>
                           <th className="px-4 py-5">学科</th>
                           <th className="px-4 py-5">预览图</th>
                           <th className="px-4 py-5">实验名称</th>
                           <th className="px-8 py-5 text-right">实验编号</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                        {supportExperiments.map((exp, idx) => (
                           <tr key={exp.id} className="group hover:bg-slate-50 dark:hover:bg-blue-900/10 transition-colors">
                              <td className="px-8 py-4 text-sm text-slate-400 font-mono">{String(idx + 1).padStart(2, '0')}</td>
                              <td className="px-4 py-4">
                                 <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{exp.lib}</span>
                              </td>
                              <td className="px-4 py-4">
                                 <span className={cn(
                                    "px-2 py-0.5 rounded text-[10px] font-black uppercase text-white",
                                    exp.subject === '物理' ? "bg-blue-600" : "bg-teal-600"
                                 )}>{exp.subject}</span>
                              </td>
                              <td className="px-4 py-4">
                                 <div className="w-16 h-10 rounded shadow-sm overflow-hidden bg-slate-200">
                                    <img src={exp.image} className="w-full h-full object-cover" />
                                 </div>
                              </td>
                              <td className="px-4 py-4">
                                 <span className="text-sm font-black text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">{exp.name}</span>
                              </td>
                              <td className="px-8 py-4 text-right">
                                 <span className="text-xs font-mono text-slate-400 group-hover:text-blue-500 transition-colors">{exp.code}</span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default InstrumentDetail;
