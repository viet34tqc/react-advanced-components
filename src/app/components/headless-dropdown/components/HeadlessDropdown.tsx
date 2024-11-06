'use client';

import {
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
  RefObject,
} from 'react';
import { useDropdown } from '../hooks/useDropdown';
import DropdownContext, { useDropdownContext } from './DropdownContext';

const HeadlessDropdown = <T extends { label: string }>({
  children,
  items,
}: PropsWithChildren<{ items: T[] }>) => {
  const {
    isOpen,
    toggleDropdown,
    selectedIndex,
    selectedItem,
    updateSelectedItem,
    getAriaAttributes,
    dropdownRef,
  } = useDropdown(items);
  return (
    <DropdownContext.Provider
      value={{
        isOpen,
        toggleDropdown,
        selectedIndex,
        selectedItem,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        updateSelectedItem,
      }}
    >
      <div
        ref={dropdownRef as RefObject<HTMLDivElement>}
        {...getAriaAttributes()}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

type GenericComponentType<C extends ElementType> = {
  as?: C | React.FC;
} & ComponentPropsWithoutRef<C>;

HeadlessDropdown.Trigger = function Trigger({
  as: Component = 'button',
  ...props
}: GenericComponentType<'button'>) {
  const { selectedItem, toggleDropdown } = useDropdownContext();  

  return (
    <Component tabIndex={0} onClick={toggleDropdown} {...props}>
      {selectedItem ? selectedItem.label : 'Select an item...'}
    </Component>
  );
};

HeadlessDropdown.List = function List({
  as: Component = 'ul',
  ...props
}: GenericComponentType<'ul'>) {
  const { isOpen } = useDropdownContext();

  return isOpen ? <Component {...props} role="listbox" tabIndex={0} /> : null;
};

HeadlessDropdown.Option = function Option({
  as: Component = 'li',
  index,
  item,
  ...props
}: GenericComponentType<'li'> & { index: number; item: { label: string } }) {
  const { updateSelectedItem, selectedIndex } = useDropdownContext();

  return (
    <Component
      role="option"
      aria-selected={index === selectedIndex}
      onClick={() => updateSelectedItem(item)}
      {...props}
    >
      {item.label}
    </Component>
  );
};

export default HeadlessDropdown;
