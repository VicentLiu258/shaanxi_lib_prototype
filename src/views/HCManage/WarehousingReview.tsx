
import React, { useState } from 'react';
import { Search, RotateCcw, UserCircle2, Eye, ArrowUpDown } from 'lucide-react';
import { ReviewRecord, ReviewStatus } from './types.ts';
import { ReviewDrawer } from './ReviewDrawer';
import { cn } from '../../lib/utils';

const MOCK_DATA: ReviewRecord[] = [
  {
    id: '1',
    applicant: '张三',
    batchNo: 'WHS20240519001',
    categoryCount: 3,
    applyTime: '2024-05-19 10:00:00',
    status: '待审核',
    details: [
      { name: '盐酸', specs: '500ml/瓶', stock: 10, unit: '瓶', brand: '国药', quantity: 5, price: 25.0, totalPrice: 125.0 },
      { name: '硫酸', specs: '500ml/瓶', stock: 5, unit: '瓶', brand: '国药', quantity: 2, price: 30.0, totalPrice: 60.0 },
    ]
  },
  {
    id: '2',
    applicant: '李四',
    batchNo: 'WHS20240519002',
    categoryCount: 1,
    applyTime: '2024-05-18 15:30:00',
    status: '审核通过',
    auditTime: '2024-05-18 16:00:00',
    auditOpinion: '资料齐全，准予入库',
    details: [
      { name: '氢氧化钠', specs: '500g/瓶', stock: 20, unit: '瓶', brand: '阿拉丁', quantity: 10, price: 15.0, totalPrice: 150.0 },
    ]
  },
  // Add more mock items to demonstrate pagination
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `mock-${i}`,
    applicant: `申请人-${i + 3}`,
    batchNo: `WHS202405${17-i}00${i+1}`,
    categoryCount: Math.floor(Math.random() * 5) + 1,
    applyTime: `2024-05-${17-i} 09:00:00`,
    status: i % 2 === 0 ? '待审核' : '审核通过',
    details: []
  })) as ReviewRecord[]
];

export const WarehousingReview: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<ReviewStatus>('全部');
  const [keyword, setKeyword] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ReviewRecord | null>(null);
  const [drawerMode, setDrawerMode] = useState<'audit' | 'view'>('view');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredData = MOCK_DATA.filter(item => {
    const matchStatus = statusFilter === '全部' || item.status === statusFilter;
    const matchKeyword = item.applicant.includes(keyword) || (item.batchNo && item.batchNo.includes(keyword));
    return matchStatus && matchKeyword;
  });

  const total = filteredData.length;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleAudit = (record: ReviewRecord) => {
    setSelectedRecord(record);
    setDrawerMode('audit');
    setIsDrawerOpen(true);
  };

  const handleView = (record: ReviewRecord) => {
    setSelectedRecord(record);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="flex flex-wrap items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600 font-bold">当前状态:</span>
          <select 
            className="border rounded px-3 py-1.5 text-sm outline-none focus:border-blue-600 text-slate-700 font-medium"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ReviewStatus)}
          >
            <option value="全部">全部</option>
            <option value="待审核">待审核</option>
            <option value="审核通过">审核通过</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600 font-medium">时间范围:</span>
          <div className="flex items-center border rounded px-3 py-1.5 gap-2 bg-white">
            <input type="date" className="text-sm outline-none bg-transparent text-slate-700" />
            <span className="text-slate-500">~</span>
            <input type="date" className="text-sm outline-none bg-transparent text-slate-700" />
          </div>
        </div>

        <div className="flex items-center flex-1 max-w-sm">
          <input 
            type="text" 
            placeholder="请输入关键字"
            className="w-full border rounded-l px-3 py-1.5 text-sm outline-none focus:border-blue-600"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 py-1.5 rounded-r hover:bg-blue-700 transition-colors">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden mb-6">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#f8fafc] text-slate-700 font-bold">
            <tr>
              <th className="px-4 py-3 border-b">序号</th>
              <th className="px-4 py-3 border-b">申请人</th>
              <th className="px-4 py-3 border-b">入库批次</th>
              <th className="px-4 py-3 border-b">入库危化品种类</th>
              <th className="px-4 py-3 border-b font-bold">危化品明细</th>
              <th className="px-4 py-3 border-b flex items-center gap-1 cursor-pointer hover:text-blue-600 text-slate-700 font-bold">
                申请时间 <ArrowUpDown size={14} />
              </th>
              <th className="px-4 py-3 border-b">当前状态</th>
              <th className="px-4 py-3 border-b">操作</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-4 py-3 border-b text-slate-600">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-3 border-b font-semibold text-slate-900">{item.applicant}</td>
                <td className="px-4 py-3 border-b text-slate-700 font-medium">{item.batchNo}</td>
                <td className="px-4 py-3 border-b text-slate-700">{item.categoryCount}种</td>
                <td className="px-4 py-3 border-b">
                  <button 
                    onClick={() => handleView(item)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    查看
                  </button>
                </td>
                <td className="px-4 py-3 border-b text-slate-600 font-medium">{item.applyTime}</td>
                <td className="px-4 py-3 border-b">
                  <span className={cn(
                    "text-xs font-medium",
                    item.status === '待审核' ? "text-gray-900" : "text-gray-900"
                  )}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 border-b">
                  {item.status === '待审核' ? (
                    <button 
                      onClick={() => handleAudit(item)}
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <UserCircle2 size={16} />
                      审核
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleView(item)}
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Eye size={16} />
                      查看
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-slate-600 font-medium">
        <div className="flex items-center gap-4">
          <select 
            className="border rounded px-2 py-1 outline-none text-slate-700"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value={10}>10条/页</option>
            <option value={20}>20条/页</option>
            <option value={50}>50条/页</option>
          </select>
          <span>共 {total} 条</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            上一页
          </button>
          {Array.from({ length: Math.ceil(total / pageSize) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={cn(
                "w-8 h-8 rounded border transition-colors",
                currentPage === i + 1 ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "hover:bg-gray-50"
              )}
            >
              {i + 1}
            </button>
          ))}
          <button 
            disabled={currentPage === Math.ceil(total / pageSize)}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            下一页
          </button>
          <div className="flex items-center gap-1 ml-4">
            <span>前往第</span>
            <input 
              type="number" 
              className="w-12 border rounded px-1 py-1 text-center outline-none focus:border-blue-600" 
              defaultValue={currentPage}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = Number((e.target as HTMLInputElement).value);
                  if (val > 0 && val <= Math.ceil(total / pageSize)) {
                    setCurrentPage(val);
                  }
                }
              }}
            />
            <span>页</span>
          </div>
        </div>
      </div>

      <ReviewDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        record={selectedRecord}
        mode={drawerMode}
        onSave={(id, status, opinion) => {
           // Mock save logic
           console.log('Saved Audit:', { id, status, opinion });
           setIsDrawerOpen(false);
        }}
      />
    </div>
  );
};
