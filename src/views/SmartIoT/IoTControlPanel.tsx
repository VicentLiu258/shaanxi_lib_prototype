import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Video,
  Play,
  ChevronRight,
  Menu,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  ROOM_TABS,
  buildDevicesFromLabDevices,
  filterDevicesByRoom,
  getFeaturedCameraForRoom,
  statusDotColor,
  type IoTDevice,
} from './iotMockData';

interface IoTControlPanelProps {
  labDevices: Record<string, Record<string, string>>;
  onToast?: (text: string, type?: 'success' | 'warn' | 'info') => void;
}

export const IoTControlPanel: React.FC<IoTControlPanelProps> = ({ labDevices, onToast }) => {
  const [activeRoom, setActiveRoom] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'room' | 'status'>('room');

  const allDevices = useMemo(() => buildDevicesFromLabDevices(labDevices), [labDevices]);
  const filteredDevices = useMemo(() => {
    const list = filterDevicesByRoom(allDevices, activeRoom);
    if (sortBy === 'status') {
      return [...list].sort((a, b) => {
        const order = { offline: 0, standby: 1, running: 2, online: 3 };
        return order[a.status] - order[b.status];
      });
    }
    return list;
  }, [allDevices, activeRoom, sortBy]);

  const featuredCamera = useMemo(() => getFeaturedCameraForRoom(activeRoom), [activeRoom]);

  const onlineCount = allDevices.filter((d) => d.status === 'online' || d.status === 'running').length;

  const handleDeviceClick = (device: IoTDevice) => {
    onToast?.(`已打开「${device.name}」控制面板（原型）`, 'info');
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-gradient-to-b from-[#1c2433] via-[#151b26] to-[#0f1419] text-zinc-100">
      {/* Room tabs + filter */}
      <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-3 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1 min-w-0">
          {ROOM_TABS.map((tab) => {
            const isActive = activeRoom === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveRoom(tab.id)}
                className={cn(
                  'relative px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors shrink-0',
                  isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                )}
              >
                {tab.label}
                {isActive && (
                  <motion.span
                    layoutId="iot-room-tab-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-cyan-400 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
        <div className="relative shrink-0">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            title="筛选与排序"
          >
            <Menu size={18} className="text-zinc-300" />
          </button>
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute right-0 top-full mt-2 w-44 py-2 rounded-xl bg-[#1e2838] border border-white/10 shadow-xl z-30"
              >
                <button
                  onClick={() => { setSortBy('room'); setFilterOpen(false); }}
                  className={cn(
                    'w-full px-4 py-2 text-left text-xs font-medium flex items-center gap-2 hover:bg-white/5',
                    sortBy === 'room' && 'text-cyan-400'
                  )}
                >
                  <SlidersHorizontal size={14} />
                  按房间排序
                </button>
                <button
                  onClick={() => { setSortBy('status'); setFilterOpen(false); }}
                  className={cn(
                    'w-full px-4 py-2 text-left text-xs font-medium flex items-center gap-2 hover:bg-white/5',
                    sortBy === 'status' && 'text-cyan-400'
                  )}
                >
                  <SlidersHorizontal size={14} />
                  按状态排序
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">
        {/* Stats strip */}
        <div className="flex items-center gap-4 text-xs text-zinc-400">
          <span>
            在线设备 <span className="text-cyan-400 font-bold">{onlineCount}</span> / {allDevices.length}
          </span>
          <span className="h-3 w-px bg-white/10" />
          <span>当前视图：{ROOM_TABS.find((t) => t.id === activeRoom)?.label}</span>
        </div>

        {/* Featured camera card */}
        <motion.div
          key={featuredCamera.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white/[0.06] border border-white/10 overflow-hidden max-h-[280px] flex flex-col"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 shrink-0">
                <Video size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-zinc-400">{featuredCamera.room}</p>
                <p className="text-sm font-bold truncate">{featuredCamera.model}</p>
              </div>
            </div>
            <button
              onClick={() => onToast?.(`进入「${featuredCamera.name}」实时画面`, 'info')}
              className="flex items-center gap-0.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 shrink-0"
            >
              进入
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="relative flex-1 min-h-[120px] max-h-[140px] mx-4 mt-2 rounded-xl overflow-hidden bg-[#0a0f18]">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60 blur-[2px]"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #1a2a3a 0%, #0d1520 50%, #1c3040 100%)',
              }}
            />
            <button
              onClick={() => onToast?.('正在加载实时画面…', 'info')}
              className="absolute inset-0 flex items-center justify-center group"
            >
              <span className="w-12 h-12 rounded-full bg-white/15 border border-white/25 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                <Play size={22} className="text-white ml-0.5" fill="white" />
              </span>
            </button>
            {featuredCamera.alert && (
              <button
                onClick={() => onToast?.(featuredCamera.alert!, 'warn')}
                className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-amber-500/20 backdrop-blur-sm text-[11px] font-medium text-amber-200/90 text-center hover:bg-amber-500/30 transition-colors"
              >
                {featuredCamera.alert}
                <ChevronRight size={12} className="inline ml-0.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto shrink-0">
            {featuredCamera.events.map((evt) => (
              <button
                key={evt.id}
                onClick={() => onToast?.(`回放 ${evt.time} ${evt.label}`, 'info')}
                className="shrink-0 w-20 rounded-lg overflow-hidden border border-white/10 bg-white/5 hover:border-cyan-500/40 transition-colors"
              >
                <div className="h-12 bg-gradient-to-br from-slate-700/80 to-slate-900/80" />
                <p className="text-[10px] py-1 text-center text-zinc-400 font-mono">{evt.time}</p>
              </button>
            ))}
            <button className="shrink-0 w-8 h-full flex items-center justify-center text-zinc-500 hover:text-zinc-300">
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* Device grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredDevices.map((device) => {
              const Icon = device.icon;
              const isOffline = device.status === 'offline';
              return (
                <motion.button
                  key={device.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => handleDeviceClick(device)}
                  className={cn(
                    'rounded-2xl border p-4 text-left transition-all hover:border-cyan-500/30 hover:bg-white/[0.08]',
                    'bg-white/[0.06] border-white/10',
                    isOffline && 'opacity-60'
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="p-2.5 rounded-xl bg-white/5 text-zinc-300">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>
                    <span
                      className={cn('h-2 w-2 rounded-full shrink-0 mt-1', statusDotColor(device.status))}
                      title={device.statusLabel}
                    />
                  </div>
                  <p className="text-sm font-bold text-white mb-1 line-clamp-2">{device.name}</p>
                  <p className="text-[11px] text-zinc-400">
                    {device.room}
                    <span className="mx-1 text-zinc-600">|</span>
                    <span className={isOffline ? 'text-rose-400/90' : 'text-zinc-400'}>
                      {device.statusLabel}
                    </span>
                  </p>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredDevices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
            <X size={32} className="mb-3 opacity-40" />
            <p className="text-sm font-medium">该房间暂无其他物联设备</p>
          </div>
        )}
      </div>
    </div>
  );
};
