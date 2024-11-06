'use client';

import { createContext, RefObject, useContext } from 'react';

// Define the context type with a generic parameter T
type DropdownContextType<T extends { label: string }> = {
  isOpen: boolean;
  toggleDropdown: () => void;
  selectedIndex: number;
  selectedItem: T | null;
  updateSelectedItem: (item: T) => void;
  getAriaAttributes: () => Record<string, string>;
  dropdownRef: RefObject<HTMLElement>;
};

// Create a generic context without a default type for T
function createDropdownContext<T extends { label: string }>() {
  return createContext<DropdownContextType<T> | null>(null);
}

// Initialize the context without specifying a type
const DropdownContext = createDropdownContext();

export const useDropdownContext = <T extends { label: string }>() => {
  const context = useContext(DropdownContext) as DropdownContextType<T> | null;
  if (!context) {
    throw new Error(
      'useDropdownContext must be used within a DropdownProvider'
    );
  }
  return context;
};

export default DropdownContext;
