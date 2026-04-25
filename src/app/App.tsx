import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
<<<<<<< HEAD
import { Chatbot } from './components/Chatbot';
=======
>>>>>>> de07bf0b8126dd86041aa8749009a15751d42fcd

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
<<<<<<< HEAD
      <Chatbot />
=======
>>>>>>> de07bf0b8126dd86041aa8749009a15751d42fcd
    </AuthProvider>
  );
}