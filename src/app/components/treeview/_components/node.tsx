import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import { useTreeViewContext } from '../treeview-context';
import { TreeNode } from '../types';

type Props = {
  node: TreeNode;
};

function NodeNameWithIcon({ name, children, id }: Props['node']) {
  const { state } = useTreeViewContext();
  const icon = (
    <ChevronRight
      className={clsx('h-4 w-4 transition-all shrink-0', {
        'rotate-90': state.get(id),
      })}
    />
  );
  return (
    <>
      {children && children.length > 0 && icon}
      <span className="text-ellipsis whitespace-nowrap overflow-hidden">
        {name}
      </span>
    </>
  );
}

const Node = ({ node: { name, children, id } }: Props) => {
  const { state, dispatch, select, selectedId } = useTreeViewContext();
  return (
    <li className="flex flex-col cursor-pointer select-none">
      <div
        className={clsx(
          'flex items-center gap-1 font-mono font-medium rounded-sm px-1',
          selectedId === id ? 'bg-slate-500' : 'bg-transparent'
        )}
        onClick={() => {
          select(id);
          dispatch({
            type: state.get(id) ? 'CLOSE' : 'OPEN',
            id,
          });
        }}
      >
        <NodeNameWithIcon name={name} children={children} id={id} />
      </div>
      {children && children.length > 0 && state.get(id) && (
        <ul className="pl-4">
          {children.map(node => (
            <Node node={node} key={node.id} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default Node;
