import { z } from 'zod';

export const todoSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Текст задачи не может быть пустым').max(100, 'Максимум 100 символов'),
  completed: z.boolean(),
});

export const createTodoSchema = z.object({
  title: z.string().min(1, 'Введите название задачи').max(100, 'Максимум 100 символов'),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1, 'Введите название задачи').max(100, 'Максимум 100 символов').optional(),
  completed: z.boolean().optional(),
});

export type Todo = z.infer<typeof todoSchema>;
export type CreateTodoDto = z.infer<typeof createTodoSchema>;
export type UpdateTodoDto = z.infer<typeof updateTodoSchema>;
