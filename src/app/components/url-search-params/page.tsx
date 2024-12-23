import { Suspense } from 'react';
import CategoryFilter from './_components/CategoryFilter';
import { CategoryFilterSkeleton } from './_components/CategoryFilter/CategoryFilterSkeleton';
import Search from './_components/Search';
import { SearchSkeleton } from './_components/Search/SearchSkeleton';
import Tasks from './_components/Tasks';
import FilterProvider from './_providers/FilterProvider';
import { getCategoriesMap } from './apis/getCategories';

const Page = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { q: string; category: string };
}) => {
  const categories = getCategoriesMap();

  // Just for cleaning the warning `searchParams` should be awaited before using its properties.
  const searchPr = await searchParams;
  return (
    <div className="group flex flex-col gap-10">
      <div className="h-[1px] bg-primary" />
      <Suspense>
        <FilterProvider>
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
          <Suspense fallback={<CategoryFilterSkeleton />}>
            <CategoryFilter categoriesPromise={categories} />
          </Suspense>
          <Suspense fallback={<>Loading...</>}>
            <Tasks searchParams={searchPr} />
          </Suspense>
        </FilterProvider>
      </Suspense>
    </div>
  );
};

export default Page;
