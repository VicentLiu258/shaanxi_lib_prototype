
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SystemMessage } from './types.ts';
import { useNavigate } from 'react-router-dom';

const MOCK_MESSAGES: SystemMessage[] = [
  { id: '1', title: '入库审核提醒', content: '您有一条新的入库申请待审核，请及时处理。申请单号：WHS20240519001', time: '2024-05-19 14:00', isRead: false },
  { id: '2', title: '安全检查通知', content: '本季度安全检查即将开始，请提前做好准备。', time: '2024-05-18 09:00', isRead: false },
  { id: '3', title: '采购审核通过', content: '您的采购申请(PO20240510001)已审核通过。', time: '2024-05-17 16:30', isRead: true },
  { id: '4', title: '超期预警', content: '危化品室(校级01)有3种药剂即将到期，请尽快核查。', time: '2024-05-16 10:00', isRead: true },
];

export const SystemMessages: React.FC = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState(MOCK_MESSAGES);

    const markAllRead = () => {
        setMessages(prev => prev.map(m => ({ ...m, isRead: true })));
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-800">系统消息</h2>
                    <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] rounded-full font-bold">
                        {messages.filter(m => !m.isRead).length}
                    </span>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={markAllRead}
                        className="flex items-center gap-2 px-4 py-1.5 border border-blue-600 text-blue-600 rounded text-sm hover:bg-blue-50 transition-all font-medium"
                    >
                        <Mail size={16} />
                        一键标记已读
                    </button>
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-1.5 border border-gray-200 text-gray-600 rounded text-sm hover:bg-gray-50 transition-all font-medium"
                    >
                        <ArrowLeft size={16} />
                        返回
                    </button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50/30">
                {messages.map((msg) => (
                    <div 
                        key={msg.id}
                        className={cn(
                            "p-4 rounded-xl border transition-all flex gap-4 group cursor-pointer",
                            msg.isRead ? "bg-white border-gray-100 opacity-70" : "bg-white border-blue-100 shadow-sm shadow-blue-600/5 ring-1 ring-blue-600/10"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                            msg.isRead ? "bg-gray-100 text-gray-400" : "bg-blue-50 text-blue-600"
                        )}>
                            {msg.isRead ? <CheckCircle2 size={20} /> : <Mail size={20} />}
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <h3 className={cn("font-bold text-sm", msg.isRead ? "text-slate-600" : "text-slate-900 group-hover:text-blue-600 transition-colors")}>
                                    {msg.title}
                                </h3>
                                <span className="text-[10px] text-slate-500 font-bold">{msg.time}</span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed font-bold">
                                {msg.content}
                            </p>
                        </div>
                        {!msg.isRead && (
                            <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 animate-pulse" />
                        )}
                    </div>
                ))}

                {/* Simplified Pagination */}
                <div className="flex items-center justify-center gap-4 mt-8 py-4">
                    <button className="text-xs text-slate-500 font-bold hover:text-blue-600 transition-colors">上一页</button>
                    <div className="flex gap-2">
                        <button className="w-6 h-6 rounded bg-blue-600 text-white text-[10px] shadow-sm font-bold">1</button>
                    </div>
                    <button className="text-xs text-slate-500 font-bold hover:text-blue-600 transition-colors">下一页</button>
                </div>
            </div>
        </div>
    );
};
