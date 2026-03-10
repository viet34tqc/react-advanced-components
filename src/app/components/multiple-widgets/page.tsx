'use client';

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

// Mock API call
async function fetchWidgetData(id: number) {
  // simulate network delay
  await new Promise(res => setTimeout(res, Math.random() * 1000));
  return `Widget ${id} data`;
}

// Concurrency pool
function createFetchWithPool(limit = 4) {
  let active = 0;
  const queue: (() => void)[] = [];

  const runNext = () => {
    if (active >= limit || queue.length === 0) return;
    active++;
    const next = queue.shift();
    next?.();
  };

  return async function pooledFetch<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const task = () => {
        fn()
          .then(resolve)
          .catch(reject)
          .finally(() => {
            active--;
            runNext();
          });
      };
      queue.push(task);
      runNext();
    });
  };
}

const pooledFetch = createFetchWithPool(4); // max 4 concurrent

// Widget component
function Widget({ id }: { id: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['widget', id],
    queryFn: () => pooledFetch(() => fetchWidgetData(id)),
    staleTime: 60_000, // cache for 1 min
  });

  if (isLoading)
    return <div className="p-4 border rounded">Widget {id}: Loading...</div>;

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">Widget {id}</h3>
      <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

// Dashboard with many widgets
function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {Array.from({ length: 12 }, (_, i) => (
        <Widget key={i} id={i + 1} />
      ))}
    </div>
  );
}

const MultipleWidgets = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
};

export default MultipleWidgets;
