import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  ShieldAlert, 
  Settings, 
  Layers, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  RotateCcw, 
  Check, 
  X, 
  ArrowLeft, 
  Download, 
  Save, 
  Database, 
  Lock, 
  User, 
  Clock, 
  Power, 
  Eye, 
  EyeOff, 
  CheckSquare, 
  Square,
  Filter,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  MoreVertical,
  Activity
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { cn } from '../lib/utils';

// Interfaces
interface UserAccount {
  id: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  role: string;
  status: 'active' | 'disabled';
  createdAt: string;
}

interface SystemRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface LogEntry {
  id: string;
  time: string;
  operator: string;
  roleName: string;
  action: string;
  category: 'account' | 'permission' | 'config' | 'system';
  ip: string;
  status: '成功' | '失败';
  device: string;
}

const MODULE_NAMES: Record<string, string> = {
  data: '大数据可视化中心',
  instr: '智慧无感仪器管理',
  teach: '实验室教学管理',
  exam: '实验操作考试',
  vr: '虚拟仿真测试',
  res: '实验教学资源',
  rem: '远程在线巡课',
  haz: '智慧危化品管理',
  env: '环境监测预警',
  asset: '固定资产管理',
};

const DEFAULT_USERS: UserAccount[] = [
  { id: 'U1001', name: '系统管理员', username: 'admin', phone: '13888888888', email: 'admin@xyzx.edu.cn', role: 'SuperAdmin', status: 'active', createdAt: '2024-01-10' },
  { id: 'U1002', name: '物理主管张老师', username: 'zhang_phys', phone: '13566667777', email: 'zhang.phys@xyzx.edu.cn', role: 'Teacher', status: 'active', createdAt: '2024-02-20' },
  { id: 'U1003', name: '化学实验王老师', username: 'wang_chem', phone: '13911112222', email: 'wang.chem@xyzx.edu.cn', role: 'LabAdmin', status: 'active', createdAt: '2024-05-15' },
  { id: 'U1004', name: '实验教学副校长', username: 'li_principal', phone: '13612344321', email: 'li.principal@xyzx.edu.cn', role: 'SchoolAdmin', status: 'active', createdAt: '2024-05-18' },
  { id: 'U1005', name: '危化安全审计员', username: 'zhao_audit', phone: '13799998888', email: 'zhao.audit@xyzx.edu.cn', role: 'Auditor', status: 'active', createdAt: '2025-01-05' },
  { id: 'U1006', name: '外部临时测试号', username: 'test_temp', phone: '18888888888', email: 'temp_test@xyzx.edu.cn', role: 'Teacher', status: 'disabled', createdAt: '2026-03-12' },
];

const DEFAULT_ROLES: SystemRole[] = [
  { id: 'SuperAdmin', name: '超级管理员', description: '具备全权管理机制，负责主数据维护、配置系统全量底层底座参数、审计安全策略。', permissions: ['data', 'instr', 'teach', 'exam', 'vr', 'res', 'rem', 'haz', 'env', 'asset'] },
  { id: 'SchoolAdmin', name: '学校管理员', description: '负责全校各类型实验室的宏观规划、开放审核、实验绩效数据查阅和资产追溯。', permissions: ['data', 'teach', 'exam', 'res', 'rem', 'asset'] },
  { id: 'LabAdmin', name: '专业实验室管理员', description: '负责具体专业实验室（物化生）的常用耗材备库、重点精尖设备保管与危化品领退登记。', permissions: ['instr', 'teach', 'res', 'haz', 'env'] },
  { id: 'Teacher', name: '任课/授课教师', description: '负责排课申请、实验课前安全教育课件上传、学生考核录入，并获取相关微课资源。', permissions: ['teach', 'res'] },
  { id: 'Auditor', name: '独立审计安全总监', description: '专门针对危化品流转状态、危险废物集中处置、环境实时告警解除等敏感合规操作进行双盲核对与专项监督。', permissions: ['haz', 'env', 'asset'] },
];

const DEFAULT_CONFIG = {
  schoolName: '咸阳市实验中学',
  systemLogo: 'SHAANXI LABORATORY INTEGRATED PLATFORM',
  sessionTimeout: '45',
  backupInterval: 'daily',
  loggingLevel: 'all',
  autoSync: true,
};

const DEFAULT_SUBSYSTEMS = [
  { id: 'data', name: '大数据可视化中心', description: '实验室全景态势感知与多维核心指标集中看板。', defaultEnabled: true },
  { id: 'instr', name: '智慧无感仪器管理', description: '基于超高频RFID无感盘点的精密大型科学仪器流转管理。', defaultEnabled: true },
  { id: 'teach', name: '实验室教学管理', description: '开放预约排程、班级流转实验课排课系统及考勤。', defaultEnabled: true },
  { id: 'exam', name: '实验操作考试', description: '考务统筹、人工智能录像行为判定及操作精细化评分。', defaultEnabled: true },
  { id: 'vr', name: '虚拟仿真测试', description: '3D沉浸式微观物理、极高危化学虚拟复现实验操作台。', defaultEnabled: true }, // Default enabled to mount on start
  { id: 'res', name: '实验教学资源', description: '标准化学案、AR实验课件、多媒体试题知识图谱。', defaultEnabled: true },
  { id: 'rem', name: '远程在线巡课', description: '多路低延迟直播级视频流，满足日常网格化教研督导。', defaultEnabled: true },
  { id: 'haz', name: '智慧危化品管理', description: '重点监管及剧毒、易制毒化学品双人双锁全周期追溯。', defaultEnabled: true },
  { id: 'env', name: '环境监测预警', description: '一氧化碳、氧含量、漏水及挥发性有机物二十四小时红外探测。', defaultEnabled: true },
  { id: 'asset', name: '固定资产管理', description: '高价值折旧计算、国资产权变更与仪器寿命演变追溯。', defaultEnabled: true },
];

const DEFAULT_LOGS: LogEntry[] = [
  { id: 'L3011', time: '2026-05-20 10:15:32', operator: 'admin', roleName: '超级管理员', action: '启用了「虚拟仿真测试」子系统外部控制接口', category: 'system', ip: '192.168.1.100', status: '成功', device: 'Edge / macOS' },
  { id: 'L3012', time: '2026-05-20 09:44:12', operator: 'admin', roleName: '超级管理员', action: '更新了「咸阳市实验中学」全局备份策略为每日自动上云', category: 'config', ip: '192.168.1.100', status: '成功', device: 'Chrome / Windows' },
  { id: 'L3013', time: '2026-05-20 08:30:15', operator: 'wang_chem', roleName: '实验教师/管理员', action: '执行危险废液全生命周期终结核查申报', category: 'system', ip: '192.168.10.45', status: '成功', device: 'Safari / iPad OS' },
  { id: 'L3014', time: '2026-05-19 16:22:10', operator: 'admin', roleName: '超级管理员', action: '重置了普通授课教师「王老师」的登录动态口令密匙', category: 'account', ip: '192.168.1.100', status: '成功', device: 'Chrome / Windows' },
  { id: 'L3015', time: '2026-05-19 14:10:05', operator: 'li_principal', roleName: '学校管理员', action: '尝试在未授权终端修改「剧毒化学物质配额方案」', category: 'permission', ip: '10.200.5.12', status: '失败', device: 'Firefox / Linux' },
  { id: 'L3016', time: '2026-05-19 10:05:40', operator: 'admin', roleName: '超级管理员', action: '移除了异常访问测试账户（ID: U1008）', category: 'account', ip: '192.168.1.102', status: '成功', device: 'Chrome / Windows' },
  { id: 'L3017', time: '2026-05-18 11:40:00', operator: 'zhao_audit', roleName: '安全审计员', action: '审核通过了放射源红外双路监视系统告警重置设定', category: 'system', ip: '192.168.12.8', status: '成功', device: 'Edge / Windows' },
];

export const SystemSettingsView: React.FC<{ onBack: () => void; onLogout: () => void }> = ({ onBack, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'config' | 'subsystems' | 'logs'>('users');
  
  // Persistence states
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [roles, setRoles] = useState<SystemRole[]>([]);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [subsystems, setSubsystems] = useState<{ id: string; name: string; description: string; enabled: boolean }[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Feedback notifications
  const [tosat, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Load and Init from LocalStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem('sys_users');
    const storedRoles = localStorage.getItem('sys_roles');
    const storedConfig = localStorage.getItem('sys_config');
    const storedSubsystems = localStorage.getItem('sys_subsystems');
    const storedLogs = localStorage.getItem('sys_logs');

    if (storedUsers) setUsers(JSON.parse(storedUsers));
    else {
      setUsers(DEFAULT_USERS);
      localStorage.setItem('sys_users', JSON.stringify(DEFAULT_USERS));
    }

    if (storedRoles) setRoles(JSON.parse(storedRoles));
    else {
      setRoles(DEFAULT_ROLES);
      localStorage.setItem('sys_roles', JSON.stringify(DEFAULT_ROLES));
    }

    if (storedConfig) setConfig(JSON.parse(storedConfig));
    else {
      setConfig(DEFAULT_CONFIG);
      localStorage.setItem('sys_config', JSON.stringify(DEFAULT_CONFIG));
    }

    if (storedSubsystems) {
      try {
        const parsed = JSON.parse(storedSubsystems);
        let modified = false;
        const verified = parsed.map((s: any) => {
          if (s.id === 'vr' && s.enabled === false) {
            modified = true;
            return { ...s, enabled: true };
          }
          return s;
        });
        if (modified) {
          localStorage.setItem('sys_subsystems', JSON.stringify(verified));
        }
        setSubsystems(verified);
      } catch (e) {
        setSubsystems(DEFAULT_SUBSYSTEMS.map(s => ({ id: s.id, name: s.name, description: s.description, enabled: s.defaultEnabled })));
      }
    } else {
      const initialSub = DEFAULT_SUBSYSTEMS.map(s => ({ id: s.id, name: s.name, description: s.description, enabled: s.defaultEnabled }));
      setSubsystems(initialSub);
      localStorage.setItem('sys_subsystems', JSON.stringify(initialSub));
    }

    if (storedLogs) setLogs(JSON.parse(storedLogs));
    else {
      setLogs(DEFAULT_LOGS);
      localStorage.setItem('sys_logs', JSON.stringify(DEFAULT_LOGS));
    }
  }, []);

  // Show customized feedback toasts
  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  // Log automated system audits
  const addAuditLog = (action: string, category: 'account' | 'permission' | 'config' | 'system' = 'system', status: '成功' | '失败' = '成功') => {
    const newLog: LogEntry = {
      id: 'L' + (Math.floor(Math.random() * 9000) + 1000),
      time: new Date().toISOString().replace('T', ' ').slice(0, 19),
      operator: 'admin',
      roleName: '超级管理员',
      action,
      category,
      ip: '192.168.1.100',
      status,
      device: 'Chrome / React GUI'
    };
    const updated = [newLog, ...logs];
    setLogs(updated);
    localStorage.setItem('sys_logs', JSON.stringify(updated));
  };

  // ----- TAB 1: USER MANAGEMENT LOGICS -----
  const [userSearch, setUserSearch] = useState('');
  const [selectedUserRoleFilter, setSelectedUserRoleFilter] = useState('all');
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  
  // Add/Edit user form fields
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState('Teacher');
  const [formStatus, setFormStatus] = useState<'active' | 'disabled'>('active');

  const handleOpenUserDrawer = (user?: UserAccount) => {
    if (user) {
      setEditingUser(user);
      setFormName(user.name);
      setFormUsername(user.username);
      setFormPhone(user.phone);
      setFormEmail(user.email);
      setFormRole(user.role);
      setFormStatus(user.status);
    } else {
      setEditingUser(null);
      setFormName('');
      setFormUsername('');
      setFormPhone('');
      setFormEmail('');
      setFormRole('Teacher');
      setFormStatus('active');
    }
    setIsUserDrawerOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formUsername.trim()) {
      triggerToast('姓名与账号名不可为空！', 'error');
      return;
    }

    let updatedUsers = [...users];

    if (editingUser) {
      // Edit mode
      updatedUsers = users.map(u => u.id === editingUser.id ? {
        ...u,
        name: formName,
        username: formUsername,
        phone: formPhone,
        email: formEmail,
        role: formRole,
        status: formStatus
      } : u);
      triggerToast(`账号 [${formUsername}] 更新成功`);
      addAuditLog(`更新了用户账号资料: ${formName} (${formUsername})`, 'account');
    } else {
      // Create mode
      const isExist = users.some(u => u.username === formUsername);
      if (isExist) {
        triggerToast('该账号登录名已存在！', 'error');
        return;
      }
      const newUser: UserAccount = {
        id: 'U' + (Math.floor(Math.random() * 9000) + 1000),
        name: formName,
        username: formUsername,
        phone: formPhone,
        email: formEmail,
        role: formRole,
        status: formStatus,
        createdAt: new Date().toISOString().split('T')[0]
      };
      updatedUsers.push(newUser);
      triggerToast(`账号 [${formUsername}] 创建成功`);
      addAuditLog(`创建了全新业务账号: ${formName} (${formUsername}) 作为 [${roles.find(r => r.id === formRole)?.name}]`, 'account');
    }

    setUsers(updatedUsers);
    localStorage.setItem('sys_users', JSON.stringify(updatedUsers));
    setIsUserDrawerOpen(false);
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (id === 'U1001') {
      triggerToast('保护限制: 系统内置超级管理员不可被注销！', 'error');
      return;
    }
    if (confirm(`确定要注销并永久删除用户 [${name}] 的系统账号吗？`)) {
      const updated = users.filter(u => u.id !== id);
      setUsers(updated);
      localStorage.setItem('sys_users', JSON.stringify(updated));
      triggerToast(`用户账号 ${name} 已彻底移除`);
      addAuditLog(`注销并移除了系统用户账号: ${name}`, 'account', '成功');
    }
  };

  const handleToggleUserStatus = (id: string, name: string, current: 'active' | 'disabled') => {
    if (id === 'U1001') {
      triggerToast('超级管理员不能禁用！', 'error');
      return;
    }
    const targetStatus = current === 'active' ? 'disabled' : 'active';
    const updated = users.map(u => u.id === id ? { ...u, status: targetStatus } : u);
    setUsers(updated);
    localStorage.setItem('sys_users', JSON.stringify(updated));
    triggerToast(`登录账号 ${name} 已被${targetStatus === 'active' ? '锁定恢复' : '隔离禁用'}`);
    addAuditLog(`${targetStatus === 'active' ? '启用' : '禁用'}了用户账号: ${name}`, 'account');
  };

  const handleResetPassword = (name: string, username: string) => {
    triggerToast(`重置口令成功！新口令为xyzx@2026_sh, 临时凭证在5分钟内有效`, 'success');
    addAuditLog(`重置了教职工「${name} (${username})」的主控制台登录密钥`, 'account');
  };

  // Filtered Users List
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          user.username.toLowerCase().includes(userSearch.toLowerCase()) ||
                          user.phone.includes(userSearch);
    const matchesRole = selectedUserRoleFilter === 'all' || user.role === selectedUserRoleFilter;
    return matchesSearch && matchesRole;
  });


  // ----- TAB 2: ROLE MANAGEMENT LOGICS -----
  const [selectedRoleId, setSelectedRoleId] = useState('SuperAdmin');
  
  const handleTogglePermission = (subsystemId: string) => {
    if (selectedRoleId === 'SuperAdmin') {
      triggerToast('超级管理员默认开启所有控制权限，无法减少！', 'error');
      return;
    }

    const updatedRoles = roles.map(r => {
      if (r.id === selectedRoleId) {
        const fileExists = r.permissions.includes(subsystemId);
        let newPerms = [...r.permissions];
        if (fileExists) {
          newPerms = newPerms.filter(p => p !== subsystemId);
        } else {
          newPerms.push(subsystemId);
        }
        return { ...r, permissions: newPerms };
      }
      return r;
    });

    setRoles(updatedRoles);
    localStorage.setItem('sys_roles', JSON.stringify(updatedRoles));
    triggerToast(`角色控制权限表已更新`);
    addAuditLog(`修改角色「${roles.find(r => r.id === selectedRoleId)?.name}」对「${MODULE_NAMES[subsystemId]}」的访问控制权`, 'permission');
  };

  // ----- TAB 3: GLOBAL CONFIG LOGICS -----
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sys_config', JSON.stringify(config));
    triggerToast('底层基础框架运行环境参数保存成功');
    addAuditLog(`更新了全局运行配置参数 (学校名称, 加载负载级别等)`, 'config');
  };

  // ----- TAB 4: SUBSYSTEM LOGICS -----
  const handleToggleSubsystem = (id: string, active: boolean) => {
    const updated = subsystems.map(s => s.id === id ? { ...s, enabled: active } : s);
    setSubsystems(updated);
    localStorage.setItem('sys_subsystems', JSON.stringify(updated));
    triggerToast(`子系统 [${MODULE_NAMES[id]}] 初始化挂载状态: ${active ? '装载活跃' : '屏蔽脱机'}`);
    addAuditLog(`${active ? '开启并挂载' : '屏蔽卸载'}了业务系统控制器: ${MODULE_NAMES[id]}`, 'system');
  };

  // ----- TAB 5: AUDIT LOGS LOGICS -----
  const [logFilterQuery, setLogFilterQuery] = useState('');
  const [logCategoryFilter, setLogCategoryFilter] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.operator.toLowerCase().includes(logFilterQuery.toLowerCase()) || 
                          log.action.toLowerCase().includes(logFilterQuery.toLowerCase());
    const matchesCategory = logCategoryFilter === 'all' || log.category === logCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleExportLogs = () => {
    const header = 'ID,时间,操作员,角色类型,操作行踪,模块类型,IP来源,审计状态,设备特征\n';
    const rows = filteredLogs.map(l => 
      `"${l.id}","${l.time}","${l.operator}","${l.roleName}","${l.action.replace(/"/g, '""')}","${l.category}","${l.ip}","${l.status}","${l.device}"`
    ).join('\n');
    
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `xyzx_laboratory_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    triggerToast('全系统审计报表已导出至您的安全终端', 'success');
    addAuditLog('触发了全量系统安全事件审计报表下载', 'config');
  };

  const handleRefreshState = () => {
    triggerToast('运行状态正在刷新...', 'info');
    setTimeout(() => {
      triggerToast('所有模块心跳连接正常，状态更新完毕', 'success');
    }, 600);
  };

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden bg-[var(--bg-main)] transition-colors text-slate-700 dark:text-slate-300">
      <Navbar onLogout={onLogout} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Navigation Sidebar */}
        <aside className="w-64 bg-[var(--card-bg)] border-r border-slate-200 dark:border-white/10 flex flex-col z-20 shrink-0 transition-colors">
          <div className="p-5 flex flex-col gap-4">
            <button 
              onClick={onBack}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all w-full text-left"
              title="返回总门户"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-bold">返回工作台门户</span>
            </button>
            
            <div className="h-px bg-slate-100 dark:bg-white/5" />
          </div>

          <p className="px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">安全与控制中心</p>
          <nav className="flex-1 px-3 space-y-1">
            {[
              { id: 'users', label: '账号用户管理', icon: Users, desc: '控制全系统登入人员' },
              { id: 'roles', label: '系统角色授权', icon: ShieldAlert, desc: '细粒度安全角色指派' },
              { id: 'subsystems', label: '业务子系统装载', icon: Layers, desc: '挂载及屏蔽特定子系统' },
              { id: 'config', label: '基础运行配置', icon: Settings, desc: '底层基础备份与偏好' },
              { id: 'logs', label: '安全审计日志', icon: Database, desc: '追溯系统事件轨迹' },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={cn(
                    "w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-left group",
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/15" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-lg transition-colors shrink-0",
                    isActive ? "bg-white/15" : "bg-slate-100 dark:bg-white/5 group-hover:bg-slate-200 dark:group-hover:bg-white/10 text-slate-500 dark:text-slate-400"
                  )}>
                    <Icon size={16} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold truncate leading-none mb-1">{item.label}</span>
                    <span className={cn("text-[9px] truncate font-medium", isActive ? "text-blue-100" : "text-slate-400")}>{item.desc}</span>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="p-4 m-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">系统负载良好</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">咸阳实验智慧内网底盘。保障级别: AAA合规</p>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-[1200px] mx-auto space-y-6">
            
            {/* Tab Header Zone */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-6">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 rounded text-[9px] font-extrabold uppercase tracking-widest">
                    SYSTEM SETTINGS
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">/</span>
                  <span className="text-xs font-bold text-slate-400">
                    {activeTab === 'users' && '用户登录名与系统账号矩阵'}
                    {activeTab === 'roles' && '模块节点访问控制（RBAC）'}
                    {activeTab === 'subsystems' && '总控门户大类子系统装载清单'}
                    {activeTab === 'config' && '全局元数据与系统灾备规划'}
                    {activeTab === 'logs' && '国家二级等保安全追溯审计'}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                  {activeTab === 'users' && '系统主账号池管理'}
                  {activeTab === 'roles' && '岗位角色与特权模型'}
                  {activeTab === 'subsystems' && '多维度子系统软停用'}
                  {activeTab === 'config' && '基础环境运行配置'}
                  {activeTab === 'logs' && '行为链审计追踪平台'}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={handleRefreshState}
                  className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center gap-2 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-500 hover:text-blue-500 shadow-sm"
                >
                  <RefreshCw size={13} />
                  <span>刷新连接</span>
                </button>
                {activeTab === 'users' && (
                  <button 
                    onClick={() => handleOpenUserDrawer()}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 text-xs font-bold transition-all shadow-md shadow-blue-500/15"
                  >
                    <Plus size={15} />
                    <span>添加全新账号</span>
                  </button>
                )}
                {activeTab === 'logs' && (
                  <button 
                    onClick={handleExportLogs}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 text-xs font-bold transition-all shadow-md shadow-emerald-500/15"
                  >
                    <Download size={15} />
                    <span>导出合规报表</span>
                  </button>
                )}
              </div>
            </div>

            {/* TAB INTERFACES */}
            
            {/* 1. USERS LIST VIEW */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                {/* Filters */}
                <div className="pro-card p-4 flex flex-col sm:flex-row gap-4 items-center justify-between bg-[var(--card-bg)] border border-slate-200 dark:border-white/10">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="检索姓名、登录账号、电话..." 
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                    <Filter size={13} className="text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-400">过滤身份:</span>
                    <select 
                      value={selectedUserRoleFilter} 
                      onChange={e => setSelectedUserRoleFilter(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 px-3 py-1.5 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">显示系统全部</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Users Table */}
                <div className="pro-card bg-[var(--card-bg)] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-white/5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          <th className="px-6 py-4">基础信息</th>
                          <th className="px-6 py-4">登录凭架 / 状态</th>
                          <th className="px-6 py-4">角色身份</th>
                          <th className="px-6 py-4">联系保障</th>
                          <th className="px-6 py-4">创建时间</th>
                          <th className="px-6 py-4 text-right">管理控制项</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                        <AnimatePresence mode="popLayout">
                          {filteredUsers.map((user) => {
                            const userRoleName = roles.find(r => r.id === user.role)?.name || '未知岗位';
                            return (
                              <motion.tr 
                                key={user.id}
                                layoutId={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className={cn(
                                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs select-none shadow-sm",
                                      user.status === 'disabled' 
                                        ? "bg-slate-100 dark:bg-slate-800 text-slate-400" 
                                        : "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                    )}>
                                      {user.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                                        <span>{user.name}</span>
                                        {user.id === 'U1001' && (
                                          <span className="bg-red-150 dark:bg-red-500/10 hover:bg-red-500/15 border border-red-200 dark:border-red-500/20 text-red-500 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider scale-90">
                                            保护型
                                          </span>
                                        )}
                                      </p>
                                      <p className="text-[10px] text-slate-400 font-mono">UID: {user.id}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="space-y-1.5">
                                    <span className="font-mono bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded text-[10px] font-medium">@{user.username}</span>
                                    <div className="flex items-center gap-1.5">
                                      <span className={cn(
                                        "w-1.5 h-1.5 rounded-full",
                                        user.status === 'active' ? "bg-emerald-500" : "bg-rose-500"
                                      )} />
                                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                        {user.status === 'active' ? '正常服务中' : '限制访问/锁定'}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 rounded-lg bg-blue-100/50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px]">
                                    {userRoleName}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="font-semibold text-[11px] text-slate-600 dark:text-slate-300 font-mono">{user.phone}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">{user.email || '未绑定邮箱'}</p>
                                </td>
                                <td className="px-6 py-4 text-[11px] text-slate-400 font-mono">
                                  {user.createdAt}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button 
                                      onClick={() => handleResetPassword(user.name, user.username)}
                                      className="p-1 px-2 rounded hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-blue-500 text-[10px] font-bold flex items-center gap-1 transition-colors border border-transparent"
                                      title="重置登录密钥"
                                    >
                                      <RotateCcw size={12} className="shrink-0" />
                                      <span>重置口令</span>
                                    </button>
                                    <button 
                                      onClick={() => handleToggleUserStatus(user.id, user.name, user.status)}
                                      className={cn(
                                        "p-1.5 rounded hover:bg-slate-150 dark:hover:bg-white/5 transition-colors",
                                        user.status === 'active' ? "text-amber-500 hover:text-amber-600" : "text-emerald-500 hover:text-emerald-600"
                                      )}
                                      title={user.status === 'active' ? '锁定停用' : '解锁启用'}
                                    >
                                      <Power size={13} />
                                    </button>
                                    <button 
                                      onClick={() => handleOpenUserDrawer(user)}
                                      className="p-1.5 rounded hover:bg-slate-150 dark:hover:bg-white/5 text-blue-500 hover:text-blue-600 transition-colors"
                                      title="编辑资料"
                                    >
                                      <Edit size={13} />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteUser(user.id, user.name)}
                                      className={cn(
                                        "p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors",
                                        user.id === 'U1001' ? "text-slate-300 dark:text-slate-700 cursor-not-allowed" : "text-red-500 hover:text-red-600"
                                      )}
                                      title="注销账号"
                                      disabled={user.id === 'U1001'}
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </motion.tr>
                            );
                          })}
                        </AnimatePresence>
                        
                        {filteredUsers.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-xs">
                              <User size={36} className="mx-auto mb-2 opacity-20" />
                              <p className="font-medium">无匹配的教职工账号结果</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Additional Guidelines Banner */}
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5 flex items-start gap-4">
                  <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                    <ShieldAlert size={18} />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-extrabold text-slate-800 dark:text-white">等保二级合规审计提示</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                      本系统账号实行实名制绑定，所有新加入的教职工账号均会被写入系统全局审计日志中。首次登录的用户必须通过绑定的安全邮箱/手机，重新校准一次独立密匙才可开启实验室管理及排课相关的操作。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ROLE & DYNAMICS PERMISSIONS RBAC */}
            {activeTab === 'roles' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Visual Roles Sidebar */}
                <div className="space-y-3 md:col-span-1">
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase px-1">角色类型选择列表</p>
                  {roles.map((r) => {
                    const isSelected = selectedRoleId === r.id;
                    const membersLength = users.filter(u => u.role === r.id).length;
                    
                    return (
                      <button
                        key={r.id}
                        onClick={() => setSelectedRoleId(r.id)}
                        className={cn(
                          "w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between group cursor-pointer",
                          isSelected 
                            ? "bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-500/30 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/30" 
                            : "bg-[var(--card-bg)] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"
                        )}
                      >
                        <div className="space-y-1.5 pr-2 min-w-0">
                          <h4 className={cn(
                            "font-bold text-sm transition-colors",
                            isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-800 dark:text-slate-200"
                          )}>
                            {r.name}
                          </h4>
                          <p className="text-[10px] text-slate-450 dark:text-slate-400 truncate max-w-[170px]">
                            {r.description}
                          </p>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-1 font-mono">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[9px] font-bold",
                            isSelected ? "bg-blue-50 dark:bg-blue-500/20 text-blue-600" : "bg-slate-100 dark:bg-white/5 text-slate-400"
                          )}>
                            {membersLength} 名成员
                          </span>
                          <span className="text-[9px] text-slate-300 dark:text-slate-700">{r.id}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Permissions Panel */}
                <div className="md:col-span-2 space-y-4">
                  {(() => {
                    const activeRole = roles.find(r => r.id === selectedRoleId);
                    if (!activeRole) return null;
                    const associatedUsers = users.filter(u => u.role === activeRole.id);
                    
                    return (
                      <div className="pro-card p-6 bg-[var(--card-bg)] border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
                        
                        {/* Header metadata */}
                        <div className="space-y-2 border-b border-slate-100 dark:border-white/5 pb-5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono tracking-widest text-blue-500 font-extrabold uppercase">ROLE MATRIX NODE: {activeRole.id}</span>
                            <span className="text-[11px] text-slate-400 font-semibold">该岗位目前绑定了 {associatedUsers.length} 个账号</span>
                          </div>
                          <h3 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                            <span>{activeRole.name}</span>
                            <span className="text-xs text-slate-400 font-normal">功能模块配额权限</span>
                          </h3>
                          <p className="text-xs text-slate-400 leading-relaxed font-medium">
                            {activeRole.description}
                          </p>
                          
                          {/* Members strip */}
                          {associatedUsers.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-3">
                              <span className="text-[10px] text-slate-400 font-bold mr-1">现有登录账户:</span>
                              {associatedUsers.map(au => (
                                <span key={au.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-105 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 text-[10px] text-slate-500 font-mono">
                                  {au.name} (@{au.username})
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Subsystem Toggles matrix */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">细粒度子系统大类授权 (勾选即分配访问权限)</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {subsystems.map((sub) => {
                              const isPermEnabled = activeRole.permissions.includes(sub.id);
                              const isSuperAdmin = activeRole.id === 'SuperAdmin';
                              const subNameOrig = MODULE_NAMES[sub.id] || sub.id;
                              
                              return (
                                <button
                                  key={sub.id}
                                  onClick={() => handleTogglePermission(sub.id)}
                                  className={cn(
                                    "flex items-start gap-3.5 p-3.5 rounded-xl border text-left cursor-pointer transition-all",
                                    isPermEnabled 
                                      ? "bg-blue-50/15 dark:bg-blue-500/[0.02] border-blue-200/60 dark:border-blue-500/20" 
                                      : "bg-slate-50/30 dark:bg-slate-900/10 border-slate-150 dark:border-white/5 text-slate-400"
                                  )}
                                  style={{ cursor: isSuperAdmin ? 'not-allowed' : 'pointer' }}
                                  disabled={isSuperAdmin}
                                >
                                  <div className="mt-0.5 shrink-0">
                                    {isPermEnabled ? (
                                      <div className="text-blue-600 dark:text-blue-400">
                                        <CheckSquare size={17} strokeWidth={2.5} />
                                      </div>
                                    ) : (
                                      <div className="text-slate-300 dark:text-slate-700">
                                        <Square size={17} />
                                      </div>
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1.5">
                                      <h5 className={cn(
                                        "text-xs font-bold transition-colors",
                                        isPermEnabled ? "text-slate-800 dark:text-slate-200" : "text-slate-450 dark:text-slate-500"
                                      )}>
                                        {subNameOrig}
                                      </h5>
                                      {!sub.enabled && (
                                        <span className="bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 px-1 py-0.2 rounded text-[7px] font-black tracking-wider scale-90">
                                          脱机
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[9.5px] text-slate-400 font-medium leading-relaxed">
                                      {sub.description}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Guard Disclaimer */}
                        <div className="pt-2 border-t border-slate-100 dark:border-white/5 text-[10px] text-slate-400 flex items-start gap-2 leading-relaxed">
                          <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                          <p>
                            <strong>基于角色的权限控制策略 (RBAC.v2.0):</strong> 修改特定岗位的子系统授权，其对应的所有分配账号将于下一次登入中继凭证激活时即刻生效。不影响当期正在进行中或离线持久的任务会话。
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* 3. SUBSYSTEMS CONTROLLERS (MOUNT/DISMOUNT) */}
            {activeTab === 'subsystems' && (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
                    <Layers size={16} className="text-blue-500" />
                    <span>总控制门户子系统生命周期挂载</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    管理员可在本级随时对平台顶盘包含的10个主要功能单元执行「联机挂载」或「屏蔽脱机」操作。脱机的系统不仅不可点击，在主门户上也会处于被锁定、无法非法渗透的状态，用来应对业务期未到（如：实验考试未开启）、例行检修维护、或者资源服务暂时断网等真实场景。
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subsystems.map((sub) => {
                    const subName = MODULE_NAMES[sub.id] || sub.id;
                    return (
                      <div 
                        key={sub.id}
                        className={cn(
                          "pro-card p-5 bg-[var(--card-bg)] border transition-all flex items-start justify-between gap-4 shadow-sm",
                          sub.enabled 
                            ? "border-slate-200 dark:border-white/10" 
                            : "border-dashed border-slate-200 bg-slate-50/20 dark:border-white/5 opacity-80"
                        )}
                      >
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "w-2 h-2 rounded-full",
                              sub.enabled ? "bg-emerald-500 animate-pulse" : "bg-slate-350 dark:bg-slate-700"
                            )} />
                            <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">{subName}</h4>
                            <span className="font-mono text-[9px] text-slate-400 bg-slate-100 dark:bg-white/5 px-1.5 py-0.2 rounded">
                              {sub.id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-medium leading-relaxed">
                            {sub.description}
                          </p>
                        </div>

                        {/* Real-time Toggle Switch */}
                        <div className="shrink-0 flex items-center">
                          <button
                            onClick={() => handleToggleSubsystem(sub.id, !sub.enabled)}
                            className={cn(
                              "w-12 h-6 px-1.5 rounded-full flex items-center transition-all cursor-pointer relative",
                              sub.enabled ? "bg-emerald-500 justify-end" : "bg-slate-200 dark:bg-slate-800 justify-start"
                            )}
                          >
                            <motion.div 
                              layout 
                              className="w-3.5 h-3.5 bg-white rounded-full shadow-md"
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. BASE RUNTIME SETTINGS */}
            {activeTab === 'config' && (
              <form onSubmit={handleSaveConfig} className="pro-card p-6 bg-[var(--card-bg)] border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
                <div className="border-b border-slate-100 dark:border-white/5 pb-5">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">系统运行级配置参数</h3>
                  <p className="text-xs text-slate-450 dark:text-slate-400 font-medium">定制底层存储、组织身份、安全防护。需要具备超级管理员身份权限方可变更。</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Group */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 block">注册教育主单位</label>
                      <input 
                        type="text" 
                        value={config.schoolName}
                        onChange={e => setConfig({ ...config, schoolName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-bold outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 block">系统主页 Logo 标志文本</label>
                      <input 
                        type="text" 
                        value={config.systemLogo}
                        onChange={e => setConfig({ ...config, systemLogo: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-mono outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 block">登录会话无操作失效时间 (分钟)</label>
                      <input 
                        type="number" 
                        min={5}
                        max={1440}
                        value={config.sessionTimeout}
                        onChange={e => setConfig({ ...config, sessionTimeout: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-mono outline-none"
                      />
                      <span className="text-[10px] text-slate-400 font-medium leading-none">到达时限未收到鼠标移动，将强制自动退登保护。</span>
                    </div>
                  </div>

                  {/* Right Group */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 block">主系统底层事件备份频率</label>
                      <select 
                        value={config.backupInterval}
                        onChange={e => setConfig({ ...config, backupInterval: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-semibold outline-none"
                      >
                        <option value="hourly">每小时增量备份 (极高负荷安全模式)</option>
                        <option value="daily">每日凌晨增量备份并自动校验上云 (推荐)</option>
                        <option value="weekly">每周定时快照全备份</option>
                        <option value="monthly">每月进行一次完全冷核查存档</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 block">审计日志冗余留存级别</label>
                      <select 
                        value={config.loggingLevel}
                        onChange={e => setConfig({ ...config, loggingLevel: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-semibold outline-none"
                      >
                        <option value="all">记录全量操作与交互足迹 (最高安全审计等级)</option>
                        <option value="warning">仅抓取数据异常与流程变更事件</option>
                        <option value="critical">仅抓取非法越权和危化品泄露红线阻断告警</option>
                      </select>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                        <input 
                          type="checkbox" 
                          id="autoSync" 
                          checked={config.autoSync}
                          onChange={e => setConfig({ ...config, autoSync: e.target.checked })}
                          className="mt-0.5 rounded cursor-pointer"
                        />
                        <label htmlFor="autoSync" className="cursor-pointer select-none space-y-0.5">
                          <span className="text-xs font-bold text-slate-800 dark:text-white block">允许异地高精密时钟授时中心校准</span>
                          <span className="text-[10px] text-slate-400 block font-medium">由于系统承载国家合规危化品高敏跟踪，要求本地总计时钟与北京标准时间无差运行（误差控制在 50ms 内）。</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-end">
                  <button 
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 text-xs font-bold transition-all shadow-md shadow-blue-500/10 hover:-translate-y-0.5"
                  >
                    <Save size={15} />
                    <span>保存全局系统配置</span>
                  </button>
                </div>
              </form>
            )}

            {/* 5. AUDITING AND TAMPER-PROOF SECURITY LOGS */}
            {activeTab === 'logs' && (
              <div className="space-y-4">
                
                {/* Search & filters */}
                <div className="pro-card p-4 flex flex-col sm:flex-row gap-4 items-center justify-between bg-[var(--card-bg)] border border-slate-200 dark:border-white/10 shadow-sm">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="根据审计行踪、操作人名搜索..." 
                      value={logFilterQuery}
                      onChange={e => setLogFilterQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <Filter size={13} className="text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-400">事件类型过滤:</span>
                    <select 
                      value={logCategoryFilter} 
                      onChange={e => setLogCategoryFilter(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 px-3 py-1.5 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">全部生命事件</option>
                      <option value="account">用户账号安全 (account)</option>
                      <option value="permission">RBAC 权限变动 (permission)</option>
                      <option value="config">全局配置升级 (config)</option>
                      <option value="system">核心业务日志 (system)</option>
                    </select>
                  </div>
                </div>

                {/* Audit Logs Table */}
                <div className="pro-card bg-[var(--card-bg)] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-white/5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          <th className="px-6 py-4">时间戳</th>
                          <th className="px-6 py-4">操作者身份</th>
                          <th className="px-6 py-4">主板块</th>
                          <th className="px-6 py-4 text-left">审计操作详情</th>
                          <th className="px-6 py-4">IP 来源 / 终端环境</th>
                          <th className="px-6 py-4 text-center">审计结果</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-[11px] font-medium leading-relaxed text-slate-600 dark:text-slate-450">
                        {filteredLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50/30 dark:hover:bg-white/[0.005] transition-colors">
                            <td className="px-6 py-3.5 font-mono text-slate-400 whitespace-nowrap">
                              {log.time}
                            </td>
                            <td className="px-6 py-3.5 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">@{log.operator}</span>
                                <span className="text-[10px] text-slate-400">{log.roleName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-3.5 whitespace-nowrap">
                              <span className={cn(
                                "text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded",
                                log.category === 'account' && 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-650 dark:text-emerald-400',
                                log.category === 'permission' && 'bg-blue-50 dark:bg-blue-500/10 text-blue-650 dark:text-blue-400',
                                log.category === 'config' && 'bg-amber-50 dark:bg-amber-500/10 text-amber-655 dark:text-amber-400',
                                log.category === 'system' && 'bg-purple-50 dark:bg-purple-500/10 text-purple-650 dark:text-purple-400'
                              )}>
                                {log.category}
                              </span>
                            </td>
                            <td className="px-6 py-3.5 text-slate-800 dark:text-slate-300 font-bold min-w-[300px]">
                              {log.action}
                            </td>
                            <td className="px-6 py-3.5">
                              <p className="font-mono text-slate-500 dark:text-slate-400 text-[10.5px] leading-none mb-0.5">{log.ip}</p>
                              <p className="text-[9.5px] text-slate-400 max-w-[130px] truncate" title={log.device}>{log.device}</p>
                            </td>
                            <td className="px-6 py-3.5 text-center whitespace-nowrap">
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1",
                                log.status === '成功' 
                                  ? "bg-emerald-100/50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                                  : "bg-rose-100/50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              )}>
                                {log.status === '成功' ? <Check size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}
                                <span>{log.status}</span>
                              </span>
                            </td>
                          </tr>
                        ))}
                        
                        {filteredLogs.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                              <Activity size={36} className="mx-auto mb-2 opacity-20 animate-pulse" />
                              <p className="font-medium">未发现满足检索条件的生命事件足迹</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 leading-relaxed font-mono text-right flex items-center justify-end gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>等保二级实时探针运行正常（SHA-256 防篡改签名已校验就绪）</span>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* DRAWER MODAL: ADD / EDIT ACCOUNT */}
      <AnimatePresence>
        {isUserDrawerOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            
            {/* Dark Overlay backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUserDrawerOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />

            {/* Side Drawer Body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="relative w-full max-w-md h-full bg-[var(--card-bg)] border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col z-20"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/10">
                <div>
                  <h3 className="text-base font-black text-slate-800 dark:text-white">
                    {editingUser ? '编辑教职工账号' : '录入新教职工账号'}
                  </h3>
                  <p className="text-[10.5px] text-slate-400 font-medium">遵循学校智慧网络实名制与业务流转追溯原则</p>
                </div>
                <button 
                  onClick={() => setIsUserDrawerOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-450 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveUser} className="flex-1 overflow-y-auto p-6 space-y-5">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 block">教师姓名 *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="text" 
                      required
                      placeholder="例如：物理实验室杨老师"
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-semibold outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 block">系统唯一登入账号登录名 *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs font-bold">@</span>
                    <input 
                      type="text" 
                      required
                      placeholder="例: yang_phys (仅英文数字和下划线)"
                      value={formUsername}
                      onChange={e => setFormUsername(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-mono outline-none"
                      disabled={!!editingUser}
                    />
                  </div>
                  {editingUser && <p className="text-[10px] text-slate-400 font-medium">保护安全：主账号登录登录名在创建后不可修改。</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 block">岗位分配 / 角色身份 *</label>
                  <select 
                    value={formRole}
                    onChange={e => setFormRole(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-semibold outline-none"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name} ({r.id})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 block">教师保障电话 (手机)</label>
                  <input 
                    type="tel" 
                    placeholder="请输入11位中国境内手机号码"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-mono outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 block">通知安全邮箱地址</label>
                  <input 
                    type="email" 
                    placeholder="example@xyzx.edu.cn"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-mono outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 block">主功能服务状态</label>
                  <div className="flex items-center gap-6 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                      <input 
                        type="radio" 
                        name="drawerStatus" 
                        checked={formStatus === 'active'}
                        onChange={() => setFormStatus('active')}
                        className="cursor-pointer"
                      />
                      <span className="text-slate-800 dark:text-slate-200">允许正常服务、登录访问</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                      <input 
                        type="radio" 
                        name="drawerStatus" 
                        checked={formStatus === 'disabled'}
                        onChange={() => setFormStatus('disabled')}
                        className="cursor-pointer"
                      />
                      <span className="text-rose-600">隔离、禁用该账号</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl flex items-start gap-3">
                  <Lock size={15} className="text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-slate-400 leading-normal font-medium">
                    {!editingUser ? '系统会自动为新账号初始化一次初始登录动态密钥。您可以随时通过「重置口令」按键恢复异常无法进入的用户口令。' : '对账号属性（如图案、手机号码等）所做的任何更动均会永久附加于系统底层安全审核报告中。'}
                  </p>
                </div>

                {/* Submit button inside drawer */}
                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsUserDrawerOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-xs font-bold transition-all"
                  >
                    取消
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/15"
                  >
                    确定并保存
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOAT NOTIFICATION TOAST */}
      <AnimatePresence>
        {tosat && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-2xl"
          >
            {tosat.type === 'success' && <CheckCircle size={16} className="text-emerald-450" />}
            {tosat.type === 'info' && <RefreshCw size={16} className="text-cyan-400 animate-spin" />}
            {tosat.type === 'error' && <AlertTriangle size={16} className="text-red-400" />}
            <span className="text-xs font-bold">{tosat.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
