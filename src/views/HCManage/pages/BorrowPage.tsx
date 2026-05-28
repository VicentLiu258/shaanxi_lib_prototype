import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DemoTriggerButton } from '../components/DemoRunner';

export function BorrowPage() {
  const navigate = useNavigate();
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-end">
        <DemoTriggerButton demoId="borrow" onComplete={() => navigate('/hc-manage/terminal-simulator')} />
      </div>
      <div className="pro-card p-6 bg-white">
        <h3 className="font-bold mb-2">在线申领</h3>
        <p className="text-sm text-slate-500 mb-4">填写实验项目、化学品明细、预计用量及安全防护承诺。</p>
        <form className="grid gap-3 max-w-lg text-sm">
          <input className="border rounded-lg px-3 py-2" placeholder="实验项目" />
          <textarea rows={3} className="border rounded-lg px-3 py-2" placeholder="安全防护承诺" />
          <button type="button" className="w-fit px-4 py-2 bg-blue-600 text-white rounded-lg">提交申领</button>
        </form>
      </div>
      <div className="pro-card p-6 bg-blue-50 border-blue-100">
        <h3 className="font-bold mb-2">扫码取用 / 归还</h3>
        <p className="text-sm text-slate-600 mb-3">现场演示请使用智能存储终端模拟器，支持身份验证、选格领用与称重入账。</p>
        <button type="button" onClick={() => navigate('/hc-manage/terminal-simulator')} className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg text-sm font-bold">
          打开智能终端模拟器
        </button>
      </div>
    </div>
  );
}
