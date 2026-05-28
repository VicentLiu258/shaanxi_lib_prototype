import { DemoScenarioId, DemoStepConfig } from '../types';

export const DEMO_SCENARIO_STEPS: Record<DemoScenarioId, DemoStepConfig[]> = {
  restricted: [
    { title: '加载管控目录', detail: '从化学品档案筛选易制毒、易制爆品种…' },
    { title: '比对 CAS 库', detail: '与公安备案名录自动比对' },
    { title: '生成管控清单', detail: '输出 12 条重点管控化学品' },
  ],
  'hazard-map': [
    { title: '构建图谱节点', detail: '载入 GHS 危险特性节点 18 个' },
    { title: '计算禁混关系', detail: '分析氧化剂与易燃液体相容性' },
    { title: '高亮风险链路', detail: '标注 3 组禁混存关联' },
  ],
  transfer: [
    { title: '发起调拨申请', detail: 'LH-A01 → LH-A03，甲醇 2 瓶' },
    { title: '院级审批通过', detail: '安全员李娜已签批' },
    { title: '出库扫码', detail: '2 件已离库，状态→在途' },
    { title: '目标库入库确认', detail: '入库确认完成，台账已同步' },
  ],
  discard: [
    { title: '勾选待报废瓶', detail: '选中 3 瓶（使用完毕/过期）' },
    { title: '安全复核', detail: '双人确认标签与余量' },
    { title: '转入危废暂存', detail: '生成 WC-2026-000131 暂存单' },
  ],
  'storage-overview': [
    { title: '展开组织树', detail: '校区 → 实验楼 2 → 201 室 → 柜-3' },
    { title: '切换地图视图', detail: '楼宇热力：实验楼 2 为橙色二级风险' },
    { title: '进入柜内视图', detail: '第 2 层 甲醇瓶位高亮' },
  ],
  stocktake: [
    { title: '发起 RFID 盘点', detail: '柜 STX-G-02 全盘扫描…' },
    { title: '比对账面', detail: '账面 36 / 实盘 35' },
    { title: '输出差异清单', detail: '盘亏 1、状态异常 1、盘盈 1' },
  ],
  devices: [
    { title: '轮询物联节点', detail: '24 台终端在线 22 / 离线 1 / 报警 1' },
    { title: 'VOC 超限预警', detail: 'STX-T-04 VOC 1.85ppm > 阈值' },
    { title: '自动启动排风', detail: '远程排风指令已下发' },
  ],
  'waste-generate': [
    { title: '连接电子秤', detail: '模拟称重 3.6 kg' },
    { title: '选择 HW06', detail: '废有机溶剂 · 液态' },
    { title: '赋码完成', detail: 'WC-2026-000131 已打印' },
  ],
  'waste-storage': [
    { title: '扫描暂存柜', detail: '暂存柜 #2 利用率 78%' },
    { title: '超期预警', detail: '1 桶已暂存 92 天' },
    { title: '推送处置提醒', detail: '已通知院级安全员' },
  ],
  'waste-transfer': [
    { title: '填写联单', detail: '产废单位、运输单位、接收单位' },
    { title: '电子签章', detail: '三方签章完成' },
    { title: '运输在途', detail: '陕A·8801 GPS 轨迹已激活' },
  ],
  'waste-ledger': [
    { title: '汇总本月产废', detail: '化学学院 126 kg / 生科院 84 kg' },
    { title: '按 HW 类别统计', detail: 'HW06 占比 52%' },
    { title: '生成报表', detail: '处置台账图表已刷新' },
  ],
  'risk-rating': [
    { title: '打开自评问卷', detail: '化学危险源 30 题' },
    { title: '自动算分', detail: '得分 78 → 二级（橙）' },
    { title: '更新实验室等级', detail: '实验室 205 已定为二级' },
  ],
  'risk-inspect': [
    { title: '下发检查计划', detail: '院级检查 · 5 月第 4 周' },
    { title: '随手拍提交隐患', detail: '废液桶未密闭 → 工单 #H-1043' },
    { title: '看板流转', detail: '待整改 → 整改中' },
  ],
  'risk-vision': [
    { title: '拉取视频流', detail: '化学楼-201-东' },
    { title: 'AI 识别', detail: '未穿实验服 置信度 0.92' },
    { title: '生成事件', detail: '已写入预警中心' },
  ],
  'risk-emergency': [
    { title: '选择泄漏预案', detail: '化学品泄漏应急处置' },
    { title: '展示流程图', detail: '隔离 → 上报 → 吸附' },
    { title: '通知应急联系人', detail: '短信模拟已发送' },
  ],
  'training-access': [
    { title: '读取主系统人员', detail: '张明 · 化学与材料学院' },
    { title: '校验学时与成绩', detail: '16 学时 / 考试 86 分' },
    { title: '授予准入', detail: '一级操作资格已生效' },
  ],
  'training-learn': [
    { title: '进入化学安全课', detail: '第 3 章 易制毒管理' },
    { title: '播放学习', detail: '进度 65% → 80%' },
    { title: '章节测验', detail: '测验通过 +15 分' },
  ],
  'training-exam': [
    { title: '抽题组卷', detail: '单选 20 + 判断 10' },
    { title: '模拟答题', detail: '已答 28/30' },
    { title: '提交成绩', detail: '得分 88，准入通过' },
  ],
  'training-cert': [
    { title: '匹配证书模板', detail: '危化品操作准入证' },
    { title: '填充变量', detail: '姓名、有效期、二维码' },
    { title: '签发证书', detail: '证书 PDF 已生成' },
  ],
  'settings-approval': [
    { title: '打开申购模板', detail: '5 节点串行审批' },
    { title: '调整节点', detail: '增加校级安全员节点' },
    { title: '发布模板', detail: '已启用 v2.1' },
  ],
  'settings-dict': [
    { title: '新增字典项', detail: '库房类型 · 低温库' },
    { title: '校验编码', detail: 'W3 未重复' },
    { title: '保存生效', detail: '业务字典已更新' },
  ],
  'settings-log': [
    { title: '检索操作日志', detail: '模块=领用归还' },
    { title: '展开 JSON 详情', detail: '瓶码 LC-2026-000015' },
    { title: '导出审计', detail: '已生成 20 条记录' },
  ],
  catalog: [
    { title: '检索甲醇', detail: 'CAS 67-56-1' },
    { title: '打开 MSDS', detail: '第 7 章 操作处置' },
    { title: '查看存储建议', detail: '阴凉通风、远离火源' },
  ],
  bottles: [
    { title: '扫描瓶码', detail: 'LC-2026-000001' },
    { title: '展示生命周期', detail: '申购→入库→领用 2 次→归还' },
    { title: '用量曲线', detail: '近 30 天消耗 120ml' },
  ],
  purchase: [
    { title: '新建申购单', detail: '用途说明 28 字' },
    { title: '风险评估', detail: '含易制毒 → 多级审批' },
    { title: '提交审批', detail: 'PO-2026-0041 审批中' },
  ],
  inbound: [
    { title: '模拟扫码', detail: '连续扫描 3 件' },
    { title: '验收合格', detail: '赋码 LC-2026-SCAN-003' },
    { title: '院级审核', detail: '入库批次 WHS202605018 通过' },
  ],
  borrow: [
    { title: '提交申领', detail: '项目：有机合成实验' },
    { title: '跳转智能终端', detail: 'IC 卡验证通过' },
    { title: '称重领用', detail: '498.2g → 台账已记' },
  ],
  cabinets: [
    { title: '选择 STX-G-02', detail: '查看 24h 环境曲线' },
    { title: '远程解锁', detail: '授权领用开门' },
    { title: '关门回传', detail: '温度 24.6℃ 正常' },
  ],
  alert: [
    { title: '新预警推送', detail: '环境超限 · 实验楼 2' },
    { title: '指派处置人', detail: '王浩' },
    { title: '闭环归档', detail: '预警已处置' },
  ],
  dashboard: [
    { title: '刷新指标', detail: '在管瓶数 12,348' },
    { title: '查看分类占比', detail: '易燃液体 32%' },
    { title: '跳转大屏', detail: '进入监管驾驶舱' },
  ],
  screen: [
    { title: '全屏驾驶舱', detail: '深色主题加载' },
    { title: '动态指标', detail: '数据每 5 秒微调' },
    { title: '返回工作台', detail: '演示结束' },
  ],
  terminal: [
    { title: 'IC 卡验证', detail: '身份通过' },
    { title: '选择格位', detail: '格位 5 · 易燃' },
    { title: '称重入账', detail: '领用成功' },
  ],
};
