import { z } from 'zod';

export const taskStatusSchema = z.enum(['todo', 'inprogress', 'done']);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export type TaskSummary = Record<
  TaskStatus,
  Record<number, { count: number; name: string }>
>;

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  categoryId: string;
};

export type Category = {
  id: number;
  name: string;
};
