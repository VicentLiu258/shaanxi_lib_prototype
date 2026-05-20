
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit3, Trash2, Download, Search, Settings, Building2, X, ChevronDown, Check, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

// Simple Toast Component
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 20 }}
    exit={{ opacity: 0, y: -20 }}
    className={cn(
      "fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 text-white",
      type === 'success' ? "bg-blue-600" : "bg-red-500"
    )}
  >
    {type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
    <span className="text-sm font-bold">{message}</span>
  </motion.div>
);

export const BaseMessage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'基本配置' | '危化品室'>('基本配置');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="flex flex-col h-full relative">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <div className="flex border-b px-6 bg-white shrink-0">
        {['基本配置', '危化品室'].map((tab) => (
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
              <motion.div layoutId="base-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {activeTab === '基本配置' ? <BasicConfig onSave={() => showToast('保存成功')} /> : <ChemicalRooms showToast={showToast} />}
      </div>
    </div>
  );
};

const BasicConfig = ({ onSave }: { onSave: () => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [checkItems, setCheckItems] = useState([
    { id: 1, category: '库房环境', project: '--', nature: '问题', danger: '较大' },
    { id: 2, category: '库房环境', project: '--', nature: '隐患', danger: '轻微' },
    { id: 3, category: '库房环境', project: '--', nature: '问题', danger: '重大' },
  ]);

  const addRow = () => {
    setCheckItems([...checkItems, { id: Date.now(), category: '', project: '', nature: '问题', danger: '轻微' }]);
  };

  const removeRow = (id: number) => {
    setCheckItems(checkItems.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-4xl space-y-10 relative">
      <div className="flex justify-end absolute -top-12 right-0">
        <button 
          onClick={() => {
            if (isEditing) onSave();
            setIsEditing(!isEditing);
          }}
          className="flex items-center gap-2 px-6 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-all shadow-sm font-bold"
        >
          {isEditing ? <Settings size={16} /> : <Edit3 size={16} />}
          {isEditing ? '保存' : '修改'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <span className="text-red-500">*</span>
            <label className="text-sm font-bold text-slate-800">超期预警设置</label>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 font-medium whitespace-nowrap">过期前</span>
            <input 
              type="number" 
              defaultValue={6} 
              disabled={!isEditing}
              className={cn(
                "w-24 border rounded px-3 py-1.5 text-center text-sm outline-none transition-all font-bold",
                isEditing ? "border-blue-600 bg-white text-blue-600" : "border-gray-100 bg-gray-50 text-slate-500"
              )}
            />
            <span className="text-sm text-slate-600 font-medium whitespace-nowrap">(天)进行预警</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <span className="text-red-500">*</span>
            <label className="text-sm font-bold text-slate-800">超量预警设置</label>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 font-medium whitespace-nowrap">超出数量</span>
            <input 
              type="number" 
              defaultValue={10} 
              disabled={!isEditing}
              className={cn(
                "w-24 border rounded px-3 py-1.5 text-center text-sm outline-none transition-all font-bold",
                isEditing ? "border-blue-600 bg-white text-blue-600" : "border-gray-100 bg-gray-50 text-slate-500"
              )}
            />
            <span className="text-sm text-slate-600 font-medium whitespace-nowrap">进行预警</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <span className="text-red-500">*</span>
            <label className="text-sm font-bold text-slate-800">检查设置</label>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-[150px]">
              <select 
                disabled={!isEditing}
                className={cn(
                  "w-full border rounded px-3 py-1.5 text-sm outline-none transition-all font-bold appearance-none pr-8",
                  isEditing ? "border-blue-600 bg-white text-blue-600" : "border-gray-100 bg-gray-50 text-slate-500"
                )}
              >
                <option>半年</option>
                <option>季度</option>
                <option>每月</option>
                <option>年</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
            </div>
            <span className="text-sm text-slate-600 font-medium">检查一次</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-800 block">安全检查内容</label>
          {isEditing && (
            <button 
              onClick={addRow}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-all font-bold shadow-sm"
            >
              <Plus size={14} /> 添加
            </button>
          )}
        </div>
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f8fafc] text-slate-800 font-bold">
              <tr>
                <th className="px-4 py-3 border-b">类别</th>
                <th className="px-4 py-3 border-b">项目</th>
                <th className="px-4 py-3 border-b">性质</th>
                <th className="px-4 py-3 border-b">危险等级</th>
                <th className="px-4 py-3 border-b text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {checkItems.map(item => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-3 border-b">
                    {isEditing ? (
                      <select className="border rounded px-2 py-1 text-sm bg-white outline-none focus:border-blue-600 w-full font-bold text-blue-600">
                        <option>库房环境</option>
                        <option>消防设施</option>
                        <option>个人防护</option>
                      </select>
                    ) : (
                      <span className="text-blue-600 font-bold hover:underline cursor-pointer">{item.category}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 border-b">
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={item.project === '--' ? '' : item.project} 
                        placeholder="请输入"
                        className="border rounded px-2 py-1 text-sm bg-white outline-none focus:border-blue-600 w-full text-slate-700 font-medium"
                      />
                    ) : (
                      <span className="text-slate-600 font-medium">{item.project}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 border-b">
                    {isEditing ? (
                      <select className="border rounded px-2 py-1 text-sm bg-white outline-none focus:border-blue-600 w-full">
                        <option>问题</option>
                        <option>隐患</option>
                      </select>
                    ) : (
                      <span className="text-slate-700 font-medium">{item.nature}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 border-b">
                    {isEditing ? (
                      <select className="border rounded px-2 py-1 text-sm bg-white outline-none focus:border-blue-600 w-full">
                        <option>轻微</option>
                        <option>较大</option>
                        <option>重大</option>
                      </select>
                    ) : (
                      <span className="text-slate-700 font-medium">{item.danger}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 border-b text-center">
                    <button 
                      onClick={() => removeRow(item.id)}
                      className={cn(
                        "transition-colors",
                        isEditing ? "text-blue-600 hover:text-red-500" : "text-slate-400 hover:text-red-500"
                      )}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface Room {
  id: string;
  name: string;
  location?: string;
  area?: string;
  manager: string;
  content?: string;
  qr: string;
}

const ChemicalRooms = ({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) => {
  const [rooms, setRooms] = useState<Room[]>([
    { id: '1', name: '校级危化品库房01', manager: '黄老师', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Room01' },
    { id: '2', name: '实验艺术楼危化品间', manager: '张老师', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Room02' },
    { id: '3', name: '一号教学楼化学实验室', manager: '李老师', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Room03' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const handleCreate = () => {
    setModalMode('create');
    setSelectedRoom(null);
    setModalOpen(true);
  };

  const handleEdit = (room: Room) => {
    setModalMode('edit');
    setSelectedRoom(room);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确认删除该危化品室吗？')) {
      setRooms(rooms.filter(r => r.id !== id));
      showToast('删除成功');
    }
  };

  const handleSave = (roomData: Partial<Room>) => {
    if (modalMode === 'create') {
      const newRoom: Room = {
        id: Date.now().toString(),
        name: roomData.name || '',
        manager: roomData.manager || '',
        location: roomData.location,
        area: roomData.area,
        content: roomData.content,
        qr: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(roomData.name || '')}`,
      };
      setRooms([...rooms, newRoom]);
      showToast('新建成功');
    } else {
      setRooms(rooms.map(r => r.id === selectedRoom?.id ? { ...r, ...roomData } : r));
      showToast('更新成功');
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 px-1 relative">
      <div className="flex items-center justify-between">
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 shadow-sm transition-all font-bold"
        >
          <Plus size={18} />
          新建危化品室
        </button>
        <div className="relative w-64">
          <input 
            type="text" 
            placeholder="关键字搜索" 
            className="w-full border rounded-lg px-4 py-2 pl-10 text-sm outline-none focus:border-blue-600 transition-colors" 
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map(room => (
          <div key={room.id} className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all group overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-bold text-gray-800 text-center group-hover:text-blue-600 transition-colors h-5 overflow-hidden text-ellipsis whitespace-nowrap">{room.name}</h3>
            </div>
            <div className="p-8 flex items-center justify-center relative bg-gray-50/50">
              <img src={room.qr} alt="QR" className="w-32 h-32 relative z-10 shadow-sm border border-white" />
              <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                 <Building2 size={100} className="text-blue-600" />
              </div>
            </div>
            <div className="flex border-t divide-x divide-gray-100 h-10">
              <button 
                onClick={() => handleEdit(room)}
                className="flex-1 flex items-center justify-center text-xs text-slate-600 font-bold hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                编辑
              </button>
              <button 
                onClick={() => handleDelete(room.id)}
                className="flex-1 flex items-center justify-center text-xs text-slate-600 font-bold hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                删除
              </button>
              <button className="flex-1 flex items-center justify-center text-xs text-blue-600 hover:bg-blue-50 transition-colors font-bold">
                <Download size={14} className="mr-1" />
                下载二维码
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <RoomModal 
            mode={modalMode}
            room={selectedRoom}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const RoomModal = ({ mode, room, onClose, onSave }: { mode: 'create' | 'edit', room: Room | null, onClose: () => void, onSave: (d: Partial<Room>) => void }) => {
  const [formData, setFormData] = useState<Partial<Room>>(room || {
    name: '',
    location: '',
    area: '',
    manager: '',
    content: ''
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.name) newErrors.name = true;
    if (!formData.manager) newErrors.manager = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-[520px] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-slate-800">
            {mode === 'create' ? '新建危化品室' : '危化品室明细'}
          </h2>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                <span className="text-red-500">*</span> 危化品室名称
              </label>
              <input 
                type="text" 
                placeholder="请输入"
                value={formData.name}
                onChange={e => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: false });
                }}
                className={cn(
                  "w-full border rounded-lg px-3 py-2 text-sm outline-none transition-all",
                  errors.name ? "border-red-500 focus:ring-1 focus:ring-red-500" : "focus:border-blue-600",
                  mode === 'edit' ? "text-blue-600 font-bold" : "text-slate-800"
                )}
              />
              {errors.name && <p className="text-xs text-red-500">请输入危化品室名称</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">危化品室位置</label>
              <input 
                type="text" 
                placeholder="请输入"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">面积</label>
              <div className="relative">
                <input 
                  type="number" 
                  placeholder="请输入"
                  value={formData.area}
                  onChange={e => setFormData({ ...formData, area: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600 pr-20 text-slate-700"
                />
                <span className="absolute right-3 top-2 text-sm text-slate-600 font-bold">平方米</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                <span className="text-red-500">*</span> 负责人
              </label>
              <div className="relative">
                <select 
                  value={formData.manager}
                  onChange={e => {
                    setFormData({ ...formData, manager: e.target.value });
                    if (errors.manager) setErrors({ ...errors, manager: false });
                  }}
                  className={cn(
                    "w-full border rounded-lg px-3 py-2 text-sm outline-none transition-all appearance-none pr-10",
                    errors.manager ? "border-red-500" : "focus:border-blue-600",
                    formData.manager ? "text-blue-600 font-bold" : "text-slate-500 font-bold"
                  )}
                >
                  <option value="" disabled>请选择</option>
                  <option value="黄老师">黄老师（化学）</option>
                  <option value="张老师">张老师（物理）</option>
                  <option value="李老师">李老师（生物）</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3 text-slate-500 pointer-events-none" />
              </div>
              {errors.manager && <p className="text-xs text-red-500">请选择负责人</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">存放内容</label>
              <textarea 
                placeholder="请输入"
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600 h-[60px] resize-none text-slate-700"
              />
            </div>

            {mode === 'create' && (
              <div className="pt-2 border-t flex flex-col items-center gap-2">
                <label className="text-sm font-bold text-slate-700 self-start">危化品室二维码</label>
                <div className="relative group">
                   <div className="w-[100px] h-[100px] border rounded bg-gray-50 flex items-center justify-center overflow-hidden">
                      {formData.name ? (
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(formData.name)}`} 
                          alt="QR Preview"
                          className="w-full h-full"
                        />
                      ) : (
                        <div className="text-[10px] text-gray-300 text-center px-2">输入室名后<br/>自动生成</div>
                      )}
                   </div>
                   <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                         <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50">
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-600 rounded text-sm font-bold hover:bg-gray-100 transition-colors"
          >
            关闭
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
          >
            保存
          </button>
        </div>
      </motion.div>
    </div>
  );
};

