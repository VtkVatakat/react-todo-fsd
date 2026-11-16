import { useUpdateTodoMutation } from '@/entities/todo/api/todoApi';

type ToggleTodoCheckboxProps = {
  id: string;
  completed: boolean;
};

export function ToggleTodoCheckbox({ id, completed }: ToggleTodoCheckboxProps) {
  const [updateTodo, { isLoading }] = useUpdateTodoMutation();

  const handleToggle = () => {
    updateTodo({ id, data: { completed: !completed } });
  };

  return (
    <input
      type="checkbox"
      checked={completed}
      onChange={handleToggle}
      disabled={isLoading}
      className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
    />
  );
}
