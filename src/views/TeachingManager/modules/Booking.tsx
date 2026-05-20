import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search, 
  Calendar as CalendarIcon,
  ChevronDown,
  Clock,
  LayoutGrid,
  List as ListIcon,
  Trash2,
  X,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import dayjs from 'dayjs';
import { cn } from '../../../lib/utils';

// Mock data for initial display
const MOCK_BOOKINGS = [
  { id: '1', title: '探究影响电荷间相互作用的因素', date: '2024-03-05', time: '10:00-11:00', teacher: '张平', class: '高一(3)班', lab: '物理实验室1', subject: '物理' },
  { id: '2', title: '植物细胞的吸水和失水', date: '2024-03-06', time: '14:30-15:30', teacher: '李华', class: '高一(1)班', lab: '生物实验室2', subject: '生物' },
  { id: '3', title: '验证机械能守恒定律', date: '2024-03-07', time: '09:00-10:00', teacher: '张平', class: '高一(3)班', lab: '物理实验室1', subject: '物理' },
];

export const Booking: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('my-bookings');

  // Small Calendar Logic
  const renderSmallCalendar = () => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const daysInMonth = currentDate.daysInMonth();
    const firstDayOfWeek = startOfMonth.day();
    const days = [];

    // Empty cells for days before the start of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = currentDate.date(d).isSame(dayjs(), 'day');
      const isSelected = currentDate.date(d).isSame(currentDate, 'day');
      days.push(
        <button
          key={d}
          onClick={() => setCurrentDate(currentDate.date(d))}
          className={cn(
            "h-8 w-8 text-xs rounded-full flex items-center justify-center transition-all",
            isSelected ? "bg-blue-600 text-white font-bold" : "hover:bg-slate-100",
            isToday && !isSelected && "border border-blue-600 text-blue-600"
          )}
        >
          {d}
        </button>
      );
    }

    return (
      <div className="p-4 bg-white border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold">{currentDate.format('YYYY年MM月')}</span>
          <div className="flex gap-1">
            <button onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))} className="p-1 hover:bg-slate-100 rounded"><ChevronLeft size={16} /></button>
            <button onClick={() => setCurrentDate(currentDate.add(1, 'month'))} className="p-1 hover:bg-slate-100 rounded"><ChevronRight size={16} /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['日', '一', '二', '三', '四', '五', '六'].map(w => (
            <div key={w} className="text-[10px] text-slate-400 font-bold h-6 flex items-center justify-center">{w}</div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  // Big Calendar Logic (simplified for brevity)
  const renderBigCalendar = () => {
    if (viewMode === 'week') {
      const startOfWeek = currentDate.startOf('week');
      const weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));

      return (
        <div className="flex-1 flex flex-col h-full bg-white select-none">
          <div className="grid grid-cols-[100px_1fr] bg-slate-50 border-b border-slate-200">
            <div className="h-12 border-r border-slate-200"></div>
            <div className="grid grid-cols-7 divide-x divide-slate-200">
              {weekDays.map(day => (
                <div key={day.toString()} className={cn(
                  "p-2 text-center flex flex-col items-center justify-center h-16",
                  day.isSame(dayjs(), 'day') ? "bg-blue-50/50" : ""
                )}>
                  <span className="text-xs text-slate-400 font-medium">{['周日', '周一', '周二', '周三', '周四', '周五', '周六'][day.day()]}</span>
                  <span className={cn(
                    "text-lg font-bold w-10 h-10 flex items-center justify-center rounded-full mt-1",
                    day.isSame(dayjs(), 'day') ? "bg-blue-600 text-white" : "text-slate-700"
                  )}>{day.format('DD')}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto grid grid-cols-[100px_1fr]">
            {/* Time labels */}
            <div className="divide-y divide-slate-100">
              {Array.from({ length: 14 }, (_, i) => i + 7).map(hour => (
                <div key={hour} className="h-24 px-4 py-2 text-[10px] text-slate-400 font-bold text-right">
                  {hour}:00
                </div>
              ))}
            </div>
            {/* Grid display */}
            <div className="grid grid-cols-7 divide-x divide-slate-100 relative bg-[size:100%_96px] bg-[linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)]">
               {/* Grid overlay for events */}
               <div className="absolute inset-0 pointer-events-none">
                  {/* Mock event positioning */}
                  {MOCK_BOOKINGS.filter(b => dayjs(b.date).isAfter(startOfWeek.subtract(1, 'day')) && dayjs(b.date).isBefore(startOfWeek.add(7, 'day'))).map(booking => {
                    const day = dayjs(booking.date).day();
                    const hour = parseInt(booking.time.split(':')[0]);
                    const offsetTop = (hour - 7) * 96;
                    return (
                      <div 
                        key={booking.id}
                        className="absolute bg-blue-500/10 border-l-4 border-blue-500 p-2 text-xs overflow-hidden rounded-r shadow-sm transition-transform hover:scale-[1.02] cursor-pointer pointer-events-auto"
                        style={{ 
                          left: `${(day * 14.28) + 0.5}%`, 
                          top: `${offsetTop + 8}px`, 
                          width: '13.28%', 
                          height: '80px' 
                        }}
                      >
                        <p className="font-bold text-blue-700 truncate">{booking.title}</p>
                        <p className="text-[10px] text-blue-600 mt-1">{booking.class} · {booking.teacher}</p>
                        <p className="text-[10px] text-blue-500/70">{booking.lab}</p>
                      </div>
                    );
                  })}
               </div>
            </div>
          </div>
        </div>
      );
    }

    // Month view placeholder
    return (
      <div className="flex-1 bg-white p-4 grid grid-cols-7 grid-rows-6 gap-px border border-slate-200">
         {Array.from({ length: 42 }).map((_, i) => (
           <div key={i} className="border border-slate-100 p-2 min-h-[100px] hover:bg-slate-50 transition-colors">
              <span className="text-xs text-slate-400 font-medium">{i + 1}</span>
           </div>
         ))}
      </div>
    );
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left Sidebar Info */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0">
        {renderSmallCalendar()}
        
        <div className="p-4 flex flex-col gap-4 border-b border-slate-100 flex-1 overflow-hidden">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="搜索实验名称"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="mb-2">
               <button 
                onClick={() => setExpandedSection(expandedSection === 'my-bookings' ? null : 'my-bookings')}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 py-2"
               >
                  <span>我的预约</span>
                  <ChevronDown size={14} className={cn("transition-transform", expandedSection !== 'my-bookings' && "-rotate-90")} />
               </button>
               {expandedSection === 'my-bookings' && (
                 <div className="space-y-2 mt-2">
                    {MOCK_BOOKINGS.map(b => (
                      <div key={b.id} className="p-2 border border-slate-100 rounded-lg hover:border-blue-200 transition-colors cursor-pointer group">
                        <p className="text-xs font-bold text-slate-700 truncate">{b.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                          <Clock size={10} />
                          <span>{b.date} {b.time}</span>
                        </div>
                      </div>
                    ))}
                    {MOCK_BOOKINGS.length === 0 && (
                      <p className="text-[10px] text-slate-400 text-center py-4">暂无预约信息</p>
                    )}
                 </div>
               )}
            </div>
          </div>
        </div>
      </aside>

      {/* Right Main Calendar */}
      <section className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
        {/* Toolbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
             <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setViewMode('week')}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                    viewMode === 'week' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  周
                </button>
                <button 
                  onClick={() => setViewMode('month')}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                    viewMode === 'month' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  月
                </button>
             </div>
             <div className="flex items-center gap-2 ml-4">
                <button 
                  onClick={() => setCurrentDate(dayjs())}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-xs font-bold transition-colors disabled:opacity-50"
                  disabled={currentDate.isSame(dayjs(), 'day')}
                >
                  今天
                </button>
                <div className="flex gap-1 ml-1">
                  <button onClick={() => setCurrentDate(currentDate.subtract(1, viewMode === 'week' ? 'week' : 'month'))} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded transition-colors"><ChevronLeft size={16} /></button>
                  <button onClick={() => setCurrentDate(currentDate.add(1, viewMode === 'week' ? 'week' : 'month'))} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded transition-colors"><ChevronRight size={16} /></button>
                </div>
                <h2 className="text-sm font-black ml-2 uppercase tracking-tight">
                  {viewMode === 'week' 
                    ? `${currentDate.startOf('week').format('YYYY年MM月DD日')} - ${currentDate.endOf('week').format('MM月DD日')}`
                    : currentDate.format('YYYY年MM月')}
                </h2>
             </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-600/20 transition-all"
          >
            <Plus size={18} />
            <span>创建预约</span>
          </button>
        </header>

        <div className="flex-1 overflow-hidden p-6">
          <div className="h-full rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm flex flex-col">
            {renderBigCalendar()}
          </div>
        </div>
      </section>

      {/* Create Booking Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-blue-600 text-white">
                 <h3 className="font-bold">创建实验预约</h3>
                 <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors"><X size={20} /></button>
              </header>

              <div className="p-8 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">预约时间 *</label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                          <input type="datetime-local" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">班级名称 *</label>
                          <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500">
                             <option>高一(1)班</option>
                             <option>高一(2)班</option>
                             <option>高一(3)班</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">学科 *</label>
                          <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500">
                             <option>物理</option>
                             <option>化学</option>
                             <option>生物</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">实验名称 *</label>
                          <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500">
                             <option>探究影响电荷间相互作用的因素</option>
                             <option>验证机械能守恒定律</option>
                          </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">是否必做 *</label>
                          <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500">
                             <option>是</option>
                             <option>否</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">实验教师 *</label>
                          <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500">
                             <option>张平</option>
                             <option>李华</option>
                          </select>
                        </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">开课地点 *</label>
                          <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500">
                             <option>物理实验室1</option>
                             <option>物理实验室2</option>
                          </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">实验人数 *</label>
                          <input type="number" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500" defaultValue={50} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">实验小组数</label>
                          <input type="number" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500" defaultValue={25} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">备注</label>
                        <textarea rows={3} maxLength={200} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 resize-none" placeholder="选填，限200字"></textarea>
                      </div>
                   </div>
                </div>

                {/* Experiment Info Tab Area */}
                <div className="mt-8">
                   <div className="flex border-b border-slate-100 mb-4">
                      <button className="px-6 py-2 border-b-2 border-blue-500 text-blue-600 text-xs font-bold">仪器/耗材信息</button>
                   </div>
                   <div className="border border-slate-100 rounded-lg overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-400">
                          <tr>
                            <th className="px-4 py-3 font-black uppercase tracking-widest">物品名称</th>
                            <th className="px-4 py-3 font-black uppercase tracking-widest">所需数量</th>
                            <th className="px-4 py-3 font-black uppercase tracking-widest">单位</th>
                            <th className="px-4 py-3 font-black uppercase tracking-widest w-20">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           <tr className="hover:bg-slate-50 transition-colors">
                             <td className="px-4 py-3 font-bold">玻璃棒</td>
                             <td className="px-4 py-3">25</td>
                             <td className="px-4 py-3">支</td>
                             <td className="px-4 py-3"><button className="text-red-500 hover:text-red-700 transition-colors"><Trash2 size={14} /></button></td>
                           </tr>
                           <tr className="hover:bg-slate-50 transition-colors">
                             <td className="px-4 py-3 font-bold">酒精灯</td>
                             <td className="px-4 py-3">25</td>
                             <td className="px-4 py-3">个</td>
                             <td className="px-4 py-3"><button className="text-red-500 hover:text-red-700 transition-colors"><Trash2 size={14} /></button></td>
                           </tr>
                        </tbody>
                      </table>
                      <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] transition-colors border-t border-slate-100">
                        + 添加仪器或耗材
                      </button>
                   </div>
                </div>
              </div>

              <footer className="px-8 py-6 border-t border-slate-100 flex justify-end gap-4 bg-slate-50">
                 <button onClick={() => setIsModalOpen(false)} className="px-8 py-2.5 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-100 transition-all">取消</button>
                 <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 transition-all"
                 >
                   提交预约申请
                 </button>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
