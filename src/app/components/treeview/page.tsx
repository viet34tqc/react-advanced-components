'use client';

import { TreeView } from './_components/TreeView';
import { data } from './data';

const TreeviewPage = () => {
  return (
    <TreeView.Root className="w-72 h-full border-[1.5px] border-slate-200 m-4">
      {data.map(node => (
        <TreeView.Node node={node} key={node.id} />
      ))}
    </TreeView.Root>
  );
};

export default TreeviewPage;
