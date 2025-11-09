'use client';

import {
  getNextFocusableId,
  getPrevFocusableId,
  RovingTabindexItem,
  RovingTabindexRoot,
  useRovingTabindex,
} from '@/app/contexts/roving-tabindex';
import { Button } from '@/components/ui/button';
import isHotkey from 'is-hotkey';
import { ComponentProps, useState } from 'react';

function RovingButton({
  children,
  id,
  isSelected,
  ...props
}: ComponentProps<'button'> & { isSelected: boolean }) {
  const { getOrderedItems, getRovingProps } = useRovingTabindex(id || '');
  return (
    <Button
      {...getRovingProps<'button'>({
        onKeyDown: e => {
          props?.onKeyDown?.(e);
          let nextItem: RovingTabindexItem | undefined;
          const items = getOrderedItems();
          if (isHotkey('right', e)) {
            nextItem = getNextFocusableId(items, id!);
          } else if (isHotkey('left', e)) {
            nextItem = getPrevFocusableId(items, id!);
          }
          nextItem?.element.focus();
        },
        className: isSelected ? 'bg-black text-white' : 'bg-white text-black',
        ...props,
      })}
    >
      {children}
    </Button>
  );
}

const ButtonGroupWithTabindex = () => {
  const [valueId, setValueId] = useState('button 1');
  return (
    <RovingTabindexRoot valueId={valueId}>
      <span>hello</span>
      <RovingButton
        id={'button 1'}
        isSelected={valueId === 'button 1'}
        onClick={() => setValueId('button 1')}
      >
        button 1
      </RovingButton>
      <span>hello</span>
      <RovingButton
        id={'button 2'}
        isSelected={valueId === 'button 2'}
        onClick={() => setValueId('button 2')}
      >
        button 2
      </RovingButton>
      <span>hello</span>
      <RovingButton
        id={'button 3'}
        isSelected={valueId === 'button 3'}
        onClick={() => setValueId('button 3')}
      >
        button 3
      </RovingButton>
      <span>world</span>
    </RovingTabindexRoot>
  );
};

export default ButtonGroupWithTabindex;
