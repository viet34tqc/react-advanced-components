'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { createContext, useOptimistic, useTransition } from 'react';
import { z } from 'zod';

const filterSchema = z.object({
  category: z.array(z.string()).default([]).optional(),
  q: z.string().default('').optional(),
});

type Filters = z.infer<typeof filterSchema>;
type FilterContextType = {
  filters: Filters;
  isPending: boolean;
  updateFilters: (_updates: Partial<Filters>) => void;
};

export const FilterContext = createContext<FilterContextType | undefined>(
  undefined
);

export default function FilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filters = filterSchema.safeParse({
    category: searchParams.getAll('category'),
    q: searchParams.get('q') || undefined,
  });

  const [isPending, startTransition] = useTransition();
  const [optimisticFilters, setOptimisticFilters] = useOptimistic(
    filters.data,
    (currentFilter, optimisticValue: Partial<Filters>) => {
      return {
        ...currentFilter,
        ...optimisticValue,
      };
    }
  );

  function updateFilters(updates: Partial<typeof optimisticFilters>) {
    const newState = {
      ...optimisticFilters,
      ...updates,
    };
    const newSearchParams = new URLSearchParams();

    Object.entries(newState).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => {
          newSearchParams.append(key, v);
        });
      } else if (value !== undefined) {
        newSearchParams.set(key, value);
      }
    });

    startTransition(() => {
      setOptimisticFilters(updates || {});
      router.push(`?${newSearchParams}`, { scroll: false });
    });
  }

  return (
    <FilterContext.Provider
      value={{ filters: optimisticFilters || {}, isPending, updateFilters }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = React.useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}
