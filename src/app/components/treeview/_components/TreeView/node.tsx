import {
  getFirstFocusableId,
  getLastFocusableId,
  getNextFocusableId,
  getNextFocusableIdByTypeahead,
  getParentFocusableId,
  getPrevFocusableId,
  RovingTabindexItem,
  useRovingTabindex,
} from '@/app/contexts/roving-tabindex';
import clsx from 'clsx';
import isHotkey from 'is-hotkey';
import { ChevronRight } from 'lucide-react';
import { KeyboardEvent, useCallback } from 'react';
import {
  TreeViewActionsTypes,
  useTreeViewContext,
} from '../../treeview-context';
import { TreeNode } from '../../types';

type NodeProps = {
  node: TreeNode;
};

type NodeNameWithIconProps = NodeProps['node'] & {
  hasIcon: boolean;
  isExpanded: boolean;
};

function NodeNameWithIcon({
  name,
  hasIcon,
  isExpanded,
}: NodeNameWithIconProps) {
  const icon = (
    <ChevronRight
      className={clsx('h-4 w-4 transition-all shrink-0', {
        'rotate-90': isExpanded,
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
  const isExpanded = state[id];

  const handleToggle = useCallback(() => {
    select(id);
    dispatch({
      type: isExpanded ? TreeViewActionsTypes.CLOSE : TreeViewActionsTypes.OPEN,
      id,
    });
  }, [id, dispatch, select, isExpanded]);

  return {
    isExpanded,
    selectedId,
    handleToggle,
    isSelected: selectedId === id,
  };
};

const Node = ({ node: { name, children, id } }: NodeProps) => {
  const { isExpanded, handleToggle, isSelected, selectedId } =
    useNodeInteraction(id);
  const { getRovingProps, getOrderedItems, isFocusable } =
    useRovingTabindex(id);
  const hasChildren = !!children && children?.length > 0;
  return (
    <li
      {...getRovingProps<'li'>({
        ['aria-expanded']: hasChildren ? Boolean(isExpanded) : undefined,
        ['aria-selected']: selectedId === id,
        role: 'treeitem',
        className:
          'flex flex-col cursor-pointer select-none focus:outline-none group',
        onKeyDown: function (e: KeyboardEvent) {
          const items = getOrderedItems();
          let nextItemToFocus: RovingTabindexItem | undefined;
          if (isHotkey('up', e)) {
            e.preventDefault();
            nextItemToFocus = getPrevFocusableId(items, id);
          } else if (isHotkey('down', e)) {
            e.preventDefault();
            nextItemToFocus = getNextFocusableId(items, id);
          } else if (isHotkey('right', e)) {
            e.preventDefault();
            if (isExpanded && hasChildren) {
              nextItemToFocus = getNextFocusableId(items, id);
            } else {
              handleToggle();
            }
          } else if (isHotkey('left', e)) {
            e.preventDefault();
            if (isExpanded && hasChildren) {
              handleToggle();
            } else {
              nextItemToFocus = getParentFocusableId(items, id);
            }
          } else if (isHotkey('home', e)) {
            e.preventDefault();
            nextItemToFocus = getFirstFocusableId(items);
          } else if (isHotkey('end', e)) {
            e.preventDefault();
            nextItemToFocus = getLastFocusableId(items);
          }
          // Using the start letter of the node name to focus the next node with the same first letter
          else if (/^[a-z]$/i.test(e.key)) {
            nextItemToFocus = getNextFocusableIdByTypeahead(items, id, e.key);
          }
          nextItemToFocus?.element.focus();
        },
      })}
    >
      <div
        className={clsx(
          'flex items-center space-x-2 font-mono font-medium rounded-sm px-1 border-[1.5px] border-transparent',
          isFocusable && 'group-focus:border-slate-500',
          isSelected ? 'bg-slate-500' : 'bg-transparent'
        )}
        onClick={handleToggle}
      >
        <NodeNameWithIcon
          name={name}
          hasIcon={hasChildren}
          id={id}
          isExpanded={isExpanded}
        />
      </div>
      {children && children.length > 0 && isExpanded && (
        <ul className="pl-4" role="group">
          {children.map(node => (
            <Node node={node} key={node.id} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default Node;
