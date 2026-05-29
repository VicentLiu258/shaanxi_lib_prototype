import type { LucideIcon } from 'lucide-react';
import {
  Video,
  Lock,
  AirVent,
  Wind,
  Fan,
  Droplets,
  Shield,
} from 'lucide-react';

export type DeviceStatus = 'online' | 'offline' | 'running' | 'standby';

export interface RoomTab {
  id: string;
  label: string;
}

export interface CameraEvent {
  id: string;
  time: string;
  label: string;
}

export interface FeaturedCamera {
  id: string;
  name: string;
  model: string;
  room: string;
  alert?: string;
  events: CameraEvent[];
}

export interface IoTDevice {
  id: string;
  name: string;
  room: string;
  icon: LucideIcon;
  status: DeviceStatus;
  statusLabel: string;
  category: 'camera' | 'access' | 'hvac' | 'ventilation' | 'other';
}

export const ROOM_TABS: RoomTab[] = [
  { id: 'all', label: '全屋' },
  { id: '化学分析室', label: '化学分析室' },
  { id: '微生物实验室', label: '微生物实验室' },
  { id: '洁净制样间', label: '洁净制样间' },
  { id: '仪器准备室', label: '仪器准备室' },
  { id: 'unassigned', label: '未分配房间' },
];

const statusFromDeviceState = (state: string): { status: DeviceStatus; label: string } => {
  if (state === '运行中') return { status: 'running', label: '运行中' };
  if (state === '开启') return { status: 'online', label: '在线' };
  if (state === '关闭') return { status: 'standby', label: '待机' };
  return { status: 'standby', label: '待机' };
};

export const buildDevicesFromLabDevices = (
  labDevices: Record<string, Record<string, string>>
): IoTDevice[] => {
  const deviceDefs: { key: string; name: string; icon: LucideIcon; category: IoTDevice['category'] }[] = [
    { key: 'entrance', name: '智能磁感门禁', icon: Lock, category: 'access' },
    { key: 'air', name: '精密恒温空调', icon: AirVent, category: 'hvac' },
    { key: 'fresh', name: '新风系统', icon: Wind, category: 'ventilation' },
    { key: 'exhaust', name: '强排风阀', icon: Fan, category: 'ventilation' },
    { key: 'dehumidifier', name: '除湿机', icon: Droplets, category: 'hvac' },
  ];

  const list: IoTDevice[] = [];
  Object.entries(labDevices).forEach(([room, states]) => {
    deviceDefs.forEach((def) => {
      const raw = states[def.key];
      if (!raw) return;
      const { status, label } = statusFromDeviceState(raw);
      list.push({
        id: `${room}-${def.key}`,
        name: def.name,
        room,
        icon: def.icon,
        status,
        statusLabel: label,
        category: def.category,
      });
    });
  });

  list.push(
    {
      id: 'cam-chemical',
      name: '智能摄像机 2K',
      room: '化学分析室',
      icon: Video,
      status: 'online',
      statusLabel: '在线',
      category: 'camera',
    },
    {
      id: 'purifier-microbe',
      name: '空气净化器',
      room: '微生物实验室',
      icon: Wind,
      status: 'offline',
      statusLabel: '长期离线',
      category: 'other',
    },
    {
      id: 'purifier-clean',
      name: '实验室净水监测仪',
      room: '洁净制样间',
      icon: Droplets,
      status: 'offline',
      statusLabel: '长期离线',
      category: 'other',
    },
    {
      id: 'sensor-unassigned',
      name: '红外遥控网关',
      room: '未分配房间',
      icon: Shield,
      status: 'standby',
      statusLabel: '设备数 0',
      category: 'other',
    }
  );

  return list;
};

export const FEATURED_CAMERAS: FeaturedCamera[] = [
  {
    id: 'cam-chemical',
    name: '智能摄像机 2K',
    model: '实验室智能摄像机 云台版 2K',
    room: '化学分析室',
    alert: '云存安全已断联！点击续费',
    events: [
      { id: 'e1', time: '10:57', label: '人员进入' },
      { id: 'e2', time: '09:24', label: '05-24' },
      { id: 'e3', time: '08:12', label: '异常移动' },
      { id: 'e4', time: '07:45', label: '05-23' },
    ],
  },
  {
    id: 'cam-microbe',
    name: '智能摄像机 2K',
    model: '实验室智能摄像机 云台版 2K',
    room: '微生物实验室',
    events: [
      { id: 'e1', time: '11:20', label: '消杀作业' },
      { id: 'e2', time: '10:05', label: '05-24' },
      { id: 'e3', time: '08:30', label: '通风联动' },
    ],
  },
  {
    id: 'cam-clean',
    name: '智能摄像机 2K',
    model: '实验室智能摄像机 云台版 2K',
    room: '洁净制样间',
    alert: '设备离线，请检查网络',
    events: [
      { id: 'e1', time: '昨天', label: '漏水告警' },
      { id: 'e2', time: '05-22', label: '压差异常' },
    ],
  },
];

export const getFeaturedCameraForRoom = (roomId: string): FeaturedCamera => {
  if (roomId === 'all' || roomId === 'unassigned') return FEATURED_CAMERAS[0];
  const match = FEATURED_CAMERAS.find((c) => c.room === roomId);
  return match ?? FEATURED_CAMERAS[0];
};

export const filterDevicesByRoom = (devices: IoTDevice[], roomId: string): IoTDevice[] => {
  if (roomId === 'all') return devices.filter((d) => d.category !== 'camera');
  if (roomId === 'unassigned') return devices.filter((d) => d.room === '未分配房间');
  return devices.filter((d) => d.room === roomId && d.category !== 'camera');
};

export const statusDotColor = (status: DeviceStatus): string => {
  switch (status) {
    case 'online':
      return 'bg-emerald-400';
    case 'running':
      return 'bg-cyan-400';
    case 'offline':
      return 'bg-rose-400';
    default:
      return 'bg-amber-400/80';
  }
};
