import React, { useState, useEffect, useMemo } from 'react';
import { 
  Video, ShieldAlert, CheckCircle2, Clock, ClipboardList, BarChart3, Sliders, 
  ChevronRight, Calendar, Award, Check, Settings, AlertTriangle, ArrowLeft,
  X, MessageSquare, Star, Grid, List, Download, User, MapPin, Activity, Bell, Sun, Moon, Info, Eye
} from 'lucide-react';
import { useTheme } from '../components/ThemeContext';

// Define Types
interface Classroom {
  id: string;
  courseName: string;
  teacher: string;
  room: string;
  elapsedTime: number; // in mins
  studentsCount: number;
  status: '进行中' | '课间' | '已结束';
  college: string;
  building: string;
}

interface InspectionTask {
  id: string;
  status: '待巡课' | '已完成' | '已取消';
  courseName: string;
  teacher: string;
  room: string;
  scheduledTime: string;
  mode: '远程在线' | '现场';
  record?: {
    scores: Record<string, number>;
    comment: string;
  };
}

interface EvaluationRecord {
  id: string;
  courseName: string;
  teacherName: string;
  time: string;
  mode: string;
  score: number;
  ratings: Record<string, number>; // 6 dimensions
  comment: string;
}

const EvaluationRecordCard: React.FC<{
  item: EvaluationRecord;
  borderHexColor: string;
  cardBgColor: string;
  textMutedColor: string;
  setViewingRecord: (item: EvaluationRecord) => void;
}> = ({ item, borderHexColor, cardBgColor, textMutedColor, setViewingRecord }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`rounded-2xl border ${borderHexColor} ${cardBgColor} p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}
    >
      <div>
        {/* Heading row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h4 className="font-bold text-sm leading-snug">{item.courseName}</h4>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              被巡教师: <span className="text-[#01696f] font-bold">{item.teacherName}</span> · {item.time} ({item.mode})
            </p>
          </div>

          {/* Scoring label */}
          <div className="flex flex-col items-end">
            <span className={`text-lg font-black leading-none font-mono ${
              item.score >= 90 ? 'text-[#437a22]' :
              item.score >= 80 ? 'text-[#01696f]' :
              item.score >= 60 ? 'text-[#da7101]' : 'text-red-500'
            }`}>
              {item.score} <span className="text-[10px] font-bold">分</span>
            </span>
            <span className="text-[9px] font-semibold text-slate-500 mt-1 select-none bg-slate-100 dark:bg-slate-800 px-1 rounded">
              {item.score >= 90 ? '优秀' : item.score >= 80 ? '良好' : item.score >= 60 ? '合格' : '整改'}
            </span>
          </div>
        </div>

        {/* Progress bar metrics indicator */}
        <div className="space-y-2 mb-4 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-[#272624]">
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium mb-1">
            <span>督导打分六维度量表(权重等效)</span>
            <span>全维度雷达拟合值</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-[#01696f] h-full rounded-full transition-all"
              style={{ width: `${item.score}%` }}
            />
          </div>
          
          {/* Hexagon approximation inline using pure CSS blocks */}
          <div className="grid grid-cols-3 gap-y-2 gap-x-1.5 mt-2.5 pt-1 text-[10px] font-mono text-slate-400">
           {(Object.entries(item.ratings) as Array<[string, number]>).map(([dim, val]) => (
              <div key={dim} className="flex flex-col border-r last:border-r-0 border-slate-200 dark:border-slate-800 pr-1 truncate">
                <span className="text-slate-500 scale-95 origin-left truncate">{dim}</span>
                <span className="font-bold text-slate-300">{'★'.repeat(val)}{'☆'.repeat(5 - val)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Comments text block */}
        <p className="text-xs text-[#8a857b] font-sans leading-relaxed">
          <span className="font-bold text-slate-400">督导评语：</span>
          {isExpanded ? item.comment : `${item.comment.slice(0, 42)}...`}
          {item.comment.length > 42 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#01696f] hover:underline hover:text-teal-700 ml-1.5 inline font-bold focus:outline-none"
            >
              {isExpanded ? '收起意见' : '展开全文'}
            </button>
          )}
        </p>
      </div>

      {/* Bottom look info */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#2c2b29] flex items-center justify-end">
        <button 
          onClick={() => setViewingRecord(item)}
          className="text-xs text-[#01696f] font-bold hover:underline py-1 px-2.5 bg-[#01696f]/10 rounded-lg hover:bg-[#01696f]/15"
        >
          查看完整视导报告 ➔
        </button>
      </div>
    </div>
  );
};

export const RemoteClassInspectionView: React.FC<{
  id: string;
  name: string;
  onBack: () => void;
  onLogout: () => void;
}> = ({ id, name, onBack, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  
  // States
  const [activeTab, setActiveTab] = useState<'current' | 'tasks' | 'records' | 'stats' | 'settings'>('current');
  const [role, setRole] = useState<'supervisor' | 'leader'>('supervisor'); // supervisor (督导), leader (领导)
  const [currentTime, setCurrentTime] = useState<string>('');
  const [viewType, setViewType] = useState<'grid3x3' | 'grid2x2' | 'list'>('grid3x3');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Filter States
  const [collegeFilter, setCollegeFilter] = useState<string>('all');
  const [buildingFilter, setBuildingFilter] = useState<string>('all');
  const [teacherSearch, setTeacherSearch] = useState<string>('');

  // Modals & Sliders
  const [inspectingClass, setInspectingClass] = useState<Classroom | null>(null);
  const [anomalyClass, setAnomalyClass] = useState<Classroom | null>(null);
  const [viewingRecord, setViewingRecord] = useState<EvaluationRecord | null>(null);
  const [selectedTaskRecord, setSelectedTaskRecord] = useState<InspectionTask | null>(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  // Camera angles inside inspection
  const [cameraAngles, setCameraAngles] = useState<string[]>(['讲台视角', '学生前视', '学生后视', '黑板特写']);
  const [activeCameraIdx, setActiveCameraIdx] = useState<number>(0);

  // Detail Right Panel Tabs
  const [detailTab, setDetailTab] = useState<'records' | 'ratings' | 'info'>('records');
  const [detailNotes, setDetailNotes] = useState<string>('');
  const [liveNotes, setLiveNotes] = useState<Array<{ id: string; time: string; text: string }>>([
    { id: '1', time: '14:15:20', text: '教师精神饱满，实验演示细致。' },
    { id: '2', time: '14:28:45', text: '学生按小组进行仪器校准，课堂纪律良好。' },
    { id: '3', time: '14:40:12', text: '开展现场提问互动，学生反应积极。' }
  ]);

  // Scoring in Detail Tab
  const [scoring, setScoring] = useState<Record<string, number>>({
    '教学内容': 5,
    '教学方法': 4,
    '教学态度': 5,
    '课堂秩序': 4,
    '教学效果': 4,
    '实验规范': 5
  });
  const [scoringComment, setScoringComment] = useState<string>('');
  const [scoreSubmitted, setScoreSubmitted] = useState<boolean>(false);

  // Anomaly Modal Form
  const [anomalyTypes, setAnomalyTypes] = useState<string[]>([]);
  const [anomalyNote, setAnomalyNote] = useState<string>('');

  // Create Task Form
  const [newTaskCourse, setNewTaskCourse] = useState('有机化学实验');
  const [newTaskTime, setNewTaskTime] = useState('2026-05-21T09:00');
  const [newTaskMode, setNewTaskMode] = useState<'远程在线' | '现场'>('远程在线');
  const [newTaskNote, setNewTaskNote] = useState('');

  // Mock Databases
  const [classrooms, setClassrooms] = useState<Classroom[]>([
    { id: '1', courseName: '有机化学实验', teacher: '李明', room: 'B302', elapsedTime: 35, studentsCount: 28, status: '进行中', college: '化学工程学院', building: '实验教学楼B区' },
    { id: '2', courseName: '分析化学实验', teacher: '张红', room: 'B305', elapsedTime: 50, studentsCount: 24, status: '进行中', college: '化学工程学院', building: '实验教学楼B区' },
    { id: '3', courseName: '生物工程实验', teacher: '周杰', room: 'A104', elapsedTime: 20, studentsCount: 32, status: '进行中', college: '生命科学与技术学院', building: '实验教学楼A区' },
    { id: '4', courseName: '食品安全检测', teacher: '刘洋', room: 'A201', elapsedTime: 42, studentsCount: 30, status: '进行中', college: '生命科学与技术学院', building: '实验教学楼A区' },
    { id: '5', courseName: '仪器分析实验', teacher: '宋文', room: 'B108', elapsedTime: 65, studentsCount: 26, status: '进行中', college: '化学工程学院', building: '实验教学楼B区' },
    { id: '6', courseName: '微生物学实验', teacher: '陈丽', room: 'A109', elapsedTime: 15, studentsCount: 35, status: '进行中', college: '生命科学与技术学院', building: '实验教学楼A区' },
    { id: '7', courseName: '高分子实验', teacher: '徐伟', room: 'B402', elapsedTime: 55, studentsCount: 22, status: '课间', college: '化学工程学院', building: '实验教学楼B区' },
    { id: '8', courseName: '植物生理实验', teacher: '林枫', room: 'C201', elapsedTime: 80, studentsCount: 20, status: '已结束', college: '生命科学与技术学院', building: '实验教学楼C区' },
    { id: '9', courseName: '材料表征实验', teacher: '戴明', room: 'C104', elapsedTime: 40, studentsCount: 27, status: '进行中', college: '材料科学学院', building: '实验教学楼C区' },
    { id: '10', courseName: '工程力学实验', teacher: '赵强', room: 'C302', elapsedTime: 48, studentsCount: 29, status: '进行中', college: '材料科学学院', building: '实验教学楼C区' },
    { id: '11', courseName: '电子技术实验', teacher: '王雷', room: 'D102', elapsedTime: 72, studentsCount: 31, status: '进行中', college: '物理与电子学院', building: '实验教学楼D区' },
    { id: '12', courseName: '数字逻辑实验', teacher: '孙霞', room: 'D204', elapsedTime: 12, studentsCount: 28, status: '进行中', college: '物理与电子学院', building: '实验教学楼D区' }
  ]);

  const [tasks, setTasks] = useState<InspectionTask[]>([
    { id: 't1', status: '待巡课', courseName: '有机化学实验', teacher: '李明', room: 'B302', scheduledTime: '2026-05-20 09:00', mode: '远程在线' },
    { id: 't2', status: '待巡课', courseName: '生物工程实验', teacher: '周杰', room: 'A104', scheduledTime: '2026-05-20 14:00', mode: '远程在线' },
    { id: 't3', status: '已完成', courseName: '分析化学实验', teacher: '张红', room: 'B305', scheduledTime: '2026-05-19 10:00', mode: '远程在线', record: { scores: { '教学内容': 5, '教学方法': 5, '教学态度': 4, '课堂秩序': 4, '教学效果': 5, '实验规范': 5 }, comment: '张老师准备极其充分，实验讲解有条理，互动亲切。' } },
    { id: 't4', status: '已完成', courseName: '食品安全检测', teacher: '刘洋', room: 'A201', scheduledTime: '2026-05-18 15:30', mode: '现场', record: { scores: { '教学内容': 4, '教学方法': 4, '教学态度': 4, '课堂秩序': 5, '教学效果': 4, '实验规范': 4 }, comment: '现场纪律优秀，学生操作非常规范。' } },
    { id: 't5', status: '已完成', courseName: '微生物学实验', teacher: '陈丽', room: 'A109', scheduledTime: '2026-05-17 09:30', mode: '远程在线', record: { scores: { '教学内容': 5, '教学方法': 3, '教学态度': 4, '课堂秩序': 4, '教学效果': 4, '实验规范': 4 }, comment: '微生物接种讲解规范，学生实操有序。' } },
    { id: 't6', status: '待巡课', courseName: '电子技术实验', teacher: '王雷', room: 'D102', scheduledTime: '2026-05-21 14:30', mode: '现场' },
    { id: 't7', status: '已取消', courseName: '植物生理实验', teacher: '林枫', room: 'C201', scheduledTime: '2026-05-16 14:00', mode: '远程在线' },
    { id: 't8', status: '已完成', courseName: '高分子实验', teacher: '徐伟', room: 'B402', scheduledTime: '2026-05-15 10:30', mode: '远程在线', record: { scores: { '教学内容': 4, '教学方法': 4, '教学态度': 5, '课堂秩序': 4, '教学效果': 4, '实验规范': 5 }, comment: '教师对高分子聚合反应阐述清晰，课堂安全措施到位。' } }
  ]);

  const [evaluationRecords, setEvaluationRecords] = useState<EvaluationRecord[]>([
    { id: 'r1', courseName: '化学工程设计专题', teacherName: '李教授', time: '2026-05-19 14:30', mode: '远程在线', score: 94, ratings: { '教学内容': 5, '教学方法': 5, '教学态度': 5, '课堂秩序': 4, '教学效果': 5, '实验规范': 4 }, comment: '老教授讲课极其透彻。结合实际工业流程娓娓道来，课堂生动有趣。' },
    { id: 'r2', courseName: '无机材料工程实验', teacherName: '赵副教授', time: '2026-05-18 09:00', mode: '现场厅课', score: 88, ratings: { '教学内容': 4, '教学方法': 4, '教学态度': 5, '课堂秩序': 4, '教学效果': 4, '实验规范': 5 }, comment: '教学态度严谨，实验指导十分到位，实验室安全和卫生状况一流。' },
    { id: 'r3', courseName: '生物化学大实验', teacherName: '林老师', time: '2026-05-15 15:40', mode: '远程在线', score: 79, ratings: { '教学内容': 4, '教学方法': 3, '教学态度': 4, '课堂秩序': 3, '教学效果': 4, '实验规范': 4 }, comment: '教师演示认真，但学生自主讨论时气氛稍微有些嘈杂，需要加强秩序引导。' },
    { id: 'r4', courseName: '数据通信实验', teacherName: '张副教授', time: '2026-05-14 10:00', mode: '远程在线', score: 85, ratings: { '教学内容': 4, '教学方法': 4, '教学态度': 4, '课堂秩序': 4, '教学效果': 4, '实验规范': 5 }, comment: '数字演示手段非常新颖，能激发同学的研究动机。' },
    { id: 'r5', courseName: '精细化工系统实验', teacherName: '孙老师', time: '2026-05-13 14:15', mode: '现场听课', score: 91, ratings: { '教学内容': 5, '教学方法': 4, '教学态度': 5, '课堂秩序': 5, '教学效果': 4, '实验规范': 4 }, comment: '学生按部就班开展合成，讲理清晰，启发式反问优秀。' },
    { id: 'r6', courseName: '基因表达调控实验', teacherName: '余教授', time: '2026-05-12 09:30', mode: '远程在线', score: 96, ratings: { '教学内容': 5, '教学方法': 5, '教学态度': 5, '课堂秩序': 5, '教学效果': 5, '实验规范': 5 }, comment: '无可挑剔的模范示范课，实验操作手法非常规范流利，学生获益匪浅。' },
    { id: 'r7', courseName: '热质力学性能测定', teacherName: '钱老师', time: '2026-05-11 11:00', mode: '远程在线', score: 72, ratings: { '教学内容': 3, '教学方法': 3, '教学态度': 4, '课堂秩序': 3, '教学效果': 3, '实验规范': 4 }, comment: '教师稍微有些刻板地按照PPT宣读，后续应优化教学案例引入及探究性交互。' },
    { id: 'r8', courseName: '植物标本制备实验', teacherName: '王老师', time: '2026-05-10 14:00', mode: '远程在线', score: 86, ratings: { '教学内容': 4, '教学方法': 4, '教学态度': 4, '课堂秩序': 5, '教学效果': 4, '实验规范': 4 }, comment: '实物摄影头投影操作示范效果绝佳，同学们模仿制作效率很高。' },
    { id: 'r9', courseName: '单片机接口编程', teacherName: '刘讲师', time: '2026-05-08 10:30', mode: '远程在线', score: 82, ratings: { '教学内容': 4, '教学方法': 4, '教学态度': 4, '课堂秩序': 4, '教学效果': 4, '实验规范': 4 }, comment: '代码讲解十分细心，对于遇到Bug崩溃的组别逐一耐心排除。' },
    { id: 'r10', courseName: '电路板焊接焊接课', teacherName: '郭老师', time: '2026-05-07 15:00', mode: '现场听课', score: 68, ratings: { '教学内容': 3, '教学方法': 3, '教学态度': 4, '课堂秩序': 3, '教学效果': 3, '实验规范': 3 }, comment: '部分学生没有佩戴防护眼罩，教师在巡回督导时未能及时制止异常操作，需整改。' }
  ]);

  // Setting Defaults
  const [minInspecCount, setMinInspecCount] = useState<number>(4);
  const [allowDup, setAllowDup] = useState<boolean>(true);
  const [remindTime, setRemindTime] = useState<string>('1小时');
  const [weights, setWeights] = useState<Record<string, number>>({
    '教学内容': 20,
    '教学方法': 15,
    '教学态度': 15,
    '课堂秩序': 15,
    '教学效果': 20,
    '实验规范': 15
  });
  const [channels, setChannels] = useState<{ web: boolean; sms: boolean; workWechat: boolean }>({
    web: true,
    sms: false,
    workWechat: true
  });
  const [receivers, setReceivers] = useState<{ teacher: boolean; dean: boolean }>({
    teacher: true,
    dean: true
  });

  // KPI Targets for Animated Counters
  const [kpiCounts, setKpiCounts] = useState({ count: 0, distinctTeachers: 0, avgS: 0, excelRatio: 0 });

  useEffect(() => {
    // Current Local time updater
    const updateTime = () => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      setCurrentTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Trigger KPI Counting animation
  useEffect(() => {
    if (activeTab === 'stats') {
      setKpiCounts({ count: 0, distinctTeachers: 0, avgS: 0, excelRatio: 0 });
      const timer = setTimeout(() => {
        setKpiCounts({ count: 48, distinctTeachers: 32, avgS: 86.4, excelRatio: 34 });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // Helpers
  const triggerToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const filteredClassrooms = useMemo(() => {
    return classrooms.filter(item => {
      const matchCol = collegeFilter === 'all' || item.college === collegeFilter;
      const matchBuild = buildingFilter === 'all' || item.building === buildingFilter;
      const matchTeach = teacherSearch.trim() === '' || item.teacher.includes(teacherSearch) || item.courseName.includes(teacherSearch);
      return matchCol && matchBuild && matchTeach;
    });
  }, [classrooms, collegeFilter, buildingFilter, teacherSearch]);

  const ratingAvgAll = {
    '教学内容': 88,
    '教学方法': 85,
    '教学态度': 91,
    '课堂秩序': 82,
    '教学效果': 84,
    '实验规范': 79
  };

  const currentOnLiveCount = classrooms.filter(c => c.status === '进行中').length;

  // Add notes logs inside inspecting detail
  const handleAddLiveNote = () => {
    if (!detailNotes.trim()) return;
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    setLiveNotes(prev => [
      { id: Date.now().toString(), time: timeStr, text: detailNotes.trim() },
      ...prev
    ]);
    setDetailNotes('');
    triggerToast('追加巡课观察记录成功', 'success');
  };

  // Submit Score Form
  const handleSubmitScoringForm = () => {
    if (role === 'leader') {
      triggerToast('您当前是只读角色（领导），无法提交评分', 'error');
      return;
    }
    if (!scoringComment.trim()) {
      triggerToast('请输入评分综合评价（必填）', 'error');
      return;
    }
    setScoreSubmitted(true);
    triggerToast('在线巡课评分表提交成功！', 'success');
    
    // Save into evaluationRecords (Mock)
    const overallScore = Math.round(
      (Object.entries(scoring) as Array<[string, number]>).reduce((acc: number, [k, v]) => {
        const weight = (weights[k] || 0) as number;
        return acc + v * 20 * (weight / 100);
      }, 0)
    );
    const newRec: EvaluationRecord = {
      id: 'r' + (evaluationRecords.length + 1),
      courseName: inspectingClass?.courseName || '巡课记录',
      teacherName: inspectingClass?.teacher || '未知',
      time: '2026-05-20 08:45',
      mode: '远程在线',
      score: overallScore,
      ratings: { ...scoring },
      comment: scoringComment
    };
    setEvaluationRecords(prev => [newRec, ...prev]);

    // Also mark associated task as '已完成' if any
    if (inspectingClass) {
      setTasks(prev => prev.map(t => {
        if (t.courseName === inspectingClass.courseName && t.teacher === inspectingClass.teacher && t.status === '待巡课') {
          return { ...t, status: '已完成' };
        }
        return t;
      }));
    }
  };

  // Submit Anomaly
  const handleSubmitAnomaly = () => {
    if (role === 'leader') {
      triggerToast('您当前是只读角色（领导），无法登记异常', 'error');
      return;
    }
    if (anomalyTypes.length === 0) {
      triggerToast('请至少选择一个异常类型', 'error');
      return;
    }
    triggerToast(`成功登记一笔异常事件：${anomalyTypes.join(', ')}。已推送通知督导组！`, 'success');
    setAnomalyClass(null);
    setAnomalyTypes([]);
    setAnomalyNote('');
  };

  // Create Task Submission
  const handleCreateTask = () => {
    if (role === 'leader') {
      triggerToast('您当前是只读角色（领导），无法新建任务', 'error');
      return;
    }
    const targetCourse = newTaskCourse;
    const matchClass = classrooms.find(c => c.courseName === targetCourse);
    const mockT: InspectionTask = {
      id: 't' + (tasks.length + 1),
      status: '待巡课',
      courseName: targetCourse,
      teacher: matchClass ? matchClass.teacher : '校内教师',
      room: matchClass ? matchClass.room : '未分配',
      scheduledTime: newTaskTime.replace('T', ' '),
      mode: newTaskMode
    };
    setTasks(prev => [mockT, ...prev]);
    setIsCreateTaskOpen(false);
    triggerToast(`新建巡课任务成功：${targetCourse}`, 'success');
    setNewTaskNote('');
  };

  // Theme support
  const bgMainColor = theme === 'light' ? 'bg-[#f5f4ef]' : 'bg-[#121110]';
  const cardBgColor = theme === 'light' ? 'bg-[#fcfbf9]' : 'bg-[#1c1b19]';
  const textPrimaryColor = theme === 'light' ? 'text-[#1a1a1a]' : 'text-[#eae9e6]';
  const textMutedColor = theme === 'light' ? 'text-[#6e6a64]' : 'text-[#a29e97]';
  const borderHexColor = theme === 'light' ? 'border-[#e5e2da]' : 'border-[#2d2c29]';

  // Weights Checker
  const weightsSum = (Object.values(weights) as number[]).reduce((a: number, b: number) => a + b, 0);

  return (
    <div className={`flex flex-col flex-1 h-full min-h-screen overflow-hidden ${bgMainColor} ${textPrimaryColor} transition-colors duration-300 font-sans`}>
      {/* Toast notifications */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#01696f] text-white rounded-xl shadow-2xl border border-[#028b93] animate-[slideIn_0.2s_ease-out]">
          <Info size={18} />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Main full panel frame */}
      <div className="flex flex-1 h-full overflow-hidden">
        
        {/* Left Sidebar Menu */}
        <aside className="w-[220px] bg-[#0d141e] text-slate-300 flex flex-col justify-between border-r border-[#1e2a39] flex-shrink-0">
          <div className="flex flex-col">
            {/* Title Identity */}
            <div className="p-5 flex items-center gap-3 border-b border-[#1e2a39]">
              <div className="w-9 h-9 bg-[#01696f] rounded-xl flex items-center justify-center text-white font-bold ring-2 ring-[#028b93]/35">
                <Video size={18} />
              </div>
              <div>
                <h1 className="text-sm font-black text-white leading-none">在线课堂巡检</h1>
                <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Remote Patrol</span>
              </div>
            </div>

            {/* Role switch in system */}
            <div className="p-4 mx-2 mt-3 bg-[#131d2b] rounded-xl flex items-center justify-between border border-[#1e2e42]">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400">当前操作人员</span>
                <span className="text-xs font-bold text-slate-200">
                  {role === 'supervisor' ? '督导专家' : '院系领导'}
                </span>
              </div>
              <button 
                onClick={() => {
                  const to = role === 'supervisor' ? 'leader' : 'supervisor';
                  setRole(to);
                  triggerToast(`已切换身份为: ${to === 'supervisor' ? '督导 (可撰写评价)' : '领导 (只读查看)'}`, 'info');
                }}
                className="px-2 py-1 bg-[#1a2b3e] text-[10px] rounded text-[#028b93] hover:bg-[#028b93] hover:text-white transition-colors duration-150 font-bold border border-[#028b93]/30"
              >
                切换
              </button>
            </div>

            {/* Sidebar items */}
            <nav className="p-3 space-y-1 mt-4">
              <button 
                onClick={() => { setActiveTab('current'); setInspectingClass(null); }}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-left text-sm font-medium transition-all duration-150 ${activeTab === 'current' ? 'bg-[#01696f] text-white font-bold shadow-lg shadow-[#01696f]/20' : 'hover:bg-slate-800 hover:text-white'}`}
              >
                <div className="flex items-center gap-2.5">
                  <Activity size={16} />
                  <span>📡 当前课堂</span>
                </div>
                <span className="text-[10px] bg-[#1a2d3a] text-[#028b93] px-1.5 py-0.5 rounded-full font-bold">LIVE</span>
              </button>

              <button 
                onClick={() => { setActiveTab('tasks'); setInspectingClass(null); }}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-left text-sm font-medium transition-all duration-150 ${activeTab === 'tasks' ? 'bg-[#01696f] text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
              >
                <Clock size={16} />
                <span>🎥 我的巡课</span>
              </button>

              <button 
                onClick={() => { setActiveTab('records'); setInspectingClass(null); }}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-left text-sm font-medium transition-all duration-150 ${activeTab === 'records' ? 'bg-[#01696f] text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
              >
                <ClipboardList size={16} />
                <span>📋 听评课记录</span>
              </button>

              <button 
                onClick={() => { setActiveTab('stats'); setInspectingClass(null); }}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-left text-sm font-medium transition-all duration-150 ${activeTab === 'stats' ? 'bg-[#01696f] text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
              >
                <BarChart3 size={16} />
                <span>📊 巡课统计</span>
              </button>

              <button 
                onClick={() => { setActiveTab('settings'); setInspectingClass(null); }}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-left text-sm font-medium transition-all duration-150 ${activeTab === 'settings' ? 'bg-[#01696f] text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
              >
                <Sliders size={16} />
                <span>⚙️ 巡课设置</span>
              </button>
            </nav>
          </div>

          {/* Quick Exit Bottom Info */}
          <div className="p-4 border-t border-[#1e2a39] flex flex-col gap-2">
            <button 
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#15202e] hover:bg-[#1a2d3a] text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700/50"
            >
              <ArrowLeft size={14} />
              <span>返回总门户</span>
            </button>
            <div className="text-[9px] text-slate-600 text-center font-mono">
              IP: SERVER_PORT: 3000
            </div>
          </div>
        </aside>

        {/* Content Box */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Top Status Bar component */}
          <header className={`h-16 px-6 ${cardBgColor} border-b ${borderHexColor} flex items-center justify-between flex-shrink-0 transition-colors`}>
            {/* Breadcrumb path */}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold text-[#01696f]">远程巡检</span>
              <ChevronRight size={14} className="text-slate-400" />
              <span className={textMutedColor}>
                {activeTab === 'current' && '当前课堂直播'}
                {activeTab === 'tasks' && '我的巡课任务'}
                {activeTab === 'records' && '听评课历史档案'}
                {activeTab === 'stats' && '全校大数据看板'}
                {activeTab === 'settings' && '系统巡检业务配置'}
              </span>
            </div>

            {/* Right statistics info and theme indicators */}
            <div className="flex items-center gap-4">
              {/* Classroom counts */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#01696f]/10 text-[#01696f] border border-[#01696f]/20 rounded-full text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span>正在上课: 14 间</span>
              </div>

              {/* Bell Notice */}
              <div className="relative w-8 h-8 rounded-full bg-slate-100 dark:bg-[#201f1d] flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700">
                <Bell size={16} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] text-white rounded-full flex items-center justify-center font-bold">
                  2
                </span>
              </div>

              {/* Time display */}
              <div className="hidden lg:flex items-center gap-1.5 font-mono text-xs text-[#8a857b]">
                <Clock size={12} />
                <span>{currentTime || '2026-05-20'}</span>
              </div>

              {/* Light/Dark Toggle */}
              <button 
                onClick={toggleTheme}
                title="切换主题"
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#201f1d] flex items-center justify-center text-slate-500 hover:text-[#01696f]"
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>

              {/* Role Indicator avatar */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-[#01696f] text-white flex items-center justify-center font-black text-xs shadow-sm">
                  {role === 'supervisor' ? '督' : '领'}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-bold leading-none">
                    {role === 'supervisor' ? '督导专家 陆明' : '院长 李国华'}
                  </span>
                  <span className="text-[9px] text-[#8a857b] mt-0.5">
                    {role === 'supervisor' ? '化学教研室' : '工程学院'}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Core Body viewport */}
          <main className="flex-1 overflow-y-auto p-6 relative">
            
            {/* SCREEN 1: 当前课堂宫格视图 */}
            {activeTab === 'current' && !inspectingClass && (
              <div className="space-y-6">
                
                {/* Search / Filter toolbar */}
                <div className={`${cardBgColor} p-4 rounded-xl border ${borderHexColor} flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm`}>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* College Filter */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#8a857b]">学院楼栋:</span>
                      <select 
                        value={collegeFilter}
                        onChange={(e) => setCollegeFilter(e.target.value)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border ${borderHexColor} ${cardBgColor} focus:ring-1 focus:ring-[#01696f] outline-none font-medium`}
                      >
                        <option value="all">全部学院 (4)</option>
                        <option value="化学工程学院">化学工程学院</option>
                        <option value="生命科学与技术学院">生命科学与技术学院</option>
                        <option value="材料科学学院">材料科学学院</option>
                        <option value="物理与电子学院">物理与电子学院</option>
                      </select>
                    </div>

                    {/* Building Filter */}
                    <select 
                      value={buildingFilter}
                      onChange={(e) => setBuildingFilter(e.target.value)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border ${borderHexColor} ${cardBgColor} focus:ring-1 focus:ring-[#01696f] outline-none font-medium`}
                    >
                      <option value="all">全部教学楼</option>
                      <option value="实验教学楼A区">实验教学楼A区</option>
                      <option value="实验教学楼B区">实验教学楼B区</option>
                      <option value="实验教学楼C区">实验教学楼C区</option>
                      <option value="实验教学楼D区">实验教学楼D区</option>
                    </select>

                    {/* Search Field */}
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="检索教师 / 课程名称..." 
                        value={teacherSearch}
                        onChange={(e) => setTeacherSearch(e.target.value)}
                        className={`text-xs pl-8 pr-3 py-1.5 w-48 rounded-lg border ${borderHexColor} ${cardBgColor} outline-none focus:ring-1 focus:ring-[#01696f] font-medium`}
                      />
                      <svg className="absolute w-3.5 h-3.5 left-2.5 top-2.5 text-[#8a857b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      {teacherSearch && (
                        <button onClick={() => setTeacherSearch('')} className="absolute right-2 top-2 text-[#8a857b] hover:text-red-500">
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Grid layout switcher */}
                  <div className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 p-0.5 rounded-lg">
                    <button 
                      onClick={() => setViewType('grid3x3')}
                      title="3x3 宫格"
                      className={`p-1.5 rounded-md ${viewType === 'grid3x3' ? 'bg-[#01696f] text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                      <Grid size={14} />
                    </button>
                    <button 
                      onClick={() => setViewType('grid2x2')}
                      title="2x2 宫格"
                      className={`p-1.5 rounded-md ${viewType === 'grid2x2' ? 'bg-[#01696f] text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                    </button>
                    <button 
                      onClick={() => setViewType('list')}
                      title="列表视图"
                      className={`p-1.5 rounded-md ${viewType === 'list' ? 'bg-[#01696f] text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                      <List size={14} />
                    </button>
                  </div>
                </div>

                {/* Grid List Renderer */}
                {filteredClassrooms.length === 0 ? (
                  <div className={`p-12 text-center border-2 border-dashed ${borderHexColor} rounded-2xl`}>
                    <p className={textMutedColor}>没有检索到符合条件的课堂状态或教师名称</p>
                    <button onClick={() => { setCollegeFilter('all'); setBuildingFilter('all'); setTeacherSearch(''); }} className="mt-3 px-3 py-1.5 bg-[#01696f] text-white rounded-lg text-xs font-semibold">
                      重置筛选条件
                    </button>
                  </div>
                ) : (
                  <div className={`grid gap-5 transition-all duration-300 ${
                    viewType === 'grid3x3' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 
                    viewType === 'grid2x2' ? 'grid-cols-1 md:grid-cols-2' : 
                    'grid-cols-1'
                  }`}>
                    {filteredClassrooms.map((item) => (
                      <div 
                        key={item.id} 
                        className={`rounded-2xl overflow-hidden border ${borderHexColor} ${cardBgColor} shadow-sm group hover:shadow-md transition-all duration-200`}
                      >
                        {/* Camera viewport box */}
                        <div className="relative aspect-[16/9] bg-[#1a1a2e] flex flex-col justify-between p-3 overflow-hidden">
                          {/* Live / Status indicators */}
                          <div className="flex items-center justify-between w-full z-10">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-full">
                              <span className="w-1.5 h-1.5 bg-[#e53e3e] rounded-full animate-pulse"></span>
                              <span className="text-[10px] text-[#eae9e6] font-extrabold tracking-wider font-mono">LIVE</span>
                            </div>

                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === '进行中' ? 'bg-[#437a22]/85 text-white' :
                              item.status === '课间' ? 'bg-amber-600 text-white' :
                              'bg-slate-700 text-slate-300'
                            }`}>
                              {item.status}
                            </span>
                          </div>

                          {/* Graphical decoration inside blackened placeholder */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <Video className="text-slate-700/40 group-hover:text-cyan-500/10 group-hover:scale-110 transition-transform duration-500" size={54} />
                            <span className="text-[10px] text-slate-600 font-mono mt-1 select-none">
                              CAMERA_{item.room}_01
                            </span>
                          </div>

                          {/* Bottom info: student counts */}
                          <div className="flex items-center justify-between pointer-events-none z-10 w-full mt-auto">
                            <span className="text-[10px] bg-black/50 text-white/80 px-2 py-0.5 rounded-md font-medium">
                              {item.building} · {item.room}
                            </span>
                            <span className="text-[10px] bg-[#01696f]/80 text-[#fafafa] px-2 py-0.5 rounded-md font-sans">
                              👤 {item.studentsCount} 人
                            </span>
                          </div>
                        </div>

                        {/* Text information */}
                        <div className="p-4">
                          <h3 className="text-sm font-bold tracking-tight truncate mb-1">{item.courseName}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                            <span>主讲教师: {item.teacher} 教授</span>
                            <span className="text-slate-300 dark:text-slate-700">|</span>
                            <span className="text-[11px] font-mono">⏱ 已上 {item.elapsedTime} 分钟</span>
                          </p>

                          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#2a2926] flex items-center gap-2">
                            {/* Enter inspect */}
                            <button 
                              onClick={() => {
                                setInspectingClass(item);
                                setScoreSubmitted(false);
                                setScoringComment('');
                                setScoring({
                                  '教学内容': 5,
                                  '教学方法': 4,
                                  '教学态度': 5,
                                  '课堂秩序': 4,
                                  '教学效果': 4,
                                  '实验规范': 5
                                });
                              }}
                              className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 bg-[#01696f] hover:bg-[#025a5f] text-white rounded-xl text-xs font-bold shadow-md shadow-[#01696f]/10 transition-all cursor-pointer"
                            >
                              <Eye size={12} />
                              <span>进入巡课</span>
                            </button>
                            
                            {/* Anomaly flag */}
                            <button 
                              onClick={() => setAnomalyClass(item)}
                              disabled={role === 'leader'}
                              className={`py-1.5 px-2.5 border rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                                role === 'leader' ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-transparent' : 
                                'border-red-200 dark:border-red-920 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20'
                              }`}
                            >
                              标记异常
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SCREEN 1B: 巡课详情全屏覆盖视图 (进入后渲染) */}
            {activeTab === 'current' && inspectingClass && (
              <div className="fixed inset-0 top-16 left-0 md:left-[220px] bg-[#121110] text-[#eae9e6] z-40 p-4 lg:p-6 flex flex-col overflow-y-auto">
                {/* Header navbar inside detail */}
                <div className="flex items-center justify-between pb-4 border-b border-[#2d2c29] mb-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setInspectingClass(null)}
                      className="p-1.5 bg-[#1c1b19] hover:bg-[#2d2c29] text-white rounded-xl transition-all"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <div>
                      <h2 className="text-base font-bold text-[#fafafa] flex items-center gap-2">
                        {inspectingClass.courseName} 
                        <span className="text-xs px-2 py-0.5 bg-[#01696f]/20 text-[#028b93] border border-[#028b93]/30 rounded">
                          {inspectingClass.room}
                        </span>
                      </h2>
                      <p className="text-xs text-slate-400 font-medium">主讲教师：{inspectingClass.teacher} · 课程时长已有 {inspectingClass.elapsedTime} 分钟</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[#e53e3e]/15 text-[#e53e3e] text-xs font-mono font-bold rounded-lg flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#e53e3e] rounded-full animate-ping"></span>
                      🔴 LIVE 监控画面已接入
                    </span>
                    <button 
                      onClick={() => setInspectingClass(null)}
                      className="text-xs text-slate-400 hover:text-white font-medium border border-slate-700 px-3 py-1 bg-[#1a1918] rounded-xl hover:bg-slate-800 transition-colors"
                    >
                      退出巡课
                    </button>
                  </div>
                </div>

                {/* Left/Right layout columns */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: Big monitor container */}
                  <div className="lg:col-span-2 flex flex-col gap-4">
                    
                    {/* Big viewport */}
                    <div className="relative aspect-[16/9] bg-[#0c0c16] rounded-2xl overflow-hidden shadow-2xl border border-[#2d2c29]">
                      {/* Graphics decoration overlay */}
                      <div className="absolute inset-0 flex flex-col justify-between p-4 z-10 pointer-events-none">
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-mono bg-black/60 text-white rounded px-2.5 py-0.5 border border-white/10 font-bold">
                            CHANNEL_HD_{inspectingClass.room}
                          </span>
                          <span className="px-2 py-0.5 bg-red-600 text-[10px] text-white rounded font-mono font-black animate-pulse">
                            REC 🔴
                          </span>
                        </div>

                        {/* Overlay course labels */}
                        <div className="w-full bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/5 text-xs text-slate-200 mt-auto flex items-center justify-between">
                          <p className="font-sans">
                            <span className="font-bold text-white pr-2">正在监控:</span> 
                            {inspectingClass.courseName} ({inspectingClass.teacher}老师 · {inspectingClass.room})
                          </p>
                          <span className="text-[10px] font-mono text-slate-400">1080P @60FPS · 码率 4300kbps</span>
                        </div>
                      </div>

                      {/* Central graphical indicator */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <Video size={64} className="text-slate-800 animate-pulse" />
                        <span className="text-xs font-mono text-slate-600 mt-2">视角：{cameraAngles[activeCameraIdx]}</span>
                      </div>

                      {/* Media icons */}
                      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 pointer-events-auto">
                        <button className="p-1.5 bg-black/50 text-slate-300 hover:text-white rounded-lg hover:bg-black/85">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                        </button>
                        <button className="p-1.5 bg-black/50 text-slate-300 hover:text-white rounded-lg hover:bg-black/85">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                        </button>
                      </div>
                    </div>

                    {/* Multi camera previews */}
                    <div className="p-4 bg-[#1c1b19] border border-[#2d2c29] rounded-2xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-white">📡 多角度视频机位切换 (点击换入主画幅)</span>
                        <span className="text-[10px] text-slate-500 font-mono">Camera Matrix</span>
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        {cameraAngles.map((cam, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              setActiveCameraIdx(idx);
                              triggerToast(`已切换至: ${cam} 摄像头`, 'info');
                            }}
                            className={`aspect-video rounded-lg relative overflow-hidden border cursor-pointer group transition-all duration-150 bg-black ${
                              activeCameraIdx === idx ? 'border-[#01696f] ring-2 ring-[#01696f]/45' : 'border-slate-800'
                            }`}
                          >
                            <div className="absolute inset-0 bg-[#07070e] flex items-center justify-center">
                              <span className="text-[10px] font-mono text-slate-700 font-medium group-hover:text-[#01696f] select-none text-center p-1">
                                {cam}
                              </span>
                            </div>
                            <div className="absolute inset-x-0 bottom-0 py-0.5 px-1 bg-black/70 text-[9px] text-[#eae9e6] font-sans truncate text-center font-bold">
                              {cam} {activeCameraIdx === idx && '★'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Information & Interactions panel */}
                  <div className="bg-[#1c1b19] border border-[#2d2c29] rounded-2xl flex flex-col overflow-hidden shadow-xl min-h-[450px]">
                    
                    {/* Tab Navigation buttons */}
                    <div className="flex border-b border-[#2d2c29] bg-[#161514]">
                      <button 
                        onClick={() => setDetailTab('records')}
                        className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-colors ${
                          detailTab === 'records' ? 'border-[#01696f] text-white bg-[#1c1b19]' : 'border-transparent text-slate-400 hover:text-white'
                        }`}
                      >
                        ⏱ 巡课记录
                      </button>
                      <button 
                        onClick={() => setDetailTab('ratings')}
                        className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-colors ${
                          detailTab === 'ratings' ? 'border-[#01696f] text-white bg-[#1c1b19]' : 'border-transparent text-slate-400 hover:text-white'
                        }`}
                      >
                        ★ 评分权重表
                      </button>
                      <button 
                        onClick={() => setDetailTab('info')}
                        className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-colors ${
                          detailTab === 'info' ? 'border-[#01696f] text-white bg-[#1c1b19]' : 'border-transparent text-slate-400 hover:text-white'
                        }`}
                      >
                        ℹ️ 教学课堂详情
                      </button>
                    </div>

                    {/* Tab Content Display */}
                    <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-between">
                      {/* TAB 1: Live Record chat */}
                      {detailTab === 'records' && (
                        <div className="space-y-4 flex flex-col h-full justify-between">
                          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                            {liveNotes.map((note) => (
                              <div key={note.id} className="p-2.5 bg-[#252422] rounded-xl border border-slate-800 transition-all duration-300">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] text-[#028b93] font-bold">陆专家 (巡课督导)</span>
                                  <span className="text-[9px] text-[#8a857b] font-mono">{note.time}</span>
                                </div>
                                <p className="text-xs text-slate-300 font-sans leading-relaxed">{note.text}</p>
                              </div>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-[#2a2926] mt-auto">
                            <span className="text-[10px] text-slate-400 block mb-1">追加文字观察（督导专享）</span>
                            <div className="flex items-end gap-2 bg-[#252422] p-1.5 rounded-xl border border-slate-800">
                              <textarea 
                                value={detailNotes}
                                onChange={(e) => setDetailNotes(e.target.value)}
                                placeholder={role === 'leader' ? '只读：领导身份无权限录入观察笔记' : '在此输入实时巡课观察描述...'}
                                disabled={role === 'leader'}
                                rows={2}
                                className="flex-1 bg-transparent border-none text-xs outline-none text-slate-100 placeholder-slate-600 resize-none font-sans"
                              />
                              <button 
                                onClick={handleAddLiveNote}
                                disabled={!detailNotes.trim() || role === 'leader'}
                                className="px-3 py-1.5 bg-[#01696f] hover:bg-[#025a5f] disabled:opacity-30 disabled:hover:bg-[#01696f] text-white rounded-lg text-[10px] font-bold transition-all whitespace-nowrap"
                              >
                                添加
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 2: Star rating table */}
                      {detailTab === 'ratings' && (
                        <div className="space-y-4 flex flex-col justify-between h-full">
                          <div className="space-y-3.5">
                            <div className="p-2 bg-[#0d141e] border border-[#028b93]/20 rounded-xl text-[11px] text-slate-400 flex items-center gap-1.5">
                              <Info size={12} className="text-[#028b93]" />
                              <span>由 6 个实验核心维度评分，总分自权重累加。</span>
                            </div>

                            {(Object.entries(scoring) as Array<[string, number]>).map(([dim, score]) => (
                              <div key={dim} className="flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-400">{dim} <span className="text-[9px] text-[#028b93] font-mono">({weights[dim]}%)</span></span>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <button 
                                      key={s} 
                                      onClick={() => {
                                        if (scoreSubmitted || role === 'leader') return;
                                        setScoring(prev => ({ ...prev, [dim]: s }));
                                      }}
                                      disabled={scoreSubmitted || role === 'leader'}
                                      className="text-amber-500 hover:scale-110 active:scale-95 transition-all text-sm cursor-pointer disabled:cursor-not-allowed"
                                    >
                                      {s <= score ? '★' : '☆'}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-[#2a2926] mt-auto">
                            <textarea 
                              value={scoringComment}
                              onChange={(e) => setScoringComment(e.target.value)}
                              disabled={scoreSubmitted || role === 'leader'}
                              placeholder={role === 'leader' ? '只读：领导无权限填写综合评语' : '在此输入本评课课堂的综合评语文本（必填）...'}
                              rows={3}
                              className={`w-full p-2 text-xs rounded-xl border border-slate-800 bg-[#252422] outline-none placeholder-slate-600 font-sans resize-none text-slate-200 mt-2 mb-2 focus:ring-1 focus:ring-[#01696f]`}
                            />
                            
                            <button 
                              onClick={handleSubmitScoringForm}
                              disabled={scoreSubmitted || role === 'leader'}
                              className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#01696f] hover:bg-[#025a5f] text-white text-xs font-bold rounded-xl transition-all disabled:opacity-40"
                            >
                              <CheckCircle2 size={13} />
                              <span>{scoreSubmitted ? '✓ 在线评分表已封存提交' : '提交评价报告'}</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* TAB 3: Classroom detailed stats */}
                      {detailTab === 'info' && (
                        <div className="space-y-4 text-xs font-sans text-slate-300">
                          <div className="p-3 bg-[#252422] rounded-xl border border-slate-850 space-y-2">
                            <p><span className="text-slate-500">学期阶段:</span> 2025-2026年 春季学期</p>
                            <p><span className="text-slate-500">课堂课号:</span> EXP-CHEM0305</p>
                            <p><span className="text-slate-500">学分权重:</span> 2.5 学分</p>
                            <p><span className="text-slate-500">上课周次:</span> 第 12 周 (星期三 第3-4节)</p>
                            <p><span className="text-slate-500">出勤容载:</span> 应到 30 人 / 实到 28 人 (容积率: 93.3%)</p>
                            <p><span className="text-slate-500">学生分布:</span> 电子显微镜物理、无机应用化学各半</p>
                          </div>

                          <div className="p-3 bg-[#252422] rounded-xl border border-slate-850 space-y-2.5">
                            <h4 className="text-xs font-bold text-white mb-2">本学期教师巡课履历</h4>
                            <p className="flex justify-between"><span>被巡课监控次数:</span> <strong className="text-[#028b93]">3 次</strong></p>
                            <div className="h-px bg-slate-800" />
                            <p className="text-[11px] text-slate-500 leading-normal">历史督导打分历史记录:</p>
                            <ul className="space-y-1 bg-black/30 p-2 rounded-lg text-[10px] font-mono text-slate-400">
                              <li>· 2026-05-12 : 91 分 (李专家听课)</li>
                              <li>· 2026-04-30 : 86 分 (陈专家听课)</li>
                              <li>· 2026-04-12 : 88 分 (王专家听课)</li>
                            </ul>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* SCREEN 2: 我的巡课任务列表 */}
            {activeTab === 'tasks' && (
              <div className="space-y-6">
                
                {/* Task summary header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold tracking-tight">本学期我的远程/现场巡视任务列表</h3>
                    <p className={`text-xs ${textMutedColor} mt-1`}>管理待处理的课堂和已登记的历史考评文件</p>
                  </div>

                  <button 
                    onClick={() => {
                      if (role === 'leader') {
                        triggerToast('您当前的角色（领导）无权限创建巡课任务', 'error');
                        return;
                      }
                      setIsCreateTaskOpen(true);
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 bg-[#01696f] hover:bg-[#025a5f] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#01696f]/10 ${
                      role === 'leader' ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                  >
                    <span>+ 新建巡视计划</span>
                  </button>
                </div>

                {/* Table list rows */}
                <div className={`${cardBgColor} rounded-2xl border ${borderHexColor} overflow-hidden shadow-sm`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-[#121110] border-b border-slate-100 dark:border-[#2d2c29] text-slate-500 font-semibold select-none">
                          <th className="p-4 w-28 text-center">状态</th>
                          <th className="p-4">课程名称</th>
                          <th className="p-4 w-32">主讲教师</th>
                          <th className="p-4 w-24 text-center">授课教室</th>
                          <th className="p-4 w-40">约定计划巡检时间</th>
                          <th className="p-4 w-32 text-center">考评模式</th>
                          <th className="p-4 w-24 text-center">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 dark:divide-[#282725]">
                        {tasks.map((task) => (
                          <tr key={task.id} className="hover:bg-slate-50/50 dark:hover:bg-[#201f1d]/50 transition-colors">
                            <td className="p-4 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                task.status === '待巡课' ? 'bg-[#da7101]/10 text-[#da7101] border border-[#da7101]/20' :
                                task.status === '已完成' ? 'bg-[#437a22]/10 text-[#437a22] border border-[#437a22]/20' :
                                'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-transparent'
                              }`}>
                                {task.status}
                              </span>
                            </td>
                            <td className="p-4 font-bold">{task.courseName}</td>
                            <td className="p-4 font-medium text-slate-500 dark:text-slate-400">{task.teacher} 老师</td>
                            <td className="p-4 text-center font-mono text-slate-500">{task.room}</td>
                            <td className="p-4 font-mono text-slate-500">{task.scheduledTime}</td>
                            <td className="p-4 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                task.mode === '远程在线' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400' : 'bg-[#01696f]/10 text-[#01696f]'
                              }`}>
                                {task.mode}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              {task.status === '待巡课' ? (
                                <button 
                                  onClick={() => {
                                    // Navigate directly to inspecting
                                    const matchC = classrooms.find(c => c.courseName === task.courseName);
                                    if (matchC) {
                                      setInspectingClass(matchC);
                                      setActiveTab('current');
                                    } else {
                                      triggerToast('直播无法连接：该课堂今天没有在线教学活动。', 'error');
                                    }
                                  }}
                                  className="px-2.5 py-1 bg-[#da7101] hover:bg-[#c26401] text-white rounded text-[10px] font-bold shadow-sm transition-all"
                                >
                                  立即进入
                                </button>
                              ) : task.status === '已完成' ? (
                                <button 
                                  onClick={() => setSelectedTaskRecord(task)}
                                  className="px-2.5 py-1 border border-[#01696f] text-[#01696f] hover:bg-[#01696f]/10 rounded text-[10px] font-bold transition-all"
                                >
                                  查看记录
                                </button>
                              ) : (
                                <span className="text-slate-400 font-medium">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 3: 听评课记录列表 */}
            {activeTab === 'records' && (
              <div className="space-y-6">
                
                {/* Records view header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold tracking-tight">课堂视导听评记录档案库</h3>
                    <p className={`text-xs ${textMutedColor} mt-1`}>已存档的历史考评得分和评课分析意见</p>
                  </div>

                  <button 
                    onClick={() => triggerToast('导出成功，数据文件excel压缩包已生成并开始下载。', 'success')}
                    className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold rounded-xl text-xs transition-all"
                  >
                    <Download size={13} />
                    <span>导出全部巡考记录</span>
                  </button>
                </div>

                {/* Grid format logs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {evaluationRecords.map((item) => (
                    <EvaluationRecordCard
                      key={item.id}
                      item={item}
                      borderHexColor={borderHexColor}
                      cardBgColor={cardBgColor}
                      textMutedColor={textMutedColor}
                      setViewingRecord={setViewingRecord}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN 4: 巡视统计大数据 */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                
                {/* Header periods switch layout */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold tracking-tight">实验在线视频巡监数据统计看板</h3>
                    <p className={`text-xs ${textMutedColor} mt-1`}>多学期多维度定量分析督导覆盖率和整改闭环情况</p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#1a1918] p-1 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <button className="px-3 py-1 bg-[#01696f]/10 text-[#01696f] text-xs font-bold rounded-lg border border-[#01696f]/20">2025-2026 春</button>
                    <button className="px-3 py-1 text-[#8a857b] hover:text-[#1a1a1a] dark:hover:text-[#eae9e6] text-xs font-medium rounded-lg" onClick={() => triggerToast('学期切换成功（模拟重置）', 'info')}>2024-2025 秋</button>
                    <button className="px-3 py-1 text-[#8a857b] hover:text-[#1a1a1a] dark:hover:text-[#eae9e6] text-xs font-medium rounded-lg" onClick={() => triggerToast('学期切换成功（模拟重置）', 'info')}>2024-2025 春</button>
                  </div>
                </div>

                {/* 4 KPI cards with transition */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className={`${cardBgColor} border ${borderHexColor} p-4.5 rounded-2xl shadow-sm text-center`}>
                    <p className="text-[11px] text-slate-500 font-medium">本学期共巡课</p>
                    <div className="text-3xl font-black mt-1 text-[#01696f] font-mono animate-fade">
                      {kpiCounts.count || '0'} <span className="text-xs font-bold text-[#8a857b]">次</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-sans block mt-1.5">比上学期同期 +12%</span>
                  </div>

                  <div className={`${cardBgColor} border ${borderHexColor} p-4.5 rounded-2xl shadow-sm text-center`}>
                    <p className="text-[11px] text-slate-500 font-medium">覆盖教师数</p>
                    <div className="text-3xl font-black mt-1 text-[#437a22] font-mono">
                      {kpiCounts.distinctTeachers || '0'} <span className="text-xs font-bold text-[#8a857b]">人</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-sans block mt-1.5">教师覆盖率达 89.2%</span>
                  </div>

                  <div className={`${cardBgColor} border ${borderHexColor} p-4.5 rounded-2xl shadow-sm text-center`}>
                    <p className="text-[11px] text-slate-500 font-medium">巡监平均评分</p>
                    <div className="text-3xl font-black mt-1 text-[#01696f] font-mono">
                      {kpiCounts.avgS ? kpiCounts.avgS.toFixed(1) : '0.0'} <span className="text-xs font-bold text-[#8a857b]">分</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-sans block mt-1.5">总体较上轮视导提升 2.1%</span>
                  </div>

                  <div className={`${cardBgColor} border ${borderHexColor} p-4.5 rounded-2xl shadow-sm text-center`}>
                    <p className="text-[11px] text-slate-500 font-medium">优秀课堂比例</p>
                    <div className="text-3xl font-black mt-1 text-amber-600 font-mono">
                      {kpiCounts.excelRatio || '0'} <span className="text-xs font-bold text-[#8a857b]">%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-sans block mt-1.5">督导综合打分评分 ≥90</span>
                  </div>
                </div>

                {/* Middle Row Layout: Heatmap & Ranking list */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: Heatmap (2 cols width) */}
                  <div className={`col-span-1 lg:col-span-2 ${cardBgColor} border ${borderHexColor} p-5 rounded-2xl shadow-sm flex flex-col justify-between`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-bold tracking-tight">巡课时间覆盖率热图 (周 × 星期)</h4>
                        <p className="text-[11px] text-slate-500">网格单元颜色深浅表征该节点被巡视覆盖的频数 (亮色为无，深 teal 为多)</p>
                      </div>
                      <span className="text-[10px] font-mono text-[#01696f] font-bold">18周 × 24时段拟合</span>
                    </div>

                    {/* Interactive Heatmap Matrix */}
                    <div className="overflow-x-auto">
                      <div className="min-w-[480px]">
                        {/* Day indicator header */}
                        <div className="flex items-center gap-1.5 pl-6 mb-2">
                          {['周一', '周二', '周三', '周四', '周五'].map((d, idx) => (
                            <div key={idx} className="flex-1 text-center text-[10px] font-bold font-sans text-slate-400">{d}</div>
                          ))}
                        </div>

                        {/* Week matrix rows */}
                        <div className="space-y-1">
                          {Array.from({ length: 18 }).map((_, weekIdx) => {
                            const weekNum = weekIdx + 1;
                            
                            // Mock counts per week per day
                            const getMockCount = (w: number, d: number) => {
                              const pseudoHash = (w * 37 + d * 19) % 5;
                              return pseudoHash === 0 ? 0 : pseudoHash === 4 ? 3 : pseudoHash === 1 ? 1 : 2;
                            };

                            return (
                              <div key={weekIdx} className="flex items-center gap-1.5">
                                <span className="w-6 text-right text-[9px] font-mono font-bold text-slate-400 pr-1">W{weekNum}</span>
                                {Array.from({ length: 5 }).map((_, dIdx) => {
                                  const countVal = getMockCount(weekNum, dIdx);
                                  const heatColor = 
                                    countVal === 0 ? 'bg-slate-100 dark:bg-[#1a1918] opacity-30' :
                                    countVal === 1 ? 'bg-[#01696f] opacity-35' :
                                    countVal === 2 ? 'bg-[#01696f] opacity-65' :
                                    'bg-[#01696f]'; // count >= 3

                                  return (
                                    <div 
                                      key={dIdx}
                                      className={`flex-1 h-5 rounded-md ${heatColor} hover:scale-105 active:scale-95 transition-all cursor-pointer relative group-hover:z-10`}
                                      title={`第 ${weekNum} 周 星期${dIdx+1} 被巡视 ${countVal} 次`}
                                    >
                                      {/* Custom tooltip hover inside browser */}
                                      <div className="opacity-0 pointer-events-none group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 py-1 px-2 bg-black text-[#fafafa] text-[9px] rounded-md font-sans whitespace-nowrap z-35 shadow-xl transition-all duration-150">
                                        第 {weekNum} 周 星期{dIdx+1} · 巡课 {countVal} 次
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Ranked lists */}
                  <div className={`${cardBgColor} border ${borderHexColor} p-5 rounded-2xl shadow-sm flex flex-col justify-between`}>
                    <div className="mb-4">
                      <h4 className="text-sm font-bold tracking-tight">督导热点：教师被巡次数排行</h4>
                      <p className="text-[11px] text-slate-500">本轮被覆盖频率最高的TOP-8教师情况</p>
                    </div>

                    {/* Chart list */}
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[440px] pr-1.5">
                      {[
                        { name: '李明', count: 6, score: 91, college: '化学系' },
                        { name: '张红', count: 5, score: 88, college: '应用化学' },
                        { name: '周杰', count: 5, score: 85, college: '生物工学' },
                        { name: '王雷', count: 4, score: 90, college: '微电子学' },
                        { name: '陈丽', count: 4, score: 79, college: '微生物学' },
                        { name: '刘洋', count: 3, score: 86, college: '食品检测' },
                        { name: '戴明', count: 3, score: 84, college: '材料物理' },
                        { name: '郭老师', count: 3, score: 68, college: '工程焊接' }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1 text-[11px]">
                          <div className="flex justify-between items-center font-sans">
                            <span className="font-bold flex items-center gap-1.5">
                              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white ${
                                idx === 0 ? 'bg-amber-600 font-extrabold' :
                                idx === 1 ? 'bg-slate-500' :
                                idx === 2 ? 'bg-amber-800' : 'bg-slate-300 dark:bg-slate-700'
                              }`}>{idx+1}</span>
                              <span>{item.name} 教授 ({item.college})</span>
                            </span>
                            <span className="font-mono text-slate-500">
                              被巡 <strong className="text-[#01696f]">{item.count}</strong> 次 · <strong className="text-[#437a22]">{item.score}</strong> 分
                            </span>
                          </div>
                          
                          {/* Percent block helper */}
                          <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-1 relative overflow-hidden">
                            <div className="bg-[#01696f] h-full rounded" style={{ width: `${(item.count / 6) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Bottom Section: Dimensions progress bars */}
                <div className={`${cardBgColor} border ${borderHexColor} p-5 rounded-2xl shadow-sm space-y-4`}>
                  <div>
                    <h4 className="text-sm font-bold tracking-tight">学科教务：全校各教学质控维度平均打分情况</h4>
                    <p className="text-[11px] text-slate-500">横轴展示各评估维度的全院本学期宏观均分</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
                    {Object.entries(ratingAvgAll).map(([dim, val]) => (
                      <div key={dim} className="space-y-1.5 p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-150 dark:border-[#2b2a28]">
                        <div className="flex justify-between items-center font-bold">
                          <span>{dim}</span>
                          <span className="text-[#01696f] font-mono">{val} / 100 分</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-[#028b93] h-full rounded-full" style={{ width: `${val}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-400 block font-sans">
                          {val >= 90 ? '◎ 状态优秀，无需干预' : val >= 80 ? '◎ 质量稳定，常规督促' : '⚠️ 低于80警告，重点督导'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* SCREEN 5: 巡视参数配置 */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                
                {/* Heading section */}
                <div>
                  <h3 className="text-base font-bold tracking-tight">教务视导规则与行为参数配置层</h3>
                  <p className={`text-xs ${textMutedColor} mt-1`}>自定义指标打分权重总比、频率要求以及通知通报机制</p>
                </div>

                {/* 3 Setting rows cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Card 1: Patrol rules */}
                  <div className={`${cardBgColor} border ${borderHexColor} p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[380px]`}>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="text-[#01696f]" size={16} />
                        <h4 className="text-xs font-bold uppercase text-slate-500">① 基础考评业务规划</h4>
                      </div>

                      <div className="space-y-3.5 text-xs">
                        <div className="space-y-1.5">
                          <span className="font-semibold text-slate-500">每名督导成员学期最低听课指标:</span>
                          <div className="flex items-center gap-2">
                            <input 
                              type="number" 
                              value={minInspecCount}
                              onChange={(e) => setMinInspecCount(Number(e.target.value))}
                              className={`w-full p-2 rounded-xl border ${borderHexColor} ${cardBgColor} focus:ring-1 focus:ring-[#01696f] outline-none font-bold text-center`}
                            />
                            <span className="text-[#8a857b] font-medium">次 / 学期</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                          <div className="flex flex-col">
                            <span className="font-bold">允许同一课程重复巡监</span>
                            <span className="text-[10px] text-slate-500">避免教师被频繁或漏项质检</span>
                          </div>
                          <button 
                            onClick={() => setAllowDup(!allowDup)}
                            className={`w-10 h-6 flex items-center rounded-full p-1 transition-all ${allowDup ? 'bg-[#01696f] justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
                          >
                            <span className="w-4 h-4 bg-white rounded-full shadow-md" />
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          <span className="font-semibold text-[#8a857b]">下一次巡监计划提前提醒时区:</span>
                          <select 
                            value={remindTime}
                            onChange={(e) => setRemindTime(e.target.value)}
                            className={`w-full p-2.5 rounded-xl border ${borderHexColor} ${cardBgColor} outline-none focus:ring-1 focus:ring-[#01696f] font-medium`}
                          >
                            <option value="30分钟">提前 30 分钟提示督导</option>
                            <option value="1小时">提前 1 小时提示督导</option>
                            <option value="2小时">提前 2 小时提示督导</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => triggerToast('基础规则及提醒配置保存成功！', 'success')}
                      className="w-full py-2 bg-[#01696f] hover:bg-[#025a5f] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#01696f]/10 mt-6 cursor-pointer"
                    >
                      保存基础设置
                    </button>
                  </div>

                  {/* Card 2: Metrics weight manager */}
                  <div className={`${cardBgColor} border ${borderHexColor} p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[380px]`}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Settings className="text-[#01696f]" size={16} />
                          <h4 className="text-xs font-bold uppercase text-slate-500">② 量表评价维度比设</h4>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          weightsSum === 100 ? 'bg-[#437a22]/20 text-[#437a22]' : 'bg-red-500/20 text-red-500'
                        }`}>
                          当前总和: {weightsSum}%
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        {Object.entries(weights).map(([dim, wt]) => (
                          <div key={dim} className="flex items-center justify-between gap-3">
                            <span className="font-medium text-slate-500 w-24">{dim}</span>
                            <div className="flex-1 flex items-center gap-1.5">
                              <input 
                                type="number" 
                                min={5}
                                max={50}
                                value={wt}
                                onChange={(e) => {
                                  const newVal = Number(e.target.value);
                                  setWeights(prev => ({ ...prev, [dim]: newVal }));
                                }}
                                className={`w-16 p-1.5 rounded-lg text-center border ${borderHexColor} ${cardBgColor} focus:ring-1 focus:ring-[#01696f] outline-none font-bold`}
                              />
                              <span className="text-slate-400 font-mono">%</span>
                            </div>
                          </div>
                        ))}

                        {weightsSum !== 100 && (
                          <p className="text-[10px] text-red-500 flex items-center gap-1 mt-1 leading-snug">
                            <AlertTriangle size={12} />
                            <span>权重分配必须等和于 100% 后保存才可用</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => triggerToast('大纲量表评价指标分配权重保存成功！', 'success')}
                      disabled={weightsSum !== 100}
                      className="w-full py-2 bg-[#01696f] hover:bg-[#025a5f] disabled:opacity-30 disabled:hover:bg-[#01696f] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#01696f]/10 mt-6 cursor-pointer"
                    >
                      保存考核权重
                    </button>
                  </div>

                  {/* Card 3: Notice targets config */}
                  <div className={`${cardBgColor} border ${borderHexColor} p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[380px]`}>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Bell className="text-[#01696f]" size={16} />
                        <h4 className="text-xs font-bold uppercase text-slate-500">③ 通知与发布对象渠道</h4>
                      </div>

                      <div className="space-y-3.5 text-xs">
                        {/* Channels switches */}
                        <div className="space-y-2">
                          <span className="font-semibold text-slate-400">消息通知发布媒介通道:</span>
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">教务系统站内信、桌面弹屏通知</span>
                              <button 
                                onClick={() => setChannels(prev => ({ ...prev, web: !prev.web }))}
                                className={`w-9 h-5 flex items-center rounded-full p-1 transition-all ${channels.web ? 'bg-[#01696f] justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
                              >
                                <span className="w-3.5 h-3.5 bg-white rounded-full shadow" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">短信通知 (备考/考后汇总推送)</span>
                              <button 
                                onClick={() => setChannels(prev => ({ ...prev, sms: !prev.sms }))}
                                className={`w-9 h-5 flex items-center rounded-full p-1 transition-all ${channels.sms ? 'bg-[#01696f] justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
                              >
                                <span className="w-3.5 h-3.5 bg-white rounded-full shadow" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">企业微信工作日程通知推送</span>
                              <button 
                                onClick={() => setChannels(prev => ({ ...prev, workWechat: !prev.workWechat }))}
                                className={`w-9 h-5 flex items-center rounded-full p-1 transition-all ${channels.workWechat ? 'bg-[#01696f] justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
                              >
                                <span className="w-3.5 h-3.5 bg-white rounded-full shadow" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-slate-800" />

                        {/* Receivers switches */}
                        <div className="space-y-2">
                          <span className="font-semibold text-slate-400">报告生成后即时通达对象:</span>
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">被巡任课教师及助教</span>
                              <button 
                                onClick={() => setReceivers(prev => ({ ...prev, teacher: !prev.teacher }))}
                                className={`w-9 h-5 flex items-center rounded-full p-1 transition-all ${receivers.teacher ? 'bg-[#01696f] justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
                              >
                                <span className="w-3.5 h-3.5 bg-white rounded-full shadow" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">学院教学院长及系主任</span>
                              <button 
                                onClick={() => setReceivers(prev => ({ ...prev, dean: !prev.dean }))}
                                className={`w-9 h-5 flex items-center rounded-full p-1 transition-all ${receivers.dean ? 'bg-[#01696f] justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
                              >
                                <span className="w-3.5 h-3.5 bg-white rounded-full shadow" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => triggerToast('通达渠道通知接收偏好保存成功！', 'success')}
                      className="w-full py-2 bg-[#01696f] hover:bg-[#025a5f] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#01696f]/10 mt-6 cursor-pointer"
                    >
                      保存短信与频道通知偏好
                    </button>
                  </div>

                </div>

              </div>
            )}

          </main>
        </div>

      </div>

      {/* MODAL SECTION 1: 标记课堂异常 */}
      {anomalyClass && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade">
          <div className={`${cardBgColor} rounded-2xl max-w-md w-full border ${borderHexColor} shadow-2xl p-6 relative overflow-hidden`}>
            {/* Modal header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2a2926] mb-4">
              <h3 className="text-sm font-bold text-red-500 flex items-center gap-1.5">
                <ShieldAlert size={16} />
                <span>登记课堂教学活动异常：{anomalyClass.room}</span>
              </h3>
              <button 
                onClick={() => { setAnomalyClass(null); setAnomalyTypes([]); setAnomalyNote(''); }}
                className="text-slate-400 hover:text-red-500 p-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal body items */}
            <div className="space-y-4 text-xs font-sans">
              <p className="text-slate-500 leading-normal mb-2">
                系统正在协助监测 <strong>{anomalyClass.courseName}</strong> ({anomalyClass.teacher}老师)。请依据实况勾选异常项目，通报考评督导办公室进行快速干预：
              </p>

              {/* Checkboxes selection */}
              <div className="space-y-2 bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-100 dark:border-[#201f1e]">
                {[
                  { value: '教师迟到', label: '教师或教学辅助迟到、无故缺课' },
                  { value: '学生秩序混乱', label: '实验纪律废弛（喧哗/打闹/无序）' },
                  { value: '课堂内容异常', label: '授课脱离实训，或设备大规模损坏无法教学' },
                  { value: '实验室不合规', label: '不按安全章程进行强电或化学易燃耗材合成' },
                  { value: '其他异常', label: '其他对上课纪律造成实质伤害的问题' }
                ].map((option) => (
                  <label key={option.value} className="flex items-start gap-2.5 cursor-pointer hover:text-white select-none">
                    <input 
                      type="checkbox"
                      checked={anomalyTypes.includes(option.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAnomalyTypes(prev => [...prev, option.value]);
                        } else {
                          setAnomalyTypes(prev => prev.filter(t => t !== option.value));
                        }
                      }}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="font-bold">{option.value}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{option.label}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Notes input */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-400">详细情况备注补充:</span>
                <textarea 
                  value={anomalyNote}
                  onChange={(e) => setAnomalyNote(e.target.value)}
                  placeholder="请输入导致该异常的具体详细原因或整改口径建议..."
                  rows={3}
                  className={`w-full p-2.5 rounded-xl border border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none placeholder-slate-600 font-sans resize-none text-slate-200`}
                />
              </div>
            </div>

            {/* Modal Footer buttons */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-[#2a2926] flex items-center justify-end gap-2.5">
              <button 
                onClick={() => { setAnomalyClass(null); setAnomalyTypes([]); setAnomalyNote(''); }}
                className="px-4 py-2 border rounded-xl text-xs font-semibold cursor-pointer text-slate-400 border-slate-700 hover:bg-slate-800"
              >
                取消
              </button>
              <button 
                onClick={handleSubmitAnomaly}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-500/10 cursor-pointer"
              >
                提交异常记录
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SECTION 2: 查看历史听打分视导详情记录 */}
      {viewingRecord && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade">
          <div className={`${cardBgColor} rounded-2xl max-w-lg w-full border ${borderHexColor} shadow-2xl p-6 relative overflow-hidden`}>
            {/* Modal header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2a2926] mb-4">
              <h3 className="text-sm font-bold text-[#01696f] flex items-center gap-1.5">
                <Award size={16} />
                <span>督导评价报告单 (详案存档录备)</span>
              </h3>
              <button 
                onClick={() => setViewingRecord(null)}
                className="text-slate-400 hover:text-red-500 p-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal body items */}
            <div className="space-y-4 text-xs font-sans">
              <div className="p-3 bg-[#01696f]/10 text-slate-400 flex flex-col md:flex-row md:items-center justify-between gap-2.5 rounded-xl border border-[#01696f]/20">
                <div>
                  <p className="font-bold text-[#fafafa] text-sm">{viewingRecord.courseName}</p>
                  <p className="text-[10px] text-[#028b93] font-semibold mt-0.5">授课教研员: {viewingRecord.teacherName} 教授 · {viewingRecord.time}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-[#01696f]">{viewingRecord.score}</span>
                  <span className="text-[10px] block font-bold text-slate-500 mt-0.5">综合视导得分</span>
                </div>
              </div>

              {/* 6 dimensions rating results inside log review */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-2">
                <h4 className="font-bold text-white mb-2 text-xs">督导评价细分分值 (1-5星星星制)</h4>
                {(Object.entries(viewingRecord.ratings) as Array<[string, number]>).map(([dim, score]) => (
                  <div key={dim} className="flex justify-between items-center bg-black/10 py-1.5 px-3 rounded-md">
                    <span className="font-medium text-slate-400">{dim} <span className="text-[9px] text-slate-500">({weights[dim]}% 权重分等效计)</span></span>
                    <span className="text-amber-500 font-bold tracking-wider">{'★'.repeat(score)}{'☆'.repeat(5-score)}</span>
                  </div>
                ))}
              </div>

              {/* Comprehensive report */}
              <div className="p-3.5 border border-slate-200 dark:border-slate-800 rounded-xl">
                <h4 className="font-bold text-slate-400 mb-1">视导评价综合审核意见 :</h4>
                <p className="text-[#8a857b] leading-relaxed text-xs">{viewingRecord.comment}</p>
              </div>
            </div>

            {/* Modal Footer buttons */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-[#2a2926] flex items-center justify-between">
              <span className="text-[10px] text-slate-500">存档编号: PATROL-REC-RE-{viewingRecord.id}</span>
              <button 
                onClick={() => setViewingRecord(null)}
                className="px-4 py-2 bg-[#01696f] hover:bg-[#025a5f] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                确定并关闭文件
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SECTION 3: 新建巡课任务 */}
      {isCreateTaskOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade">
          <div className={`${cardBgColor} rounded-2xl max-w-md w-full border ${borderHexColor} shadow-2xl p-6 relative overflow-hidden`}>
            {/* Modal header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2a2926] mb-4">
              <h3 className="text-sm font-bold text-[#01696f] flex items-center gap-1.5">
                <Calendar size={16} />
                <span>规划并预约本学期听巡课任务</span>
              </h3>
              <button 
                onClick={() => setIsCreateTaskOpen(false)}
                className="text-slate-400 hover:text-red-500 p-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal body items */}
            <div className="space-y-4 text-xs font-sans">
              {/* Class Dropdown */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-400">选择拟安排听巡的课堂:</span>
                <select 
                  value={newTaskCourse}
                  onChange={(e) => setNewTaskCourse(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border ${borderHexColor} ${cardBgColor} outline-none focus:ring-1 focus:ring-[#01696f] font-medium`}
                >
                  <option value="有机化学实验">有机化学实验 (李明老师 - B302)</option>
                  <option value="分析化学实验">分析化学实验 (张红老师 - B305)</option>
                  <option value="生物工程实验">生物工程实验 (周杰老师 - A104)</option>
                  <option value="食品安全检测">食品安全检测 (刘洋老师 - A201)</option>
                  <option value="微生物学实验">微生物学实验 (陈丽老师 - A109)</option>
                  <option value="高分子实验">高分子实验 (徐伟老师 - B402)</option>
                </select>
              </div>

              {/* Timepicker Selection */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-400">计划听评巡视的时间安排:</span>
                <input 
                  type="datetime-local" 
                  value={newTaskTime}
                  onChange={(e) => setNewTaskTime(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border ${borderHexColor} ${cardBgColor} focus:ring-1 focus:ring-[#01696f] outline-none font-bold`}
                />
              </div>

              {/* Inspection Mode selector */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-400">选择计划的听评考视导手段模式:</span>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer select-none font-bold gap-2 ${
                    newTaskMode === '远程在线' ? 'border-[#01696f] bg-[#01696f]/10 text-[#01696f]' : 'border-slate-800'
                  }`}>
                    <input 
                      type="radio" 
                      name="inspect_mode" 
                      checked={newTaskMode === '远程在线'}
                      onChange={() => setNewTaskMode('远程在线')}
                      className="hidden"
                    />
                    <span>📡 远程在线实时巡监</span>
                  </label>
                  <label className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer select-none font-bold gap-2 ${
                    newTaskMode === '现场' ? 'border-[#01696f] bg-[#01696f]/10 text-[#01696f]' : 'border-slate-800'
                  }`}>
                    <input 
                      type="radio" 
                      name="inspect_mode" 
                      checked={newTaskMode === '现场'}
                      onChange={() => setNewTaskMode('现场')}
                      className="hidden"
                    />
                    <span>🏫 传统现场课堂听课</span>
                  </label>
                </div>
              </div>

              {/* Remarks note text */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-400">备注安排/拟关注点补充(非必填):</span>
                <textarea 
                  value={newTaskNote}
                  onChange={(e) => setNewTaskNote(e.target.value)}
                  placeholder="请输入如：'重点评估生物制剂制备防毒眼罩与规范使用防爆柜的环节'等提醒..."
                  rows={2}
                  className={`w-full p-2.5 rounded-xl border border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none placeholder-slate-600 font-sans resize-none text-slate-200`}
                />
              </div>
            </div>

            {/* Modal Footer buttons */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-[#2a2926] flex items-center justify-end gap-2.5">
              <button 
                onClick={() => setIsCreateTaskOpen(false)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold cursor-pointer text-slate-400 border-slate-700 hover:bg-slate-800"
              >
                放弃
              </button>
              <button 
                onClick={handleCreateTask}
                className="px-4 py-2 bg-[#01696f] hover:bg-[#025a5f] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#01696f]/10 cursor-pointer"
              >
                确定预约巡视
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER SECTION 4: 右侧抽屉展示评价历史详情 (我的巡课已完成详情) */}
      {selectedTaskRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fade" onClick={() => setSelectedTaskRecord(null)}>
          <div 
            className="w-full max-w-[420px] h-full bg-[#1c1b19] border-l border-[#2d2c29] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-[slideRight_0.25s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Title header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#2d2c29] mb-5">
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <ClipboardList size={18} className="text-[#01696f]" />
                  <span>督导历史质控档案详情</span>
                </h3>
                <button 
                  onClick={() => setSelectedTaskRecord(null)}
                  className="p-1 px-2.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white text-xs font-bold font-mono transition"
                >
                  ✕
                </button>
              </div>

              {/* Task general descriptors */}
              <div className="space-y-4 text-xs font-sans">
                <div className="p-3.5 bg-[#252422] rounded-xl border border-slate-850 space-y-1">
                  <p className="text-slate-400">听巡课程项目 :</p>
                  <h4 className="text-sm font-bold text-[#fafafa] leading-tight">{selectedTaskRecord.courseName}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">主讲教师: {selectedTaskRecord.teacher} · 教室: {selectedTaskRecord.room}</p>
                  <p className="text-[10px] text-[#028b93] font-mono mt-1">计划检测时间: {selectedTaskRecord.scheduledTime} ({selectedTaskRecord.mode})</p>
                </div>

                {/* Score block */}
                {selectedTaskRecord.record && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-900 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">综合定量等效最终打分 :</span>
                      <div className="text-right">
                        <strong className="text-2xl font-black text-[#01696f] font-mono">
                          {Math.round(
                            (Object.entries(selectedTaskRecord.record.scores) as Array<[string, number]>).reduce((acc: number, [k, v]) => {
                              const weight = (weights[k] || 0) as number;
                              return acc + v * 20 * (weight / 100);
                            }, 0)
                          )}
                        </strong>
                        <span className="text-xs font-bold ml-0.5 text-slate-500">分</span>
                      </div>
                    </div>

                    {/* Dimensions stars */}
                    <div className="space-y-2 bg-[#252422] p-4 rounded-xl border border-slate-850">
                      <h4 className="font-bold text-white mb-2">等效量尺指标细目分值 :</h4>
                      {(Object.entries(selectedTaskRecord.record.scores) as Array<[string, number]>).map(([dim, val]) => (
                        <div key={dim} className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-medium">{dim}</span>
                          <span className="text-amber-500 font-mono tracking-wider">{'★'.repeat(val)}{'☆'.repeat(5-val)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Feedback block text review */}
                    <div className="p-3 border border-slate-800 rounded-xl">
                      <h4 className="font-bold text-slate-400 mb-1">主审核评语报告 :</h4>
                      <p className="text-slate-300 leading-normal text-xs">{selectedTaskRecord.record.comment}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer lock bottom */}
            <div className="pt-4 border-t border-[#2d2c29] mt-6 flex justify-end">
              <button 
                onClick={() => setSelectedTaskRecord(null)}
                className="w-full py-2 bg-[#1c1b19] border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all"
              >
                确定并返回任务档案
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
