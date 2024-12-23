import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { getTasks } from '../../apis/getTasks';
import { CATEGORIES } from '../../mockData';

export default async function Tasks({
  searchParams,
}: {
  searchParams?: { q: string; category: string };
}) {
  const q = searchParams?.q;
  const category = searchParams?.category;

  const data = await getTasks({
    categories: Array.isArray(category)
      ? category.map(Number)
      : category
      ? [Number(category)]
      : undefined,
    q,
  });

  return (
    <div className="overflow-x-auto rounded group-has-[[data-pending]]:animate-pulse">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Title</TableHead>
            <TableHead scope="col">Description</TableHead>
            <TableHead scope="col">Category</TableHead>
            <TableHead scope="col">Created Date</TableHead>
            <TableHead scope="col" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(task => {
            return (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>
                  <div
                    className={cn(
                      'flex w-fit justify-center px-3 py-1 text-white dark:text-black'
                    )}
                  >
                    {CATEGORIES[task.categoryId].name}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(task.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            );
          })}
          {data.length === 0 && (
            <TableRow>
              <TableCell className="italic" colSpan={5}>
                No tasks found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
