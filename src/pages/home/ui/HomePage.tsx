import { TodoBoard } from '@/widgets/todo-board/ui/TodoBoard';

export function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <TodoBoard />
    </main>
  );
}
