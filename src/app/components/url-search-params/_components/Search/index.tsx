'use client';

import { Input } from '@/components/ui/input';
import Form from 'next/form';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';
import { useFilters } from '../../_providers/FilterProvider';
import { TaskStatus } from '../../_types';
import SearchStatus from './SearchStatus';

const Search = () => {
  const params = useParams();
  const { filters, updateFilters } = useFilters();
  const activeTab = params.tab as TaskStatus;
  const [isPending, startTransition] = useTransition();

  return (
    <Form
      action=""
      className="relative flex w-full flex-col gap-1 sm:w-fit"
      key={activeTab}
    >
      <label className="font-semibold uppercase" htmlFor="search">
        Search
      </label>
      <Input
        autoComplete="off"
        id="search"
        onChange={e => {
          startTransition(() => {
            updateFilters({ q: e.target.value });
          });
        }}
        defaultValue={filters.q}
        className="w-full pl-10 sm:w-96"
        name="q"
        placeholder="Search in task title or description..."
        type="search"
      />
      <SearchStatus searching={isPending} />
    </Form>
  );
};

export default Search;
