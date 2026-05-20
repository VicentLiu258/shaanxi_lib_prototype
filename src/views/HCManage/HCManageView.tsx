
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HCManageLayout } from './HCManageLayout';
import { WarehousingReview } from './WarehousingReview';
import { WasteReview } from './WasteReview';
import { SecurityCheck } from './SecurityCheck';
import { BaseMessage } from './BaseMessage';
import { PurchaseReview } from './PurchaseReview';
import { ReceiveReview } from './ReceiveReview';
import { SystemMessages } from './SystemMessages';

export const HCManageView: React.FC = () => {
  return (
    <Routes>
      <Route element={<HCManageLayout />}>
        <Route index element={<Navigate to="warehousing" replace />} />
        <Route path="warehousing" element={<WarehousingReview />} />
        <Route path="waste" element={<WasteReview />} />
        <Route path="security-check" element={<SecurityCheck />} />
        <Route path="base-info" element={<BaseMessage />} />
        <Route path="purchase" element={<PurchaseReview />} />
        <Route path="receive" element={<ReceiveReview />} />
        <Route path="messages" element={<SystemMessages />} />
      </Route>
    </Routes>
  );
};

export default HCManageView;
