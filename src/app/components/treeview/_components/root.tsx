import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import { TreeViewContextProvider } from '../treeview-context';

type Props = {
  className: string;
};

const Root = ({ children, className }: PropsWithChildren<Props>) => {
  return (
    <TreeViewContextProvider>
      <ul className={clsx('flex flex-col overflow-auto', className)}>
        {children}
      </ul>
    </TreeViewContextProvider>
  );
};

export default Root;
