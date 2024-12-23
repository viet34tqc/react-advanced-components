import { connection } from 'next/server';
import { TASKS } from '../mockData';

export async function getTasks(filter?: { q?: string; categories?: number[] }) {
  await connection();
  await new Promise(resolve => {
    return setTimeout(resolve, 1000);
  });

  const filteredByQuery = TASKS.filter(task => {
    if (filter && filter.q) {
      console.log(' filter.q', filter.q);
      return (
        task.title.includes(filter?.q) || task.description.includes(filter?.q)
      );
    }
    return task;
  });

  const filteredByCategory = filteredByQuery.filter(task => {
    if (filter && filter.categories) {
      return filter.categories.includes(task.categoryId);
    }
    return task;
  });

  return filteredByCategory;
}
