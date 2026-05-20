
import React, { useState } from 'react';
import { Search, UserCircle2, ArrowUpDown } from 'lucide-react';
import { ReviewRecord } from './types.ts';
import { ReviewDrawer } from './ReviewDrawer';

const MOCK_DATA: ReviewRecord[] = [
  {
    id: '1',
    applicant: '张三',
    wasteType: '有机废液',
    categoryCount: 2,
    applyTime: '2024-05-19 10:00:00',
    status: '待审核',
    details: [
      { name: '废盐酸', specs: '--', stock: 0, unit: 'L', brand: '未知', quantity: 5, price: 0, totalPrice: 0 },
    ]
  },
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `waste-${i}`,
    applicant: `申请人-${i + 2}`,
    wasteType: i % 2 === 0 ? '无机废渣' : '固体废物',
    categoryCount: 1,
    applyTime: `2024-05-${18-i} 11:00:00`,
    status: '已审核',
    details: []
  })) as ReviewRecord[]
];

export const WasteReview: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ReviewRecord | null>(null);

  return (
    <div className="p-6">
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600 font-bold">当前状态:</span>
          <select className="border rounded px-3 py-1.5 text-sm outline-none text-slate-700 font-medium focus:border-blue-600"><option>全部</option></select>
        </div>
        <div className="flex items-center gap-2">
          <input type="text" placeholder="请输入关键字" className="border rounded px-3 py-1.5 text-sm outline-none w-64 focus:border-blue-600 text-slate-700" />
          <button className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition-colors shadow-sm"><Search size={18} /></button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#f8fafc] text-slate-800 font-bold">
            <tr>
              <th className="px-4 py-3 border-b">序号</th>
              <th className="px-4 py-3 border-b">申请人</th>
              <th className="px-4 py-3 border-b">处置危废物种类</th>
              <th className="px-4 py-3 border-b">危废物明细</th>
              <th className="px-4 py-3 border-b">申请时间</th>
              <th className="px-4 py-3 border-b">当前状态</th>
              <th className="px-4 py-3 border-b">操作</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DATA.map((item, idx) => (
              <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-4 py-3 border-b text-slate-500 font-bold">{idx + 1}</td>
                <td className="px-4 py-3 border-b font-bold text-slate-900">{item.applicant}</td>
                <td className="px-4 py-3 border-b text-slate-700 font-medium">{item.wasteType}</td>
                <td className="px-4 py-3 border-b text-blue-600 font-bold cursor-pointer hover:underline" onClick={() => { setSelectedRecord(item); setIsDrawerOpen(true); }}>查看明细</td>
                <td className="px-4 py-3 border-b text-slate-600 font-medium">{item.applyTime}</td>
                <td className="px-4 py-3 border-b font-semibold text-slate-800">{item.status}</td>
                <td className="px-4 py-3 border-b">
                  <button className="text-blue-600 font-bold hover:underline flex items-center gap-1 transition-all">
                    <UserCircle2 size={16} /> 审核
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ReviewDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} record={selectedRecord || MOCK_DATA[0]} mode="view" />
    </div>
  );
};
