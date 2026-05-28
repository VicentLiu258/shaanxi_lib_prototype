import React, { useState, useMemo } from 'react';
import {
  Building2, Map, LayoutGrid, Box, ChevronRight, ChevronDown,
  AlertTriangle, Thermometer, FlaskConical,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { DemoTriggerButton } from '../components/DemoRunner';
import { DemoRunResult } from '../types';

type ViewMode = 'map' | 'room' | 'cabinet';
type TreeId = string;

interface TreeNode {
  id: TreeId;
  label: string;
  children?: TreeNode[];
  risk?: '一级' | '二级' | '三级' | '四级';
  meta?: { bottles?: number; temp?: string; humidity?: string };
}

const WAREHOUSE_TREE: TreeNode[] = [
  {
    id: 'campus',
    label: '示范大学',
    children: [
      {
        id: 'b1', label: '实验楼 1', risk: '三级',
        children: [{ id: 'b1-101', label: '101 室', children: [{ id: 'b1-101-c1', label: '柜-1', meta: { bottles: 18, temp: '22.1℃', humidity: '45%' } }] }],
      },
      {
        id: 'b2', label: '实验楼 2', risk: '二级',
        children: [
          {
            id: 'b2-201', label: '201 室',
            children: [
              { id: 'b2-201-c1', label: '柜-1', meta: { bottles: 24, temp: '23.4℃', humidity: '41%' } },
              { id: 'b2-201-c2', label: '柜-2', meta: { bottles: 31, temp: '24.0℃', humidity: '43%' } },
              { id: 'b2-201-c3', label: '柜-3', meta: { bottles: 28, temp: '24.6℃', humidity: '42%' } },
            ],
          },
          { id: 'b2-202', label: '202 室', children: [{ id: 'b2-202-c1', label: '柜-1', meta: { bottles: 12 } }] },
        ],
      },
      {
        id: 'b3', label: '实验楼 3', risk: '四级',
        children: [{ id: 'b3-301', label: '301 室', children: [{ id: 'b3-301-c1', label: '柜-1' }] }],
      },
    ],
  },
];

const BUILDINGS = [
  { id: 'b1', name: '实验楼 1', risk: '三级', bottles: 86, x: 12, y: 20 },
  { id: 'b2', name: '实验楼 2', risk: '二级', bottles: 142, x: 42, y: 18 },
  { id: 'b3', name: '实验楼 3', risk: '四级', bottles: 54, x: 72, y: 24 },
  { id: 'b4', name: '实验楼 4', risk: '三级', bottles: 98, x: 22, y: 55 },
  { id: 'b5', name: '实验楼 5', risk: '一级', bottles: 36, x: 62, y: 58 },
];

const RISK_STYLE: Record<string, string> = {
  '一级': 'bg-red-100 text-red-700 border-red-200',
  '二级': 'bg-orange-100 text-orange-700 border-orange-200',
  '三级': 'bg-amber-100 text-amber-700 border-amber-200',
  '四级': 'bg-blue-100 text-blue-700 border-blue-200',
};

const RISK_HEAT: Record<string, string> = {
  '一级': '#fecaca',
  '二级': '#fed7aa',
  '三级': '#fde68a',
  '四级': '#bfdbfe',
};

function findNode(nodes: TreeNode[], id: TreeId): TreeNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNode(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

function getPath(nodes: TreeNode[], targetId: TreeId, trail: TreeNode[] = []): TreeNode[] | null {
  for (const n of nodes) {
    const next = [...trail, n];
    if (n.id === targetId) return next;
    if (n.children) {
      const found = getPath(n.children, targetId, next);
      if (found) return found;
    }
  }
  return null;
}

const TreeItem: React.FC<{
  node: TreeNode;
  depth: number;
  selectedId: TreeId;
  expanded: Set<TreeId>;
  onSelect: (id: TreeId) => void;
  onToggle: (id: TreeId) => void;
}> = ({
  node,
  depth,
  selectedId,
  expanded,
  onSelect,
  onToggle,
}) => {
  const hasChildren = !!node.children?.length;
  const isExp = expanded.has(node.id);
  const isSel = selectedId === node.id;

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          onSelect(node.id);
          if (hasChildren) onToggle(node.id);
        }}
        className={cn(
          'w-full flex items-center gap-1 py-1.5 px-2 rounded-lg text-left text-sm transition-colors',
          isSel ? 'bg-[#1E3A8A] text-white' : 'hover:bg-slate-100 text-slate-700',
        )}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
      >
        {hasChildren ? (
          isExp ? <ChevronDown size={14} className="shrink-0" /> : <ChevronRight size={14} className="shrink-0" />
        ) : <span className="w-3.5" />}
        <span className="truncate">{node.label}</span>
      </button>
      {hasChildren && isExp && node.children!.map(child => (
        <div key={child.id}>
          <TreeItem
            node={child}
            depth={depth + 1}
            selectedId={selectedId}
            expanded={expanded}
            onSelect={onSelect}
            onToggle={onToggle}
          />
        </div>
      ))}
    </div>
  );
};

/** 柜内 4 层 × 3 列 */
const CABINET_SLOTS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  layer: Math.floor(i / 3) + 1,
  col: (i % 3) + 1,
  chemical: i === 4 ? '甲醇' : i % 4 === 0 ? '盐酸' : i % 3 === 1 ? '乙醇' : null,
  hazard: i === 4 ? '易燃' : i % 4 === 0 ? '腐蚀' : '一般',
}));

export function StorageOverviewPage() {
  const [selectedId, setSelectedId] = useState<TreeId>('b2-201-c3');
  const [expanded, setExpanded] = useState<Set<TreeId>>(() => new Set(['campus', 'b2', 'b2-201']));
  const [viewMode, setViewMode] = useState<ViewMode>('cabinet');
  const [highlightSlot, setHighlightSlot] = useState<number | null>(5);
  const [demoBanner, setDemoBanner] = useState<string | null>(null);

  const path = useMemo(() => getPath(WAREHOUSE_TREE, selectedId) || [], [selectedId]);
  const selectedNode = useMemo(() => findNode(WAREHOUSE_TREE, selectedId), [selectedId]);
  const buildingNode = path.find(n => n.id.startsWith('b') && !n.id.includes('-')) || path[1];
  const riskLevel = buildingNode?.risk || selectedNode?.risk || '二级';

  const toggleExpand = (id: TreeId) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const runDemoFlow = (_result: DemoRunResult) => {
    setDemoBanner('演示进行中：正在带您浏览库房位置…');
    setExpanded(new Set(['campus', 'b2', 'b2-201']));
    setSelectedId('b2');
    setViewMode('map');
    setHighlightSlot(null);

    setTimeout(() => {
      setSelectedId('b2-201');
      setViewMode('room');
    }, 1200);
    setTimeout(() => {
      setSelectedId('b2-201-c3');
      setViewMode('cabinet');
      setHighlightSlot(5);
      setDemoBanner('演示完成：已定位至 实验楼 2 · 201 室 · 柜-3 · 第 2 层甲醇位');
    }, 2400);
  };

  const breadcrumb = path.map(n => n.label).join(' / ');

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          从左侧选择校区、楼宇、房间与存储柜；右侧可切换地图、房间平面、柜内格位三种查看方式。
        </p>
        <DemoTriggerButton demoId="storage-overview" onComplete={runDemoFlow} />
      </div>

      {demoBanner && (
        <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 font-medium flex items-center gap-2">
          <CheckIcon />
          {demoBanner}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 min-h-[520px]">
        {/* 组织树 */}
        <div className="pro-card bg-white p-3 overflow-y-auto max-h-[560px]">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">库房位置</p>
          {WAREHOUSE_TREE.map(node => (
            <div key={node.id}>
              <TreeItem
                node={node}
                depth={0}
                selectedId={selectedId}
                expanded={expanded}
                onSelect={setSelectedId}
                onToggle={toggleExpand}
              />
            </div>
          ))}
        </div>

        {/* 主视图区 */}
        <div className="space-y-4">
          {/* 位置摘要卡 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <SummaryCard icon={Building2} label="当前位置" value={breadcrumb || '请选择左侧节点'} />
            <SummaryCard
              icon={AlertTriangle}
              label="楼宇风险等级"
              value={riskLevel}
              valueClassName={RISK_STYLE[riskLevel]?.split(' ')[1]}
            />
            <SummaryCard
              icon={FlaskConical}
              label="在库瓶数"
              value={selectedNode?.meta?.bottles != null ? `${selectedNode.meta.bottles} 瓶` : '—'}
            />
            <SummaryCard
              icon={Thermometer}
              label="环境监测"
              value={selectedNode?.meta?.temp ? `${selectedNode.meta.temp} · 湿度 ${selectedNode.meta.humidity}` : '点击存储柜查看'}
            />
          </div>

          {/* 视图切换 */}
          <div className="flex gap-2 border-b border-slate-200 pb-1">
            {([
              { id: 'map' as const, label: '地图视图', icon: Map },
              { id: 'room' as const, label: '房间视图', icon: LayoutGrid },
              { id: 'cabinet' as const, label: '柜内视图', icon: Box },
            ]).map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setViewMode(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-bold transition-colors',
                  viewMode === tab.id
                    ? 'bg-[#1E3A8A] text-white'
                    : 'text-slate-500 hover:bg-slate-100',
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="pro-card bg-white p-5 min-h-[360px]">
            {viewMode === 'map' && (
              <MapView selectedBuildingId={buildingNode?.id || 'b2'} onSelectBuilding={id => {
                setSelectedId(id);
                setExpanded(prev => new Set([...prev, 'campus', id]));
              }} />
            )}
            {viewMode === 'room' && (
              <RoomView
                roomLabel={path.find(n => n.label.includes('室'))?.label || '201 室'}
                selectedCabinet={selectedId.includes('c') ? selectedNode?.label : undefined}
                onSelectCabinet={(cabId) => {
                  setSelectedId(cabId);
                  setViewMode('cabinet');
                }}
              />
            )}
            {viewMode === 'cabinet' && (
              <CabinetView
                cabinetLabel={selectedNode?.label || '柜-3'}
                highlightSlot={highlightSlot}
                onSelectSlot={setHighlightSlot}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="pro-card bg-white p-4 border border-slate-100">
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
        <Icon size={14} />
        {label}
      </div>
      <p className={cn('text-sm font-bold text-slate-800 line-clamp-2', valueClassName)}>{value}</p>
    </div>
  );
}

function MapView({
  selectedBuildingId,
  onSelectBuilding,
}: {
  selectedBuildingId: string;
  onSelectBuilding: (id: string) => void;
}) {
  return (
    <div>
      <p className="text-sm text-slate-600 mb-4">校园平面图（颜色越深表示风险越高，点击楼宇可下钻）</p>
      <div className="relative h-[300px] rounded-xl border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-emerald-50/30 overflow-hidden">
        <div className="absolute inset-4 border border-slate-300/50 rounded-lg" />
        <p className="absolute top-3 left-4 text-xs font-bold text-slate-400">示范大学 · 主校区</p>
        {BUILDINGS.map(b => (
          <button
            key={b.id}
            type="button"
            onClick={() => onSelectBuilding(b.id)}
            className={cn(
              'absolute rounded-lg border-2 shadow-sm transition-all hover:scale-105 flex flex-col items-center justify-center text-xs font-bold',
              selectedBuildingId === b.id ? 'ring-2 ring-[#1E3A8A] ring-offset-2 border-[#1E3A8A]' : 'border-slate-300',
            )}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: '22%',
              height: '28%',
              backgroundColor: RISK_HEAT[b.risk],
            }}
          >
            <span>{b.name}</span>
            <span className={cn('mt-1 px-1.5 py-0.5 rounded text-[10px] border', RISK_STYLE[b.risk])}>{b.risk}</span>
            <span className="text-[10px] text-slate-600 mt-0.5">{b.bottles} 瓶</span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-200" /> 一级</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-200" /> 二级</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-200" /> 三级</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-200" /> 四级</span>
      </div>
    </div>
  );
}

function RoomView({
  roomLabel,
  selectedCabinet,
  onSelectCabinet,
}: {
  roomLabel: string;
  selectedCabinet?: string;
  onSelectCabinet: (cabId: string) => void;
}) {
  const cabinets = [
    { id: 'b2-201-c1', label: '柜-1', count: 24 },
    { id: 'b2-201-c2', label: '柜-2', count: 31 },
    { id: 'b2-201-c3', label: '柜-3', count: 28 },
  ];

  return (
    <div>
      <p className="text-sm text-slate-600 mb-4">{roomLabel} 平面示意（点击存储柜进入柜内视图）</p>
      <div className="relative h-[300px] border-2 border-slate-800 rounded-lg bg-slate-50 p-6">
        <div className="absolute top-2 left-3 text-xs font-bold text-slate-500">门</div>
        <div className="grid grid-cols-3 gap-6 h-full items-end pb-8">
          {cabinets.map(cab => (
            <button
              key={cab.id}
              type="button"
              onClick={() => onSelectCabinet(cab.id)}
              className={cn(
                'h-40 border-2 rounded-lg flex flex-col items-center justify-center gap-2 transition-all hover:border-blue-500',
                selectedCabinet === cab.label
                  ? 'border-[#1E3A8A] bg-blue-50 shadow-md'
                  : 'border-slate-400 bg-white',
              )}
            >
              <Box size={28} className="text-slate-600" />
              <span className="font-bold text-sm">{cab.label}</span>
              <span className="text-xs text-slate-500">{cab.count} 瓶在库</span>
            </button>
          ))}
        </div>
        <div className="absolute bottom-3 right-4 flex gap-3 text-[10px] text-slate-500">
          <span>🚿 紧急喷淋</span>
          <span>👁 洗眼器</span>
          <span>🌬 通风橱</span>
        </div>
      </div>
    </div>
  );
}

function CabinetView({
  cabinetLabel,
  highlightSlot,
  onSelectSlot,
}: {
  cabinetLabel: string;
  highlightSlot: number | null;
  onSelectSlot: (id: number) => void;
}) {
  const layers = [4, 3, 2, 1];
  return (
    <div>
      <p className="text-sm text-slate-600 mb-2">
        <strong>{cabinetLabel}</strong> 内部分层格位（点击瓶位查看档案）
      </p>
      <div className="flex gap-6">
        <div className="flex-1 border-4 border-slate-700 rounded-t-2xl bg-slate-100 p-4 relative">
          <div className="absolute -top-3 left-4 px-2 bg-white text-xs font-bold text-slate-600">柜门已打开（示意）</div>
          {layers.map(layer => (
            <div key={layer} className="mb-3 last:mb-0">
              <p className="text-[10px] text-slate-500 mb-1 font-bold">第 {layer} 层</p>
              <div className="grid grid-cols-3 gap-2">
                {CABINET_SLOTS.filter(s => s.layer === layer).map(slot => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => onSelectSlot(slot.id)}
                    className={cn(
                      'aspect-square rounded-lg border-2 flex flex-col items-center justify-center text-[10px] transition-all',
                      !slot.chemical && 'border-slate-200 bg-white opacity-40',
                      slot.chemical && 'border-slate-300 bg-white hover:border-blue-400',
                      highlightSlot === slot.id && 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50 scale-105',
                      slot.hazard === '易燃' && slot.chemical && highlightSlot !== slot.id && 'bg-orange-50 border-orange-200',
                      slot.hazard === '腐蚀' && slot.chemical && highlightSlot !== slot.id && 'bg-blue-50 border-blue-200',
                    )}
                  >
                    {slot.chemical ? (
                      <>
                        <span className="text-lg">🧪</span>
                        <span className="font-bold truncate w-full text-center px-0.5">{slot.chemical}</span>
                      </>
                    ) : (
                      <span className="text-slate-300">空</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {highlightSlot != null && (
          <div className="w-56 pro-card p-4 bg-white border-emerald-200 border-2 shrink-0">
            {(() => {
              const slot = CABINET_SLOTS.find(s => s.id === highlightSlot);
              if (!slot?.chemical) return <p className="text-sm text-slate-500">请选择有试剂的位置</p>;
              return (
                <>
                  <p className="text-xs text-emerald-600 font-bold mb-2">当前选中</p>
                  <p className="font-bold text-lg text-slate-800">{slot.chemical}</p>
                  <p className="text-xs text-slate-500 mt-2">瓶码 LC-2026-000015</p>
                  <p className="text-xs text-slate-500">规格 500ml/瓶</p>
                  <p className="text-xs text-slate-500">状态：在库</p>
                  <span className={cn('inline-block mt-3 px-2 py-0.5 rounded text-xs border', RISK_STYLE['二级'])}>
                    危险类别：{slot.hazard}
                  </span>
                  <button type="button" className="mt-4 w-full py-2 text-xs bg-[#1E3A8A] text-white rounded-lg font-bold">
                    查看一瓶一码档案
                  </button>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
