import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys, type UpdatePass, type UserUpdate } from "../../types/user";
import { userService } from "../../services/userService";

export const useProfileMutations = () => {
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: (data: UserUpdate) => userService.profile.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });

  const updatePass = useMutation({
    mutationFn: (data: UpdatePass) => userService.profile.updatePass(data),
  });

  return {
    updateProfile: updateProfile.mutateAsync,
    updatingProfile: updateProfile.isPending,
    updatePass: updatePass.mutateAsync,
    updatingPass: updatePass.isPending,
  };
};
