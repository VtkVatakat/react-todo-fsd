import { baseApi } from '@/shared/api/baseApi';
import type { Todo, UpdateTodoDto } from '../model/schema';

const API_URL = 'http://localhost:3001/todos';
const STORAGE_KEY = 'fsd_todos';

const INITIAL_TODOS: Todo[] = [
  { id: '1', title: 'Изучить классический FSD на React', completed: true },
  { id: '2', title: 'Настроить RTK Query и json-server', completed: false },
];

function getLocalTodos(): Todo[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TODOS));
    return INITIAL_TODOS;
  }
  return JSON.parse(raw) as Todo[];
}

function saveLocalTodos(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export const todoApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTodos: build.query<Todo[], void>({
      async queryFn() {
        if (import.meta.env.PROD) {
          return { data: getLocalTodos() };
        }
        try {
          const res = await fetch(API_URL);
          if (!res.ok) throw new Error('Ошибка сервера');
          const data = (await res.json()) as Todo[];
          return { data };
        } catch (err) {
          return { error: { status: 'FETCH_ERROR', error: String(err) } };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Todo' as const, id })),
              { type: 'Todo', id: 'LIST' },
            ]
          : [{ type: 'Todo', id: 'LIST' }],
    }),

    addTodo: build.mutation<Todo, Omit<Todo, 'id'>>({
      async queryFn(body) {
        if (import.meta.env.PROD) {
          const todos = getLocalTodos();
          const newTodo: Todo = { id: crypto.randomUUID(), ...body };
          saveLocalTodos([...todos, newTodo]);
          return { data: newTodo };
        }
        try {
          const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
          if (!res.ok) throw new Error('Ошибка создания');
          const data = (await res.json()) as Todo;
          return { data };
        } catch (err) {
          return { error: { status: 'FETCH_ERROR', error: String(err) } };
        }
      },
      invalidatesTags: [{ type: 'Todo', id: 'LIST' }],
    }),

    updateTodo: build.mutation<Todo, { id: string; data: UpdateTodoDto }>({
      async queryFn({ id, data }) {
        if (import.meta.env.PROD) {
          const todos = getLocalTodos();
          const updated = todos.map((t) => (t.id === id ? { ...t, ...data } : t));
          saveLocalTodos(updated);
          const target = updated.find((t) => t.id === id)!;
          return { data: target };
        }
        try {
          const res = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error('Ошибка обновления');
          const updatedTodo = (await res.json()) as Todo;
          return { data: updatedTodo };
        } catch (err) {
          return { error: { status: 'FETCH_ERROR', error: String(err) } };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Todo', id }],
    }),

    deleteTodo: build.mutation<void, string>({
      async queryFn(id) {
        if (import.meta.env.PROD) {
          const todos = getLocalTodos().filter((t) => t.id !== id);
          saveLocalTodos(todos);
          return { data: undefined };
        }
        try {
          const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Ошибка удаления');
          return { data: undefined };
        } catch (err) {
          return { error: { status: 'FETCH_ERROR', error: String(err) } };
        }
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'Todo', id },
        { type: 'Todo', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todoApi;
