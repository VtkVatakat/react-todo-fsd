import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetTodosQuery } from '@/entities/todo/api/todoApi';
import { TodoItem } from '@/entities/todo/ui/TodoItem';
import { AddTodoForm } from '@/features/add-todo/ui/AddTodoForm';
import { ToggleTodoCheckbox } from '@/features/todo-actions/ui/ToggleTodoCheckbox';
import { DeleteTodoButton } from '@/features/todo-actions/ui/DeleteTodoButton';
import { EditTodoForm } from '@/features/todo-actions/ui/EditTodoForm';
import { FilterButtons } from '@/features/filter-todos/ui/FilterButtons';
import type { RootState } from '@/app/store/store';

export function TodoBoard() {
  const { data: todos, isLoading, isError } = useGetTodosQuery();
  const currentFilter = useSelector((state: RootState) => state.filter.status);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredTodos = todos?.filter((todo) => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  return (
    <section className="mx-auto w-full max-w-xl rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-md">
      <h1 className="mb-4 text-xl font-bold text-slate-900">Список задач (React + FSD)</h1>

      <div className="mb-4">
        <AddTodoForm />
      </div>

      <div className="mb-6">
        <FilterButtons />
      </div>

      {isLoading && <p className="text-sm text-slate-500">Загрузка задач...</p>}
      {isError && (
        <p className="text-sm text-red-600">
          Ошибка подключения к серверу. Проверьте, что запущен npm run server
        </p>
      )}

      {filteredTodos && filteredTodos.length === 0 && (
        <p className="text-center text-sm text-slate-500">Задач по выбранному фильтру нет.</p>
      )}

      {filteredTodos && filteredTodos.length > 0 && (
        <ul className="flex flex-col gap-2">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isEditing={editingId === todo.id}
              editFormSlot={
                <EditTodoForm
                  id={todo.id}
                  initialTitle={todo.title}
                  onCancel={() => setEditingId(null)}
                  onSuccess={() => setEditingId(null)}
                />
              }
              toggleSlot={<ToggleTodoCheckbox id={todo.id} completed={todo.completed} />}
              editButtonSlot={
                <button
                  type="button"
                  onClick={() => setEditingId(todo.id)}
                  className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                >
                  Изменить
                </button>
              }
              deleteSlot={<DeleteTodoButton id={todo.id} />}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
