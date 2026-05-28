import { DemoScenarioId, DemoRunResult } from '../types';
import { HcMockStore } from './seed';
import { FAKE_DELAY } from './constants';

function delay<T>(data: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), FAKE_DELAY()));
}

export async function executeDemoScenario(store: HcMockStore, id: DemoScenarioId): Promise<DemoRunResult> {
  switch (id) {
    case 'transfer': {
      const t = store.transfers.find(x => x.status === '在途') || store.transfers[0];
      if (t) {
        t.status = '入库确认';
        t.updatedAt = new Date().toLocaleString();
      }
      return delay({
        message: '调拨流程演示完成：在途 → 入库确认',
        columns: ['单号', '源库', '目标库', '状态'],
        rows: store.transfers.slice(0, 5).map(x => ({
          单号: x.orderNo, 源库: x.fromWarehouse, 目标库: x.toWarehouse, 状态: x.status,
        })),
      });
    }
    case 'discard': {
      store.discards.filter(d => d.status === '待报废').slice(0, 3).forEach(d => {
        d.status = '已转入危废';
        store.wastes.unshift({
          id: `waste-new-${Date.now()}`,
          code: `WC-2026-${String(store.wastes.length + 1).padStart(6, '0')}`,
          lab: '实验室 201',
          hwCategory: 'HW06 废有机溶剂',
          form: '液',
          weight: 3.6,
          date: '2026-05-28',
          reason: '报废转入',
          status: '暂存中',
        });
      });
      store.dashboard.wasteKg += 11;
      return delay({
        message: '3 瓶已批量转入危废暂存，新增 WC 码',
        columns: ['瓶码', '化学品', '状态'],
        rows: store.discards.map(d => ({ 瓶码: d.bottleCode, 化学品: d.chemicalName, 状态: d.status })),
      });
    }
    case 'stocktake':
      return delay({
        message: 'RFID 盘点完成，发现 3 条差异',
        columns: ['瓶码', '账面', '实盘', '差异'],
        rows: store.stocktakeDiffs.map(d => ({
          瓶码: d.code, 账面: d.bookStatus, 实盘: d.actualStatus, 差异: d.diffType,
        })),
      });
    case 'devices': {
      const cab = store.cabinets.find(c => c.status === '在线');
      if (cab) { cab.voc = 1.85; cab.status = '报警'; }
      store.alerts.unshift({
        id: `alert-demo-${Date.now()}`,
        level: '橙',
        type: '环境超限',
        source: `${cab?.code || 'STX-T-04'} VOC 超限`,
        time: new Date().toLocaleString(),
        status: '待处置',
      });
      store.dashboard.weeklyAlerts += 1;
      return delay({
        message: '物联告警已触发，排风指令已模拟下发',
        columns: ['编号', '房间', 'VOC', '状态'],
        rows: store.cabinets.slice(0, 8).map(c => ({
          编号: c.code, 房间: c.room, VOC: `${c.voc.toFixed(2)}ppm`, 状态: c.status,
        })),
      });
    }
    case 'waste-generate': {
      const code = `WC-2026-${String(store.wastes.length + 131).padStart(6, '0')}`;
      store.wastes.unshift({
        id: `w-gen-${Date.now()}`,
        code,
        lab: '实验室 201',
        hwCategory: 'HW06 废有机溶剂',
        form: '液',
        weight: 3.6,
        date: '2026-05-28',
        reason: '实验残余',
        status: '暂存中',
      });
      store.dashboard.wasteKg += 4;
      return delay({
        message: `产废登记成功，危废码 ${code}`,
        columns: ['危废码', '类别', '重量kg', '状态'],
        rows: store.wastes.slice(0, 5).map(w => ({
          危废码: w.code, 类别: w.hwCategory, '重量kg': w.weight, 状态: w.status,
        })),
      });
    }
    case 'waste-transfer': {
      const slip = store.wasteTransfers[0];
      if (slip) slip.status = '运输中';
      return delay({
        message: '转移联单已发起，运输在途',
        columns: ['联单号', '接收单位', '车牌', '状态'],
        rows: store.wasteTransfers.map(w => ({
          联单号: w.slipNo, 接收单位: w.receiver, 车牌: w.plateNo, 状态: w.status,
        })),
        extra: { slipNo: slip?.slipNo },
      });
    }
    case 'waste-ledger':
      return delay({
        message: '处置台账统计已更新',
        columns: ['学院', 'HW06(kg)', 'HW49(kg)'],
        rows: [
          { 学院: '化学与材料学院', 'HW06(kg)': 126, 'HW49(kg)': 48 },
          { 学院: '生命科学学院', 'HW06(kg)': 84, 'HW49(kg)': 32 },
        ],
      });
    case 'risk-rating': {
      const lab = store.labs[4];
      if (lab) { lab.score = 78; lab.riskLevel = '二级'; }
      return delay({
        message: '实验室 205 完成自评，定为二级（橙）',
        columns: ['实验室', '学院', '等级', '得分'],
        rows: store.labs.slice(0, 8).map(l => ({
          实验室: l.name, 学院: l.college, 等级: l.riskLevel, 得分: l.score,
        })),
      });
    }
    case 'risk-inspect': {
      const ticket = store.hazardTickets.find(h => h.status === '待整改');
      if (ticket) ticket.status = '整改中';
      return delay({
        message: '隐患工单已流转至「整改中」',
        columns: ['工单', '隐患', '实验室', '状态'],
        rows: store.hazardTickets.map(h => ({
          工单: h.id, 隐患: h.title, 实验室: h.lab, 状态: h.status,
        })),
      });
    }
    case 'risk-vision': {
      store.visionEvents.unshift({
        id: `ve-d-${Date.now()}`,
        camera: '化学楼-201-东',
        eventType: '未穿实验服',
        confidence: 0.92,
        time: new Date().toLocaleString(),
      });
      return delay({
        message: 'AI 识别事件已入库',
        columns: ['摄像头', '事件', '置信度', '时间'],
        rows: store.visionEvents.map(v => ({
          摄像头: v.camera, 事件: v.eventType, 置信度: v.confidence, 时间: v.time,
        })),
      });
    }
    case 'risk-emergency':
      return delay({
        message: '已打开「化学品泄漏」预案并模拟通知值班',
        columns: ['类别', '预案', '值班电话'],
        rows: store.emergencyPlans.map(e => ({
          类别: e.category, 预案: e.title, 值班电话: e.contact,
        })),
      });
    case 'training-access': {
      const rec = store.trainingAccess.find(t => t.status === '待考试');
      if (rec) { rec.status = '已准入'; rec.examScore = 88; }
      return delay({
        message: '张明 已授予一级危化品操作准入',
        columns: ['姓名', '学院', '成绩', '状态'],
        rows: store.trainingAccess.map(t => ({
          姓名: t.name, 学院: t.college, 成绩: t.examScore, 状态: t.status,
        })),
      });
    }
    case 'training-learn': {
      const c = store.courses[1];
      if (c) c.progress = Math.min(100, c.progress + 15);
      return delay({
        message: `化学安全课程进度 ${c?.progress}%`,
        columns: ['课程', '类别', '进度', '时长'],
        rows: store.courses.map(co => ({
          课程: co.title, 类别: co.category, 进度: `${co.progress}%`, 时长: co.duration,
        })),
      });
    }
    case 'training-exam':
      return delay({
        message: '模拟考试提交：得分 88，准入通过',
        columns: ['试卷', '题量', '及格线'],
        rows: store.exams.map(e => ({
          试卷: e.title, 题量: e.questionCount, 及格线: e.passScore,
        })),
        extra: { score: 88 },
      });
    case 'training-cert':
      return delay({
        message: '已为 陈雪 签发准入证书（演示）',
        columns: ['持有人', '类型', '有效期', '状态'],
        rows: store.certs.map(c => ({
          持有人: c.holder, 类型: c.type, 有效期: c.expiry, 状态: c.status,
        })),
      });
    case 'settings-approval': {
      const tpl = store.approvalTemplates[0];
      if (tpl) { tpl.nodeCount = 6; tpl.enabled = true; }
      return delay({
        message: '申购审批模板已更新为 6 节点并发布',
        columns: ['模板', '类型', '节点数', '启用'],
        rows: store.approvalTemplates.map(a => ({
          模板: a.name, 类型: a.type, 节点数: a.nodeCount, 启用: a.enabled ? '是' : '否',
        })),
      });
    }
    case 'settings-dict': {
      store.dictEntries.push({
        id: `d-new-${Date.now()}`,
        category: '库房类型',
        code: 'W3',
        label: '低温库',
      });
      return delay({
        message: '已新增字典项：库房类型 · 低温库',
        columns: ['类别', '编码', '标签'],
        rows: store.dictEntries.filter(d => d.category === '库房类型').map(d => ({
          类别: d.category, 编码: d.code, 标签: d.label,
        })),
      });
    }
    case 'settings-log':
      store.operationLogs.unshift({
        id: `log-d-${Date.now()}`,
        operator: '张明',
        module: '领用归还',
        action: '领用',
        ip: '10.12.20.8',
        result: '成功',
        time: new Date().toLocaleString(),
        detail: JSON.stringify({ bottleCode: 'LC-2026-000015', demo: true }),
      });
      return delay({
        message: '新增 1 条操作日志',
        columns: ['操作人', '模块', '动作', '结果', '时间'],
        rows: store.operationLogs.slice(0, 10).map(l => ({
          操作人: l.operator, 模块: l.module, 动作: l.action, 结果: l.result, 时间: l.time,
        })),
      });
    case 'purchase': {
      store.purchases.unshift({
        id: `po-d-${Date.now()}`,
        orderNo: `PO-2026-${String(store.purchases.length + 1).padStart(4, '0')}`,
        applicant: '张明',
        college: '化学与材料学院',
        itemCount: 2,
        purpose: '本科有机实验教学使用，已落实双人双锁与通风橱操作。',
        budget: 860,
        approvalNode: '院级安全员',
        status: '审批中',
        createdAt: new Date().toLocaleString(),
        items: [{ name: '甲醇', spec: '500ml', qty: 2, price: 45 }],
      });
      store.dashboard.pendingPurchase += 1;
      return delay({ message: '申购单已提交，进入多级审批', extra: { orderNo: store.purchases[0].orderNo } });
    }
    case 'inbound': {
      store.inboundReviews.unshift({
        id: `in-d-${Date.now()}`,
        applicant: '李娜',
        batchNo: `WHS202605${String(store.inboundReviews.length + 1).padStart(3, '0')}`,
        categoryCount: 3,
        applyTime: new Date().toLocaleString(),
        status: '待审核',
        details: [{ name: '盐酸', specs: '500ml', stock: 10, unit: '瓶', brand: '国药', quantity: 3, price: 25, totalPrice: 75 }],
      });
      return delay({ message: '模拟扫码 3 件并完成验收赋码，待审核入库单已生成' });
    }
    case 'alert': {
      const a = store.alerts.find(x => x.status === '待处置');
      if (a) { a.status = '已处置'; a.handler = '王浩'; }
      return delay({
        message: '预警已指派并完成闭环',
        columns: ['等级', '类型', '来源', '状态'],
        rows: store.alerts.slice(0, 8).map(x => ({
          等级: x.level, 类型: x.type, 来源: x.source, 状态: x.status,
        })),
      });
    }
    case 'dashboard':
      store.dashboard.bottleCount += 12;
      store.dashboard.pendingPurchase += 1;
      return delay({ message: '看板指标已刷新（+12 瓶，+1 待办申购）' });
    case 'restricted':
      return delay({
        message: '已加载易制毒/易制爆管控目录',
        columns: ['CAS', '名称', '管控类别'],
        rows: store.chemicals.filter(c => c.isPrecursor || c.isExplosive).slice(0, 12).map(c => ({
          CAS: c.cas, 名称: c.nameCn, 管控类别: c.isPrecursor ? '易制毒' : '易制爆',
        })),
      });
    case 'hazard-map':
      return delay({
        message: '危险特性图谱已渲染禁混关系',
        columns: ['化学品A', '化学品B', '关系'],
        rows: store.hazardMapLinks.map(l => ({ 化学品A: l.from, 化学品B: l.to, 关系: l.relation })),
      });
    case 'storage-overview':
      return delay({
        message: '已定位：实验楼 2 · 201 室 · 柜-3 · 第 2 层甲醇位',
      });
    case 'waste-storage':
      return delay({
        message: '暂存柜 #2 利用率 78%，1 条超 90 天预警',
        columns: ['危废码', '实验室', '重量kg', '状态'],
        rows: store.wastes.map(w => ({
          危废码: w.code, 实验室: w.lab, '重量kg': w.weight, 状态: w.status,
        })),
      });
    case 'catalog':
      return delay({ message: '已定位甲醇 CAS 67-56-1，MSDS 第 7 章已展开（演示）' });
    case 'bottles':
      return delay({
        message: '瓶码 LC-2026-000001 全生命周期轨迹已展示',
        extra: { code: 'LC-2026-000001', events: 8 },
      });
    case 'borrow':
      return delay({ message: '申领已提交，请继续在智能终端完成领用' });
    case 'cabinets': {
      const c = store.cabinets[1];
      if (c) c.lastOpen = new Date().toLocaleString();
      return delay({ message: `${c?.code} 远程解锁成功，开门记录已写入` });
    }
    case 'screen':
      return delay({ message: '监管驾驶舱动态刷新一轮完成' });
    case 'terminal':
      return delay({ message: '终端模拟：格位 5 领用 498.2g 已入账' });
    default:
      return delay({ message: '演示完成' });
  }
}
