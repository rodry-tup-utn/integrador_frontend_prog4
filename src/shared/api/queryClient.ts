import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

let isRedirecting = false;

function handleAuthError(error: unknown) {
  if (isRedirecting) return;

  const axiosError = error as { response?: { status?: number } };
  if (axiosError?.response?.status !== 401) return;

  isRedirecting = true;

  notifications.show({
    title: "Sesión expirada",
    message: "Tu sesión ha expirado. Redirigiendo al login...",
    color: "orange",
  });
  setTimeout(() => {
    window.open("/login", "_blank");
  }, 3000);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({ onError: handleAuthError }),
  mutationCache: new MutationCache({ onError: handleAuthError }),
});
