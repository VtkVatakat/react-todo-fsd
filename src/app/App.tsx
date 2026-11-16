import { StoreProvider } from './providers/StoreProvider';
import { HomePage } from '@/pages/home/ui/HomePage';

export function App() {
  return (
    <StoreProvider>
      <HomePage />
    </StoreProvider>
  );
}