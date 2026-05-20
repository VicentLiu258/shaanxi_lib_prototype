
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Download, UserCircle2, ArrowUpDown, Plus, Save, FileUp, Check, AlertCircle, X, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SecurityCheckItem, SecurityCheckRecord, HazardIssue } from './types.ts';

const CHECK_ITEMS_INIT: SecurityCheckItem[] = [
  { id: '1', category: '库房环境', projectName: '通风设施', nature: '问题', dangerLevel: '轻微', isQualified: null as any, explanation: '', fileStatus: '未' },
  { id: '2', category: '消防安全', projectName: '灭火器状态', nature: '隐患', dangerLevel: '较大', isQualified: null as any, deadline: '2024-05-25', explanation: '', fileStatus: '未' },
  { id: '3', category: '标识规范', projectName: '危化品标识', nature: '问题', dangerLevel: '较大', isQualified: null as any, explanation: '', fileStatus: '未' },
];

export const SecurityCheck: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'检查提报' | '检查记录' | '问题隐患清单'>('检查提报');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="flex flex-col h-full relative">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={cn(
              "fixed top-4 left-1/2 z-[100] px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 text-white min-w-[300px] justify-center",
              toast.type === 'success' ? "bg-blue-600" : "bg-red-500"
            )}
          >
            {toast.type === 'success' ? <Check size={18} /> : <X size={18} />}
            <span className="text-sm font-bold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex border-b px-6 bg-white shrink-0">
        {['检查提报', '检查记录', '问题隐患清单'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "px-6 py-4 text-sm font-bold transition-all relative",
              activeTab === tab ? "text-blue-600" : "text-slate-600 hover:text-blue-600"
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="sec-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {activeTab === '检查提报' && <SecurityReport showToast={showToast} />}
        {activeTab === '检查记录' && <SecurityRecords />}
        {activeTab === '问题隐患清单' && <HazardList />}
      </div>
    </div>
  );
};

const SecurityReport = ({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) => {
  const [items, setItems] = useState<SecurityCheckItem[]>(CHECK_ITEMS_INIT);

  const handleStatusChange = (id: string, qualified: boolean) => {
    setItems(items.map(item => item.id === id ? { ...item, isQualified: qualified } : item));
  };

  const handleDeadlineChange = (id: string, deadline: string) => {
      setItems(items.map(item => item.id === id ? { ...item, deadline } : item));
  };

  const handleExplanationChange = (id: string, explanation: string) => {
      setItems(items.map(item => item.id === id ? { ...item, explanation } : item));
  };

  const handleSave = () => {
    showToast('保存成功');
  };

  const handleSubmit = () => {
    const unChecked = items.some(item => item.isQualified === null);
    if (unChecked) {
      showToast('是否符合要求为必选项！', 'error');
      return;
    }
    showToast('提报成功');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-start gap-4">
        <button 
          onClick={handleSubmit}
          className="px-8 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 shadow-md transition-all font-bold active:scale-95"
        >
          提报
        </button>
        <button 
          onClick={handleSave}
          className="px-8 py-2 bg-white border border-blue-600 text-blue-600 rounded text-sm hover:bg-blue-50 transition-all font-bold active:scale-95 shadow-sm"
        >
          保存
        </button>
      </div>

      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl shadow-inner">
        <div className="flex-1 max-w-xs relative">
          <input type="text" placeholder="关键字搜索" className="w-full border rounded-lg px-4 py-2 pl-10 text-sm focus:border-blue-600 outline-none transition-all shadow-sm text-slate-700" />
          <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
        </div>
        <select className="border rounded-lg px-4 py-2 text-sm outline-none bg-white focus:border-blue-600 shadow-sm font-medium"><option>类别</option></select>
        <select className="border rounded-lg px-4 py-2 text-sm outline-none bg-white focus:border-blue-600 shadow-sm font-medium"><option>性质</option></select>
        <select className="border rounded-lg px-4 py-2 text-sm outline-none bg-white focus:border-blue-600 shadow-sm font-medium"><option>危险等级</option></select>
        <select className="border rounded-lg px-4 py-2 text-sm outline-none bg-white focus:border-blue-600 shadow-sm font-medium"><option>符合要求</option></select>
      </div>

      <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#f8fafc] text-slate-800 font-bold">
            <tr>
              <th className="px-4 py-4 border-b">序号</th>
              <th className="px-4 py-4 border-b">类别</th>
              <th className="px-4 py-4 border-b">项目名称</th>
              <th className="px-4 py-4 border-b">性质</th>
              <th className="px-4 py-4 border-b">危险等级</th>
              <th className="px-4 py-4 border-b">
                 <span className="text-red-500 mr-1">*</span> 是否符合要求
              </th>
              <th className="px-4 py-4 border-b">整改时限</th>
              <th className="px-4 py-4 border-b">情况说明</th>
              <th className="px-4 py-4 border-b text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className="hover:bg-blue-50/20 transition-colors">
                <td className="px-4 py-4 border-b text-slate-500 font-medium">{idx + 1}</td>
                <td className="px-4 py-4 border-b">
                   <button className="text-blue-600 font-bold hover:underline">{item.category}</button>
                </td>
                <td className="px-4 py-4 border-b">
                   <button className="text-blue-600 font-bold hover:underline">{item.projectName}</button>
                </td>
                <td className="px-4 py-4 border-b text-slate-700 font-medium">{item.nature}</td>
                <td className="px-4 py-4 border-b">
                  <span className={cn(
                    "px-2.5 py-1 rounded text-[11px] font-bold shadow-sm",
                    item.dangerLevel === '轻微' ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"
                  )}>
                    {item.dangerLevel}
                  </span>
                </td>
                <td className="px-4 py-4 border-b">
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div 
                        onClick={() => handleStatusChange(item.id, true)}
                        className={cn(
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all", 
                          item.isQualified === true ? "border-blue-600 bg-blue-50" : "border-gray-300 group-hover:border-blue-400"
                        )}
                      >
                        {item.isQualified === true && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                      </div>
                      <span className={cn("text-xs font-bold", item.isQualified === true ? "text-blue-600" : "text-slate-500")}>是</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div 
                        onClick={() => handleStatusChange(item.id, false)}
                        className={cn(
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all", 
                          item.isQualified === false ? "border-blue-600 bg-blue-50" : "border-gray-300 group-hover:border-blue-400"
                        )}
                      >
                        {item.isQualified === false && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                      </div>
                      <span className={cn("text-xs font-bold", item.isQualified === false ? "text-blue-600" : "text-slate-500")}>否</span>
                    </label>
                  </div>
                </td>
                <td className="px-4 py-4 border-b">
                  <input 
                    type="date" 
                    className={cn(
                        "border rounded px-2 py-1 text-xs outline-none bg-white focus:border-blue-600 transition-all shadow-sm",
                        item.isQualified === false ? "border-red-200 bg-red-50/30" : "border-slate-200"
                    )}
                    value={item.deadline || ''}
                    onChange={(e) => handleDeadlineChange(item.id, e.target.value)}
                  />
                </td>
                <td className="px-4 py-4 border-b">
                  <input 
                    type="text" 
                    placeholder="请输入"
                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-600 bg-white transition-all shadow-sm" 
                    value={item.explanation}
                    onChange={(e) => handleExplanationChange(item.id, e.target.value)}
                  />
                </td>
                <td className="px-4 py-4 border-b text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button className="px-3 py-1.5 border border-slate-200 rounded-lg bg-gray-50 text-[11px] text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center gap-1.5 font-bold shadow-sm">
                      <FileUp size={14} />
                      选择文件
                    </button>
                    <span className="text-[11px] text-slate-500 font-bold">未选</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SecurityRecords = () => {
  const records: SecurityCheckRecord[] = [
    { id: '1', filler: '张三', fillTime: '2024-05-19 14:00:00', problemCount: 2, rectifiedProblemCount: 1, dangerCount: 1, rectifiedDangerCount: 0 },
    { id: '2', filler: '李四', fillTime: '2024-05-18 09:30:00', problemCount: 0, rectifiedProblemCount: 0, dangerCount: 0, rectifiedDangerCount: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl shadow-inner">
        <div className="relative">
            <select className="border rounded-lg px-4 py-2 text-sm outline-none appearance-none pr-10 bg-white focus:border-blue-600 shadow-sm font-medium text-slate-700">
               <option>填报人</option>
               <option>张三</option>
               <option>李四</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3 text-slate-500 pointer-events-none" />
        </div>
        <div className="flex items-center border rounded-lg px-4 py-2 gap-3 bg-white shadow-sm">
          <input type="date" className="text-xs outline-none text-slate-700" />
          <span className="text-slate-400">~</span>
          <input type="date" className="text-xs outline-none text-slate-700" />
        </div>
        <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95">
           <Search size={20} />
        </button>
      </div>

      <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#f8fafc] text-slate-800 font-bold">
            <tr>
              <th className="px-4 py-4 border-b">序号</th>
              <th className="px-4 py-4 border-b">填报人</th>
              <th className="px-4 py-4 border-b">填报时间 <ArrowUpDown size={14} className="inline ml-1 text-slate-400" /></th>
              <th className="px-4 py-4 border-b">发现问题数 (个)</th>
              <th className="px-4 py-4 border-b">已整改问题 (个)</th>
              <th className="px-4 py-4 border-b">发现隐患 (个)</th>
              <th className="px-4 py-4 border-b">已整改隐患 (个)</th>
              <th className="px-4 py-4 border-b">操作</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, idx) => (
              <tr key={r.id} className="hover:bg-blue-50/20 transition-colors">
                <td className="px-4 py-4 border-b text-slate-500 font-medium">{idx+1}</td>
                <td className="px-4 py-4 border-b font-bold text-slate-900">{r.filler}</td>
                <td className="px-4 py-4 border-b text-slate-600 font-medium">{r.fillTime}</td>
                <td className="px-4 py-4 border-b font-bold">{r.problemCount}</td>
                <td className="px-4 py-4 border-b text-blue-600 font-bold">{r.rectifiedProblemCount}</td>
                <td className="px-4 py-4 border-b font-bold text-orange-600">{r.dangerCount}</td>
                <td className="px-4 py-4 border-b text-blue-600 font-bold">{r.rectifiedDangerCount}</td>
                <td className="px-4 py-4 border-b">
                   <button className="text-blue-600 font-bold hover:underline flex items-center gap-1 transition-all">
                      <Search size={14} /> 查看
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const HazardList = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-start">
                <button className="px-8 py-2 bg-white border border-blue-600 text-blue-600 rounded text-sm hover:bg-blue-50 transition-all font-bold flex items-center gap-2 shadow-sm active:scale-95">
                    <Download size={18} /> 导出清单
                </button>
            </div>
            
            <div className="flex flex-col gap-4 bg-slate-50 p-4 rounded-xl shadow-inner">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <select className="border rounded-lg px-4 py-2 text-xs outline-none bg-white min-w-[120px] focus:border-blue-600 shadow-sm appearance-none pr-10 font-medium text-slate-700">
                            <option>类别</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-2.5 text-slate-500 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select className="border rounded-lg px-4 py-2 text-xs outline-none bg-white min-w-[120px] focus:border-blue-600 shadow-sm appearance-none pr-10 font-medium text-slate-700">
                            <option>性质</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-2.5 text-slate-500 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select className="border rounded-lg px-4 py-2 text-xs outline-none bg-white min-w-[120px] focus:border-blue-600 shadow-sm appearance-none pr-10 font-medium text-slate-700">
                            <option>严重程度</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-2.5 text-slate-500 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select className="border rounded-lg px-4 py-2 text-xs outline-none bg-white min-w-[120px] focus:border-blue-600 shadow-sm appearance-none pr-10 font-medium text-slate-700">
                            <option>解决情况</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-2.5 text-slate-500 pointer-events-none" />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg px-4 py-2 gap-3 bg-white shadow-sm focus-within:border-blue-600 transition-all">
                        <input type="date" className="text-xs outline-none text-slate-700" />
                        <span className="text-slate-400">~</span>
                        <input type="date" className="text-xs outline-none text-slate-700" />
                    </div>
                    <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95">
                        <Search size={22} />
                    </button>
                    <div className="flex-1 max-w-xs relative ml-auto">
                        <input type="text" placeholder="关键字搜索" className="w-full border rounded-lg px-4 py-2 pl-10 text-sm focus:border-blue-600 outline-none transition-all shadow-sm text-slate-700" />
                        <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
                    </div>
                </div>
            </div>

            <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#f8fafc] text-slate-800 font-bold">
                        <tr>
                            <th className="px-4 py-4 border-b">序号</th>
                            <th className="px-4 py-4 border-b">类别</th>
                            <th className="px-4 py-4 border-b">项目</th>
                            <th className="px-4 py-4 border-b">填报人</th>
                            <th className="px-4 py-4 border-b">性质</th>
                            <th className="px-4 py-4 border-b">危险等级</th>
                            <th className="px-4 py-4 border-b">检查时间 <ArrowUpDown size={14} className="inline ml-1 text-slate-400" /></th>
                            <th className="px-4 py-4 border-b">整改时限 <ArrowUpDown size={14} className="inline ml-1 text-slate-400" /></th>
                            <th className="px-4 py-4 border-b">整改日期 <ArrowUpDown size={14} className="inline ml-1 text-slate-400" /></th>
                            <th className="px-4 py-4 border-b">整改状态</th>
                            <th className="px-4 py-4 border-b">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2].map((i) => (
                            <tr key={i} className="hover:bg-blue-50/20 transition-colors">
                                <td className="px-4 py-4 border-b text-slate-500 font-medium">{i}</td>
                                <td className="px-4 py-4 border-b font-bold text-blue-600">消防安全</td>
                                <td className="px-4 py-4 border-b font-medium text-slate-800">灭火器检查</td>
                                <td className="px-4 py-4 border-b font-bold text-slate-900">张三</td>
                                <td className="px-4 py-4 border-b text-orange-600 font-bold">隐患</td>
                                <td className="px-4 py-4 border-b">
                                   <span className="px-2 py-1 bg-red-50 text-red-600 text-[11px] font-bold rounded shadow-sm">较大</span>
                                </td>
                                <td className="px-4 py-4 border-b text-slate-600 font-bold">2024-05-19</td>
                                <td className="px-4 py-4 border-b text-slate-600 font-bold">2024-05-25</td>
                                <td className="px-4 py-4 border-b text-slate-500 font-bold">--</td>
                                <td className="px-4 py-4 border-b">
                                    <span className="text-orange-600 font-black flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
                                        待整改
                                    </span>
                                </td>
                                <td className="px-4 py-4 border-b">
                                    <button className="flex items-center gap-1 text-blue-600 font-bold hover:underline transition-all">
                                        <UserCircle2 size={16} /> 整改
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

