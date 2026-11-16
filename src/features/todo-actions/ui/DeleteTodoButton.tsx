import { useDeleteTodoMutation } from '@/entities/todo/api/todoApi';

type DeleteTodoButtonProps = {
  id: string;
};

export function DeleteTodoButton({ id }: DeleteTodoButtonProps) {
  const [deleteTodo, { isLoading }] = useDeleteTodoMutation();

  return (
    <button
      type="button"
      onClick={() => deleteTodo(id)}
      disabled={isLoading}
      className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {isLoading ? '...' : 'Удалить'}
    </button>
  );
}
