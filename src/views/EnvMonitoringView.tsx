import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Bell, 
  CheckCircle2, 
  Clock, 
  Database, 
  LayoutDashboard, 
  Search, 
  Settings, 
  ShieldAlert, 
  Sliders, 
  Sun, 
  Moon, 
  Thermometer, 
  Wind, 
  Droplets, 
  RotateCw, 
  AlertTriangle, 
  Eye, 
  Send, 
  X, 
  Lock, 
  Unlock, 
  ListRestart, 
  Waves,
  ChevronRight,
  UserCheck,
  Check,
  AlertCircle,
  TrendingUp,
  LineChart,
  Grid,
  LayoutGrid,
  Filter,
  CheckCircle,
  ArrowRight,
  Info
} from 'lucide-react';
import { useTheme } from '../components/ThemeContext';
import { cn } from '../lib/utils';
import { IoTControlPanel } from './SmartIoT/IoTControlPanel';

// --- Types & Interfaces ---
interface LabInfo {
  id: string;
  name: string;
  status: '正常' | '预警' | '严重告警';
  temp: number;
  humidity: number;
  co2: number;
  pressure: number;
  voc: number;
  water: '正常' | '漏水告警';
}

interface WarningRecord {
  id: string;
  time: string;
  labName: string;
  type: '温度' | '湿度' | 'VOC' | 'CO2' | '压差' | '水浸';
  currentValue: string;
  threshold: string;
  level: '一级' | '二级' | '三级';
  status: '待处理' | '处理中' | '已关闭';
  operator?: string;
  dispatchNote?: string;
}

interface EventRecord {
  id: string;
  time: string;
  type: 'threshold_over' | 'linkage_exec' | 'manual_confirm' | 'remote_reset' | 'false_alarm';
  typeLabel: string;
  labName: string;
  description: string;
  operator: string;
  details?: any;
}

interface ThresholdConfig {
  id: string;
  metric: string;
  name: string;
  lowerLimit?: number;
  upperLimit: number;
  unit: string;
  enabled: boolean;
  level: '一级' | '二级' | '三级';
  notifyChannels: string[];
}

interface LinkageRecord {
  id: string;
  time: string;
  labName: string;
  condition: string;
  action: string;
  status: '已执行' | '执行中' | '失败';
}

interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'warn' | 'info';
}

// --- Initial Mock Data ---
const initialLabs: LabInfo[] = [
  { id: 'chemical', name: '化学分析室', status: '预警', temp: 26.4, humidity: 55.2, co2: 750, pressure: 12, voc: 320, water: '正常' },
  { id: 'microbe', name: '微生物实验室', status: '正常', temp: 22.1, humidity: 48.5, co2: 600, pressure: 15, voc: 140, water: '正常' },
  { id: 'cleanroom', name: '洁净制样间', status: '严重告警', temp: 24.8, humidity: 62.1, co2: 920, pressure: 8, voc: 450, water: '漏水告警' },
  { id: 'instrument', name: '仪器准备室', status: '正常', temp: 21.5, humidity: 42.1, co2: 480, pressure: 10, voc: 90, water: '正常' },
];

const last24hAnomalies = [
  { hour: '00:00', count: 1 }, { hour: '02:00', count: 2 }, { hour: '04:00', count: 0 },
  { hour: '06:00', count: 1 }, { hour: '08:00', count: 3 }, { hour: '10:00', count: 5 },
  { hour: '12:00', count: 4 }, { hour: '14:00', count: 2 }, { hour: '16:00', count: 8 },
  { hour: '18:00', count: 6 }, { hour: '20:00', count: 3 }, { hour: '22:00', count: 1 }
];

const initialLinkages: LinkageRecord[] = [
  { id: 'link-1', time: '2026-05-20 10:24:12', labName: '微生物实验室', condition: 'VOC 达到 140ppb', action: '自动启动新风及排风设备', status: '已执行' },
  { id: 'link-2', time: '2026-05-20 09:15:30', labName: '洁净制样间', condition: '湿度达到 62.1%', action: '自动启动除湿机调节运转', status: '已执行' },
  { id: 'link-3', time: '2026-05-20 08:33:11', labName: '化学分析室', condition: 'VOC 偏高超标(320ppb)', action: '自动提升强排风阀开度值', status: '已执行' },
  { id: 'link-4', time: '2026-05-19 23:12:05', labName: '洁净制样间', condition: '压差偏低仅有 8Pa', action: '自动调高回风口压力变频机', status: '已执行' },
  { id: 'link-5', time: '2026-05-19 16:45:18', labName: '化学分析室', condition: '温度偏高至 26.4°C', action: '自动调低精密空调目标设定值', status: '已执行' }
];

const mockTrendData: Record<string, { temp: number[]; humidity: number[]; co2: number[] }> = {
  '化学分析室': {
    temp: [22.2, 22.5, 23.1, 23.8, 24.5, 25.1, 25.9, 26.4, 26.2, 25.8, 25.2, 24.8],
    humidity: [45.2, 46.1, 47.5, 49.0, 51.5, 53.2, 54.8, 55.2, 54.1, 53.0, 52.1, 51.5],
    co2: [480, 510, 550, 620, 690, 750, 810, 750, 730, 780, 720, 680],
  },
  '微生物实验室': {
    temp: [21.0, 21.2, 21.5, 21.8, 22.0, 22.1, 22.1, 22.1, 22.0, 22.0, 21.8, 21.7],
    humidity: [48.0, 48.2, 48.5, 48.6, 48.5, 48.5, 48.4, 48.5, 48.3, 48.2, 48.1, 48.1],
    co2: [450, 470, 490, 520, 560, 580, 600, 600, 590, 570, 540, 520],
  },
  '洁净制样间': {
    temp: [22.5, 22.8, 23.2, 23.5, 23.9, 24.2, 24.6, 24.8, 24.7, 24.5, 24.1, 23.9],
    humidity: [50.1, 52.0, 55.1, 58.2, 60.5, 61.8, 62.1, 62.1, 61.5, 60.1, 58.5, 57.0],
    co2: [550, 610, 720, 850, 910, 950, 920, 920, 910, 890, 850, 780],
  },
  '仪器准备室': {
    temp: [20.5, 20.8, 21.0, 21.2, 21.4, 21.5, 21.5, 21.5, 21.4, 21.3, 21.2, 21.0],
    humidity: [40.1, 40.5, 41.2, 41.8, 42.0, 42.1, 42.1, 42.1, 41.9, 41.5, 41.0, 40.8],
    co2: [400, 420, 440, 460, 490, 510, 480, 480, 475, 470, 460, 450],
  }
};

const hours12 = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const initialWarnings: WarningRecord[] = [
  { id: 'WARN-001', time: '2026-05-20 10:48:33', labName: '洁净制样间', type: '水浸', currentValue: '溢水重度告警', threshold: '干燥无水浸', level: '一级', status: '待处理' },
  { id: 'WARN-002', time: '2026-05-20 10:42:10', labName: '化学分析室', type: '温度', currentValue: '26.4 °C', threshold: '18.0 - 25.0 °C', level: '二级', status: '待处理' },
  { id: 'WARN-003', time: '2026-05-20 10:35:14', labName: '微生物实验室', type: 'CO2', currentValue: '820 ppm', threshold: '<800 ppm', level: '三级', status: '处理中', operator: '张老师', dispatchNote: '已现场开启应急新风系统进行强制稀释通风。' },
  { id: 'WARN-004', time: '2026-05-20 09:55:00', labName: '洁净制样间', type: '压差', currentValue: '8 Pa', threshold: '10.0 - 20.0 Pa', level: '二级', status: '待处理' },
  { id: 'WARN-005', time: '2026-05-20 08:12:44', labName: '化学分析室', type: 'VOC', currentValue: '320 ppb', threshold: '<200 ppb', level: '三级', status: '已关闭' },
  { id: 'WARN-006', time: '2026-05-19 22:30:11', labName: '仪器准备室', type: '湿度', currentValue: '62.4 %RH', threshold: '30.0 - 60.0 %RH', level: '三级', status: '已关闭' },
  { id: 'WARN-007', time: '2026-05-19 18:24:55', labName: '微生物实验室', type: '温度', currentValue: '16.8 °C', threshold: '18.0 - 25.0 °C', level: '二级', status: '已关闭' },
  { id: 'WARN-008', time: '2026-05-19 14:10:02', labName: '洁净制样间', type: 'CO2', currentValue: '920 ppm', threshold: '<800 ppm', level: '二级', status: '已关闭' },
  { id: 'WARN-009', time: '2026-05-19 09:33:45', labName: '化学分析室', type: '水浸', currentValue: '漏水触发', threshold: '干燥无水浸', level: '一级', status: '已关闭' },
  { id: 'WARN-010', time: '2026-05-19 08:20:17', labName: '仪器准备室', type: 'VOC', currentValue: '250 ppb', threshold: '<200 ppb', level: '三级', status: '已关闭' }
];

const initialEvents: EventRecord[] = [
  { id: 'EVT-1', time: '2026-05-20 10:48:33', type: 'threshold_over', typeLabel: '阈值超限', labName: '洁净制样间', description: '洁净制样间排水管防返水垫圈损坏，溢水传感器检测到重度水浸信号，产生一级紧急告警。', operator: '系统', details: { value: '漏水激发', standard: '干燥状态', sensorCode: 'LEAK-301' } },
  { id: 'EVT-2', time: '2026-05-20 10:24:12', type: 'linkage_exec', typeLabel: '联动执行', labName: '微生物实验室', description: '微生物实验室内由于有害挥发浓度突增至140ppb，排风通风管道阀门自动联锁开启100%。', operator: '系统', details: { action: '开启强排风阀并通知维保人员', source: 'VOC Sensor 212' } },
  { id: 'EVT-3', time: '2026-05-20 10:15:30', type: 'manual_confirm', typeLabel: '人工确认', labName: '化学分析室', description: '操作员章老师现场确认温度偏高是由于开启精密马弗炉放热，属于实验操作内合理排热，不作异常处置。', operator: '章老师', details: { remark: '热解实验反应放热中，实验窗口可自然散热。' } },
  { id: 'EVT-4', time: '2026-05-20 09:12:00', type: 'remote_reset', typeLabel: '远程复位', labName: '仪器准备室', description: '系统派发远程复位动作，消除VOC模块传感器上的瞬间短路干扰锁定。', operator: '管理员', details: { targetDevice: 'VOC-SENSOR-A04' } },
  { id: 'EVT-5', time: '2026-05-19 23:45:10', type: 'false_alarm', typeLabel: '误报关闭', labName: '洁净制样间', description: '评估属于高分子材料喷挥洗涤引起的突发气雾干扰。章老师将本条CO2告警设定为误报关闭。', operator: '章老师', details: { origId: 'WARN-008' } },
  { id: 'EVT-6', time: '2026-05-19 16:33:20', type: 'threshold_over', typeLabel: '阈值超限', labName: '化学分析室', description: '环境温度达到 26.4 °C 持续10分钟，超过预设的 25.0 °C 上限限制。', operator: '系统' },
  { id: 'EVT-7', time: '2026-05-19 14:24:00', type: 'linkage_exec', typeLabel: '联动执行', labName: '化学分析室', description: '由于室温偏高，中央空调系统自控输出设定调低到 21 摄氏度。', operator: '系统' },
  { id: 'EVT-8', time: '2026-05-19 09:11:15', type: 'manual_confirm', typeLabel: '人工确认', labName: '微生物实验室', description: '消杀喷施过氧化氢造成 VOC 短时波动探头测得过高，张老师手动在端上清除此锁定挂死。', operator: '张老师' }
];

const initialThresholds: ThresholdConfig[] = [
  { id: 'th-1', metric: 'temperature', name: '温度监控阈值', lowerLimit: 18.0, upperLimit: 25.0, unit: '°C', enabled: true, level: '二级', notifyChannels: ['sys_msg', 'sms'] },
  { id: 'th-2', metric: 'humidity', name: '湿度监控阈值', lowerLimit: 30.0, upperLimit: 60.0, unit: '%RH', enabled: true, level: '二级', notifyChannels: ['sys_msg', 'email'] },
  { id: 'th-3', metric: 'co2', name: 'CO2 监控上限', upperLimit: 800, unit: 'ppm', enabled: true, level: '三级', notifyChannels: ['sys_msg'] },
  { id: 'th-4', metric: 'voc', name: 'VOC 杂质上限', upperLimit: 200, unit: 'ppb', enabled: true, level: '三级', notifyChannels: ['sys_msg', 'wechat'] },
  { id: 'th-5', metric: 'pressure', name: '洁净压差监控阈值', lowerLimit: 10.0, upperLimit: 20.0, unit: 'Pa', enabled: true, level: '二级', notifyChannels: ['sys_msg', 'sms', 'wechat'] },
  { id: 'th-6', metric: 'water', name: '漏水溢水传感器', upperLimit: 1.0, unit: '信号', enabled: true, level: '一级', notifyChannels: ['sys_msg', 'sms', 'email', 'wechat'] }
];

const initialDevices = {
  '化学分析室': { entrance: '关闭', air: '运行中', fresh: '运行中', exhaust: '待机', dehumidifier: '待机' },
  '微生物实验室': { entrance: '开启', air: '运行中', fresh: '运行中', exhaust: '运行中', dehumidifier: '待机' },
  '洁净制样间': { entrance: '关闭', air: '运行中', fresh: '待机', exhaust: '待机', dehumidifier: '待机' },
  '仪器准备室': { entrance: '关闭', air: '待机', fresh: '待机', exhaust: '待机', dehumidifier: '待机' }
};

interface EnvMonitoringViewProps {
  id: string;
  name: string;
  onBack: () => void;
  onLogout: () => void;
}

export const EnvMonitoringView: React.FC<EnvMonitoringViewProps> = ({ onBack, onLogout }) => {
  const { theme, toggleTheme } = useTheme();

  // --- Sub-menu Navigation ---
  type EnvTab = 'control' | 'overview' | 'live' | 'warn' | 'event' | 'config';
  const [activeTab, setActiveTab] = useState<EnvTab>('control');

  // --- States ---
  const [labs, setLabs] = useState<LabInfo[]>(initialLabs);
  const [warnings, setWarnings] = useState<WarningRecord[]>(initialWarnings);
  const [events, setEvents] = useState<EventRecord[]>(initialEvents);
  const [thresholds, setThresholds] = useState<ThresholdConfig[]>(initialThresholds);
  const [linkages, setLinkages] = useState<LinkageRecord[]>(initialLinkages);
  const [devices, setDevices] = useState<Record<string, Record<string, string>>>(initialDevices);
  
  // Real-time page selections
  const [selectedLabName, setSelectedLabName] = useState<string>('化学分析室');
  const [selectedTrendMetric, setSelectedTrendMetric] = useState<'temp' | 'humidity' | 'co2'>('temp');

  // Interactive popup modals / drawers state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedWarning, setSelectedWarning] = useState<WarningRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // Dispatch warning order modal state
  const [dispatchOrderWarning, setDispatchOrderWarning] = useState<WarningRecord | null>(null);
  const [dispatchOperator, setDispatchOperator] = useState<string>('张老师');
  const [dispatchNote, setDispatchNote] = useState<string>('');

  // Event detail modal state
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);

  // Edit threshold config modal state
  const [editingThreshold, setEditingThreshold] = useState<ThresholdConfig | null>(null);

  // Warning filter states
  const [filterLevel, setFilterLevel] = useState<string>('全部');
  const [filterType, setFilterType] = useState<string>('全部');
  const [filterStatus, setFilterStatus] = useState<string>('全部');
  const [warnSearch, setWarnSearch] = useState<string>('');

  // Search box state for TopBar
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // --- KPI Numbers animation targets ---
  const kpiOnlineSensors = 26;
  const kpiCurrentWarningsNum = useMemo(() => warnings.filter(w => w.status !== '已关闭').length, [warnings]);
  const kpiDailyResolvedNum = 18;
  const kpiMonitoredLabs = 12;
  const kpiLinkageTriggerCount = linkages.length + 4; // Mock additions

  // Incremental numbers for animation
  const [animOnlineSensors, setAnimOnlineSensors] = useState<number>(0);
  const [animCurrentWarnings, setAnimCurrentWarnings] = useState<number>(0);
  const [animDailyResolved, setAnimDailyResolved] = useState<number>(0);
  const [animMonitoredLabs, setAnimMonitoredLabs] = useState<number>(0);
  const [animLinkageTriggers, setAnimLinkageTriggers] = useState<number>(0);

  // Trigger KPI number counter animation
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 800;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setAnimOnlineSensors(Math.floor(progress * kpiOnlineSensors));
      setAnimCurrentWarnings(Math.floor(progress * kpiCurrentWarningsNum));
      setAnimDailyResolved(Math.floor(progress * kpiDailyResolvedNum));
      setAnimMonitoredLabs(Math.floor(progress * kpiMonitoredLabs));
      setAnimLinkageTriggers(Math.floor(progress * kpiLinkageTriggerCount));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [activeTab, kpiCurrentWarningsNum]);

  // --- Core Actions ---
  const addToast = (text: string, type: 'success' | 'warn' | 'info' = 'success') => {
    const id = Math.random().toString();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const currentLabData = useMemo(() => {
    return labs.find(l => l.name === selectedLabName) || labs[0];
  }, [labs, selectedLabName]);

  // Handle Detail link from overview
  const handleDetailCheck = (labName: string) => {
    setSelectedLabName(labName);
    setActiveTab('live');
    addToast(`已切换至 实时监测 / ${labName}`, 'info');
  };

  // Dispatch dispatch modal submission
  const registerDispatchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchOrderWarning) return;
    setWarnings(prev => prev.map(w => {
      if (w.id === dispatchOrderWarning.id) {
        return {
          ...w,
          status: '处理中',
          operator: dispatchOperator,
          dispatchNote: dispatchNote || '已派遣责任人现场定位并开启环控联动调节机制。'
        };
      }
      return w;
    }));

    // Register into event list
    const newEvent: EventRecord = {
      id: `EVT-${Date.now()}`,
      time: '2026-05-20 06:54:00',
      type: 'manual_confirm',
      typeLabel: '人工派单',
      labName: dispatchOrderWarning.labName,
      description: `针对 [${dispatchOrderWarning.labName}] 的 [${dispatchOrderWarning.type}] 超限预警已手动派单。处理负责人：${dispatchOperator}；派发备忘：${dispatchNote || '系统派单'}`,
      operator: '管理员'
    };
    setEvents(prev => [newEvent, ...prev]);

    addToast(`📋 已将预警单 [${dispatchOrderWarning.id}] 派遣给 ${dispatchOperator} 进行处置`, 'success');
    setDispatchOrderWarning(null);
    setDispatchNote('');
  };

  // Close warning directly
  const closeWarningTicket = (warningId: string) => {
    const ticket = warnings.find(w => w.id === warningId);
    if (!ticket) return;

    setWarnings(prev => prev.map(w => {
      if (w.id === warningId) {
        return { ...w, status: '已关闭' };
      }
      return w;
    }));

    // Insert to timeline event
    const newEvent: EventRecord = {
      id: `EVT-${Date.now()}`,
      time: '2026-05-20 06:54:30',
      type: 'remote_reset',
      typeLabel: '故障恢复',
      labName: ticket.labName,
      description: `实验室预警 [${ticket.type}] 突发超标已消除。管理员已确认现场安全，此单已手工强行关闭。`,
      operator: '管理员'
    };
    setEvents(prev => [newEvent, ...prev]);

    addToast(`✅ 预警编号 [${warningId}] 已手动封签关闭。`, 'success');
  };

  // Save Threshold settings
  const updateThresholdConfig = (updatedData: ThresholdConfig) => {
    setThresholds(prev => prev.map(t => {
      if (t.id === updatedData.id) {
        return { ...updatedData };
      }
      return t;
    }));
    addToast(`⚙️ [${updatedData.name}] 阀限制参数更新成功！`, 'success');
    setEditingThreshold(null);
  };

  // Simulate remote refresh logic
  const simulateRefreshValues = () => {
    // Randomize some values
    setLabs(prev => prev.map(l => {
      const deltaTemp = (Math.random() - 0.5) * 1.5;
      const deltaHum = (Math.random() - 0.5) * 5;
      const deltaCo2 = Math.floor((Math.random() - 0.5) * 60);
      const deltaPres = Math.floor((Math.random() - 0.5) * 3);
      const deltaVoc = Math.floor((Math.random() - 0.5) * 40);

      const nextTemp = Number((l.temp + deltaTemp).toFixed(1));
      const nextHum = Number((l.humidity + deltaHum).toFixed(1));
      const nextCo2 = Math.max(350, l.co2 + deltaCo2);
      const nextPres = Math.max(1, l.pressure + deltaPres);
      const nextVoc = Math.max(10, l.voc + deltaVoc);

      // Determine status based on thresholds roughly
      let flag: '正常' | '预警' | '严重告警' = '正常';
      if (nextTemp > 26 || nextHum > 60 || nextCo2 > 850) {
        flag = '预警';
      }
      if (nextVoc > 400 || l.water === '漏水告警') {
        flag = '严重告警';
      }

      return {
        ...l,
        temp: nextTemp,
        humidity: nextHum,
        co2: nextCo2,
        pressure: nextPres,
        voc: nextVoc,
        status: flag
      };
    }));

    addToast('🔄 已触发多节点在线探头一键实时重测。数据及趋势已演算刷新！', 'success');
  };

  // Simulate local device states
  const simulateDeviceTransition = () => {
    const listDevs = ['entrance', 'air', 'fresh', 'exhaust', 'dehumidifier'];
    const randomDev = listDevs[Math.floor(Math.random() * listDevs.length)];
    const states = ['运行中', '待机', '关闭', '开启'];

    setDevices(prev => {
      const copy = { ...prev };
      const currentLabDevs = { ...copy[selectedLabName] };
      const previousState = currentLabDevs[randomDev];
      let nextState = states[Math.floor(Math.random() * states.length)];
      if (randomDev === 'entrance') {
        nextState = previousState === '开启' ? '关闭' : '开启';
      } else {
        if (nextState === '开启' || nextState === '关闭') nextState = '待机';
      }

      currentLabDevs[randomDev] = nextState;
      copy[selectedLabName] = currentLabDevs;

      // Add linkage log dynamically
      const translations: Record<string, string> = {
        entrance: '智能磁感门禁',
        air: '精密恒温空调',
        fresh: '多向级联新风机',
        exhaust: '强力活性排风机',
        dehumidifier: '智能抽湿净化器'
      };

      const newRec: LinkageRecord = {
        id: `link-${Date.now()}`,
        time: '2026-05-20 06:55:00',
        labName: selectedLabName,
        condition: `温湿度微调联动触发 / 人为模拟测试`,
        action: `设置 [${translations[randomDev]}] 模式由 "${previousState}" 变更为 "${nextState}"`,
        status: '已执行'
      };
      setLinkages(old => [newRec, ...old]);

      addToast(`🕹️ 环控自动联调：${selectedLabName} [${translations[randomDev]}] 转为 [${nextState}]`, 'info');
      return copy;
    });
  };

  // Warn level filter map
  const filteredWarnings = useMemo(() => {
    return warnings.filter(w => {
      const matchLvl = filterLevel === '全部' || w.level === filterLevel;
      const matchType = filterType === '全部' || w.type === filterType;
      const matchStat = filterStatus === '全部' || w.status === filterStatus;
      const matchTxt = w.labName.includes(warnSearch) || w.id.includes(warnSearch) || w.currentValue.includes(warnSearch);
      return matchLvl && matchType && matchStat && matchTxt;
    });
  }, [warnings, filterLevel, filterType, filterStatus, warnSearch]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f7f6f2] dark:bg-[#171614] text-slate-800 dark:text-zinc-100 transition-colors duration-300">
      
      {/* 1. SIDE NAVIGATION BAR (Width: 220px) */}
      <aside className="w-[220px] bg-[#01585d] text-white flex flex-col justify-between shrink-0 z-20 shadow-xl border-r border-[#004246]">
        <div>
          {/* Logo / Submodule title */}
          <div className="p-4 border-b border-[#014d51] flex flex-col gap-1 bg-[#01494e]">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-[#01cfd8]/25 text-[#01cfd8]">
                <Activity size={20} className="animate-pulse" />
              </div>
              <span className="font-extrabold text-[15px] tracking-wide">智慧物联</span>
            </div>
            <p className="text-[10px] text-[#8cb2b5] font-medium uppercase font-mono tracking-wider">Salt Middle School</p>
          </div>

          <div className="px-3 py-4">
            <button 
              onClick={onBack}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#b4d6d8] bg-[#00474b]/60 hover:bg-[#00383b] rounded-lg transition-all"
              title="返回二级系统选择"
            >
              <ArrowRight size={14} className="rotate-180" />
              <span>返回系统门户</span>
            </button>
          </div>

          {/* Nav elements */}
          <nav className="px-2 space-y-1">
            {[
              { id: 'control', label: '物联控制', icon: LayoutGrid },
              { id: 'overview', label: '环境总览', icon: LayoutDashboard },
              { id: 'live', label: '实时监测', icon: Thermometer },
              { id: 'warn', label: '预警中心', icon: ShieldAlert },
              { id: 'event', label: '事件记录', icon: Clock },
              { id: 'config', label: '阈值配置', icon: Sliders }
            ].map(item => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as EnvTab)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-left text-xs font-semibold tracking-wide transition-all duration-150 relative cursor-pointer",
                    isSelected 
                      ? "bg-[#01696f] text-white shadow-md shadow-[#003134]/30 font-bold" 
                      : "text-[#b4d6d8] hover:bg-[#01494e] hover:text-white"
                  )}
                >
                  {isSelected && (
                    <motion.span 
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-2 bottom-2 w-1.5 bg-[#01cfd8] rounded-r"
                    />
                  )}
                  <Icon size={16} />
                  <span>{item.label}</span>
                  {item.id === 'warn' && kpiCurrentWarningsNum > 0 && (
                    <span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white">
                      {kpiCurrentWarningsNum}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-[#014d51] bg-[#01494e]/50">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={simulateRefreshValues}
              className="w-full py-1.5 px-2 bg-[#01696f] hover:bg-[#017e85] text-[10.5px] font-bold text-white rounded flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-sm"
              title="模拟物理传感器上送更新数据"
            >
              <RotateCw size={11} className="animate-spin-slow" />
              <span>模拟刷新数据</span>
            </button>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#80a9ac] font-mono leading-none">
            <span>SECURE SYSTEM</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 block animate-ping" />
          </div>
        </div>
      </aside>

      {/* 2. MAIN VIEW CONTAINER */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* 2.1 TOP HEADER BAR */}
        <header className={cn(
          "h-16 border-b flex items-center justify-between px-6 shrink-0 transition-colors z-10 shadow-sm",
          activeTab === 'control'
            ? "bg-[#151b26] border-white/10 text-zinc-300"
            : "bg-white dark:bg-[#121110] border-slate-205 dark:border-white/10"
        )}>
          {/* Breadcrumbs */}
          <div className={cn(
            "flex items-center gap-2 text-xs font-medium",
            activeTab === 'control' ? "text-zinc-400" : "text-slate-500 dark:text-zinc-400"
          )}>
            <span>智慧物联</span>
            <ChevronRight size={12} />
            <span className={cn(
              "font-bold font-sans",
              activeTab === 'control' ? "text-cyan-400" : "text-[#01696f] dark:text-[#01cfd8]"
            )}>
              {activeTab === 'control' && '物联控制'}
              {activeTab === 'overview' && '环境总览'}
              {activeTab === 'live' && `实时监测 / ${selectedLabName}`}
              {activeTab === 'warn' && '预警排查响应中心'}
              {activeTab === 'event' && '现场审计日志时间线'}
              {activeTab === 'config' && '硬件报警阈值参数设定'}
            </span>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-4">
            
            {/* Sensor Online Counts */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-zinc-800/60 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-slate-500 dark:text-zinc-400 font-medium">在线探头:</span>
              <span className="font-bold text-[#01696f] dark:text-[#01cfd8]">26 / 28</span>
            </div>

            {/* Simulated Search box */}
            <div className="relative flex items-center text-xs">
              <Search size={14} className="absolute left-2.5 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="搜索传感、事件、实验室..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-full py-1.5 pl-8 pr-4 w-44 outline-none focus:w-56 focus:border-[#01696f] dark:focus:border-[#01cfd8] transition-all"
              />
            </div>

            {/* Quick light/dark switch inside subsystem (ThemeContext based) */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors text-slate-550 dark:text-zinc-400"
              title="一键转换系统主题"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Warning bell icon */}
            <div 
              onClick={() => setActiveTab('warn')}
              className="relative p-2 text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full cursor-pointer leading-none"
            >
              <Bell size={18} />
              {kpiCurrentWarningsNum > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white dark:border-[#121110]">
                  {kpiCurrentWarningsNum}
                </span>
              )}
            </div>

            {/* User Avatar Group */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-white/10">
              <div className="text-right hidden md:block">
                <p className="text-[11px] font-bold">管理员: 王老师</p>
                <p className="text-[9px] text-[#01696f] dark:text-[#a5cccc] font-medium leading-none">A栋环控调度中心</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300 dark:border-zinc-700">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nala" alt="avatar" />
              </div>
            </div>

          </div>
        </header>

        {/* 2.2 MAIN CONTENT SCENE VIEWPORT */}
        <main className={cn(
          "flex-1 overflow-hidden relative flex flex-col min-h-0",
          activeTab !== 'control' && "overflow-y-auto p-5"
        )}>
          
          {activeTab === 'control' && (
            <IoTControlPanel labDevices={devices} onToast={addToast} />
          )}

          <AnimatePresence mode="wait">
            
            {/* ========================================= */}
            {/* VIEW 1: ENVIRONMENT OVERVIEW */}
            {/* ========================================= */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                
                {/* 5 KPI CARD ANCHORS */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
                  {[
                    { title: '在线传感器', value: animOnlineSensors, unit: '台', icon: Activity, color: 'text-emerald-500 bg-emerald-500/10' },
                    { title: '当前运行告警', value: animCurrentWarnings, unit: '条', icon: ShieldAlert, color: 'text-rose-550 bg-rose-500/10 font-black text-rose-500 border border-rose-200 dark:border-rose-950', highlight: true },
                    { title: '今日已处理预警', value: animDailyResolved, unit: '条', icon: CheckCircle2, color: 'text-indigo-500 bg-indigo-500/10' },
                    { title: '监测实验室', value: animMonitoredLabs, unit: '间', icon: Grid, color: 'text-[#01696f] bg-[#01696f]/10' },
                    { title: '多维联动执行', value: animLinkageTriggers, unit: '次', icon: ListRestart, color: 'text-amber-600 bg-amber-500/10' }
                  ].map((kpi, idx) => {
                    const KpiIcon = kpi.icon;
                    return (
                      <div 
                        key={idx} 
                        className="bg-white dark:bg-[#1e1d1b] border border-slate-201 dark:border-white/5 rounded-xl p-4 flex flex-col justify-between shadow-sm"
                      >
                        <div className="flex items-center justify-between text-slate-400 dark:text-zinc-400 text-[11px] font-bold">
                          <span>{kpi.title}</span>
                          <span className={cn("p-1.5 rounded-lg", kpi.color)}>
                            <KpiIcon size={14} />
                          </span>
                        </div>
                        <div className="mt-3.5 flex items-baseline gap-1">
                          <span className={cn(
                            "text-2xl font-black font-mono tracking-tight",
                            kpi.highlight ? "text-rose-550 dark:text-rose-400" : "text-[#01696f] dark:text-[#01cfd8]"
                          )}>
                            {kpi.value}
                          </span>
                          <span className="text-[10px] text-slate-450 dark:text-zinc-500">{kpi.unit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* MIDDLE DOUBLE-COLUMN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  
                  {/* LEFT: Lab summary list (Overview cards) */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black tracking-tight text-[#014e52] dark:text-[#01cfd8] uppercase">
                        🏫 实验室实时运行状态汇总
                      </h3>
                      <p className="text-[11px] text-slate-450 dark:text-zinc-400">点击 <b>[查看详情]</b> 进入实时精细测控视图</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {labs.map(lab => {
                        const statusColors = {
                          '正常': 'text-emerald-500 border-emerald-500 bg-emerald-500/10',
                          '预警': 'text-amber-500 border-amber-500 bg-amber-500/10',
                          '严重告警': 'text-rose-500 border-rose-500 bg-rose-500/10 animate-pulse'
                        };

                        return (
                          <div 
                            key={lab.id}
                            className="bg-white dark:bg-[#1e1d1b] border border-slate-201 dark:border-white/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                          >
                            <div>
                              {/* Header inside lab item */}
                              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                                <h4 className="text-sm font-bold tracking-tight">{lab.name}</h4>
                                <span className={cn("text-[10px] font-extrabold px-2 py-0.5 rounded border leading-none font-sans", statusColors[lab.status])}>
                                  {lab.status}
                                </span>
                              </div>

                              {/* Matrix grids */}
                              <div className="grid grid-cols-2 gap-x-2 gap-y-3 mt-3">
                                <div className="flex items-center gap-2">
                                  <span className="p-1 rounded bg-orange-500/10 text-orange-500"><Thermometer size={13} /></span>
                                  <div>
                                    <p className="text-[10px] text-slate-400 scale-95 origin-left">室温</p>
                                    <p className="text-xs font-bold font-mono">{lab.temp} °C</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="p-1 rounded bg-blue-500/10 text-blue-500"><Droplets size={13} /></span>
                                  <div>
                                    <p className="text-[10px] text-slate-400 scale-95 origin-left">空气湿度</p>
                                    <p className="text-xs font-bold font-mono">{lab.humidity} %</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="p-1 rounded bg-purple-500/10 text-purple-500"><Wind size={13} /></span>
                                  <div>
                                    <p className="text-[10px] text-slate-400 scale-95 origin-left">CO₂含量</p>
                                    <p className="text-xs font-bold font-mono">{lab.co2} ppm</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="p-1 rounded bg-teal-500/10 text-teal-500"><Wind size={13} /></span>
                                  <div>
                                    <p className="text-[10px] text-slate-400 scale-95 origin-left">压差/挥发</p>
                                    <p className="text-xs font-bold font-mono">{lab.pressure}Pa / {lab.voc}ppb</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Leak alert indicator */}
                            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                              <span className={cn(
                                "inline-flex items-center gap-1.5 text-[10.5px] font-extrabold px-2 py-0.5 rounded-full font-mono",
                                lab.water === '正常' ? 'text-emerald-500 bg-emerald-500/5' : 'text-rose-500 bg-rose-500/10 animate-bounce'
                              )}>
                                <Waves size={12} />
                                {lab.water === '正常' ? '溢水阀正常' : '⚠️ 水浸报警(漏水)'}
                              </span>

                              <button
                                onClick={() => handleDetailCheck(lab.name)}
                                className="text-[10.5px] text-[#01696f] dark:text-[#01cfd8] font-bold hover:underline flex items-center gap-0.5 transition-all cursor-pointer"
                              >
                                <span>精细监测</span>
                                <ChevronRight size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* RIGHT: Anomaly hours column mock graph */}
                  <div className="lg:col-span-4 bg-white dark:bg-[#1e1d1b] border border-slate-201 dark:border-white/5 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                        <h3 className="text-xs font-extrabold tracking-tight text-slate-650 dark:text-zinc-200">
                          📈 近24小时系统异常报警量时序
                        </h3>
                        <span className="text-[9px] text-[#01cfd8] bg-[#01696f]/10 font-bold px-1.5 py-0.5 rounded font-mono">24H DIST</span>
                      </div>
                      <p className="text-[10px] text-slate-450 mt-1 dark:text-zinc-400">鼠标悬停柱体上查看该时刻历史累计报警告警频次 (起)</p>
                    </div>

                    {/* Column visualization */}
                    <div className="h-44 flex items-end justify-between gap-1 mt-6 border-b border-slate-200 dark:border-zinc-800 pb-1 font-mono">
                      {last24hAnomalies.map((data, idx) => {
                        const colHeight = Math.max(4, (data.count / 9) * 100); // map max-9 count to percentage
                        return (
                          <div 
                            key={idx} 
                            className="flex-1 flex flex-col items-center group relative cursor-pointer h-full justify-end"
                          >
                            {/* Hover Tooltip Popup */}
                            <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-slate-900 border border-white/10 text-white rounded p-1.5 text-[10px] z-30 pointer-events-none whitespace-nowrap shadow-xl">
                              <span className="text-gray-400 font-bold">{data.hour} 异常数</span>
                              <strong className="text-rose-450 text-xs font-black font-mono">{data.count} 频次</strong>
                            </div>

                            {/* Action pillar */}
                            <div 
                              style={{ height: `${colHeight}%` }}
                              className={cn(
                                "w-full rounded-t-sm transition-all duration-300",
                                data.count > 5 
                                  ? 'bg-rose-500 group-hover:bg-rose-400' 
                                  : data.count > 2 
                                  ? 'bg-amber-500 group-hover:bg-amber-400' 
                                  : data.count > 0
                                  ? 'bg-[#01696f] group-hover:bg-[#01cfd8]' 
                                  : 'bg-slate-200 dark:bg-zinc-800 group-hover:bg-slate-300'
                              )}
                            />

                            <span className="text-[8px] text-slate-450 dark:text-zinc-500 scale-75 mt-1.5 block leading-none">
                              {data.hour.split(':')[0]}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-slate-400 mt-2 font-mono">
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-rose-500 block" /> 严重级</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-[#01696f] block" /> 低微超限</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-slate-200 dark:bg-zinc-800 block" /> 无异常</span>
                    </div>

                  </div>

                </div>

                {/* BOTTOM COMPONENT: Environment linkage audit log */}
                <div className="bg-white dark:bg-[#1e1d1b] border border-slate-201 dark:border-white/5 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2.5 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500"><ListRestart size={15} /></span>
                      <h3 className="text-xs font-black uppercase tracking-tight text-slate-700 dark:text-zinc-200">
                        🔄 自动闭环设备联动执行记录
                      </h3>
                    </div>
                    <span className="text-[10px] text-slate-450 dark:text-zinc-400 font-mono">AUTO_ENGINES: ACTIVE</span>
                  </div>

                  <div className="overflow-x-auto text-[11px] font-sans">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-400 dark:text-zinc-500 border-b border-slate-100 dark:border-white/5 pb-2 uppercase text-[10px]">
                          <th className="py-2">执行时序</th>
                          <th className="py-2">受控实验室</th>
                          <th className="py-2">阈值联动触发源</th>
                          <th className="py-2">环调关联动作</th>
                          <th className="py-2 text-center">指令状态</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {linkages.slice(0, 5).map(link => (
                          <tr key={link.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/25 transition-colors">
                            <td className="py-2 text-slate-500 font-mono">{link.time}</td>
                            <td className="py-2 font-bold">{link.labName}</td>
                            <td className="py-2"><span className="text-rose-500 bg-rose-500/5 px-2 py-0.5 rounded font-mono font-bold">{link.condition}</span></td>
                            <td className="py-2 text-slate-650 dark:text-zinc-300 font-medium">{link.action}</td>
                            <td className="py-2 text-center">
                              <span className="inline-block text-[9.5px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                {link.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </motion.div>
            )}

            {/* ========================================= */}
            {/* VIEW 2: REAL-TIME MONITORING */}
            {/* ========================================= */}
            {activeTab === 'live' && (
              <motion.div
                key="live"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* LAB TABS */}
                <div className="flex items-center gap-1 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#1e1d1b] p-1 rounded-xl shadow-sm">
                  {labs.map(lab => {
                    const isSelected = selectedLabName === lab.name;
                    return (
                      <button
                        key={lab.id}
                        onClick={() => setSelectedLabName(lab.name)}
                        className={cn(
                          "px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all relative flex-1 text-center",
                          isSelected 
                            ? "bg-[#01696f] text-white font-bold shadow-md" 
                            : "text-slate-550 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
                        )}
                      >
                        {lab.name}
                        {lab.status !== '正常' && (
                          <span className={cn(
                            "absolute top-1 right-2 inline-block h-2 w-2 rounded-full",
                            lab.status === '严重告警' ? 'bg-red-500 animate-ping' : 'bg-amber-500'
                          )} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 6 REAL-TIME VALUES CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
                  {[
                    { name: '环境温度', val: `${currentLabData.temp} °C`, icon: Thermometer, color: 'text-orange-500 bg-orange-550/10', range: '18.0 - 25.0 °C', pct: Math.min(100, (currentLabData.temp / 35) * 100), status: currentLabData.temp > 25 ? '偏高' : currentLabData.temp < 18 ? '偏低' : '正常' },
                    { name: '空气相对湿度', val: `${currentLabData.humidity} %`, icon: Droplets, color: 'text-blue-500 bg-blue-500/10', range: '30.0 - 60.0 %', pct: Math.min(100, currentLabData.humidity), status: currentLabData.humidity > 60 ? '偏高' : currentLabData.humidity < 30 ? '偏低' : '正常' },
                    { name: 'CO₂气体含量', val: `${currentLabData.co2} ppm`, icon: Wind, color: 'text-purple-500 bg-purple-555/10', range: '<800 ppm', pct: Math.min(100, (currentLabData.co2 / 1200) * 100), status: currentLabData.co2 > 800 ? '超限' : '正常' },
                    { name: 'VOC 挥发性物质', val: `${currentLabData.voc} ppb`, icon: Activity, color: 'text-rose-500 bg-rose-500/10', range: '<200 ppb', pct: Math.min(100, (currentLabData.voc / 500) * 100), status: currentLabData.voc > 200 ? '超限' : '正常' },
                    { name: '微压差洁净室', val: `${currentLabData.pressure} Pa`, icon: RotateCw, color: 'text-teal-500 bg-teal-500/10', range: '10.0 - 20.0 Pa', pct: Math.min(100, (currentLabData.pressure / 30) * 100), status: currentLabData.pressure < 10 ? '低偏' : '正常' },
                    { name: '溢水水浸防区', val: currentLabData.water === '正常' ? '干燥安全' : '已发生水溢', icon: Waves, color: currentLabData.water === '正常' ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/25 animate-bounce', range: '干燥状态', pct: currentLabData.water === '正常' ? 100 : 0, status: currentLabData.water === '正常' ? '正常' : '告警' }
                  ].map((card, idx) => {
                    const CardIcon = card.icon;
                    return (
                      <div key={idx} className="bg-white dark:bg-[#1e1d1b] border border-slate-201 dark:border-white/5 rounded-xl p-4 flex flex-col justify-between shadow-sm relative">
                        <div>
                          <p className="text-[10px] text-slate-400 dark:text-zinc-500 flex items-center justify-between font-extrabold leading-none">
                            <span>{card.name}</span>
                            <span className={cn(
                              "text-[9px] font-bold px-1.5 py-0.5 rounded leading-none",
                              card.status === '正常' ? 'text-emerald-500 bg-emerald-500/5' : 'text-rose-500 bg-rose-500/5'
                            )}>
                              {card.status}
                            </span>
                          </p>
                          <h4 className="text-lg font-black font-sans tracking-tight mt-2.5">{card.val}</h4>
                          <p className="text-[9px] text-slate-450 dark:text-zinc-400 font-mono mt-0.5">预设限: {card.range}</p>
                        </div>

                        {/* Progress slider bar mock */}
                        <div className="mt-4">
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                              style={{ width: `${card.pct}%` }} 
                              className={cn(
                                "h-full rounded-full transition-all duration-300",
                                card.status === '正常' ? 'bg-[#01696f]' : 'bg-red-500'
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* BOTTOM DUAL INTERACTION AREA */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  
                  {/* LEFT TREND CHART (SVG) */}
                  <div className="lg:col-span-8 bg-white dark:bg-[#1e1d1b] border border-slate-210 dark:border-white/5 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-2">
                        <h3 className="text-xs font-black text-slate-700 dark:text-zinc-200 uppercase">
                          📈 探针时序回溯 (近12小时精细曲线)
                        </h3>
                        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg">
                          {[
                            { id: 'temp', label: '温度' },
                            { id: 'humidity', label: '湿度' },
                            { id: 'co2', label: 'CO₂' }
                          ].map(metric => (
                            <button
                              key={metric.id}
                              onClick={() => setSelectedTrendMetric(metric.id as any)}
                              className={cn(
                                "text-[10px] font-bold px-2 py-1 rounded cursor-pointer transition-colors",
                                selectedTrendMetric === metric.id 
                                  ? 'bg-[#01696f] text-white' 
                                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-100'
                              )}
                            >
                              {metric.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-450 mt-1 dark:text-zinc-400">折线基于高分辨率采集芯片, 每两小时整合一包上报。触点可获知回显气温值。</p>
                    </div>

                    {/* SVG GRAPH PLOTTING */}
                    <div className="h-44 mt-6 relative select-none">
                      {/* Grid background lines */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[8px] text-slate-300 dark:text-zinc-800 font-mono">
                        <div className="border-b border-dashed border-slate-100 dark:border-zinc-800/60 pb-1">上限参考</div>
                        <div className="border-b border-dashed border-slate-100 dark:border-zinc-800/60 pb-1">中位段线</div>
                        <div className="border-b border-dashed border-slate-100 dark:border-zinc-800/60 pb-1">基轴零网</div>
                      </div>

                      {/* Line rendering */}
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 1200 200" preserveAspectRatio="none">
                        {/* Define linear gradient */}
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#01cfd8" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#01696f" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {(() => {
                          const points = mockTrendData[selectedLabName][selectedTrendMetric];
                          const maxVal = Math.max(...points) * 1.15;
                          const minVal = Math.min(...points) * 0.85;
                          const delta = (maxVal - minVal) || 1;

                          const coords = points.map((p, i) => {
                            const x = (i / 11) * 1200;
                            // Invert y because SVG y goes down
                            const y = 180 - ((p - minVal) / delta) * 150;
                            return { x, y, val: p };
                          });

                          // Generate path string
                          const pathStr = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
                          const areaStr = `${pathStr} L 1200 190 L 0 190 Z`;

                          return (
                            <>
                              {/* Area below curve */}
                              <path d={areaStr} fill="url(#chartGradient)" />

                              {/* Elegant spline */}
                              <path d={pathStr} fill="none" stroke="#01cfd8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                              {/* Target Point Dots */}
                              {coords.map((c, i) => (
                                <g key={i} className="group cursor-pointer">
                                  <circle 
                                    cx={c.x} 
                                    cy={c.y} 
                                    r="4.5" 
                                    fill="#171614" 
                                    stroke="#01cfd8" 
                                    strokeWidth="2.5" 
                                    className="transition-all duration-150 scale-100 group-hover:scale-150"
                                  />
                                  {/* Tooltip on Node */}
                                  <foreignObject x={c.x - 35} y={c.y - 35} width="70" height="30" className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <div className="bg-slate-900 text-white text-[9px] font-black rounded-md py-0.5 text-center border border-white/10 shadow-lg">
                                      {c.val} {selectedTrendMetric === 'temp' ? '°C' : selectedTrendMetric === 'humidity' ? '%' : 'ppm'}
                                    </div>
                                  </foreignObject>
                                </g>
                              ))}
                            </>
                          );
                        })()}
                      </svg>
                    </div>

                    {/* Timeline labels bar */}
                    <div className="flex items-center justify-between text-[9px] text-[#80a9ac] font-mono mt-3.5 border-t border-slate-100 dark:border-zinc-800/60 pt-2 bg-slate-50 dark:bg-zinc-900/40 px-2 rounded">
                      {hours12.map((h, i) => (
                        <span key={i}>{h}</span>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT LINKAGE DEVICE BULB Indicators */}
                  <div className="lg:col-span-4 bg-white dark:bg-[#1e1d1b] border border-slate-201 dark:border-white/5 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-cyan-400 block" />
                          <h3 className="text-xs font-black tracking-tight uppercase text-slate-700 dark:text-zinc-200">
                            🤖 设备环空调联联动状态
                          </h3>
                        </div>
                        <span className="text-[9px] text-zinc-400 font-mono">5 OUTLETS</span>
                      </div>
                      <p className="text-[10px] text-slate-450 mt-1 dark:text-zinc-400">读取到的当前实验室环境物理机运行开关状态</p>
                    </div>

                    <div className="space-y-3.5 mt-4 my-2">
                      {[
                        { key: 'entrance', label: '安全门防盗阻尼门禁', type: 'lock' },
                        { key: 'air', label: '精密恒温恒湿空调', type: 'state' },
                        { key: 'fresh', label: '中效多重净化新风机', type: 'state' },
                        { key: 'exhaust', label: '变流强排有害气体风扇', type: 'state' },
                        { key: 'dehumidifier', label: '冷凝工业精密吸湿除湿机', type: 'state' }
                      ].map(dev => {
                        const statusVal = devices[selectedLabName]?.[dev.key] || '待机';
                        const isPrimaryActive = statusVal === '运行中' || statusVal === '开启';

                        return (
                          <div key={dev.key} className="flex items-center justify-between border-b border-dashed border-slate-150 dark:border-zinc-800/50 pb-2">
                            <span className="text-[10.5px] font-semibold text-slate-650 dark:text-zinc-350">{dev.label}</span>
                            <div className="flex items-center gap-1.5 text-[10.5px]">
                              {/* Glowing state point */}
                              <span className={cn(
                                "h-2 w-2 rounded-full",
                                isPrimaryActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-350 dark:bg-zinc-700'
                              )} />
                              <strong className={cn(
                                "font-extrabold uppercase",
                                isPrimaryActive ? 'text-emerald-500' : 'text-slate-400'
                              )}>
                                {statusVal}
                              </strong>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-white/5">
                      <button
                        onClick={simulateDeviceTransition}
                        className="w-full py-2 bg-[#01696f] hover:bg-[#014e52] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer shadow-md"
                      >
                        <RotateCw size={13} />
                        <span>一键物理联动自控模拟</span>
                      </button>
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

            {/* ========================================= */}
            {/* VIEW 3: WARNING CENTER */}
            {/* ========================================= */}
            {activeTab === 'warn' && (
              <motion.div
                key="warn"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 animate-fade-in"
              >
                {/* FILTER SEARCH PANEL */}
                <div className="bg-white dark:bg-[#1e1d1b] border border-slate-201 dark:border-white/10 p-4 rounded-xl shadow-sm flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex flex-wrap items-center gap-4">
                    
                    {/* Level */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-550 dark:text-zinc-400 font-bold">
                      <span>级别:</span>
                      <select 
                        value={filterLevel} 
                        onChange={(e) => setFilterLevel(e.target.value)}
                        className="bg-slate-50 dark:bg-[#121110] border border-slate-200 dark:border-white/10 rounded px-2 py-1.5 outline-none font-bold"
                      >
                        <option value="全部">全部级别</option>
                        <option value="一级">一级 (最严重)</option>
                        <option value="二级">二级 (严重)</option>
                        <option value="三级">三级 (预警)</option>
                      </select>
                    </div>

                    {/* Sensor Type */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-550 dark:text-zinc-400 font-bold">
                      <span>指标:</span>
                      <select 
                        value={filterType} 
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-slate-50 dark:bg-[#121110] border border-slate-200 dark:border-white/10 rounded px-2 py-1.5 outline-none font-bold"
                      >
                        <option value="全部">全部指标</option>
                        <option value="温度">温度</option>
                        <option value="湿度">湿度</option>
                        <option value="CO2">CO₂气体</option>
                        <option value="VOC">VOC</option>
                        <option value="压差">室外微压差</option>
                        <option value="水浸">水浸监测</option>
                      </select>
                    </div>

                    {/* Process status */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-550 dark:text-zinc-400 font-bold">
                      <span>响应状态:</span>
                      <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-slate-50 dark:bg-[#121110] border border-slate-200 dark:border-white/10 rounded px-2 py-1.5 outline-none font-bold"
                      >
                        <option value="全部">全部状态</option>
                        <option value="待处理">待处理</option>
                        <option value="处理中">处理中</option>
                        <option value="已关闭">已关闭</option>
                      </select>
                    </div>

                    {/* Text warning input */}
                    <div className="relative flex items-center text-xs">
                      <Search size={13} className="absolute left-2 text-zinc-400" />
                      <input 
                        type="text"
                        placeholder="检索特定房间、告警特征..."
                        value={warnSearch}
                        onChange={(e) => setWarnSearch(e.target.value)}
                        className="bg-slate-50 dark:bg-[#121110] border border-slate-200 dark:border-white/10 rounded px-2 pl-7 py-1.5 outline-none w-44 focus:w-56 transition-all"
                      />
                    </div>

                  </div>

                  <span className="text-[10.5px] font-mono text-slate-400 leading-none">
                    筛后可用统计: <b>{filteredWarnings.length}</b> 组报警项
                  </span>
                </div>

                {/* WARNING TICKET LIST TABLE */}
                <div className="bg-white dark:bg-[#1e1d1b] border border-slate-201 dark:border-white/15 rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto text-xs font-sans">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-zinc-850 text-slate-450 dark:text-zinc-400 font-extrabold uppercase text-[10.5px] border-b border-slate-100 dark:border-white/5">
                          <th className="py-3 px-4">告警编号</th>
                          <th className="py-3 px-4">触发时间</th>
                          <th className="py-3 px-4">报警范围/名称</th>
                          <th className="py-3 px-4">当前采集值</th>
                          <th className="py-3 px-4 font-mono">核算限</th>
                          <th className="py-3 px-4 text-center">状态级别</th>
                          <th className="py-3 px-4 text-center">处理进度</th>
                          <th className="py-3 px-4 text-right">人工闭环通道</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {filteredWarnings.length > 0 ? (
                          filteredWarnings.map(warn => (
                            <tr key={warn.id} className="hover:bg-slate-55/40 dark:hover:bg-zinc-800/10 transition-colors">
                              <td className="py-3.5 px-4 font-mono font-bold text-slate-450">{warn.id}</td>
                              <td className="py-3.5 px-4 font-mono text-slate-500">{warn.time}</td>
                              <td className="py-3.5 px-4 font-bold">{warn.labName}</td>
                              <td className="py-3.5 px-4">
                                <span className="font-extrabold text-rose-500 font-mono">{warn.currentValue}</span>
                              </td>
                              <td className="py-3.5 px-4 text-slate-550 font-mono dark:text-zinc-400">{warn.threshold}</td>
                              <td className="py-3.5 px-4 text-center">
                                <span className={cn(
                                  "inline-block font-extrabold px-2 py-0.5 rounded text-[9.5px]",
                                  warn.level === '一级' ? 'text-red-500 bg-red-500/15 border border-red-500/20' :
                                  warn.level === '二级' ? 'text-orange-500 bg-orange-500/15 border border-orange-500/20' :
                                  'text-amber-500 bg-amber-500/15 border border-amber-500/20'
                                )}>
                                  {warn.level}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span className={cn(
                                  "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold leading-none",
                                  warn.status === '待处理' ? 'text-red-500 bg-red-100 dark:bg-red-950/20 animate-pulse' :
                                  warn.status === '处理中' ? 'text-yellow-650 bg-yellow-100 dark:bg-yellow-950/20' :
                                  'text-slate-400 bg-slate-100 dark:bg-zinc-800/60'
                                )}>
                                  ● {warn.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="inline-flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      setSelectedWarning(warn);
                                      setDrawerOpen(true);
                                    }}
                                    className="px-2.5 py-1 text-slate-500 hover:text-[#01696f] bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded text-[10px] font-bold transition-all cursor-pointer"
                                    title="详情时间轴与分析"
                                  >
                                    查看
                                  </button>
                                  
                                  {warn.status !== '已关闭' && (
                                    <>
                                      {warn.status === '待处理' && (
                                        <button
                                          onClick={() => setDispatchOrderWarning(warn)}
                                          className="px-2.5 py-1 text-white bg-amber-600 hover:bg-amber-700 rounded text-[10px] font-bold transition-all cursor-pointer shadow-sm"
                                        >
                                          派单
                                        </button>
                                      )}
                                      <button
                                        onClick={() => closeWarningTicket(warn.id)}
                                        className="px-2.5 py-1 text-white bg-slate-500 hover:bg-slate-600 rounded text-[10px] font-bold transition-all cursor-pointer"
                                      >
                                        关闭
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="py-12 text-center text-slate-400 font-bold">
                              🔍 暂无符合该筛选范围的报警时差记录
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </motion.div>
            )}

            {/* ========================================= */}
            {/* VIEW 4: EVENT HISTORY */}
            {/* ========================================= */}
            {activeTab === 'event' && (
              <motion.div
                key="event"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 font-sans max-w-4xl mx-auto"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-[#01696f] dark:text-[#01cfd8] uppercase">
                    🧾 数据审计中心：安全事件溯源历史日志
                  </h3>
                  <span className="text-[10px] text-zinc-400">一页时序轴承上报 8 列</span>
                </div>

                {/* TIMELINE ARCHITECTURE */}
                <div className="relative border-l border-slate-202 dark:border-zinc-800 ml-4 pl-6 space-y-6 py-2">
                  {events.map((evt, idx) => {
                    const eventClassMap = {
                      threshold_over: 'bg-rose-500 border-rose-600 text-white',
                      linkage_exec: 'bg-amber-500 border-amber-600 text-white',
                      manual_confirm: 'bg-indigo-650 border-indigo-700 text-white',
                      remote_reset: 'bg-emerald-500 border-emerald-650 text-white',
                      false_alarm: 'bg-slate-500 border-slate-600 text-white'
                    };

                    return (
                      <div key={evt.id} className="relative group p-4 bg-white dark:bg-[#1e1d1b] border border-slate-201 dark:border-white/5 rounded-xl shadow-sm hover:shadow-md transition-all">
                        {/* Bullet point on node axis */}
                        <div className={cn(
                          "absolute top-5 -left-10 h-7 w-7 rounded-full border-2 flex items-center justify-center font-bold text-xs scale-100 group-hover:scale-110 transition-transform shadow-lg",
                          eventClassMap[evt.type] || 'bg-slate-400 text-white'
                        )}>
                          {idx + 1}
                        </div>

                        {/* Event Title Line */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-450">{evt.time}</span>
                            <span className="text-[10px] font-sans font-bold px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded">
                              {evt.labName}
                            </span>
                            <strong className="text-xs font-black font-sans text-slate-800 dark:text-zinc-200">{evt.description}</strong>
                          </div>

                          <span className={cn(
                            "text-[9px] font-bold px-2 py-0.5 rounded leading-none",
                            evt.type === 'threshold_over' ? 'text-red-500 bg-red-500/5' :
                            evt.type === 'linkage_exec' ? 'text-amber-650 bg-amber-500/5' :
                            evt.type === 'manual_confirm' ? 'text-indigo-500 bg-indigo-500/5' :
                            'text-slate-450 bg-slate-100 dark:bg-zinc-900/60'
                          )}>
                            {evt.typeLabel}
                          </span>
                        </div>

                        {/* Footer in event element */}
                        <div className="mt-2 text-[10.5px] text-slate-500 dark:text-zinc-400 flex items-center justify-between">
                          <span>操盘手: <b>{evt.operator}</b></span>
                          {evt.details && (
                            <button
                              onClick={() => setSelectedEvent(evt)}
                              className="text-[10px] text-[#01cfd8] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                            >
                              <span>查看详情结构</span>
                              <ChevronRight size={12} />
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>

              </motion.div>
            )}

            {/* ========================================= */}
            {/* VIEW 5: THRESHOLD CONFIGURATION */}
            {/* ========================================= */}
            {activeTab === 'config' && (
              <motion.div
                key="config"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between border-b pb-2 mb-2 border-slate-201 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Sliders className="text-[#01696f]" size={16} />
                    <h3 className="text-sm font-black text-slate-800 dark:text-zinc-200">
                      ⚙️ 系统监测阈值与警报分级配置
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400">双向多触点通知策略，系统可拦截严重项推演。</p>
                </div>

                {/* THRESHOLD CONFIG CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {thresholds.map(th => {
                    const notifyChannelChinese: Record<string, string> = {
                      sys_msg: '站内消息',
                      sms: '短信通知',
                      email: '电子邮件',
                      wechat: '企业微信'
                    };

                    return (
                      <div key={th.id} className="bg-white dark:bg-[#1e1d1b] border border-slate-201 dark:border-white/5 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                            <span className="text-xs font-black tracking-tight">{th.name}</span>
                            <span className={cn(
                              "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded leading-none",
                              th.enabled ? 'text-emerald-500 bg-emerald-500/5' : 'text-slate-400 bg-slate-100'
                            )}>
                              {th.enabled ? '已启用监控' : '未挂载'}
                            </span>
                          </div>

                          <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400">警限设定:</span>
                              <strong className="font-mono text-[#01cfd8] text-sm">
                                {th.lowerLimit !== undefined ? `${th.lowerLimit} ~ ${th.upperLimit}` : `> ${th.upperLimit}`} {th.unit}
                              </strong>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400">警报响应级别:</span>
                              <span className="font-bold text-rose-450">{th.level} (重度)</span>
                            </div>

                            <div className="flex flex-col gap-1 border-t border-slate-100 dark:border-zinc-800/60 pt-2 text-[10.5px]">
                              <p className="text-slate-400 font-bold">联动通知策略通道:</p>
                              <div className="flex flex-wrap gap-1">
                                {th.notifyChannels.map(ch => (
                                  <span key={ch} className="px-1.5 py-0.5 bg-slate-50 dark:bg-zinc-800 rounded scale-95 scale-x-100 font-medium">
                                    {notifyChannelChinese[ch] || ch}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 text-right">
                          <button
                            onClick={() => setEditingThreshold(th)}
                            className="bg-slate-100 hover:bg-[#01696f] hover:text-white dark:bg-zinc-800 text-[#01696f] dark:text-zinc-200 text-xs font-bold py-1 px-3 rounded-md transition-all cursor-pointer shadow-sm"
                          >
                            配置编辑
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </motion.div>
            )}

          </AnimatePresence>

          {/* FLOATING CORNER TOAST CONTAINER */}
          <div className="fixed top-20 right-5 z-50 flex flex-col gap-2.5 max-w-sm">
            <AnimatePresence>
              {toasts.map(toast => (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0.9 }}
                  className={cn(
                    "p-3 rounded-lg shadow-xl text-white text-xs font-bold flex items-center gap-2.5 border backdrop-blur",
                    toast.type === 'success' ? 'bg-emerald-600/90 border-emerald-500' :
                    toast.type === 'warn' ? 'bg-rose-600/90 border-rose-500' :
                    'bg-cyan-600/90 border-cyan-500'
                  )}
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-white block animate-ping" />
                  <span>{toast.text}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ========================================= */}
          {/* DRAWER LAYER: TICKET DETAIL ANALYSIS (420px) */}
          {/* ========================================= */}
          <AnimatePresence>
            {drawerOpen && selectedWarning && (
              <>
                {/* Backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setDrawerOpen(false)}
                  className="fixed inset-0 bg-black z-30 pointer-events-auto"
                />

                {/* Sliding side drawer */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.25 }}
                  className="fixed top-0 right-0 h-full w-[420px] bg-white dark:bg-[#1a1917] border-l border-slate-205 dark:border-white/10 z-40 p-5 shadow-2xl overflow-y-auto"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="text-orange-500" size={18} />
                      <strong className="text-sm font-black font-sans">预警追溯详细卡 [ {selectedWarning.id} ]</strong>
                    </div>
                    <button 
                      onClick={() => setDrawerOpen(false)}
                      className="p-1 rounded bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  {/* Basic information */}
                  <div className="space-y-4 text-xs">
                    
                    <div className="bg-slate-50 dark:bg-zinc-900/60 p-3 rounded-lg border border-slate-200 dark:border-white/5 space-y-1.5">
                      <p className="font-bold flex justify-between">
                        <span className="text-slate-400">告警发生时间:</span>
                        <span className="font-mono">{selectedWarning.time}</span>
                      </p>
                      <p className="font-bold flex justify-between">
                        <span className="text-slate-400">事件实验室地点:</span>
                        <span>{selectedWarning.labName}</span>
                      </p>
                      <p className="font-bold flex justify-between">
                        <span className="text-slate-400">触发探针类型:</span>
                        <span className="text-[#01cfd8] font-bold uppercase">{selectedWarning.type}</span>
                      </p>
                      <p className="font-bold flex justify-between">
                        <span className="text-slate-400">采集到超标数值:</span>
                        <span className="text-red-500 font-extrabold">{selectedWarning.currentValue}</span>
                      </p>
                      <p className="font-bold flex justify-between">
                        <span className="text-slate-400">预设监控上限:</span>
                        <span className="font-mono">{selectedWarning.threshold}</span>
                      </p>
                    </div>

                    {/* Timeline section inside drawer */}
                    <div className="space-y-2">
                      <h4 className="font-black text-[11px] text-[#01cfd8] uppercase border-b border-zinc-800 pb-1">
                        🚦 预警节点流转确认时间线
                      </h4>

                      <div className="border-l border-slate-200 dark:border-zinc-800 pl-4 space-y-3.5 my-2">
                        {/* Step 1 */}
                        <div className="relative">
                          <span className="absolute -left-6 top-1.5 h-3 w-3 rounded-full bg-rose-500" />
                          <p className="font-bold">触发预警超载</p>
                          <p className="text-[10px] text-slate-450 leading-relaxed font-mono">温度/化学溢出瞬间电变压芯片动作 触发。时差0.02秒自动归入云台。</p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                          <span className="absolute -left-6 top-1.5 h-3 w-3 rounded-full bg-amber-500" />
                          <p className="font-bold">站内及专线推送通知</p>
                          <p className="text-[10px] text-slate-450 leading-relaxed">事件指令自动合规通知。多触点联动开启，空调及风机已自动切档调温。</p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                          <span className={cn(
                            "absolute -left-6 top-1.5 h-3 w-3 rounded-full",
                            selectedWarning.status !== '待处理' ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-zinc-700'
                          )} />
                          <p className="font-bold">调度确认与派单中</p>
                          <p className="text-[10px] text-slate-450 leading-relaxed">
                            {selectedWarning.status === '待处理' ? '当前正挂单。调度人员等现场采集老师的反馈。' : `负责人 ${selectedWarning.operator || '张老师'} 已接单并去往现场排热。`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Suggestion responses */}
                    <div className="p-3 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                      <h4 className="font-black text-[11px] text-[#01cfd8] mb-1.5 uppercase">
                        🔧 专家建议应对处置机制
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-[10.5px] leading-relaxed text-slate-650 dark:text-zinc-350">
                        <li>请前场老师核实高压加热阀气门开度，检查密封是否正常。</li>
                        <li>现场强排管阀保持100%强制循环20分钟。</li>
                        <li>如有水溢水浸，先关水源总阀，消除传感器表面金属短路。</li>
                      </ul>
                    </div>

                    {/* Associated mini SVG trend */}
                    <div className="bg-[#121110] p-3 rounded-lg border border-white/5">
                      <h4 className="text-[10px] font-mono text-[#01cfd8] mb-1">ASSOCIATED TREND (MINI-SVG)</h4>
                      <div className="h-14">
                        <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                          <path d="M 0 35 Q 25 10 50 25 T 100 5 L 100 40 L 0 40 Z" fill="rgba(1, 207, 216, 0.15)" />
                          <path d="M 0 35 Q 25 10 50 25 T 100 5" fill="none" stroke="#01cfd8" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>

                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ========================================= */}
          {/* MODAL 1: MANUAL WORK ORDER DISPATCH */}
          {/* ========================================= */}
          {dispatchOrderWarning && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                className="bg-white dark:bg-[#1a1917] rounded-xl max-w-md w-full p-5 border border-slate-205 dark:border-white/10 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <strong className="text-sm font-black font-sans">📋 调度工单下发/现场派单确认</strong>
                  <button onClick={() => setDispatchOrderWarning(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded">
                    <X size={15} />
                  </button>
                </div>

                <form onSubmit={registerDispatchOrder} className="space-y-3.5 text-xs">
                  <div className="bg-slate-50 dark:bg-zinc-900/60 p-3 rounded-lg text-slate-550 dark:text-zinc-400">
                    <p>工单编号: <b>{dispatchOrderWarning.id}</b></p>
                    <p>告警异常: <b>{dispatchOrderWarning.labName} / {dispatchOrderWarning.type} 达到 {dispatchOrderWarning.currentValue}</b></p>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold">指定现场排查处置责任人 *</label>
                    <select
                      value={dispatchOperator}
                      onChange={(e) => setDispatchOperator(e.target.value)}
                      className="w-full p-2 bg-slate-50 dark:bg-zinc-90 w border border-slate-200 dark:border-white/10 rounded"
                    >
                      <option value="张老师">张老师 (后勤安全主管)</option>
                      <option value="章老师">章老师 (实验室值机员)</option>
                      <option value="王老师">王老师 (环境协调员)</option>
                      <option value="后勤值班中心">后勤机房值班中心 (强联动派人)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold">人工介入指令备注 / 现场要求</label>
                    <textarea
                      placeholder="例如：先通风20分钟，检查水管垫圈是否老化，对过热马弗炉进行人工阻尼拉门风洗散热等..."
                      value={dispatchNote}
                      onChange={(e) => setDispatchNote(e.target.value)}
                      rows={3}
                      className="w-full p-2 bg-slate-55 dark:bg-zinc-90 w border border-slate-200 dark:border-white/10 rounded outline-none text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t">
                    <button 
                      type="button" 
                      onClick={() => setDispatchOrderWarning(null)} 
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded font-bold cursor-pointer"
                    >
                      取消
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-[#01696f] hover:bg-[#014e52] text-white rounded font-bold cursor-pointer transition-colors shadow-md"
                    >
                      签发签署单
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {/* ========================================= */}
          {/* MODAL 2: EVENT JSON DETAIL PREVIEW */}
          {/* ========================================= */}
          {selectedEvent && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                className="bg-[#121110] text-zinc-100 rounded-xl max-w-lg w-full p-5 border border-white/15 shadow-25 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-1.5 text-[#01cfd8]">
                    <Database size={16} />
                    <strong className="text-xs font-mono">审计日志 JSON 元数据卡 [ {selectedEvent.id} ]</strong>
                  </div>
                  <button onClick={() => setSelectedEvent(null)} className="p-1 hover:bg-white/10 rounded text-neutral-400">
                    <X size={15} />
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    事件源、采集器ID、网络协议上报及处理快照格式化审计日志。
                  </p>

                  <pre className="p-3 bg-[#1e1d1b] rounded-lg font-mono text-[10px] text-emerald-400 overflow-x-auto border border-white/5 space-y-1">
                    {JSON.stringify({
                      eventId: selectedEvent.id,
                      timestamp: selectedEvent.time,
                      labTag: selectedEvent.labName,
                      eventMainDesc: selectedEvent.description,
                      operatorTag: selectedEvent.operator,
                      firmwareModel: 'ENV-M-CHIP-V4.2',
                      networkPayload: selectedEvent.details || { debugStatus: 'COMPLETED' }
                    }, null, 2)}
                  </pre>
                </div>

                <div className="flex items-center justify-end pt-2 border-t border-white/10">
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    关闭元数据大卡
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* ========================================= */}
          {/* MODAL 3: THRESHOLD EDIT FORM */}
          {/* ========================================= */}
          {editingThreshold && (
            <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                className="bg-white dark:bg-[#1a1917] rounded-xl max-w-md w-full p-5 border border-slate-205 dark:border-white/10 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <strong className="text-sm font-black text-slate-800 dark:text-zinc-200 flex items-center gap-1">
                    <Settings className="text-[#01696f]" size={16} />
                    编辑 [{editingThreshold.name}] 限值参数
                  </strong>
                  <button onClick={() => setEditingThreshold(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded">
                    <X size={15} />
                  </button>
                </div>

                {(() => {
                  return (
                    <div className="text-xs space-y-4">
                      {/* Upper Limits */}
                      <div className="grid grid-cols-2 gap-3">
                        {editingThreshold.lowerLimit !== undefined && (
                          <div className="space-y-1">
                            <label className="font-bold">温度/气压下限值 ({editingThreshold.unit})</label>
                            <input 
                              type="number"
                              step="0.1"
                              value={editingThreshold.lowerLimit}
                              onChange={(e) => setEditingThreshold({ ...editingThreshold, lowerLimit: parseFloat(e.target.value) || 0 })}
                              className="w-full p-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded font-mono"
                            />
                          </div>
                        )}
                        <div className="space-y-1">
                          <label className="font-bold">临界上限监控值 ({editingThreshold.unit})</label>
                          <input 
                            type="number"
                            step="0.1"
                            value={editingThreshold.upperLimit}
                            onChange={(e) => setEditingThreshold({ ...editingThreshold, upperLimit: parseFloat(e.target.value) || 0 })}
                            className="w-full p-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded font-mono"
                          />
                        </div>
                      </div>

                      {/* Active Toggle Switch */}
                      <div className="flex items-center justify-between border-y border-slate-100 py-3 dark:border-zinc-805">
                        <div>
                          <p className="font-bold">是否启用此探头硬件挂接告警</p>
                          <p className="text-[10px] text-slate-450 leading-relaxed">停用后，即使数据发生超限也不推送和触发联动。</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingThreshold({ ...editingThreshold, enabled: !editingThreshold.enabled })}
                          className={cn(
                            "px-3 py-1.5 rounded text-[11px] font-bold transition-all cursor-pointer shadow-sm",
                            editingThreshold.enabled ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500 dark:bg-zinc-800'
                          )}
                        >
                          {editingThreshold.enabled ? '已启用监控' : '屏蔽监控'}
                        </button>
                      </div>

                      {/* Severity Levels */}
                      <div className="space-y-1">
                        <label className="font-bold">超限后警报威胁设定级别</label>
                        <select
                          value={editingThreshold.level}
                          onChange={(e) => setEditingThreshold({ ...editingThreshold, level: e.target.value as any })}
                          className="w-full p-2 bg-slate-55 dark:bg-zinc-90 w border border-slate-202 dark:border-white/10 rounded"
                        >
                          <option value="一级">一级严重：极度危险需紧急联动派单</option>
                          <option value="二级">二级预警：偏离标准正常值需巡视</option>
                          <option value="三级">三级限外：瞬变轻度波动报警</option>
                        </select>
                      </div>

                      {/* Notification multi-checkbox strategy */}
                      <div className="space-y-1 border-t pt-2.5">
                        <label className="font-bold">下发通知广播策略</label>
                        <div className="grid grid-cols-2 gap-2 mt-1.5 leading-none">
                          {[
                            { key: 'sys_msg', label: '① 站内闪控通知' },
                            { key: 'sms', label: '② 特制通知短信' },
                            { key: 'email', label: '③ 电子邮件归档' },
                            { key: 'wechat', label: '④ 企业微信群控闪推' }
                          ].map(opt => {
                            const isIncluded = editingThreshold.notifyChannels.includes(opt.key);
                            return (
                              <label key={opt.key} className="flex items-center gap-2 cursor-pointer font-medium p-1 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded">
                                <input 
                                  type="checkbox"
                                  checked={isIncluded}
                                  onChange={() => {
                                    const nextChannels = isIncluded 
                                      ? editingThreshold.notifyChannels.filter(c => c !== opt.key) 
                                      : [...editingThreshold.notifyChannels, opt.key];
                                    setEditingThreshold({ ...editingThreshold, notifyChannels: nextChannels });
                                  }}
                                  className="h-3.5 w-3.5 text-[#01696f]"
                                />
                                <span>{opt.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t">
                        <button 
                          type="button" 
                          onClick={() => setEditingThreshold(null)} 
                          className="px-3.5 py-1.5 bg-slate-100 dark:bg-zinc-805 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded font-bold cursor-pointer"
                        >
                          取消
                        </button>
                        <button 
                          type="button"
                          onClick={() => updateThresholdConfig(editingThreshold)}
                          className="px-4 py-1.5 bg-[#01696f] hover:bg-[#014e52] text-white rounded font-bold transition-all cursor-pointer shadow-md"
                        >
                          保存配置
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
