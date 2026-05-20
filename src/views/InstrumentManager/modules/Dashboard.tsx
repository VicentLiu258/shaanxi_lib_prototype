import React from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Users, 
  Database, 
  History,
  FileText,
  Mail,
  Wrench,
  LogOut,
  ChevronRight,
  AlertTriangle,
  Clock,
  ClipboardList,
  CheckCircle2,
  Send,
  Share2,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Plus,
  ArrowRightCircle,
  FileSearch,
  ShoppingCart,
  Box,
  Truck
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { cn } from '../../../lib/utils';

const COLORS = ['#1B6BE5', '#52C41A', '#FAAD14', '#FF4D4F', '#722ED1'];

const barData = [
  { name: '通用仪器', count: 450, total: 125000 },
  { name: '测量分析', count: 320, total: 248000 },
  { name: '教学模型', count: 180, total: 45000 },
  { name: '生物耗材', count: 680, total: 12000 },
  { name: '物理元件', count: 540, total: 8500 },
];

const pieData = [
  { name: '闲置', value: 400 },
  { name: '已借用', value: 300 },
  { name: '待处置', value: 100 },
  { name: '已处置', value: 200 },
];

const deptData = [
  { name: '物理实验室', count: 340 },
  { name: '化学实验室', count: 280 },
  { name: '生物实验室', count: 450 },
  { name: '现代教育中心', count: 120 },
];

export const Dashboard: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-8"
    >
      {/* 公告发布 & 快速向导 */}
      <div className="grid grid-cols-12 gap-8">
        {/* 操作引导区 */}
        <section className="col-span-12 lg:col-span-9">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
               <ArrowRightCircle className="text-[#1B6BE5]" size={20} />
               初始化业务向导
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">Setup Progress: 25%</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { 
                step: '①', 
                title: '系统设置', 
                color: 'bg-blue-500',
                active: true,
                items: ['维护组织员工', '维护区域部署', '导入标签编码', '查看系统日志'] 
              },
              { 
                step: '②', 
                title: '信息设置', 
                color: 'bg-indigo-500',
                active: false,
                items: ['配置审批流程', '配置消息设置', '配置预警值', '系统参数管理'] 
              },
              { 
                step: '③', 
                title: '信息录入', 
                color: 'bg-emerald-500',
                active: false,
                items: ['录入仪器信息', '仪器库存初始化', '仪器入库申请', '耗材入库申请'] 
              },
              { 
                step: '④', 
                title: '日常管理', 
                color: 'bg-amber-500',
                active: false,
                items: ['仪器借用/维修', '耗材领用/处置', '资产转移', '日常盘点'] 
              }
            ].map((card, i) => (
              <div key={i} className={cn(
                "bg-white rounded-2xl p-6 border transition-all group",
                card.active ? "border-[#1B6BE5] border-2 shadow-lg shadow-blue-500/10" : "border-slate-200 shadow-sm"
              )}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg", card.color)}>
                    {card.step}
                  </div>
                  <h4 className="font-black text-slate-800">{card.title}</h4>
                </div>
                <div className="space-y-3">
                  {card.items.map((item, idx) => (
                    <button key={idx} className="w-full flex items-center justify-between text-xs font-bold text-slate-500 hover:text-[#1B6BE5] transition-colors group/item text-left">
                      <span>{item}</span>
                      <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 信息中心 - 公告 */}
        <section className="col-span-12 lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
               <Mail className="text-rose-500" size={20} />
               信息中心
            </h3>
            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors">发布</button>
          </div>
          <div className="space-y-4">
             {[
               { title: '暑期实验室封闭维护通知', date: '05-19', type: '紧急' },
               { title: '新批次电子天平入库验收指南', date: '05-17', type: '通知' },
               { title: '资产盘点季度总结报告(Q1)', date: '05-14', type: '简报' },
             ].map((msg, i) => (
               <div key={i} className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm hover:border-rose-200 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                     <span className={cn(
                       "text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter",
                       msg.type === '紧急' ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-400"
                     )}>{msg.type}</span>
                     <span className="text-[10px] font-mono font-bold text-slate-300">{msg.date}</span>
                  </div>
                  <h5 className="text-xs font-black text-slate-700 leading-snug group-hover:text-rose-600 transition-colors">{msg.title}</h5>
               </div>
             ))}
             <button className="w-full py-3 border border-dashed border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all">
                查看历史全量公告 (128)
             </button>
          </div>
        </section>
      </div>

      {/* 预警提醒 & 待办中心 */}
      <div className="grid grid-cols-12 gap-8">
        {/* 预警提醒区 */}
        <section className="col-span-12 lg:col-span-8">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                 <AlertTriangle className="text-amber-500" size={20} />
                 风险与预警提醒
              </h3>
              <button className="text-[10px] font-black text-[#1B6BE5] uppercase tracking-widest hover:underline">查看全部预警</button>
           </div>
           <div className="grid grid-cols-2 gap-4">
              {[
                { label: '单据审批提醒', val: '12', sub: '条待审', icon: ClipboardList, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: '保养到期提醒', val: '05', sub: '台设备', icon: Wrench, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: '日常报修提醒', val: '03', sub: '个申请', icon: History, color: 'text-amber-500', bg: 'bg-amber-50' },
                { label: '库存预警提醒', val: '24', sub: '种耗材', icon: Box, color: 'text-red-500', bg: 'bg-red-50' },
                { label: '借用未还提醒', val: '08', sub: '件仪器', icon: Clock, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                { label: '年限到期提醒', val: '15', sub: '件资产', icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50' },
                { label: '保养过期提醒', val: '02', sub: '台设备', icon: Wrench, color: 'text-rose-500', bg: 'bg-rose-50' },
                { label: '盘点计划超时', val: '01', sub: '个计划', icon: FileSearch, color: 'text-slate-500', bg: 'bg-slate-100' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-slate-200 transition-all cursor-pointer">
                  <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-lg transition-transform group-hover:scale-110", item.bg, item.color)}>
                    <item.icon size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                    <div className="flex items-baseline gap-2">
                       <span className="text-2xl font-black font-mono leading-none">{item.val}</span>
                       <span className="text-[10px] font-bold text-slate-400">{item.sub}</span>
                    </div>
                  </div>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                </div>
              ))}
           </div>
        </section>

        {/* 待办中心 */}
        <section className="col-span-12 lg:col-span-4">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                 <CheckCircle2 className="text-[#1B6BE5]" size={20} />
                 待办业务中心
              </h3>
           </div>
           <div className="grid grid-cols-2 gap-4">
              {[
                { label: '待处理数量', val: '08', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
                { label: '我发起的数量', val: '15', icon: Send, color: 'text-[#1B6BE5]', bg: 'bg-blue-50' },
                { label: '已处理数量', val: '142', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: '抄送我的数量', val: '24', icon: Share2, color: 'text-indigo-500', bg: 'bg-indigo-50' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center group hover:bg-slate-50 transition-colors">
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:rotate-12", item.bg, item.color)}>
                     <item.icon size={24} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{item.label}</p>
                  <span className="text-3xl font-black font-mono text-slate-800">{item.val}</span>
                </div>
              ))}
           </div>
           <button className="w-full mt-6 py-4 bg-[#1B6BE5] text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 hover:translate-y-[-2px] transition-all">
              进入工作流审批中心
           </button>
        </section>
      </div>

      {/* 统计图表区 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
             <BarChart3 className="text-[#1B6BE5]" size={20} />
             校舍资产大数据看板
          </h3>
          <div className="flex gap-2">
             <button className="px-3 py-1 bg-white border border-slate-200 rounded text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 transition-colors">导出周报</button>
             <button className="px-3 py-1 bg-[#1B6BE5] text-white rounded text-[10px] font-black uppercase transition-colors">同步数据</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* 仪器分类统计 */}
           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col h-[400px]">
              <div className="flex items-center justify-between mb-6">
                 <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">分类持有情况</h4>
                 <div className="flex bg-slate-100 rounded p-0.5">
                    <button className="px-2 py-1 text-[8px] font-black uppercase bg-white shadow-sm rounded">数量</button>
                    <button className="px-2 py-1 text-[8px] font-black uppercase text-slate-400">金额</button>
                 </div>
              </div>
              <div className="flex-1">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} layout="vertical">
                       <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                       <XAxis type="number" fontSize={10} fontStyle="bold" hide />
                       <YAxis dataKey="name" type="category" fontSize={10} width={80} tick={{ fill: '#64748b', fontWeight: 'bold' }} stroke="none" />
                       <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                       <Bar dataKey="count" fill="#1B6BE5" radius={[0, 4, 4, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* 仪器概况-数量 */}
           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col h-[400px]">
              <div className="flex items-center justify-between mb-6">
                 <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">仪器状态分布</h4>
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total: 1,000</div>
              </div>
              <div className="flex-1 flex flex-col">
                 <div className="flex-1">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie data={pieData} innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value">
                            {pieData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                         </Pie>
                         <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                         <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
                      </PieChart>
                   </ResponsiveContainer>
                 </div>
              </div>
           </div>

           {/* 仪器部门统计 */}
           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col h-[400px]">
              <div className="flex items-center justify-between mb-6">
                 <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">各部门持有对比</h4>
                 <div className="flex bg-slate-100 rounded p-0.5">
                    <button className="px-2 py-1 text-[8px] font-black uppercase bg-white shadow-sm rounded">数量</button>
                    <button className="px-2 py-1 text-[8px] font-black uppercase text-slate-400">金额</button>
                 </div>
              </div>
              <div className="flex-1">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deptData}>
                       <XAxis dataKey="name" fontSize={9} interval={0} angle={-15} textAnchor="end" tick={{ fill: '#64748b', fontWeight: 'bold' }} stroke="#e2e8f0" />
                       <YAxis fontSize={10} tick={{ fill: '#64748b', fontWeight: 'bold' }} stroke="#e2e8f0" />
                       <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                       <Bar dataKey="count" fill="#722ED1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>
      </section>
    </motion.div>
  );
};
