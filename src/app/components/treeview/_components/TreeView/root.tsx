import { RovingTabindexRoot } from '@/app/contexts/roving-tabindex';
import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import { TreeViewContextProvider } from '../../treeview-context';

type Props = {
  className: string;
};

const Root = ({ children, className }: PropsWithChildren<Props>) => {
  return (
    <TreeViewContextProvider>
      <RovingTabindexRoot
        as="ul"
        aria-multiselectable="false"
        role="tree"
        className={clsx('flex flex-col overflow-auto', className)}
      >
        {children}
      </RovingTabindexRoot>
    </TreeViewContextProvider>
  );
};

export default Root;
