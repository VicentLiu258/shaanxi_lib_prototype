import React, { useEffect, useState } from 'react';
import { FolderTree } from 'lucide-react';
import { CategoryNode } from '../types';
import { getCategories } from '../mock/api';
import { cn } from '../../../lib/utils';

export function CategoryManagePage() {
  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['cat_root']));

  useEffect(() => { getCategories().then(setTree); }, []);

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const renderNode = (node: CategoryNode, depth = 0) => (
    <div key={node.id}>
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer text-sm',
          depth === 0 && 'font-bold',
        )}
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
        onClick={() => node.children?.length && toggle(node.id)}
      >
        <FolderTree size={16} className={depth === 0 ? 'text-blue-600' : 'text-slate-400'} />
        <span>{node.name}</span>
        <span className="text-xs text-slate-400 font-mono ml-auto">{node.code}</span>
      </div>
      {node.children?.length && expanded.has(node.id) && node.children.map(c => renderNode(c, depth + 1))}
    </div>
  );

  return (
    <div className="pro-card p-4 bg-[var(--card-bg)] max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">资产分类树</h3>
        <span className="text-xs text-slate-500">树形结构 · 编码规则 CRUD 待扩展</span>
      </div>
      {tree.map(n => renderNode(n))}
    </div>
  );
}
