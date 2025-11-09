import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import { useCallback } from 'react';
import {
  TreeViewActionsTypes,
  useTreeViewContext,
} from '../../treeview-context';
import { TreeNode } from '../../types';

type NodeProps = {
  node: TreeNode;
};

type NodeNameWithIconProps = NodeProps['node'] & { hasIcon: boolean };

function NodeNameWithIcon({ name, hasIcon, id }: NodeNameWithIconProps) {
  const { state } = useTreeViewContext();
  const icon = (
    <ChevronRight
      className={clsx('h-4 w-4 transition-all shrink-0', {
        'rotate-90': state[id],
      })}
    />
  );
  return (
    <>
      {hasIcon && icon}
      <span className="text-ellipsis whitespace-nowrap overflow-hidden">
        {name}
      </span>
    </>
  );
}

const useNodeInteraction = (id: string) => {
  const { state, dispatch, select, selectedId } = useTreeViewContext();

  const handleToggle = useCallback(() => {
    select(id);
    const isExpanded = state[id];
    dispatch({
      type: isExpanded ? TreeViewActionsTypes.CLOSE : TreeViewActionsTypes.OPEN,
      id,
    });
  }, [id, state, dispatch, select]);

  return {
    isExpanded: state[id],
    handleToggle,
    isSelected: selectedId === id,
  };
};

const Node = ({ node: { name, children, id } }: NodeProps) => {
  const { isExpanded, handleToggle, isSelected } = useNodeInteraction(id);
  return (
    <li className="flex flex-col cursor-pointer select-none">
      <div
        className={clsx(
          'flex items-center gap-1 font-mono font-medium rounded-sm px-1',
          isSelected ? 'bg-slate-500' : 'bg-transparent'
        )}
        onClick={handleToggle}
      >
        <NodeNameWithIcon
          name={name}
          hasIcon={!!(children && children.length > 0)}
          id={id}
        />
      </div>
      {children && children.length > 0 && isExpanded && (
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
