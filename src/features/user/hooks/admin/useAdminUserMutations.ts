import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  userKeys,
  type UserCreateByAdmin,
  type UserUpdate,
} from "../../types/user";
import { userService } from "../../services/userService";

export const useAdminUserMutations = () => {
  const queryClient = useQueryClient();

  const invalidateUsers = async () => {
    await queryClient.invalidateQueries({
      queryKey: userKeys.all,
    });
  };

  const createUser = useMutation({
    mutationFn: (data: UserCreateByAdmin) => userService.admin.create(data),

    onSuccess: async () => {
      await invalidateUsers();
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id: number) => userService.admin.delete(id),

    onSuccess: async () => {
      await invalidateUsers();
    },
  });

  const restoreUser = useMutation({
    mutationFn: (id: number) => userService.admin.restore(id),

    onSuccess: async () => {
      await invalidateUsers();
    },
  });

  const updateUser = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserUpdate }) =>
      userService.admin.update(id, data),

    onSuccess: async () => {
      await invalidateUsers();
    },
  });

  const assignRole = useMutation({
    mutationFn: ({ id, roleCode }: { id: number; roleCode: string }) =>
      userService.admin.assignRole(id, roleCode),

    onSuccess: async () => {
      await invalidateUsers();
    },
  });

  const revokeRole = useMutation({
    mutationFn: ({ id, roleCode }: { id: number; roleCode: string }) =>
      userService.admin.revokeRole(id, roleCode),

    onSuccess: async () => {
      await invalidateUsers();
    },
  });

  return {
    createUser: createUser.mutateAsync,
    updateUser: updateUser.mutateAsync,
    deleteUser: deleteUser.mutateAsync,
    restoreUser: restoreUser.mutateAsync,
    assignRole: assignRole.mutateAsync,
    revokeRole: revokeRole.mutateAsync,
    isLoading:
      createUser.isPending ||
      updateUser.isPending ||
      deleteUser.isPending ||
      restoreUser.isPending ||
      assignRole.isPending ||
      revokeRole.isPending,
  };
};
