'use client';

import { useEffect, useRef, useState } from 'react';
import { HeadlessDropdownEntry } from '../types';

const getNextIndexOf = (total: number) => (current: number) => {
  if (current === total - 1) {
    return 0;
  }
  return current + 1;
};

const getPreviousIndexOf = (total: number) => (current: number) => {
  if (current === 0) {
    return total - 1;
  }
  return current - 1;
};

/*
 * Because our component is headless, the logic is dependent from the UI, we move all the logic into this custom hook
 * We have to handle when user select an item using keyboard and using mouse
 */
export const useDropdown = (items: HeadlessDropdownEntry[]) => {
  const [isOpen, setIsOpen] = useState(false);
  // selectedIndex is used to determine which item is currently selected when we use keyboard navigation
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedItem, setSelectedItem] =
    useState<HeadlessDropdownEntry | null>(null);

  // Our dropdown is not decided yet, so we pass HTMLElement type
  const dropdownRef = useRef<HTMLElement | null>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getNextIndex = getNextIndexOf(items.length);
  const getPreviousIndex = getPreviousIndexOf(items.length);

  const getAriaAttributes = () => ({
    role: 'combobox',
    'aria-expanded': isOpen,
    'aria-controls': 'dropdown-list',
    'aria-activedescendant': selectedItem ? selectedItem.label : undefined,
  });

  // This handle manually selected an item
  const updateSelectedItem = (item: HeadlessDropdownEntry) => {
    setSelectedItem(item);
    setSelectedIndex(items.indexOf(item));
    setIsOpen(false);
  };

  // This handle keyboard navigation
  useEffect(() => {
    const dropdown = dropdownRef.current;
    if (!dropdown) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (isOpen) {
            setSelectedItem(items[selectedIndex]);
          }
          setIsOpen(isOpen => !isOpen);
          break;
        case 'ArrowDown':
          if (!isOpen) return;
          e.preventDefault();
          setSelectedIndex(getNextIndex);
          break;
        case 'ArrowUp':
          if (!isOpen) return;
          e.preventDefault();
          setSelectedIndex(getPreviousIndex);
          break;
        case 'Home':
          if (!isOpen) return;
          e.preventDefault();
          setSelectedIndex(0);
          break;
        case 'End':
          if (!isOpen) return;
          e.preventDefault();
          setSelectedIndex(items.length - 1);
          break;
        case 'Escape':
          if (!isOpen) return;
          e.preventDefault();
          setIsOpen(false);
          dropdown.blur();
          break;
        default:
          break;
      }
    };

    dropdown.addEventListener('keydown', handleKeyDown);

    return () => {
      if (dropdown) {
        dropdown.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [getNextIndex, getPreviousIndex, items, selectedIndex, isOpen]);

  return {
    isOpen,
    toggleDropdown,
    selectedIndex,
    selectedItem,
    dropdownRef,
    updateSelectedItem,
    getAriaAttributes,
  };
};
