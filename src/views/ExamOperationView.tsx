import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Calendar, 
  Tv, 
  History, 
  User, 
  Clock, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Search, 
  Filter, 
  ArrowLeft, 
  Video, 
  ShieldAlert, 
  ListChecks, 
  UserCheck, 
  LogOut, 
  Menu, 
  ChevronLeft, 
  Download, 
  RefreshCw, 
  Play, 
  Pause, 
  Maximize2, 
  Volume2,
  Trash2,
  Plus,
  Compass,
  FileCheck,
  Eye,
  Sliders,
  Award
} from 'lucide-react';

interface ExamOperationViewProps {
  onBack: () => void;
  onLogout: () => void;
}

// Mock initial warning logs for the rolling dashboard
const INITIAL_WARNINGS = [
  { id: 1, type: 'error', text: 'AI预警：3号考位(张雨豪)未佩戴护目镜！', time: '10:01:23', seat: 3 },
  { id: 2, type: 'warning', text: '提醒：7号考位(刘家玮)滴定管未排除气泡', time: '10:02:11', seat: 7 },
  { id: 3, type: 'warning', text: ' AI判定：9号考位(陈思涵)移液管残留吹出不规范', time: '10:03:02', seat: 9 },
  { id: 4, type: 'error', text: 'AI预警：12号考位(蔡晓龙)试管加热倾斜角度过大', time: '10:04:15', seat: 12 },
  { id: 5, type: 'warning', text: '提醒：1号考位(韩诗雨)天平称量前未称空重归零', time: '10:04:45', seat: 1 },
];

export const ExamOperationView: React.FC<ExamOperationViewProps> = ({ onBack, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'exam' | 'live' | 'playback'>('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'error' | 'info' } | null>(null);

  // Stats / KPIs with Increment Effect
  const [stats, setStats] = useState({
    ongoingExams: 0,
    studentsWaiting: 0,
    passRate: 0,
    aiViolations: 0
  });

  // Animated numbers increment
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        ongoingExams: 6,
        studentsWaiting: 1240,
        passRate: 94.2,
        aiViolations: 28
      });
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Show dynamic toast helper
  const showToast = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // --- Subsystem Layout Stats ---
  // Subsystem-wide global timer (Exam Countdown)
  const [countdown, setCountdown] = useState({ m: 35, s: 42 });
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev.s === 0) {
          if (prev.m === 0) {
            clearInterval(interval);
            return prev;
          }
          return { m: prev.m - 1, s: 59 };
        }
        return { m: prev.m, s: prev.s - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- 1. Dashboard State ---
  const [logs, setLogs] = useState(INITIAL_WARNINGS);
  
  // Rolling dynamic warnings simulator
  useEffect(() => {
    const interval = setInterval(() => {
      const seat = Math.floor(Math.random() * 12) + 1;
      const names = ['韩诗雨', '王强', '张雨豪', '李佳琪', '蔡晓龙', '刘家玮', '陈思涵', '黄子健', '苏珊珊', '徐磊', '陆雯雯', '郭明'];
      const studentName = names[seat - 1];
      const items = [
        { type: 'warning', text: `提醒：${seat}号考位(${studentName})酒精灯熄灭未用灯帽双盖` },
        { type: 'error', text: `AI预警：${seat}号考位(${studentName})废液直接倒入水槽中，请制止` },
        { type: 'warning', text: `提醒：${seat}号考位(${studentName})胶头滴管平放导致液体倒吸` },
        { type: 'error', text: `AI预警：${seat}号考位(${studentName})未紧扣防护服，袖口卷起过高` }
      ];
      const item = items[Math.floor(Math.random() * items.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      const newLog = {
        id: Date.now(),
        type: item.type,
        text: item.text,
        time: timeStr,
        seat
      };
      
      setLogs(prev => [newLog, ...prev.slice(0, 9)]);
      
      // Also occasionally increase the violation counter
      if (item.type === 'error') {
        setStats(prev => ({ ...prev, aiViolations: prev.aiViolations + 1 }));
      }
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // --- 2. Seat / Exam Management State ---
  const [selectedTerm, setSelectedTerm] = useState('2025-2026-2');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentDrawerExam, setCurrentDrawerExam] = useState<any>(null);
  
  // Seating plan grid (24 positions)
  const [assignedSeats, setAssignedSeats] = useState<string[]>(Array(24).fill(''));
  const [seatAnimating, setSeatAnimating] = useState(false);

  // Mock Exam lists
  const EXAM_PLANS = [
    { id: 'ex-101', name: '2026春期中 盐酸浓度测定技能考', course: '化学操作/有机化学', lab: '精细化学实验室 201', seatsCount: 12, supervisor: '李春雷 教授', status: 'ongoing', code: 'CHEM-2026-A' },
    { id: 'ex-102', name: '高分子材料 阿司匹林制备纯化实验', course: '化学操作/有机化学', lab: '高分子化学室 304', seatsCount: 16, supervisor: '张智强 副教授', status: 'ongoing', code: 'CHEM-2026-B' },
    { id: 'ex-103', name: '基础实验 食醋中总酸度分析测试', course: '化学操作/无机化学', lab: '基础实验中心 102', seatsCount: 12, supervisor: '王海滨 讲师', status: 'finished', code: 'CHEM-2026-C' },
    { id: 'ex-104', name: '精细化学 氢氧化钠标准溶液配制', course: '化学操作/分析化学', lab: '精细化学实验室 201', seatsCount: 20, supervisor: '刘建业 教授', status: 'upcoming', code: 'CHEM-2026-D' },
    { id: 'ex-105', name: '无机材料 结晶硫酸铜的制备与提纯', course: '化学操作/无机化学', lab: '基础实验中心 105', seatsCount: 24, supervisor: '赵玲玲 讲师', status: 'upcoming', code: 'CHEM-2026-E' },
  ];

  // Random seat allocation simulation
  const handleRandomSeating = () => {
    setSeatAnimating(true);
    let counter = 0;
    const interval = setInterval(() => {
      // Simulate random blinking labels
      setAssignedSeats(Array(24).fill('0').map(() => {
        const tempNames = ['张伟', '王芳', '李娜', '刘强', '陈杰', '杨洋', '赵敏', '周涛', '吴晨', '徐静', '孙博', '朱慧'];
        return Math.random() > 0.4 ? tempNames[Math.floor(Math.random() * tempNames.length)] : '';
      }));
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        // Final real seats
        const finalStudents = [
          '韩诗雨', '王强', '张雨豪', '李佳琪', '蔡晓龙', '刘家玮', '陈思涵', '黄子健', 
          '苏珊珊', '徐磊', '陆雯雯', '郭明', '钟佳仪', '马成军', '段宏宇', '薛小倩'
        ];
        const finalArray = Array(24).fill('');
        const indices = Array.from({ length: 24 }, (_, i) => i).sort(() => Math.random() - 0.5);
        finalStudents.forEach((student, index) => {
          finalArray[indices[index]] = student;
        });
        setAssignedSeats(finalArray);
        setSeatAnimating(false);
        showToast('物理考位已完成一键随机排座，防作弊冗余考位已锁定。', 'success');
      }
    }, 80);
  };

  // Open drawer for seats
  const openSeatDrawer = (exam: any) => {
    setCurrentDrawerExam(exam);
    // Fill in some mock seat template initially
    const initialNames = [
      '韩诗雨', '王强', '张雨豪', '李佳琪', '蔡晓龙', '刘家玮', '陈思涵', '黄子健',
      '苏珊珊', '徐磊', '陆雯雯', '郭明', '', '', '', '', '', '', '', '', '', '', '', ''
    ];
    setAssignedSeats(initialNames);
    setDrawerOpen(true);
  };

  // --- 3. Live Scoring panel state ---
  const [selectedSeat, setSelectedSeat] = useState<number>(3); // Default seat 3 (Zhang Yuhao, warning state)
  const [scoreList, setScoreList] = useState<Record<number, number>>({
    1: 95, 2: 100, 3: 85, 4: 90, 5: 100, 6: 95, 7: 80, 8: 100, 9: 90, 10: 95, 11: 100, 12: 75
  });

  // Score criteria states (expanded/collapsed)
  const [scoreItems, setScoreItems] = useState([
    {
      id: 'grp-1',
      title: '一、仪器清洗与装配 (20分)',
      items: [
        { id: 'crit-1', text: '未预先清洗试管并风干', points: -5, checked: false },
        { id: 'crit-2', text: '双足铁架台放置不稳固', points: -5, checked: false },
        { id: 'crit-3', text: '酸式滴定管未用标准酸洗涤润洗 2-3 次', points: -10, checked: true, isDefault: true } // Deducted for Zhang Yuhao initially
      ]
    },
    {
      id: 'grp-2',
      title: '二、试剂移取与滴定操作 (40分)',
      items: [
        { id: 'crit-4', text: '倾倒错拿试剂瓶，手心未贴标签面', points: -10, checked: false },
        { id: 'crit-5', text: '读数时视线俯视/仰视未与凹液面平行', points: -10, checked: false },
        { id: 'crit-6', text: '移液管尖嘴残留吹出方式不规范', points: -5, checked: false },
        { id: 'crit-7', text: '往锥形瓶内滴定摇晃方式剧烈导致溅出', points: -15, checked: false }
      ]
    },
    {
      id: 'grp-3',
      title: '三、数据处理与台账清理 (40分)',
      items: [
        { id: 'crit-8', text: '未及时、如实记录第一滴终点读数', points: -20, checked: false },
        { id: 'crit-9', text: '考毕未将废液倒入重金属专项回收桶', points: -10, checked: false },
        { id: 'crit-10', text: '实验完毕台面散落脏器皿、未断电', points: -10, checked: false }
      ]
    }
  ]);

  // Adjust rubrics checked items based on selected seat
  // To keep it simple, we simulate Zhang Yuhao (Seat 3) and let other seats start with fresh checkmarks.
  useEffect(() => {
    if (selectedSeat === 3) {
      // Restore deductions for Zhang Yuhao (Seat 3)
      setScoreItems(prev => prev.map(group => {
        if (group.id === 'grp-1') {
          return {
            ...group,
            items: group.items.map(it => it.id === 'crit-3' ? { ...it, checked: true } : { ...it, checked: false })
          };
        }
        if (group.id === 'grp-2') {
          return {
            ...group,
            items: group.items.map(it => it.id === 'crit-5' ? { ...it, checked: true } : { ...it, checked: false }) // Let's also say he has reading error
          };
        }
        return { ...group, items: group.items.map(it => ({ ...it, checked: false })) };
      }));
    } else if (selectedSeat === 7) {
      // Liu Jiawei deductions
      setScoreItems(prev => prev.map(group => {
        if (group.id === 'grp-2') {
          return {
            ...group,
            items: group.items.map(it => it.id === 'crit-6' ? { ...it, checked: true } : { ...it, checked: false })
          };
        }
        if (group.id === 'grp-3') {
          return {
            ...group,
            items: group.items.map(it => it.id === 'crit-9' ? { ...it, checked: true } : { ...it, checked: false })
          };
        }
        return { ...group, items: group.items.map(it => ({ ...it, checked: false })) };
      }));
    } else {
      // Clear for other seats
      setScoreItems(prev => prev.map(group => ({
        ...group,
        items: group.items.map(it => ({ ...it, checked: false }))
      })));
    }
  }, [selectedSeat]);

  // Handle deduction checklist change
  const handleCriteriaToggle = (groupId: string, criteriaId: string) => {
    let updatedScore = 100;
    
    const nextGroups = scoreItems.map(group => {
      const nextItems = group.items.map(it => {
        if (it.id === criteriaId) {
          const nextVal = !it.checked;
          return { ...it, checked: nextVal };
        }
        return it;
      });
      return { ...group, items: nextItems };
    });

    setScoreItems(nextGroups);

    // Calc total score
    nextGroups.forEach(group => {
      group.items.forEach(it => {
        if (it.checked) {
          updatedScore += it.points; // Points are negative values
        }
      });
    });

    setScoreList(prev => ({
      ...prev,
      [selectedSeat]: Math.max(0, updatedScore)
    }));
  };

  const handleScoreSubmit = () => {
    showToast(`考位 ${selectedSeat}号 (${getStudentOnSeat(selectedSeat).name}) 成绩评定完毕，总分 ${scoreList[selectedSeat]}。评分已自同步至智慧管理核心存储库中！`, 'success');
  };

  // Student positions list (Mock database match for the Live scoring panel)
  const SEAT_STUDENTS_MOCK = [
    { seat: 1, name: '韩诗雨', status: 'ongoing', avatar: '👩‍🔬', class: '应用化学 2401', activeWarn: false },
    { seat: 2, name: '王强', status: 'ongoing', avatar: '👨‍🔬', class: '应用化学 2401', activeWarn: false },
    { seat: 3, name: '张雨豪', status: 'warning', avatar: '👨‍🔬', class: '材料工程 2402', activeWarn: true },
    { seat: 4, name: '李佳琪', status: 'ongoing', avatar: '👩‍🔬', class: '应用化学 2401', activeWarn: false },
    { seat: 5, name: '蔡晓龙', status: 'ongoing', avatar: '👨‍🔬', class: '材料工程 2402', activeWarn: false },
    { seat: 6, name: '刘家玮', status: 'ongoing', avatar: '👨‍🔬', class: '应用化学 2401', activeWarn: false },
    { seat: 7, name: '陈思涵', status: 'warning', avatar: '👩‍🔬', class: '分析应用 2403', activeWarn: true },
    { seat: 8, name: '黄子健', status: 'finished', avatar: '👨‍🔬', class: '应用化学 2401', activeWarn: false },
    { seat: 9, name: '苏珊珊', status: 'ongoing', avatar: '👩‍🔬', class: '应用化学 2401', activeWarn: false },
    { seat: 10, name: '徐磊', status: 'ongoing', avatar: '👨‍🔬', class: '分析应用 2403', activeWarn: false },
    { seat: 11, name: '陆雯雯', status: 'finished', avatar: '👩‍🔬', class: '材料工程 2402', activeWarn: false },
    { seat: 12, name: '郭明', status: 'warning', avatar: '👨‍🔬', class: '应用化学 2401', activeWarn: true },
  ];

  const [liveStudents, setLiveStudents] = useState(SEAT_STUDENTS_MOCK);

  const getStudentOnSeat = (seatId: number) => {
    return liveStudents.find(s => s.seat === seatId) || { seat: seatId, name: '空闲考位', status: 'idle', avatar: '❓', class: '无', activeWarn: false };
  };

  // "模拟 AI 巡考" Interaction: Trigger random seat alarms
  const handleSimulateAI = () => {
    // Pick a random student not currently alerting extensively, let's say Seat 2 or 5 or 10
    const candidates = [2, 5, 9, 10];
    const targetSeat = candidates[Math.floor(Math.random() * candidates.length)];
    const targetStudentName = getStudentOnSeat(targetSeat).name;

    const infractions = [
      { msg: `AI 判定：${targetSeat}号考位 (${targetStudentName}) 滴定操作未佩戴医用防护橡胶手套！`, type: 'error' },
      { msg: `AI 判定：${targetSeat}号考位 (${targetStudentName}) 使用试管对人脸方向倾斜加热，存在喷溅危险！`, type: 'error' },
      { msg: `AI 判定：${targetSeat}号考位 (${targetStudentName}) 调配碳酸钠容易未开启局部负压排风罩！`, type: 'warning' }
    ];

    const pick = infractions[Math.floor(Math.random() * infractions.length)];

    // Turn seat to red / warning State
    setLiveStudents(prev => prev.map(s => {
      if (s.seat === targetSeat) {
        return { ...s, status: 'warning', activeWarn: true };
      }
      return s;
    }));

    // Toast alert
    showToast(`${pick.msg}`, 'error');

    // Add to dashboard logs too
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setLogs(prev => [
      { id: Date.now(), type: pick.type, text: pick.msg, time: timeStr, seat: targetSeat },
      ...prev
    ]);

    // Jump / Focus to this student panel automatically to impress user!
    setSelectedSeat(targetSeat);
  };

  // --- 4. Score Replay and Review Dialog State ---
  const [selectedStudentHistory, setSelectedStudentHistory] = useState<any>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(38); // percentage 0-100
  const [exportLoading, setExportLoading] = useState(false);

  const HISTORIC_RECORDS = [
    { id: 'rec-1', student: '韩诗雨', studentId: '2024011002', examName: '2026春期中 滴定操作及天平技能考', date: '2026-05-18', score: 95, result: '合格(优秀)', timeSpent: '28分15秒', lab: '精细化学201', violations: 0, videoUrl: '#' },
    { id: 'rec-2', student: '陆雯雯', studentId: '2024011311', examName: '2026春期中 滴定操作及天平技能考', date: '2026-05-18', score: 92, result: '合格(优秀)', timeSpent: '30分00秒', lab: '精细化学201', violations: 1, videoUrl: '#' },
    { id: 'rec-3', student: '黄子健', studentId: '2024011008', examName: '2026春期中 滴定操作及天平技能考', date: '2026-05-18', score: 85, result: '合格(良好)', timeSpent: '25分10秒', lab: '精细化学201', violations: 2, videoUrl: '#' },
    { id: 'rec-4', student: '陈茂华', studentId: '2024011019', examName: '食醋中总酸度分析测试考试', date: '2026-05-12', score: 78, result: '合格(中等)', timeSpent: '31分45秒', lab: '基础中心102', violations: 3, videoUrl: '#' },
    { id: 'rec-5', student: '赵天宇', studentId: '2024011382', examName: '食醋中总酸度分析测试考试', date: '2026-05-12', score: 55, result: '不合格', timeSpent: '35分12秒', lab: '基础中心102', violations: 6, videoUrl: '#' },
    { id: 'rec-6', student: '林婉莹', studentId: '2024011831', examName: '强酸弱碱盐及制备纯化考核', date: '2026-04-20', score: 100, result: '合格(满分)', timeSpent: '22分05秒', lab: '高分子化学304', violations: 0, videoUrl: '#' },
    { id: 'rec-7', student: '刘志雄', studentId: '2024011844', examName: '强酸弱碱盐及制备纯化考核', date: '2026-04-20', score: 68, result: '合格(及格)', timeSpent: '34分50秒', lab: '高分子化学304', violations: 4, videoUrl: '#' },
  ];

  // AI violation hot points on the replay progress bar
  const MOCK_VIOLATIONS_MARKED = [
    { p: 15, label: '04:12 - AI判定：天平归零错误', detail: '未锁死旋钮直接放置称量皿扣5分' },
    { p: 45, label: '12:40 - AI预警：倾倒未贴手心原标签', detail: '未注意倒液防漏操作扣10分' },
    { p: 80, label: '22:15 - AI预警：强碱液泼洒污染探头', detail: '扣15分并进行手动干预' },
  ];

  const startReviewPlayback = (record: any) => {
    setSelectedStudentHistory(record);
    setVideoProgress(15);
    setVideoPlaying(false);
  };

  const handleExportPDF = () => {
    setExportLoading(true);
    setTimeout(() => {
      setExportLoading(false);
      showToast('实验实操考卷高清PDF报告及AI多视角打分底单导出成功！', 'success');
    }, 2000);
  };

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden bg-[#F5F7FA] text-slate-800 font-sans">
      
      {/* Dynamic Notifications Banner (Global custom Toast) */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${
              toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
              toast.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
              toast.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' :
              'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            {toast.type === 'error' && <ShieldAlert className="text-rose-600 shrink-0" size={20} />}
            {toast.type === 'warning' && <AlertTriangle className="text-amber-600 shrink-0" size={20} />}
            {toast.type === 'info' && <Info className="text-blue-600 shrink-0" size={20} />}
            {toast.type === 'success' && <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />}
            
            <div className="text-sm font-semibold">{toast.message}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Main College Styled Bar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600 font-medium text-xs"
          >
            <ArrowLeft size={16} />
            <span>返回系统总门户</span>
          </button>
          <div className="h-5 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">高校智慧实验室管理系统</h1>
            <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded font-bold">实验操作考试子系统</span>
          </div>
        </div>

        {/* Global Stats / Countdown widget */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-3 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-lg">
            <Clock className="text-indigo-600" size={16} />
            <span className="text-xs font-bold text-slate-500 font-mono text-[11px] uppercase tracking-wider">进行中场次倒计时:</span>
            <span className="text-sm font-black font-mono text-indigo-700 tracking-wider">
              {String(countdown.m).padStart(2, '0')}:{String(countdown.s).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500 block">李崇名 (考务总监考)</span>
              <span className="text-[10px] text-slate-400 font-mono block">工号: CHEM-T0421</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-slate-200 flex items-center justify-center font-bold text-blue-800">
              李
            </div>
            <button 
              onClick={onLogout}
              title="退出登录"
              className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container - Left sidebar BG is Deep Navy Blue, right is Soft Cold White */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-[#1A2B4A] flex flex-col justify-between p-4 shrink-0 shadow-lg text-slate-300 z-20">
          <div className="space-y-6">
            <div className="p-2 pb-0">
              <div className="text-xs text-blue-400 font-black uppercase tracking-[0.2em] mb-1">Navigation</div>
              <p className="text-[10px] text-slate-400 font-mono">CHEMISTRY REALTIME MODULE</p>
            </div>

            <div className="space-y-1">
              {[
                { id: 'dashboard', label: '考试总览驾驶舱', icon: BarChart3, badge: null },
                { id: 'exam', label: '排考与试卷管理', icon: Calendar, badge: '5' },
                { id: 'live', label: '监考与实时评分', icon: Tv, badge: 'LIVE', isHot: true },
                { id: 'playback', label: '成绩回溯与操作录像', icon: History, badge: null },
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                      isActive 
                        ? 'bg-[#2B6CB0] text-white shadow-lg shadow-[#2B6CB0]/20' 
                        : 'hover:bg-slate-800 hover:text-white text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-widest leading-none ${
                        item.isHot ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-700 text-slate-200'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer branding */}
          <div className="p-3 bg-slate-900/40 rounded-xl space-y-2 border border-slate-800/50">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">AI巡航网关: 在线</span>
            </div>
            <div className="text-[9px] text-slate-500 leading-normal">
              高校智慧实验室综合防作弊及实时无感客观评分引擎 v2.4.1
            </div>
          </div>
        </nav>

        {/* Dynamic Content Frame with Smooth CSS Transitions */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Dashboard Title Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">考试监控驾驶舱</h2>
                    <p className="text-sm text-slate-400 font-medium">全校实时理论、实操、防违规和AI评分聚合分析视图</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSimulateAI}
                      className="bg-[#DD6B20] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#c9601c] shadow transition-colors flex items-center gap-2"
                    >
                      <ShieldAlert size={15} />
                      <span>模拟 AI 巡考 (随机违规)</span>
                    </button>
                    <button 
                      onClick={() => showToast('核心监控指标刷新成功', 'success')}
                      className="bg-white border border-slate-200 p-2 text-slate-500 hover:text-sky-600 rounded-lg shadow-sm transition-colors"
                    >
                      <RefreshCw size={15} />
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Dashboard Row Container */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { title: '今日进行中场次', value: stats.ongoingExams + ' 场', detail: '涉及 3 个主要化学学科实验室', type: 'primary', icon: BarChart3, shadowColor: 'shadow-blue-500/10' },
                    { title: '本周待考人数', value: stats.studentsWaiting.toLocaleString() + ' 人', detail: '已录座位安全间隔 1.2M 比例', type: 'info', icon: UserCheck, shadowColor: 'shadow-indigo-500/10' },
                    { title: '实操一次及格率', value: stats.passRate + ' %', detail: '较上学期操作均分上升 1.15%', type: 'success', icon: Award, shadowColor: 'shadow-emerald-500/10' },
                    { title: 'AI 抓拍违规次数', value: stats.aiViolations + ' 次', detail: '安全防护违规率占比 4.2%', type: 'error', icon: ShieldAlert, shadowColor: 'shadow-rose-500/10' },
                  ].map((metric, i) => {
                    const Icon = metric.icon;
                    return (
                      <motion.div
                        whileHover={{ y: -4 }}
                        key={i}
                        className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-all relative overflow-hidden ${metric.shadowColor}`}
                      >
                        <div className="flex items-center justify-between z-10 relative">
                          <div className="space-y-1">
                            <span className="text-xs text-slate-400 font-bold block">{metric.title}</span>
                            <span className={`text-3xl font-black font-mono tracking-tight ${
                              metric.type === 'error' ? 'text-rose-600' :
                              metric.type === 'success' ? 'text-emerald-600' :
                              metric.type === 'info' ? 'text-indigo-600' : 'text-blue-600'
                            }`}>
                              {metric.value}
                            </span>
                          </div>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            metric.type === 'error' ? 'bg-rose-50 text-rose-500' :
                            metric.type === 'success' ? 'bg-emerald-50 text-emerald-500' :
                            metric.type === 'info' ? 'bg-indigo-50 text-indigo-500' : 'bg-blue-50 text-blue-500'
                          }`}>
                            <Icon size={24} />
                          </div>
                        </div>
                        <div className="h-px bg-slate-50 my-3" />
                        <span className="text-[10px] text-slate-400 block font-medium">{metric.detail}</span>
                        <div className={`absolute bottom-0 left-0 right-0 h-1 ${
                          metric.type === 'error' ? 'bg-rose-500' :
                          metric.type === 'success' ? 'bg-emerald-500' :
                          metric.type === 'info' ? 'bg-indigo-500' : 'bg-blue-500'
                        }`} />
                      </motion.div>
                    );
                  })}
                </div>

                {/* Dashboard Flex Layout: Ongoing Exams & Real-time Warning Scroll Logs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column (2/3 width) - Ongoing Exams */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span>实时监考列表 (进行中)</span>
                      </h3>
                      <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full font-bold">高校实操排期表</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {EXAM_PLANS.filter(ex => ex.status === 'ongoing').map((exam, i) => (
                        <div
                          key={exam.id}
                          className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 hover:border-blue-300 transition-all flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">{exam.code}</span>
                              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase tracking-wider animate-pulse flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> ONGOING
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">{exam.name}</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-1">
                              <div>实验室: <span className="font-semibold text-slate-700">{exam.lab.split(' ')[1]}</span></div>
                              <div>考位数: <span className="font-semibold text-slate-700">{exam.seatsCount}</span></div>
                            </div>
                          </div>

                          <div className="space-y-2 pt-3">
                            <div className="flex items-center justify-between text-[11px] font-bold">
                              <span className="text-slate-400">时间进度</span>
                              <span className="text-blue-600 font-mono">已考 35分钟 / 剩 45分钟</span>
                            </div>
                            {/* Realistic progress bar */}
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: '43.7%' }} />
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-xs text-slate-400">主考官: <strong className="text-slate-600">{exam.supervisor}</strong></span>
                            <button
                              onClick={() => {
                                showToast(`已切入 ${exam.name} 实时AI评分屏`, 'info');
                                setActiveTab('live');
                              }}
                              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors group"
                            >
                              <span>进入监考评分</span>
                              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Simple Welcome and Quick Help Card */}
                    <div className="bg-gradient-to-r from-[#2B6CB0]/5 to-indigo-50 border border-[#2B6CB0]/10 p-5 rounded-2xl flex items-center justify-between gap-6">
                      <div className="space-y-1 max-w-lg">
                        <h4 className="font-bold text-slate-800 text-sm">考位机位异常？使用 AI 巡考快速诊断</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          本系统已全栈升级至高精度 AI 视觉客观判分大模型。摄像头模组支持 4K 面阵扫描与双频红外感应，对违规越界、不戴防护用具、不合规范手法进行即时报警，减少教师纸质评分的偏私与人情。
                        </p>
                      </div>
                      <button
                        onClick={handleSimulateAI}
                        className="bg-white border hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold shrink-0 shadow-sm transition-colors"
                      >
                        模拟一次违规
                      </button>
                    </div>
                  </div>

                  {/* Right Column (1/3 width) - Real-time Logs Feed with Scrolling layout */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 flex flex-col h-[480px]">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm">异常动态播报 (AI实时审计流)</h3>
                      </div>
                      <span className="text-[10px] bg-rose-50 border border-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold font-mono">
                        {logs.filter(l => l.type === 'error').length} BLOCKING
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                      <AnimatePresence>
                        {logs.map((log) => (
                          <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={() => {
                              setSelectedSeat(log.seat);
                              setActiveTab('live');
                              showToast(`已为您对焦并定位该异常的考位：${log.seat}号考位`, 'info');
                            }}
                            className={`p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                              log.type === 'error' 
                                ? 'bg-rose-50/50 border-rose-100 hover:bg-rose-50' 
                                : 'bg-amber-50/40 border-amber-100 hover:bg-amber-50'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                log.type === 'error' ? 'bg-rose-100 text-[#E53E3E]' : 'bg-amber-100 text-[#DD6B20]'
                              }`}>
                                <AlertTriangle size={10} />
                                {log.type === 'error' ? '安全红牌违规' : '操作蓝牌建议'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono leading-none">{log.time}</span>
                            </div>
                            <p className="text-slate-700 font-medium leading-normal line-clamp-2">{log.text}</p>
                            <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                              <span>受试席配额: {log.seat} 号台</span>
                              <span className="text-[#2B6CB0] font-bold flex items-center gap-0.5 hover:underline">
                                <span>打分干预</span> <ChevronRight size={10} />
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    <div className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-lg text-center font-medium">
                      点击播报卡片可快速对焦跳转至对应考位
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* View 2: 排考与试卷管理 (Exam Management) */}
            {activeTab === 'exam' && (
              <motion.div
                key="exam"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Title */}
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">排考与考务配置</h2>
                  <p className="text-sm text-slate-400 font-medium font-normal">管理实操作批、试卷项目关联及物理测温排产排座</p>
                </div>

                {/* Filter and Top Filter Blocks */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center justify-between">
                  {/* Left selects */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">学期</span>
                      <select
                        value={selectedTerm}
                        onChange={(e) => setSelectedTerm(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="2025-2026-2">2025-2026学年 第二学期</option>
                        <option value="2025-2026-1">2025-2026学年 第一学期</option>
                        <option value="2024-2025-2">2024-2025学年 第二学期</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">科目分类</span>
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="all">所有专业/化学实操</option>
                        <option value="无机化学">化学操作/无机化学</option>
                        <option value="有机化学">化学操作/有机化学</option>
                        <option value="分析化学">化学操作/分析化学</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">状态</span>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="all">所有状态</option>
                        <option value="ongoing">进行中 (ONGOING)</option>
                        <option value="upcoming">待考中 (UPCOMING)</option>
                        <option value="finished">已结束 (FINISHED)</option>
                      </select>
                    </div>
                  </div>

                  {/* Search box */}
                  <div className="relative w-64">
                    <input
                      type="text"
                      placeholder="检索操作考批、实验室、考官"
                      className="w-full bg-slate-50 border border-slate-200 pl-8 pr-3 py-2 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                    <Search className="absolute left-2.5 top-2.5 text-slate-400" size={14} />
                  </div>
                </div>

                {/* Exam Table List */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[11px] font-black uppercase tracking-wider">
                        <th className="px-6 py-4">考试批次/代码</th>
                        <th className="px-6 py-4">试卷大纲/关联学科</th>
                        <th className="px-6 py-4">物理实验室</th>
                        <th className="px-6 py-4 text-center">考位容量</th>
                        <th className="px-6 py-4">主考监考</th>
                        <th className="px-6 py-4 text-center">当前状态</th>
                        <th className="px-6 py-4 text-center">考务操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {EXAM_PLANS.filter(ex => 
                        (selectedSubject === 'all' || ex.course.includes(selectedSubject)) &&
                        (selectedStatus === 'all' || ex.status === selectedStatus)
                      ).map((exam) => (
                        <tr 
                          key={exam.id}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-6 py-4 font-medium text-slate-800">
                            <div className="font-bold text-sm text-[#2B6CB0]">{exam.name}</div>
                            <span className="text-[10px] text-slate-400 font-mono">{exam.code}</span>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                            {exam.course}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                            {exam.lab}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-650 font-bold text-center font-mono">
                            {exam.seatsCount} 席
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                            {exam.supervisor}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold ${
                              exam.status === 'ongoing' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                              exam.status === 'upcoming' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                              'bg-slate-100 text-slate-500'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                exam.status === 'ongoing' ? 'bg-emerald-500 animate-pulse' :
                                exam.status === 'upcoming' ? 'bg-blue-500' : 'bg-slate-400'
                              }`} />
                              {exam.status === 'ongoing' ? '进行中' : exam.status === 'upcoming' ? '待考中' : '已归档'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {exam.status === 'finished' ? (
                                <button
                                  onClick={() => {
                                    setActiveTab('playback');
                                    showToast(`已搜索 ${exam.name} 的已结束记录`, 'info');
                                  }}
                                  className="text-slate-500 hover:text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                                >
                                  查看回溯
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => openSeatDrawer(exam)}
                                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                  >
                                    <Sliders size={13} />
                                    <span>考位排座</span>
                                  </button>
                                  {exam.status === 'ongoing' && (
                                    <button
                                      onClick={() => {
                                        setActiveTab('live');
                                        showToast(`已切换至 ${exam.name} 的监看网格`, 'info');
                                      }}
                                      className="bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                      评分
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* View 3: 监考与实时评分面板 (Live Scoring - Core Interactive) */}
            {activeTab === 'live' && (
              <motion.div
                key="live"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Header title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                      <span>实时监考评估面板</span>
                    </h2>
                    <p className="text-sm text-slate-400 font-medium">李明教授 正在主考 / 精细化学实验室 A-201 / 进行中</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSimulateAI}
                      className="bg-[#DD6B20] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#c9601c] shadow-md transition-colors flex items-center gap-2"
                    >
                      <ShieldAlert size={14} />
                      <span>模拟 AI 巡航监视</span>
                    </button>
                    <span className="text-xs bg-[#1A2B4A] text-white font-bold px-3 py-1.5 rounded-lg border border-slate-700 font-mono tracking-widest flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      LIVE MONITORING
                    </span>
                  </div>
                </div>

                {/* Subsystem grid structure */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                  {/* Left grid (col span 7): 12 stations grid */}
                  <div className="xl:col-span-7 space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-2">
                        <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <ListChecks size={16} className="text-[#2B6CB0]" />
                          <span>实验台考位全景布局图 (12席规模)</span>
                        </span>
                        <div className="flex gap-4 text-[10px] font-bold">
                          <span className="flex items-center gap-1 text-emerald-600"><span className="w-2 h-2 bg-emerald-500 rounded-full" /> 进行中</span>
                          <span className="flex items-center gap-1 text-[#DD6B20]"><span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" /> 待复核</span>
                          <span className="flex items-center gap-1 text-slate-400"><span className="w-2 h-2 bg-slate-300 rounded-full" /> 已交卷</span>
                        </div>
                      </div>

                      {/* 3x4 Station Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {liveStudents.map((stud) => {
                          const isSelected = selectedSeat === stud.seat;
                          const seatScore = scoreList[stud.seat];
                          
                          let statusBg = 'border-slate-100 hover:border-blue-200 bg-white';
                          let badgeBg = 'bg-emerald-50 text-emerald-700';
                          let badgeText = '进行中';

                          if (stud.status === 'warning') {
                            statusBg = 'border-[#DD6B20] bg-orange-50/10 hover:bg-orange-50/30';
                            badgeBg = 'bg-amber-100 text-amber-800 animate-pulse';
                            badgeText = 'AI 预警';
                          } else if (stud.status === 'finished') {
                            statusBg = 'border-slate-200 bg-slate-50/50 opacity-70';
                            badgeBg = 'bg-slate-200 text-slate-700';
                            badgeText = '已交卷';
                          }

                          if (isSelected) {
                            statusBg = 'border-[#2B6CB0] ring-2 ring-[#2B6CB0]/20 bg-[#2B6CB0]/5';
                          }

                          return (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              key={stud.seat}
                              onClick={() => setSelectedSeat(stud.seat)}
                              className={`p-4 rounded-xl border-2 shadow-sm text-left flex flex-col justify-between h-40 transition-all ${statusBg}`}
                            >
                              <div className="w-full flex items-center justify-between mb-1">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badgeBg}`}>
                                  {badgeText}
                                </span>
                                <span className="text-xs font-mono font-bold text-slate-400">{String(stud.seat).padStart(2, '0')}号台</span>
                              </div>

                              <div className="space-y-1 my-2">
                                <div className="text-base font-bold text-slate-800 flex items-center gap-1">
                                  <span>{stud.avatar}</span>
                                  <span>{stud.name}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 block font-medium truncate">{stud.class}</span>
                              </div>

                              <div className="w-full pt-1.5 border-t border-dashed border-slate-100 flex items-center justify-between">
                                <span className="text-[10px] text-slate-400 font-bold">估算评分</span>
                                <span className={`text-sm font-black font-mono tracking-tight ${
                                  seatScore < 60 ? 'text-[#E53E3E]' :
                                  seatScore < 85 ? 'text-[#DD6B20]' : 'text-[#38A169]'
                                }`}>
                                  {seatScore} pts
                                </span>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right side single seat details board (col span 5): Rubric checklist and details */}
                  <div className="xl:col-span-5 space-y-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedSeat}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-5"
                      >
                        {/* Student top resume card */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{getStudentOnSeat(selectedSeat).avatar}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-extrabold text-slate-900 text-base">{getStudentOnSeat(selectedSeat).name}</h3>
                                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 font-bold rounded">第 {selectedSeat} 考位</span>
                              </div>
                              <span className="text-[11px] text-slate-400 block font-medium mt-0.5">{getStudentOnSeat(selectedSeat).class}</span>
                            </div>
                          </div>
                          
                          {/* Circle current score gauge */}
                          <div className="text-center bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-black leading-none mb-1">实时成绩</span>
                            <span className={`text-2xl font-black font-mono tracking-tight ${
                              scoreList[selectedSeat] < 60 ? 'text-[#E53E3E]' :
                              scoreList[selectedSeat] < 85 ? 'text-[#DD6B20]' : 'text-[#38A169]'
                            }`}>
                              {scoreList[selectedSeat]}
                            </span>
                          </div>
                        </div>

                        {/* Simulated Live dual feed perspective placeholder */}
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            <Video size={14} className="text-blue-500" />
                            <span>实时双机位监测视角</span>
                          </span>

                          <div className="grid grid-cols-2 gap-3 h-32">
                            {/* Perspective A: Top head view */}
                            <div className="bg-slate-950 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-800">
                              <div className="absolute inset-0 bg-[#2B6CB0]/5 mix-blend-color pointer-events-none" />
                              <div className="absolute top-2 left-2 text-[8px] bg-slate-900/80 text-white font-mono rounded px-1 py-0.5 z-10 flex items-center gap-1 border border-slate-700">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                01-A TOPVIEW 4K
                              </div>
                              
                              {/* Vector wireframe chem lab tube animation */}
                              <svg className="w-14 h-14 opacity-45 text-[#38A169] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                              </svg>

                              {/* Target scanner line */}
                              <div className="absolute inset-y-0 w-px bg-red-500/30 left-1/2 animate-pulse" />
                              <div className="absolute inset-x-0 h-px bg-red-400/30 top-1/2 animate-pulse" />
                            </div>

                            {/* Perspective B: Detail nozzle view */}
                            <div className="bg-slate-950 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-800">
                              <div className="absolute inset-0 bg-amber-500/5 mix-blend-color pointer-events-none" />
                              <div className="absolute top-2 left-2 text-[8px] bg-slate-900/80 text-white font-mono rounded px-1 py-0.5 z-10 flex items-center gap-1 border border-slate-700">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                01-B NOZZLE DETAIL
                              </div>

                              <svg className="w-14 h-14 opacity-35 text-[#DD6B20]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.083.858L12 13.5l-2.317-.912a.75.75 0 11.082-1.338l1.084-.862z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>

                              {/* Alert overlay logic if user is on warning state */}
                              {getStudentOnSeat(selectedSeat).activeWarn && (
                                <div className="absolute inset-0 bg-red-500/20 flex flex-col items-center justify-center animate-pulse border border-red-500">
                                  <AlertTriangle size={24} className="text-red-500 animate-bounce" />
                                  <span className="text-[9px] bg-red-600 text-white px-1 py-0.5 rounded font-black mt-1">AI DETECTED EXCEPTION</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Interactive Deduction items 折叠扣分分量表 */}
                        <div className="space-y-3">
                          <span className="text-xs font-bold text-slate-500 block">实时实操考卷 评分量表扣分核定:</span>
                          
                          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                            {scoreItems.map((group) => (
                              <div key={group.id} className="space-y-1.5">
                                <span className="text-[11px] font-black tracking-wider text-slate-400 block">{group.title}</span>
                                <div className="space-y-1">
                                  {group.items.map((it) => (
                                    <label
                                      key={it.id}
                                      className={`flex items-start justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                                        it.checked 
                                          ? 'bg-rose-50 border-rose-200 text-[#E53E3E] font-medium' 
                                          : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50 text-slate-600'
                                      }`}
                                    >
                                      <div className="flex gap-2">
                                        <input
                                          type="checkbox"
                                          checked={it.checked}
                                          onChange={() => handleCriteriaToggle(group.id, it.id)}
                                          className="mt-0.5 text-rose-600 focus:ring-0 rounded"
                                        />
                                        <span className="leading-snug">{it.text}</span>
                                      </div>
                                      <span className="font-bold font-mono shrink-0 ml-2">{it.points}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Final submit scoring buttons */}
                        <div className="pt-2 border-t border-slate-100 flex gap-2">
                          <button
                            onClick={handleScoreSubmit}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-xs transition-colors shadow-sm"
                          >
                            提交当前考位成绩
                          </button>
                          
                          <button
                            onClick={() => {
                              // Mark as absolute full marks
                              setScoreList(prev => ({ ...prev, [selectedSeat]: 100 }));
                              showToast(`已重置并校准 ${getStudentOnSeat(selectedSeat).name} 的实验评分为原始 100 满分。`, 'info');
                            }}
                            className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition-colors"
                          >
                            恢复满分
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                </div>
              </motion.div>
            )}

            {/* View 4: 成绩回溯与操作录像 (Score & Playback) */}
            {activeTab === 'playback' && (
              <motion.div
                key="playback"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">成绩回溯与操作视频检索</h2>
                    <p className="text-sm text-slate-400 font-medium">查看并审计已结束的考核计划，支持AI标注多维度违规回放</p>
                  </div>
                  <span className="text-xs px-2.5 py-1.5 bg-[#1A2B4A] text-slate-200 font-mono font-bold rounded-lg border border-slate-700">
                    HISTORIC AUDIT RECORD
                  </span>
                </div>

                {/* Filter and Table List */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[11px] font-black uppercase tracking-wider">
                        <th className="px-6 py-4">受试学生/学号</th>
                        <th className="px-6 py-4">关联考核计划</th>
                        <th className="px-6 py-4">检测物理考点</th>
                        <th className="px-6 py-4">实操所用耗时</th>
                        <th className="px-6 py-4 text-center">AI违规预警</th>
                        <th className="px-6 py-4 text-center">评测得分</th>
                        <th className="px-6 py-4 text-center">操作视频追溯</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {HISTORIC_RECORDS.map((record) => (
                        <tr key={record.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-800">
                            <div className="font-bold text-sm text-slate-900">{record.student}</div>
                            <span className="text-[10px] text-slate-400 font-mono">{record.studentId}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-semibold max-w-xs truncate">
                            {record.examName}
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                            {record.lab}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-600 font-mono font-bold">
                            {record.timeSpent}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {record.violations > 0 ? (
                              <span className="inline-flex items-center gap-1 bg-amber-50 text-[#DD6B20] px-2 py-0.5 rounded text-xs font-bold border border-amber-100">
                                <AlertTriangle size={12} />
                                <span>{record.violations} 处标注</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-xs font-bold border border-emerald-100">
                                <CheckCircle2 size={12} />
                                <span>良好合规</span>
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`text-base font-black font-mono tracking-tight ${
                              record.score < 60 ? 'text-[#E53E3E]' :
                              record.score < 85 ? 'text-[#DD6B20]' : 'text-[#38A169]'
                            }`}>
                              {record.score} pts
                            </span>
                            <span className="text-[10px] text-slate-400 block leading-none mt-0.5">{record.result}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => startReviewPlayback(record)}
                              className="bg-blue-50 hover:bg-blue-100 text-[#2B6CB0] text-xs font-extrabold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 mx-auto"
                            >
                              <Video size={13} />
                              <span>回溯录像</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>

      {/* Slide-out Seat Configuration / Seating Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black z-40 cursor-pointer"
            />
            {/* Sidebar drawer body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 right-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{currentDrawerExam?.name || '考排座位划分'}</h3>
                  <span className="text-xs text-slate-400 font-medium block mt-0.5">实验室物理考位图 (防作弊分布网格)</span>
                </div>
                <button 
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 px-2 hover:bg-slate-100 rounded-lg text-slate-400 focus:outline-none"
                >
                  关闭
                </button>
              </div>

              {/* Drawer Body Container */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">排座配置指示:</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    物理配置 1.5 米间距。为保障无感化视觉监控无死角，隔板上方搭载面阵扫描仪。空余机位自动锁定充当冗余安全席。
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleRandomSeating}
                    disabled={seatAnimating}
                    className="flex-1 bg-[#2B6CB0] hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-xl text-xs font-black transition-colors shadow flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={14} className={seatAnimating ? 'animate-spin' : ''} />
                    <span>{seatAnimating ? '正在算法随机排布...' : '一键随机物理排座'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setAssignedSeats(Array(24).fill(''));
                      showToast('座位配置已完全清空，需重新编排座次。', 'info');
                    }}
                    className="px-3 border text-rose-500 hover:bg-rose-50 border-rose-100 hover:border-rose-200.5 rounded-xl font-bold text-xs"
                    title="重置"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* 24 Seat Grid */}
                <div className="grid grid-cols-4 gap-2.5 pt-2">
                  {assignedSeats.map((studName, i) => (
                    <div
                      key={i}
                      className={`h-20 rounded-lg border flex flex-col justify-between p-2 text-left transition-all ${
                        studName 
                          ? 'border-blue-200 bg-blue-50/50' 
                          : 'border-slate-100 bg-slate-50/30'
                      }`}
                    >
                      <div className="flex justify-between text-[8px] font-bold text-slate-400 font-mono">
                        <span>Seat {i + 1}</span>
                      </div>
                      
                      <div className="text-xs font-bold text-slate-800 leading-normal mb-1">
                        {studName || <span className="text-[10px] text-slate-300 font-normal">冗余空位</span>}
                      </div>

                      {studName && (
                        <span className="text-[7px] font-mono shrink-0 bg-blue-100 text-blue-700 px-1 py-0.2 rounded font-black w-max">
                          已核校
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    showToast('全新防作弊物理考位图分派已持久化同步。', 'success');
                  }}
                  className="flex-1 bg-[#1A2B4A] hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-black transition-colors"
                >
                  保存排座并下发
                </button>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-500 rounded-xl text-xs font-bold transition-colors"
                >
                  取消
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Exquisite Review Wide Modal (Score & Playback Detail Component) */}
      <AnimatePresence>
        {selectedStudentHistory && (
          <>
            {/* Backdrop遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudentHistory(null)}
              className="fixed inset-0 bg-slate-950/80 z-40 cursor-pointer backdrop-blur-xs"
            />
            {/* Wide popup container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-x-6 top-10 bottom-10 md:inset-x-20 md:top-14 md:bottom-14 bg-white/95 border border-slate-200 rounded-3xl z-50 flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Modal Banner */}
              <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 text-base font-bold">
                    {selectedStudentHistory.student[0]}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#1A2B4A] text-base leading-snug">
                      实操录像深度回溯: <strong className="text-blue-600">{selectedStudentHistory.student}</strong>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      学号: {selectedStudentHistory.studentId} | 关联大纲: {selectedStudentHistory.examName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportPDF}
                    disabled={exportLoading}
                    className="bg-[#2B6CB0] hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    {exportLoading ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download size={14} />
                    )}
                    <span>{exportLoading ? '系统编译中...' : '导出 PDF 评估白皮书'}</span>
                  </button>
                  <button
                    onClick={() => setSelectedStudentHistory(null)}
                    className="p-2 border border-slate-200 hover:bg-slate-100 text-slate-400 rounded-lg hover:text-slate-800 transition-colors"
                  >
                    X
                  </button>
                </div>
              </div>

              {/* Modal Contents Body (Split into Left Screen and Right deductions list) */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                
                {/* Left (Video player element) */}
                <div className="flex-1 bg-slate-900 flex flex-col justify-between p-4 relative text-white">
                  
                  {/* Aspect Ratio simulation */}
                  <div className="flex-1 rounded-xl bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden group">
                    
                    {/* Retro cam grid crosshair */}
                    <div className="absolute inset-0 border border-slate-800 pointer-events-none" />
                    <div className="absolute top-4 left-4 text-xs font-mono font-bold uppercase tracking-widest bg-slate-900/80 px-2.5 py-1 rounded flex items-center gap-2 border border-slate-700 text-slate-200 select-none">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      REC DECK [CH-201] DUAL-CAM FEED
                    </div>

                    <div className="absolute top-4 right-4 text-xs font-mono font-bold text-slate-400 bg-slate-950/90 px-2 py-0.5 rounded">
                      TIME SLICED: 00:24:{Math.floor(videoProgress * 0.35).toString().padStart(2, '0')}
                    </div>

                    {/* Simulation vector beaker display */}
                    <div className="text-center space-y-3 z-10">
                      <div className="relative inline-block">
                        <svg className="w-24 h-24 mx-auto text-sky-500 hover:scale-105 transition-transform cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        
                        {/* Overlay scan tag */}
                        <div className="absolute -top-2 -right-4 bg-rose-600 text-[8px] font-black px-1.5 py-0.5 rounded-lg select-none">
                          ERROR SCANNED (12:40)
                        </div>
                      </div>

                      <p className="text-sm font-semibold text-slate-300">
                        {videoPlaying ? '🎓 考试实操录制正在进行流式转码回放...' : '⏸ 多焦视频回溯在特定 AI 打点处就绪'}
                      </p>
                      
                      <button 
                        onClick={() => setVideoPlaying(!videoPlaying)}
                        className="bg-sky-600 hover:bg-sky-500 text-white mx-auto/important w-12 h-12 rounded-full flex items-center justify-center shadow transition-transform hover:scale-110 active:scale-95 text-center mt-2"
                      >
                        {videoPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
                      </button>
                    </div>

                    {/* Vector scanning grids overlay */}
                    <div className="absolute inset-x-8 top-12 bottom-12 border border-dashed border-sky-500/10 pointer-events-none flex items-center justify-center">
                      <div className="w-32 h-32 border border-sky-500/20 rounded-full animate-ping duration-10000" />
                    </div>

                    {/* Interactive Infractions marked on slider directly */}
                    <div className="absolute bottom-4 left-6 right-6">
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">AI 视觉判定违规切片事件锚点 (可点击进度快速跳过)</span>
                      
                      {/* Timeline bar with dots */}
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono font-bold text-slate-400">00:00</span>
                        
                        <div className="flex-1 relative h-6 flex items-center">
                          {/* Main progress input bar */}
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={videoProgress}
                            onChange={(e) => setVideoProgress(Number(e.target.value))}
                            className="w-full appearance-none bg-slate-700 h-1.5 rounded-lg overflow-hidden outline-none cursor-pointer"
                          />
                          
                          {/* Static overlay red keyframe indicators */}
                          {MOCK_VIOLATIONS_MARKED.map((point, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setVideoProgress(point.p);
                                showToast(`已快速跳转。${point.label}: ${point.detail}`, 'warning');
                              }}
                              className="absolute w-3 h-3 rounded-full bg-rose-500 border-2 border-white hover:scale-130 transition-transform cursor-pointer"
                              style={{ left: `${point.p}%` }}
                              title={`${point.label}: ${point.detail}`}
                            />
                          ))}
                        </div>

                        <span className="text-[10px] font-mono font-bold text-slate-400">30:00</span>
                      </div>
                    </div>

                  </div>

                  {/* Playback Controls and speed rate metrics */}
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setVideoPlaying(!videoPlaying)} 
                        className="hover:text-white transition-colors"
                      >
                        {videoPlaying ? '暂停' : '播放'}
                      </button>
                      <span>速度: <strong className="text-white">1.0x (智能降噪流)</strong></span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Volume2 size={15} />
                      <Maximize2 size={14} className="cursor-pointer hover:text-white" />
                    </div>
                  </div>

                </div>

                {/* Right (rubrics audit history receipt logs) */}
                <div className="w-full md:w-80 bg-slate-50 border-l border-slate-100 p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-[#1A2B4A] text-xs uppercase tracking-widest pb-2 border-b border-slate-200">
                      AI & 监考联合评分核准书
                    </h3>

                    {/* Key scores cards summary */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-bold">最终评定成绩</span>
                        <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 font-black rounded font-mono">
                          {selectedStudentHistory.result}
                        </span>
                      </div>
                      
                      <div className="text-3xl font-black font-mono tracking-tight text-blue-800">
                        {selectedStudentHistory.score} <span className="text-xs text-slate-400 font-semibold font-sans">分 / 百分制</span>
                      </div>

                      <div className="h-px bg-slate-50 my-1" />
                      <span className="text-[10px] text-slate-400 font-semibold block leading-snug">
                        AI 智能初筛判定扣减分数: <strong className="text-rose-600">-15pt</strong>
                        <br />
                        监考专家核准调整分值: <strong className="text-slate-600 font-semibold">+-0pt</strong>
                      </span>
                    </div>

                    {/* Deductions Items */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">扣分细目台账</span>
                      
                      <div className="space-y-1.5">
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm text-xs space-y-1">
                          <div className="flex justify-between font-bold text-[#E53E3E]">
                            <span>1. 强碱移液滴定终点偏差</span>
                            <span>-10分</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-normal">
                            AI 监控发现酸液终点呈微红持续不到 30s 即停止读数，滴定不够彻底过早结束
                          </p>
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm text-xs space-y-1">
                          <div className="flex justify-between font-bold text-amber-605 text-amber-700">
                            <span>2. 局部清洁和残留废酸倾倒</span>
                            <span>-5分</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-normal">
                            未进行冷自来水第三次冲洗即倒入架台，扣减过程仪节分值
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200 text-center space-y-1.5 select-none">
                    <span className="text-[10px] text-slate-400 font-black block leading-none uppercase">高校联合签核</span>
                    <p className="text-[9px] text-slate-400 leading-normal font-medium">
                      本成绩已通过多机位 AI 算法校核与考监老师李崇名双向多维确认，记录已上链并同步高教部系统。
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
