import AppRoutes from './routes';
import './App.css';
import { Toaster } from '@/components/components/ui/sonner';

function App() {
  return (
    <div>
      <Toaster />
      <AppRoutes />
    </div>
  );
}

export default App;