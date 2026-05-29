import React from 'react';
import { useLocation } from 'react-router-dom';
import { DataCenterLayout } from './DataCenter/DataCenterLayout';
import { SchoolDashboard } from './DataCenter/SchoolDashboard';
import { LaboratoryDashboard } from './DataCenter/LaboratoryDashboard';

interface DataCenterViewProps {
  onBack: () => void;
}

export const DataCenterView: React.FC<DataCenterViewProps> = ({ onBack }) => {
  const location = useLocation();

  return (
    <DataCenterLayout onBack={onBack}>
      {location.pathname === '/dashboard' ? <SchoolDashboard /> : <LaboratoryDashboard />}
    </DataCenterLayout>
  );
};
