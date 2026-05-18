import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

import { userKeys, type UserCreateByAdmin } from "../../types/user";
import { userService } from "../../services/userService";

export const useAdminUserMutations = () => {
  const queryClient = useQueryClient();

  const invalidateUsers = async () => {
    await queryClient.invalidateQueries({
      queryKey: userKeys.all,
    });
  };

  const create = useMutation({
    mutationFn: (data: UserCreateByAdmin) => userService.admin.create(data),

    onSuccess: async () => {
      await invalidateUsers();

      notifications.show({
        color: "green",
        title: "Usuario creado",
        message: "El usuario fue creado correctamente",
      });
    },

    onError: () => {
      notifications.show({
        color: "red",
        title: "Error",
        message: "No se pudo crear el usuario",
      });
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id: number) => userService.admin.delete(id),

    onSuccess: async () => {
      await invalidateUsers();

      notifications.show({
        color: "green",
        title: "Usuario eliminado",
        message: "El usuario fue eliminado correctamente",
      });
    },

    onError: () => {
      notifications.show({
        color: "red",
        title: "Error",
        message: "No se pudo eliminar el usuario",
      });
    },
  });

  const restore = useMutation({
    mutationFn: (id: number) => userService.admin.restore(id),

    onSuccess: async () => {
      await invalidateUsers();

      notifications.show({
        color: "green",
        title: "Usuario restaurado",
        message: "El usuario fue restaurado correctamente",
      });
    },

    onError: () => {
      notifications.show({
        color: "red",
        title: "Error",
        message: "No se pudo restaurar el usuario",
      });
    },
  });

  const assignRole = useMutation({
    mutationFn: ({ id, roleCode }: { id: number; roleCode: string }) =>
      userService.admin.assignRole(id, roleCode),

    onSuccess: async () => {
      await invalidateUsers();

      notifications.show({
        color: "green",
        title: "Rol asignado",
        message: "El rol fue asignado correctamente",
      });
    },

    onError: () => {
      notifications.show({
        color: "red",
        title: "Error",
        message: "No se pudo asignar el rol",
      });
    },
  });

  const revokeRole = useMutation({
    mutationFn: ({ id, roleCode }: { id: number; roleCode: string }) =>
      userService.admin.revokeRole(id, roleCode),

    onSuccess: async () => {
      await invalidateUsers();

      notifications.show({
        color: "green",
        title: "Rol revocado",
        message: "El rol fue revocado correctamente",
      });
    },

    onError: () => {
      notifications.show({
        color: "red",
        title: "Error",
        message: "No se pudo revocar el rol",
      });
    },
  });

  return {
    create,
    deleteUser,
    restore,
    assignRole,
    revokeRole,
  };
};
