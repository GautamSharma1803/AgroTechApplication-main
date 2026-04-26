import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from './components/ui/sonner';
import { Chatbot } from './components/Chatbot';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user } = useAuth();

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
      {user && <Chatbot />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}