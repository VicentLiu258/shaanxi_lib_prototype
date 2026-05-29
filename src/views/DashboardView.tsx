import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Settings, 
  Package, 
  Layers, 
  ShoppingCart, 
  BarChart2, 
  Calendar, 
  Zap, 
  Users,
  AlertTriangle,
  Clock,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Globe
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Navbar } from '../components/Navbar';
import { cn } from '../lib/utils';

interface DashboardViewProps {
  onBack: () => void;
  onLogout: () => void;
}

const data = [
  { name: 'Mon', usage: 400 },
  { name: 'Tue', usage: 300 },
  { name: 'Wed', usage: 600 },
  { name: 'Thu', usage: 800 },
  { name: 'Fri', usage: 500 },
  { name: 'Sat', usage: 200 },
  { name: 'Sun', usage: 100 },
];

const sidebarItems = [
  { icon: LayoutDashboard, label: '首页', active: true },
  { icon: Settings, label: '系统管理' },
  { icon: Package, label: '耗材管理' },
  { icon: Layers, label: '盘点管理' },
  { icon: ShoppingCart, label: '采购管理' },
  { icon: BarChart2, label: '统计报表' },
  { icon: Calendar, label: '课程管理' },
  { icon: Zap, label: '仪器管理' },
  { icon: Users, label: '个人中心' },
  { icon: AlertTriangle, label: '危化品管理' },
];

export const DashboardView: React.FC<DashboardViewProps> = ({ onBack, onLogout }) => {
  return (
    <div className="flex flex-col flex-1 overflow-hidden transition-colors">
      <Navbar onLogout={onLogout} />
      
      <div className="flex flex-1 overflow-hidden bg-[var(--bg-main)]">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-[var(--sidebar-bg)] flex flex-col shrink-0 z-20 transition-colors">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">SX</div>
          <span className="text-white font-semibold text-lg leading-tight tracking-tight">陕西实验室<br/><span className="text-[10px] text-blue-300 font-normal opacity-80 uppercase tracking-widest leading-none">Integrated Management</span></span>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
          <div className="px-6 py-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">核心管理</div>
          
          <div className="px-6 py-3 bg-blue-600/20 border-r-4 border-blue-400 text-white flex items-center gap-3 cursor-pointer transition-colors">
             <LayoutDashboard size={18} />
             <span className="text-sm">数据概览</span>
          </div>

          {[
            { icon: Layers, label: '设备资产' },
            { icon: Zap, label: '科研项目' },
            { icon: Calendar, label: '教学日程' },
          ].map((item, idx) => (
            <div key={idx} className="px-6 py-3 text-slate-300 hover:bg-white/5 flex items-center gap-3 cursor-pointer transition-colors group">
              <item.icon size={18} className="group-hover:text-blue-400 transition-colors" />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}

          <div className="mt-8 px-6 py-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">后续子系统入口</div>
          <div className="grid grid-cols-2 gap-2 px-4">
            {['危化品管理', '智慧物联', '耗材库房', '人员考评'].map((label) => (
              <div key={label} className="bg-white/5 p-3 rounded-lg text-[10px] text-slate-300 hover:bg-white/10 cursor-pointer border border-white/5 text-center transition-all">
                {label}
              </div>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 p-2 w-full text-slate-400 hover:text-white transition-colors text-xs font-medium"
          >
            <LayoutDashboard size={14} /> 返回系统门户
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="p-6 grid grid-cols-12 gap-6 flex-1 overflow-y-auto">
          {/* Row 1: Key Stats */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6 mb-2">
            {[
              { label: '在运行项目', val: '142', change: '+12.5%', icon: Layers, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
              { label: '高精密设备', val: '2,854', change: '在线 98%', icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
              { label: '待处理异常', val: '03', change: '关注量 2', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10', badge: true },
              { label: '总实验人次', val: '15.2k', change: '月度峰值', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-500/10' },
            ].map((stat, i) => (
              <div key={i} className="pro-card p-5 flex items-center gap-4 group hover:border-blue-200 transition-all">
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white font-mono leading-none mt-1">{stat.val}</p>
                </div>
                <div className={cn(
                  "ml-auto text-[10px] font-bold", 
                  stat.badge ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded" : (stat.change.startsWith('+') ? "text-green-500" : "text-slate-400")
                )}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: Equipment Status & Side Panels */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <div className="pro-card flex-1 flex flex-col overflow-hidden">
              <div className="p-5 border-b border-slate-50 dark:border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-slate-700 dark:text-slate-200">设备运行实时监控</h3>
                <button className="text-blue-600 text-xs font-medium flex items-center gap-1 hover:underline">
                  查看全部 <ChevronRight size={14} />
                </button>
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-100 dark:border-white/5">
                    <tr>
                      <th className="px-6 py-3">设备编号</th>
                      <th className="px-6 py-3">资产名称</th>
                      <th className="px-6 py-3">当前使用人</th>
                      <th className="px-6 py-3">剩余时长</th>
                      <th className="px-6 py-3 text-right">运行状态</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-50 dark:divide-white/5 font-medium">
                    {[
                      { id: 'EQ-2023-001', name: '场发射扫描电子显微镜', user: '李向阳', time: '02:14:00', status: '工作中', color: 'emerald' },
                      { id: 'EQ-2023-042', name: '液相色谱质谱联用仪', user: '王思琪', time: '05:45:20', status: '工作中', color: 'emerald' },
                      { id: 'EQ-2023-089', name: '核磁共振波谱仪', user: '-', time: '空闲', status: '就绪', color: 'slate' },
                      { id: 'EQ-2024-012', name: '自动旋转蒸发仪', user: '陈伟', time: '00:12:15', status: '预警中', color: 'amber' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-slate-400">{row.id}</td>
                        <td className="px-6 py-4 dark:text-slate-300">{row.name}</td>
                        <td className="px-6 py-4 flex items-center gap-2">
                           <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${row.user}`} alt="User" className="rounded-full" />
                           </div> 
                           {row.user}
                        </td>
                        <td className="px-6 py-4 text-slate-500">{row.time}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={cn(
                            "text-[10px] px-2 py-1 rounded font-bold uppercase",
                            row.color === 'emerald' ? "bg-emerald-100 text-emerald-700" : (row.color === 'amber' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500")
                          )}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 grid grid-rows-2 gap-6">
            <div className="pro-card p-5 flex flex-col overflow-hidden">
              <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                <Globe size={18} className="text-blue-500" /> 环境概览 (B栋4层)
              </h3>
              <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg relative overflow-hidden">
                <div className="absolute inset-4 grid grid-cols-3 grid-rows-3 gap-2 opacity-20">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="bg-blue-500 rounded-sm"></div>
                  ))}
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <div className="flex justify-between items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur p-3 rounded-lg shadow-sm border border-slate-200 dark:border-white/10">
                    <div className="text-center px-1">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">温度</p>
                      <p className="text-sm font-bold text-emerald-600">22.4°C</p>
                    </div>
                    <div className="w-px h-6 bg-slate-200 dark:bg-white/10"></div>
                    <div className="text-center px-1">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">湿度</p>
                      <p className="text-sm font-bold text-blue-600">45%RH</p>
                    </div>
                    <div className="w-px h-6 bg-slate-200 dark:bg-white/10"></div>
                    <div className="text-center px-1">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">洁净度</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Class 10</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--sidebar-bg)] border border-white/5 text-white rounded-xl shadow-lg p-5 flex flex-col transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm tracking-tight flex items-center gap-2 text-white">
                  <Clock size={16} className="text-blue-400" /> 近期系统日志
                </h3>
                <span className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded text-blue-400 animate-pulse uppercase font-bold tracking-widest">Live</span>
              </div>
              <div className="space-y-4 flex-1">
                {[
                  { title: '[科研部] 新项目审批通过', time: '2分钟前', sub: '西安创新产业园', color: 'bg-blue-500' },
                  { title: '[设备] 高温报警 (EQ-2024-012)', time: '15分钟前', sub: '物理分析一室', color: 'bg-amber-500' },
                  { title: '[人员] 门禁权限自动授予', time: '1小时前', sub: '研究生自习室', color: 'bg-emerald-500' },
                ].map((log, i) => (
                  <div key={i} className="flex gap-3 group cursor-pointer">
                    <div className={cn("w-1 h-8 rounded shrink-0", log.color)}></div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors">{log.title}</p>
                      <p className="text-[10px] text-blue-100/50 mt-1 uppercase font-bold tracking-widest">{log.time} · {log.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 bg-white/10 border border-white/10 rounded-lg text-xs font-medium hover:bg-white/20 text-blue-200 transition-colors uppercase tracking-widest leading-none">
                查看安全合规中心
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
  );
};
