import 'server-only';

import { connection } from 'next/server';
import { cache } from 'react';
import { CATEGORIES } from '../mockData';

export const getCategoriesMap = cache(async () => {

  await connection();
  await new Promise(resolve => {
    return setTimeout(resolve, 1000);
  });

  return CATEGORIES.reduce((acc, category) => {
    acc[category.id] = category;
    return acc;
  }, {} as Record<string, (typeof CATEGORIES)[0]>);
});
