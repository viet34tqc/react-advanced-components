'use client';

import { use, useTransition } from 'react';
import { useFilters } from '../../_providers/FilterProvider';
import { Category } from '../../_types';
import ToggleGroup from './ToggleGroup';

type Props = {
  categoriesPromise: Promise<Record<string, Category>>;
};

export default function CategoryFilter({ categoriesPromise }: Props) {
  const categoriesMap = use(categoriesPromise);
  const { filters, updateFilters } = useFilters();
  const categories = filters.category || [];
  const [isPending, startTransition] = useTransition();

  return (
    <div data-pending={isPending ? '' : undefined}>
      <ToggleGroup
        toggleKey="category"
        options={Object.values(categoriesMap).map(category => {
          return {
            label: category.name,
            value: category.id.toString(),
          };
        })}
        selectedValues={categories}
        onToggle={newCategories => {
          startTransition(() => {
            updateFilters({
              category: newCategories,
            });
          });
        }}
      />
    </div>
  );
}
