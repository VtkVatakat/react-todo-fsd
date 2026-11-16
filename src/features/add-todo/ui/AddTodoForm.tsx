import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAddTodoMutation } from '@/entities/todo/api/todoApi';
import { createTodoSchema } from '@/entities/todo/model/schema';

export function AddTodoForm() {
  const [title, setTitle] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [addTodo, { isLoading }] = useAddTodoMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorText(null);

    const parsed = createTodoSchema.safeParse({ title: title.trim() });
    if (!parsed.success) {
      setErrorText(parsed.error.issues?.message ?? 'Ошибка ввода');
      return;
    }

    try {
      await addTodo({ title: parsed.data.title, completed: false }).unwrap();
      setTitle('');
    } catch {
      setErrorText('Не удалось сохранить задачу на сервере');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Новая задача..."
          disabled={isLoading}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Добавление...' : 'Добавить'}
        </button>
      </div>
      {errorText && <p className="text-xs text-red-600">{errorText}</p>}
    </form>
  );
}
