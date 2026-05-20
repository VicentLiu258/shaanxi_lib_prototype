
import React, { useState } from 'react';
import { Search, UserCircle2, ArrowUpDown } from 'lucide-react';
import { ReviewRecord } from './types.ts';
import { ReviewDrawer } from './ReviewDrawer';

const MOCK_DATA: ReviewRecord[] = [
  {
    id: 'p1',
    applicant: '王五',
    batchNo: 'PO20240519001',
    amount: 1250.00,
    categoryCount: 4,
    applyTime: '2024-05-19 09:00',
    status: '待审核',
    details: []
  },
];

export const PurchaseReview: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    return (
        <div className="p-6">
            <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 font-bold">当前状态:</span>
                    <select className="border rounded px-3 py-1.5 text-sm outline-none text-slate-700 font-medium focus:border-blue-600"><option>待审核</option></select>
                </div>
                <div className="flex items-center gap-2">
                    <input type="text" placeholder="请输入关键字" className="border rounded px-3 py-1.5 text-sm outline-none w-64 focus:border-blue-600 text-slate-700" />
                    <button className="bg-blue-600 text-white px-4 py-1.5 rounded transition-colors hover:bg-blue-700 shadow-sm"><Search size={18}/></button>
                </div>
            </div>
            <div className="border rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#f8fafc] text-slate-800 font-bold">
                        <tr>
                            <th className="px-4 py-3 border-b">序号</th>
                            <th className="px-4 py-3 border-b">申请人</th>
                            <th className="px-4 py-3 border-b">采购批次</th>
                            <th className="px-4 py-3 border-b font-bold text-slate-900">采购金额</th>
                            <th className="px-4 py-3 border-b">危化品明细</th>
                            <th className="px-4 py-3 border-b flex items-center gap-1 cursor-pointer hover:text-blue-600 text-slate-800">
                                申请时间 <ArrowUpDown size={14} />
                            </th>
                            <th className="px-4 py-3 border-b">当前状态</th>
                            <th className="px-4 py-3 border-b">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_DATA.map((item, idx) => (
                            <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                                <td className="px-4 py-3 border-b text-slate-500 font-bold">{idx+1}</td>
                                <td className="px-4 py-3 border-b font-bold text-slate-900">{item.applicant}</td>
                                <td className="px-4 py-3 border-b text-slate-700 font-medium">{item.batchNo}</td>
                                <td className="px-4 py-3 border-b text-orange-600 font-black">¥ {item.amount}</td>
                                <td className="px-4 py-3 border-b text-blue-600 font-bold cursor-pointer hover:underline" onClick={() => setIsDrawerOpen(true)}>查看</td>
                                <td className="px-4 py-3 border-b text-slate-600 font-medium">{item.applyTime}</td>
                                <td className="px-4 py-3 border-b font-bold text-slate-800">{item.status}</td>
                                <td className="px-4 py-3 border-b">
                                    <button className="text-blue-600 flex items-center gap-1 hover:underline font-bold transition-all">
                                        <UserCircle2 size={16} /> 审核
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ReviewDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} record={MOCK_DATA[0]} mode="audit" />
        </div>
    );
};
