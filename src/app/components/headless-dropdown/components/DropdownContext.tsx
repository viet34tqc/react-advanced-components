'use client';

import { createContext, useContext } from 'react';
import { useDropdown } from '../hooks/useDropdown';

// Define the context type with a generic parameter T

type DropdownContextType = ReturnType<typeof useDropdown>;

// Create a generic context without a default type for T
function createDropdownContext() {
  return createContext<DropdownContextType | null>(null);
}

// Initialize the context without specifying a type
const DropdownContext = createDropdownContext();

export const useDropdownContext = () => {
  const context = useContext(DropdownContext) as DropdownContextType | null;
  if (!context) {
    throw new Error(
      'useDropdownContext must be used within a DropdownProvider'
    );
  }
  return context;
};

export default DropdownContext;
