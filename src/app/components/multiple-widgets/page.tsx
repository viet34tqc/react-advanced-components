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


// The Problem:
// You call pooledFetch(() => fetchWidgetData(5)) but it might not run immediately. How do you get the result back later?

// The Solution - Two Promises (Promise chaining with deferred execution or Promise delegation)

// The pattern:

// return new Promise((resolve, reject) => {
//   // Create a task that will run LATER
//   const task = () => {
//     fn().then(resolve).catch(reject);
//   };
//   queue.push(task); // Don't run now, run later
// });

// Real-world analogy:

// You order food delivery:

// Outer Promise: The tracking number you get immediately
// Queue: Restaurant is busy, your order waits
// Inner Promise: Chef actually cooks your food
// .then(resolve): Delivery driver brings it to you
// You get the tracking number (outer Promise) right away, but the food (result) comes later when the chef has capacity.

// This pattern is used when:

// You need to control when something runs (rate limiting, pooling)
// But the caller needs a Promise immediately to await on
// It's a common pattern in:

// Rate limiters (p-limit, bottleneck)
// Job queues (bull, bee-queue)
// Connection pools (database pooling)

// ┌─────────────────────────────────────────────────┐
// │ OUTER Promise (what caller gets)                │
// │                                                  │
// │  new Promise((resolve, reject) => {             │
// │    const task = () => {                         │
// │      ┌──────────────────────────────────┐      │
// │      │ INNER Promise (your actual task) │      │
// │      │                                   │      │
// │      │  fn() // fetchWidgetData(5)      │      │
// │      │    .then(resolve)  ← connects!   │      │
// │      │    .catch(reject)  ← connects!   │      │
// │      └──────────────────────────────────┘      │
// │    };                                            │
// │    queue.push(task); // wait in line            │
// │  })                                              │
// └─────────────────────────────────────────────────┘

// Step-by-step:

// 1. Outer Promise created immediately - caller gets it right away
// const resultPromise = pooledFetch(() => fetchWidgetData(5));
// // resultPromise exists NOW, but not resolved yet

// 2. Task waits in queue - not executed yet
// Task waits in queue - not executed yet

// 3. When slot opens, task runs
// fn() // NOW fetchWidgetData(5) actually executes

// 4. Inner Promise resolves → triggers outer Promise's resolve
// .then(resolve) // "resolve" is from the OUTER Promise
// // This connects inner result → outer Promise → caller

// Why two Promises?

// Outer: "I promise to give you a result eventually"
// Inner: "I'm doing the actual work"
// The .then(resolve) is the magic bridge that forwards the inner result to the outer Promise, which the caller is waiting on.
// The outer Promise is just a wrapper that waits for the inner Promise, but it's the one the caller is actually waiting on.

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
