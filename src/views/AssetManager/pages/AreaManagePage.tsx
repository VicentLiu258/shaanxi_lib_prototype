import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { AreaNode } from '../types';
import { getAreas } from '../mock/api';
import { cn } from '../../../lib/utils';

const LEVEL_LABELS = ['', '机构', '楼栋', '楼层', '房间'];

export function AreaManagePage() {
  const [tree, setTree] = useState<AreaNode[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['area_lab']));

  useEffect(() => { getAreas().then(setTree); }, []);

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const renderNode = (node: AreaNode, depth = 0) => (
    <div key={node.id}>
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer text-sm"
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
        onClick={() => node.children?.length && toggle(node.id)}
      >
        <MapPin size={14} className="text-emerald-600 shrink-0" />
        <span className="font-medium">{node.name}</span>
        <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-500">{LEVEL_LABELS[node.level]}</span>
        <span className="text-xs text-slate-400 ml-auto truncate max-w-[200px]">{node.fullPath}</span>
      </div>
      {node.children?.length && expanded.has(node.id) && node.children.map(c => renderNode(c, depth + 1))}
    </div>
  );

  return (
    <div className="pro-card p-4 bg-[var(--card-bg)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">存放区域（4级层级）</h3>
        <span className="text-xs text-slate-500">机构 → 楼栋 → 楼层 → 房间</span>
      </div>
      {tree.map(n => renderNode(n))}
    </div>
  );
}
