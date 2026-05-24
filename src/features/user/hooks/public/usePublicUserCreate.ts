import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

import type { UserCreate } from "../../types/user";
import { userService } from "../../services/userService";

export const usePublicUserCreate = () => {
  return useMutation({
    mutationFn: (data: UserCreate) => userService.public.create(data),

    onSuccess: () => {
      notifications.show({
        color: "green",
        title: "Registro exitoso",
        message: "La cuenta fue creada correctamente",
      });
    },

    onError: () => {
      notifications.show({
        color: "red",
        title: "Error",
        message: "No se pudo crear la cuenta",
      });
    },
  });
};
