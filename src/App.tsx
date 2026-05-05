import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./shared/components/router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Si falla la API, reintenta solo una vez
      refetchOnWindowFocus: false, // Evita que se recargue la data cada vez que cambias de pestaña
    },
  },
});
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" richColors closeButton></Toaster>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
