import type { ReactNode } from 'react';
import type { Todo } from '../model/schema';

type TodoItemProps = {
  todo: Todo;
  isEditing: boolean;
  editFormSlot: ReactNode;
  toggleSlot: ReactNode;
  editButtonSlot: ReactNode;
  deleteSlot: ReactNode;
};

export function TodoItem({
  todo,
  isEditing,
  editFormSlot,
  toggleSlot,
  editButtonSlot,
  deleteSlot,
}: TodoItemProps) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      {isEditing ? (
        <div className="flex-1">{editFormSlot}</div>
      ) : (
        <>
          <div className="flex flex-1 items-center gap-3 overflow-hidden">
            {toggleSlot}
            <span
              className={`truncate text-sm font-medium ${
                todo.completed ? 'text-slate-400 line-through' : 'text-slate-800'
              }`}
            >
              {todo.title}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {editButtonSlot}
            {deleteSlot}
          </div>
        </>
      )}
    </li>
  );
}
