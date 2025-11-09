import {
  createContext,
  PropsWithChildren,
  useContext,
  useReducer,
  useState,
} from 'react';

export type TreeViewContextState = Map<string, boolean>;

export const TreeViewActionsTypes = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
} as const;

export type TreeViewAction =
  | {
      type: typeof TreeViewActionsTypes.OPEN;
      id: string;
    }
  | {
      type: typeof TreeViewActionsTypes.CLOSE;
      id: string;
    };

export const TreeViewReducer = (
  state: TreeViewContextState,
  action: TreeViewAction
) => {
  switch (action.type) {
    case TreeViewActionsTypes.OPEN:
      return new Map(state).set(action.id, true);
    case TreeViewActionsTypes.CLOSE:
      return new Map(state).set(action.id, false);
    default:
      return state;
  }
};

export type TreeViewContextType = {
  state: TreeViewContextState;
  dispatch: React.Dispatch<TreeViewAction>;
  selectedId: string | null;
  select: (id: string | null) => void;
};

export const TreeViewContext = createContext<TreeViewContextType | null>({
  state: new Map<string, boolean>(),
  dispatch: () => {},
  selectedId: null,
  select: () => {},
});

export const TreeViewContextProvider = ({ children }: PropsWithChildren) => {
  const [selectedId, select] = useState<string | null>(null);
  const [state, dispatch] = useReducer(
    TreeViewReducer,
    new Map<string, boolean>()
  );

  return (
    <TreeViewContext.Provider value={{ state, dispatch, selectedId, select }}>
      {children}
    </TreeViewContext.Provider>
  );
};

export const useTreeViewContext = () => {
  const context = useContext(TreeViewContext) as TreeViewContextType;
  if (context === undefined) {
    throw new Error(
      'useTreeViewContext must be used within a TreeViewContextProvider'
    );
  }
  return context;
};
