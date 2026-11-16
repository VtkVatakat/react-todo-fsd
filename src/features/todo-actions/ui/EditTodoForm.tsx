import { useState } from 'react';
import type { FormEvent } from 'react';
import { useUpdateTodoMutation } from '@/entities/todo/api/todoApi';
import { updateTodoSchema } from '@/entities/todo/model/schema';

type EditTodoFormProps = {
  id: string;
  initialTitle: string;
  onCancel: () => void;
  onSuccess: () => void;
};

export function EditTodoForm({ id, initialTitle, onCancel, onSuccess }: EditTodoFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [updateTodo, { isLoading }] = useUpdateTodoMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorText(null);

    const trimmedTitle = title.trim();

    if (trimmedTitle === initialTitle) {
      onCancel();
      return;
    }

    const parsed = updateTodoSchema.safeParse({ title: trimmedTitle });
    if (!parsed.success) {
      setErrorText(parsed.error.issues[0]?.message ?? 'Ошибка ввода');
      return;
    }

    try {
      await updateTodo({ id, data: { title: trimmedTitle } }).unwrap();
      onSuccess();
    } catch {
      setErrorText('Ошибка сохранения');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          autoFocus
          className="flex-1 rounded border border-blue-400 px-2 py-1 text-sm text-slate-900 outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded bg-green-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? '...' : 'Сохранить'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300 disabled:opacity-50"
        >
          Отмена
        </button>
      </div>
      {errorText && <span className="text-xs text-red-600">{errorText}</span>}
    </form>
  );
}
