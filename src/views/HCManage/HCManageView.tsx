import React from 'react';

import { Routes, Route, Navigate, useOutletContext } from 'react-router-dom';

import { HCManageLayout } from './HCManageLayout';

import { DashboardPage } from './pages/DashboardPage';

import { ScreenPage } from './pages/ScreenPage';

import { CatalogPage } from './pages/CatalogPage';

import { BottlesPage } from './pages/BottlesPage';

import { PurchasePage } from './pages/PurchasePage';

import { InboundPage } from './pages/InboundPage';

import { BorrowPage } from './pages/BorrowPage';

import { TerminalSimulatorPage } from './pages/TerminalSimulatorPage';

import { CabinetsPage } from './pages/CabinetsPage';

import { AlertPage } from './pages/AlertPage';

import { PlaceholderPage } from './pages/PlaceholderPage';
import { StorageOverviewPage } from './pages/StorageOverviewPage';
import { ConsumablesPage } from './pages/ConsumablesPage';
import { ComplianceControl } from './ComprehensiveModules';

import {

  getChemicals, getWastes, getLabs, getCabinets,

  getTransfers, getDiscards, getStocktakeDiffs, getHazardTickets,

  getVisionEvents, getEmergencyPlans, getTrainingAccess, getCourses,

  getExams, getCerts, getApprovalTemplates, getDictEntries, getOperationLogs,

  getWasteTransfers, getHazardMapLinks,

} from './mock/api';



function InboundRoute() {

  const { showToast } = useOutletContext<{ showToast: (m: string) => void }>();

  return <InboundPage showToast={showToast} />;

}



export const HCManageView: React.FC = () => {

  return (

    <Routes>

      <Route path="screen" element={<ScreenPage />} />

      <Route path="terminal-simulator" element={<TerminalSimulatorPage />} />

      <Route element={<HCManageLayout />}>

        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<DashboardPage />} />



        <Route path="chemicals/catalog" element={<CatalogPage />} />

        <Route path="chemicals/bottles" element={<BottlesPage />} />

        <Route

          path="chemicals/restricted"

          element={

            <PlaceholderPage

              demoId="restricted"

              title="易制毒易制爆目录"

              description="展示易制毒、易制爆管控化学品目录，数据来自化学品档案筛选。"

              columns={['CAS', '名称', '管控类别']}

              fetchRows={async () => {

                const list = await getChemicals();

                return list.filter(c => c.isPrecursor || c.isExplosive).map(c => ({

                  CAS: c.cas, 名称: c.nameCn, 管控类别: c.isPrecursor ? '易制毒' : '易制爆',

                }));

              }}

            />

          }

        />

        <Route path="chemicals/hazard-map" element={<PlaceholderPage demoId="hazard-map" title="危险特性图谱" description="GHS 危险特性关联图谱，展示禁混存关系链路。" columns={['化学品A', '化学品B', '关系']} fetchRows={async () => (await getHazardMapLinks()).map(l => ({ 化学品A: l.from, 化学品B: l.to, 关系: l.relation }))} />} />



        <Route path="flow/purchase" element={<PurchasePage />} />

        <Route path="flow/inbound" element={<InboundRoute />} />

        <Route path="flow/borrow" element={<BorrowPage />} />

        <Route path="flow/transfer" element={<PlaceholderPage demoId="transfer" title="调拨流转" description="源库房 → 目标库房调拨，状态：申请 / 审批 / 出库 / 在途 / 入库确认。" columns={['单号', '源库', '目标库', '状态']} fetchRows={async () => (await getTransfers()).map(t => ({ 单号: t.orderNo, 源库: t.fromWarehouse, 目标库: t.toWarehouse, 状态: t.status }))} />} />

        <Route path="flow/discard" element={<PlaceholderPage demoId="discard" title="报废处置" description="待报废瓶清单，支持批量转入危废暂存。" columns={['瓶码', '化学品', '原因', '状态']} fetchRows={async () => (await getDiscards()).map(d => ({ 瓶码: d.bottleCode, 化学品: d.chemicalName, 原因: d.reason, 状态: d.status }))} />} />



        <Route path="storage/overview" element={<StorageOverviewPage />} />
        <Route path="storage/consumables" element={<ConsumablesPage />} />

        <Route path="storage/cabinets" element={<CabinetsPage />} />

        <Route path="storage/stocktake" element={<PlaceholderPage demoId="stocktake" title="实时盘点" description="RFID 全盘对比账面，输出盈亏差异清单。" columns={['瓶码', '账面', '实盘', '差异']} fetchRows={async () => (await getStocktakeDiffs()).map(d => ({ 瓶码: d.code, 账面: d.bookStatus, 实盘: d.actualStatus, 差异: d.diffType }))} />} />

        <Route path="storage/devices" element={<PlaceholderPage demoId="devices" title="设备物联状态" description="环境感知节点、视觉采集器在线状态汇总。" columns={['编号', '房间', 'VOC', '状态']} fetchRows={async () => (await getCabinets()).map(c => ({ 编号: c.code, 房间: c.room, VOC: `${c.voc.toFixed(2)}ppm`, 状态: c.status }))} />} />



        <Route path="waste/generate" element={<PlaceholderPage demoId="waste-generate" title="产废登记" description="产废实验室、HW 类别、形态、称重接入，自动赋 WC 码。" />} />

        <Route path="waste/storage" element={<PlaceholderPage demoId="waste-storage" title="暂存监控" description="暂存柜库存与超期 / 超容量预警。" columns={['危废码', '实验室', '重量kg', '状态']} fetchRows={async () => (await getWastes()).map(w => ({ 危废码: w.code, 实验室: w.lab, '重量kg': w.weight, 状态: w.status }))} />} />

        <Route path="waste/transfer" element={<PlaceholderPage demoId="waste-transfer" title="转移联单" description="危险废物转移联单电子单据预览。" columns={['联单号', '接收单位', '车牌', '状态']} fetchRows={async () => (await getWasteTransfers()).map(w => ({ 联单号: w.slipNo, 接收单位: w.receiver, 车牌: w.plateNo, 状态: w.status }))} />} />

        <Route path="waste/ledger" element={<PlaceholderPage demoId="waste-ledger" title="处置台账" description="按月、按学院、按类别多维统计。" />} />



        <Route path="risk/rating" element={<PlaceholderPage demoId="risk-rating" title="风险评级" description="实验室分级分类，含自评问卷与雷达图定级。" columns={['实验室', '学院', '等级', '得分']} fetchRows={async () => (await getLabs()).map(l => ({ 实验室: l.name, 学院: l.college, 等级: l.riskLevel, 得分: l.score }))} />} />

        <Route path="risk/inspect" element={<PlaceholderPage demoId="risk-inspect" title="检查与隐患" description="校级 / 院级 / 自查计划；隐患工单看板。" columns={['工单', '隐患', '实验室', '状态']} fetchRows={async () => (await getHazardTickets()).map(h => ({ 工单: h.id, 隐患: h.title, 实验室: h.lab, 状态: h.status }))} />} />

        <Route path="risk/alert" element={<AlertPage />} />

        <Route path="risk/vision" element={<PlaceholderPage demoId="risk-vision" title="视觉感知" description="AI 视频识别事件（Canvas 模拟框）。" columns={['摄像头', '事件', '置信度', '时间']} fetchRows={async () => (await getVisionEvents()).map(v => ({ 摄像头: v.camera, 事件: v.eventType, 置信度: v.confidence, 时间: v.time }))} />} />

        <Route path="risk/emergency" element={<PlaceholderPage demoId="risk-emergency" title="应急预案" description="化学灼伤 / 中毒 / 火灾 / 泄漏等 7 类预案库。" columns={['类别', '预案', '值班电话']} fetchRows={async () => (await getEmergencyPlans()).map(e => ({ 类别: e.category, 预案: e.title, 值班电话: e.contact }))} />} />



        <Route path="training/access" element={<PlaceholderPage demoId="training-access" title="准入审核" description="从主系统读取人员，判定危化品操作准入资格。" columns={['姓名', '学院', '成绩', '状态']} fetchRows={async () => (await getTrainingAccess()).map(t => ({ 姓名: t.name, 学院: t.college, 成绩: t.examScore, 状态: t.status }))} />} />

        <Route path="training/learn" element={<PlaceholderPage demoId="training-learn" title="在线学习" description="通识安全、化学安全、消防等 7 大类课程。" columns={['课程', '类别', '进度', '时长']} fetchRows={async () => (await getCourses()).map(c => ({ 课程: c.title, 类别: c.category, 进度: `${c.progress}%`, 时长: c.duration }))} />} />

        <Route path="training/exam" element={<PlaceholderPage demoId="training-exam" title="安全考试" description="考生答题与管理端组卷、成绩统计。" columns={['试卷', '题量', '及格线']} fetchRows={async () => (await getExams()).map(e => ({ 试卷: e.title, 题量: e.questionCount, 及格线: e.passScore }))} />} />

        <Route path="training/cert" element={<PlaceholderPage demoId="training-cert" title="资质证书" description="证书列表与模板管理，含到期预警。" columns={['持有人', '类型', '有效期', '状态']} fetchRows={async () => (await getCerts()).map(c => ({ 持有人: c.holder, 类型: c.type, 有效期: c.expiry, 状态: c.status }))} />} />



        <Route path="settings/approval-template" element={<PlaceholderPage demoId="settings-approval" title="审批模板" description="申购 / 领用 / 报废 / 危废转移 / 调拨 五类审批流。" columns={['模板', '类型', '节点数', '启用']} fetchRows={async () => (await getApprovalTemplates()).map(a => ({ 模板: a.name, 类型: a.type, 节点数: a.nodeCount, 启用: a.enabled ? '是' : '否' }))} />} />

        <Route path="settings/dict" element={<PlaceholderPage demoId="settings-dict" title="业务字典" description="危险类别、管控级别、库房类型等子系统专属字典。" columns={['类别', '编码', '标签']} fetchRows={async () => (await getDictEntries()).slice(0, 15).map(d => ({ 类别: d.category, 编码: d.code, 标签: d.label }))} />} />

        <Route path="settings/log" element={<PlaceholderPage demoId="settings-log" title="操作日志" description="子系统内业务动作审计日志。" columns={['操作人', '模块', '动作', '结果', '时间']} fetchRows={async () => (await getOperationLogs()).map(l => ({ 操作人: l.operator, 模块: l.module, 动作: l.action, 结果: l.result, 时间: l.time }))} />} />

        <Route path="settings/compliance" element={<ComplianceControl />} />



        <Route path="overview" element={<Navigate to="/hc-manage/dashboard" replace />} />

        <Route path="devices" element={<Navigate to="/hc-manage/storage/devices" replace />} />

        <Route path="inventory" element={<Navigate to="/hc-manage/storage/overview" replace />} />

        <Route path="reagents" element={<Navigate to="/hc-manage/chemicals/catalog" replace />} />

        <Route path="approvals" element={<Navigate to="/hc-manage/settings/approval-template" replace />} />

        <Route path="compliance" element={<Navigate to="/hc-manage/settings/compliance" replace />} />

        <Route path="warehousing" element={<Navigate to="/hc-manage/flow/inbound" replace />} />

        <Route path="waste" element={<Navigate to="/hc-manage/waste/storage" replace />} />

        <Route path="security-check" element={<Navigate to="/hc-manage/risk/inspect" replace />} />

        <Route path="base-info" element={<Navigate to="/hc-manage/settings/dict" replace />} />

        <Route path="purchase" element={<Navigate to="/hc-manage/flow/purchase" replace />} />

        <Route path="receive" element={<Navigate to="/hc-manage/flow/borrow" replace />} />

        <Route path="messages" element={<Navigate to="/hc-manage/dashboard" replace />} />

      </Route>

    </Routes>

  );

};



export default HCManageView;
