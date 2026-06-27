import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./shared/api/queryClient";
import { router } from "./shared/components/router";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { useAuth } from "./features/auth/context/AuthContext";
import { useOrderWebSocket } from "./shared/hooks/useOrderWebSocket";

function WsManager() {
  const { isAuthenticated } = useAuth();
  useOrderWebSocket(isAuthenticated);
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Notifications position="top-right"></Notifications>
        <ModalsProvider>
          <WsManager />
          <RouterProvider router={router} />
        </ModalsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
