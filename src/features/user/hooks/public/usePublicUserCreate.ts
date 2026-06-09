import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userKeys, type UserCreate } from "../../types/user";
import { userService } from "../../services/userService";

export const usePublicUserCreate = () => {
  const queryClient = useQueryClient();

  const invalidateUsers = async () => {
    await queryClient.invalidateQueries({
      queryKey: userKeys.all,
    });
  };
  const createPublicUser = useMutation({
    mutationFn: (data: UserCreate) => userService.public.create(data),

    onSuccess: async () => {
      await invalidateUsers();
    },
  });

  return {
    createPublicUser: createPublicUser.mutateAsync,
    isLoading: createPublicUser.isPending,
  };
};
