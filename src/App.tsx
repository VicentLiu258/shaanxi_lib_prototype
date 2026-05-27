/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate, useParams } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext';
import { LoginView } from './views/LoginView';
import { PortalView } from './views/PortalView';
import { DashboardView } from './views/DashboardView';
import { DataCenterView } from './views/DataCenterView';
import { SubsystemView } from './views/SubsystemView';
import { InstrumentManagerView } from './views/InstrumentManager/InstrumentManagerView';
import { TeachingManagerView } from './views/TeachingManager/TeachingManagerView';
import { HCManageView } from './views/HCManage/HCManageView';
import { ResourceLibraryView } from './views/ResourceLibrary/ResourceLibraryView';
import { AssetManagerView } from './views/AssetManager/AssetManagerView';
import { SystemSettingsView } from './views/SystemSettingsView';

import { UnauthorizedView } from './views/UnauthorizedView';

function SubsystemRoute({ onBack, onLogout }: { onBack: () => void; onLogout: () => void }) {
  const { id } = useParams<{ id: string }>();
  const names: Record<string, string> = {
    'data': '大数据可视化中心',
    'instr': '智慧无感仪器管理',
    'teach': '实验室教学管理',
    'exam': '实验操作考试',
    'vr': '虚拟仿真测试',
    'res': '实验教学资源',
    'rem': '远程在线巡课',
    'haz': '智慧危化品管理',
    'env': '环境监测预警',
    'asset': '固定资产管理'
  };

  if (!id) return <Navigate to="/portal" replace />;
  const name = names[id] || '未知子系统';

  if (id === 'vr') {
    return <UnauthorizedView name={name} onBack={onBack} onLogout={onLogout} />;
  }

  return <SubsystemView id={id} name={name} onBack={onBack} onLogout={onLogout} />;
}

export default function App() {
  const navigate = useNavigate();
  const [activeSubsystem, setActiveSubsystem] = useState<{ id: string; name: string } | null>(null);

  const handleLogin = () => {
    navigate('/portal');
  };

  const handlePortalSelect = (id: string, name: string) => {
    if (id === 'data') {
      navigate('/dashboard');
    } else if (id === 'instr') {
      navigate('/instrument-manager');
    } else if (id === 'teach') {
      navigate('/teaching-manager');
    } else if (id === 'haz') {
      navigate('/hc-manage');
    } else if (id === 'res') {
      navigate('/resource-library');
    } else if (id === 'asset') {
      navigate('/asset-manager');
    } else {
      setActiveSubsystem({ id, name });
      navigate(`/subsystem/${id}`);
    }
  };

  const handleLogout = () => {
    navigate('/login');
    setActiveSubsystem(null);
  };

  const handleGoBack = () => {
    navigate('/portal');
    setActiveSubsystem(null);
  };

  return (
    <ThemeProvider>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginView onLogin={handleLogin} />} />
          <Route 
            path="/portal" 
            element={
              <PortalView 
                onSelect={(id) => {
                  const names: Record<string, string> = {
                    'data': '大数据可视化中心',
                    'instr': '智慧无感仪器管理',
                    'teach': '实验室教学管理',
                    'exam': '实验操作考试',
                    'vr': '虚拟仿真测试',
                    'res': '实验教学资源',
                    'rem': '远程在线巡课',
                    'haz': '智慧危化品管理',
                    'env': '环境监测预警',
                    'asset': '固定资产管理'
                  };
                  handlePortalSelect(id, names[id] || '未知子系统');
                }} 
                onLogout={handleLogout} 
              />
            } 
          />
          
          {/* Data Center routes handled within DataCenterView */}
          <Route path="/dashboard" element={<DataCenterView onBack={handleGoBack} />} />
          <Route path="/laboratoryDashboard" element={<DataCenterView onBack={handleGoBack} />} />
          
          <Route path="/instrument-manager" element={<InstrumentManagerView onBack={handleGoBack} onLogout={handleLogout} />} />
          <Route path="/teaching-manager" element={<TeachingManagerView onBack={handleGoBack} onLogout={handleLogout} />} />
          <Route path="/hc-manage/*" element={<HCManageView />} />
          <Route path="/resource-library/*" element={<ResourceLibraryView onBack={handleGoBack} onLogout={handleLogout} />} />
          <Route path="/asset-manager" element={<AssetManagerView id="asset" name="固定资产管理" onBack={handleGoBack} onLogout={handleLogout} />} />
          <Route path="/settings" element={<SystemSettingsView onBack={handleGoBack} onLogout={handleLogout} />} />
          <Route 
            path="/subsystem/:id" 
            element={<SubsystemRoute onBack={handleGoBack} onLogout={handleLogout} />} 
          />
          <Route path="/old-dashboard" element={<DashboardView onBack={handleGoBack} onLogout={handleLogout} />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

