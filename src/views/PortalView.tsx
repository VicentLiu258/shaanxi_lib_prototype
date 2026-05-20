import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Settings2, 
  Dna, 
  ClipboardCheck, 
  Glasses, 
  FlaskConical, 
  Video, 
  Flame, 
  ShieldAlert, 
  Warehouse,
  ChevronRight,
  Database,
  Cpu,
  Globe,
  AlertTriangle,
  Lock,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { cn } from '../lib/utils';

interface PortalViewProps {
  onSelect: (id: string) => void;
  onLogout: () => void;
}

const systems = [
  { id: 'data', name: '大数据可视化中心', sub: 'DATA CENTER', icon: BarChart3, color: 'bg-blue-500' },
  { id: 'instr', name: '智慧无感仪器管理', sub: 'INSTRUMENT MGMT', icon: Settings2, color: 'bg-indigo-500' },
  { id: 'teach', name: '实验室教学管理', sub: 'TEACHING MGMT', icon: Dna, color: 'bg-emerald-500' },
  { id: 'exam', name: '实验操作考试', sub: 'OPERATION EXAM', icon: ClipboardCheck, color: 'bg-amber-500' },
  { id: 'vr', name: '虚拟仿真测试', sub: 'VIRTUAL SIMULATION', icon: Glasses, color: 'bg-purple-500' },
  { id: 'res', name: '实验教学资源', sub: 'RESOURCES', icon: FlaskConical, color: 'bg-sky-500' },
  { id: 'rem', name: '远程在线巡课', sub: 'REMOTE INSPECTION', icon: Video, color: 'bg-rose-500' },
  { id: 'haz', name: '智慧危化品管理', sub: 'CHEMICAL MGMT', icon: Flame, color: 'bg-orange-500' },
  { id: 'env', name: '环境监测预警', sub: 'ENVIRONMENTAL', icon: ShieldAlert, color: 'bg-cyan-500' },
  { id: 'asset', name: '固定资产管理', sub: 'ASSET MGMT', icon: Warehouse, color: 'bg-slate-500' },
];

export const PortalView: React.FC<PortalViewProps> = ({ onSelect, onLogout }) => {
  const [subsystemStatuses, setSubsystemStatuses] = useState<Record<string, boolean>>({});
  const [schoolName, setSchoolName] = useState('咸阳市实验中学');
  const [systemLogo, setSystemLogo] = useState('SHAANXI LABORATORY INTEGRATED PLATFORM');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Load subsystem active status mapping
    const storedSubs = localStorage.getItem('sys_subsystems');
    if (storedSubs) {
      try {
        const parsed = JSON.parse(storedSubs);
        const map: Record<string, boolean> = {};
        let modified = false;
        parsed.forEach((s: any) => {
          // Bugfix: auto-migrate the vr subsystem to true if it is currently disabled
          if (s.id === 'vr' && s.enabled === false) {
            s.enabled = true;
            modified = true;
          }
          map[s.id] = s.enabled;
        });
        if (modified) {
          localStorage.setItem('sys_subsystems', JSON.stringify(parsed));
        }
        setSubsystemStatuses(map);
      } catch (e) {
        console.error('Failed to parse subsystems', e);
      }
    } else {
      // Default fallback
      setSubsystemStatuses({
        data: true,
        instr: true,
        teach: true,
        exam: true,
        vr: true, // Auto loaded
        res: true,
        rem: true,
        haz: true,
        env: true,
        asset: true,
      });
    }

    // Load custom school credentials config
    const storedConfig = localStorage.getItem('sys_config');
    if (storedConfig) {
      try {
        const parsed = JSON.parse(storedConfig);
        if (parsed.schoolName) setSchoolName(parsed.schoolName);
        if (parsed.systemLogo) setSystemLogo(parsed.systemLogo);
      } catch (e) {
        console.error('Failed to parse config', e);
      }
    }
  }, []);

  const handleSystemClick = (id: string, name: string) => {
    // If state does not exist in our map, we assume it is enabled by default
    const isEnabled = subsystemStatuses[id] !== false;
    
    if (isEnabled) {
      onSelect(id);
    } else {
      setToastMessage(`⚠️【隔离策略】子系统「${name}」已被系统管理员设置为【脱机封锁】或处于例行检修改版维护状态。请联系学校信息中心重新装载挂载！`);
      setTimeout(() => {
        setToastMessage(null);
      }, 4000);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-[var(--bg-main)] overflow-hidden transition-colors">
      <Navbar onLogout={onLogout} />

      <main className="flex-1 overflow-y-auto p-8 relative transition-colors">
        {/* Subtle pattern background */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none -z-10">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dotGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dotGrid)" />
           </svg>
        </div>

        <div className="max-w-[1400px] mx-auto space-y-12">
          {/* Hero Section */}
          <section className="text-center space-y-4 max-w-2xl mx-auto py-8">
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4"
             >
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                欢迎进入数字化管理空间 • @{schoolName}
             </motion.div>
             <h2 className="text-4xl font-extrabold tracking-tight text-black dark:text-white">
               核心业务子系统调度中心
             </h2>
             <p className="text-slate-900 dark:text-slate-300 text-sm leading-relaxed">
               依托统一平台大架构，快速访问并监管实验室的所有核心业务岗位。点击子系统入口进行业务分配，您可以通过右上角的设置按钮调整账号权限及挂载参数。
             </p>
          </section>

          {/* Grid of cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {systems.map((sys, idx) => {
              const isEnabled = subsystemStatuses[sys.id] !== false;
              
              return (
                <motion.button
                  key={sys.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleSystemClick(sys.id, sys.name)}
                  className={cn(
                    "group relative flex flex-col items-center p-8 pro-card h-56 transition-all",
                    isEnabled 
                      ? "hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 cursor-pointer" 
                      : "opacity-60 border-dashed border-slate-200 dark:border-white/5 cursor-not-allowed bg-slate-50/10 dark:bg-slate-900/10"
                  )}
                >
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg transition-all",
                    isEnabled ? sys.color + " group-hover:scale-110" : "bg-slate-350 dark:bg-slate-800 text-slate-400"
                  )}>
                     <sys.icon size={32} />
                  </div>
                  
                  <h3 className={cn(
                    "font-bold text-sm mb-1 text-black dark:text-slate-200 transition-colors uppercase tracking-tight",
                    !isEnabled && "text-slate-500 dark:text-slate-500"
                  )}>
                    {sys.name}
                  </h3>
                  
                  <p className="text-[9px] text-slate-600 dark:text-slate-450 font-mono tracking-widest leading-none">
                    {isEnabled ? sys.sub : "MAINTENANCE"}
                  </p>
                  
                  {/* Status Indicator Overlays */}
                  {isEnabled ? (
                    <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-blue-600 dark:text-blue-500 text-[10px] font-bold uppercase tracking-widest">
                      进入系统 <ChevronRight size={10} />
                    </div>
                  ) : (
                    <div className="absolute bottom-6 flex items-center gap-1 text-rose-500 text-[9px] font-black uppercase tracking-widest bg-rose-50 dark:bg-rose-500/15 border border-rose-200/50 dark:border-rose-500/20 px-2 py-0.5 rounded-lg">
                      <Lock size={10} /> 未装载
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Key Indicators Row */}
          <div className="pro-card p-8 bg-[var(--card-bg)]/50 backdrop-blur-sm grid grid-cols-1 md:grid-cols-4 gap-8 divide-x divide-slate-100 dark:divide-white/5">
            {[
              { label: '实验室管理总架构', value: schoolName, sub: '授权核心节点', color: 'text-blue-700 dark:text-blue-400 truncate max-w-[200px] text-lg' },
              { label: '注册活跃设备', value: '2,685', sub: '台活跃资产在线并入', color: 'text-indigo-700 dark:text-indigo-400 font-mono text-3xl' },
              { label: '系统挂载状态', value: '良好', sub: '底层微物理单元就绪', color: 'text-emerald-700 dark:text-emerald-400 text-3xl' },
              { label: '安全等保等级', value: '二级等保', sub: '国家公安部合规认证', color: 'text-black dark:text-slate-200 text-lg' },
            ].map((stat, i) => (
              <div key={i} className={cn("px-4 first:pl-0 text-center md:text-left", i > 0 && "md:pl-8")}>
                <p className="text-[10px] text-slate-800 dark:text-slate-400 uppercase font-bold tracking-widest mb-2">{stat.label}</p>
                <div className="flex flex-col">
                  {i === 0 || i === 3 ? (
                    <span className={cn("font-black tracking-tight", stat.color)}>{stat.value}</span>
                  ) : (
                    <span className={cn("font-black font-mono tracking-tighter", stat.color)}>{stat.value}</span>
                  )}
                  <span className="text-[10px] text-slate-700 dark:text-slate-400 mt-1">{stat.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="footer-bar h-12 flex items-center justify-between px-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-6 text-[10px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-[0.2em]">
           <span>Services</span>
           <span>Privacy</span>
           <span>Status: 100% ONLINE</span>
        </div>
        <p className="text-[10px] text-slate-650 dark:text-slate-300 font-semibold font-mono">© 2026 {systemLogo}</p>
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-700 dark:text-slate-400">
          <span className="w-2 h-2 bg-emerald-500 rounded-full编制 animate-pulse" />
          SYSTEM_TIME_AUTOSYNC: ONLINE
        </div>
      </footer>

      {/* ERROR TOAST overlay */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-lg z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-800 flex items-start gap-3"
          >
            <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={16} />
            <span className="text-xs font-bold leading-normal">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
