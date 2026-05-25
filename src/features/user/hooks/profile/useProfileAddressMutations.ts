import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  userKeys,
  type AddressCreate,
  type AddressUpdate,
} from "../../types/user";
import { userService } from "../../services/userService";
export const useProfileAddressMutations = () => {
  const queryClient = useQueryClient();
  const invalidateAddresses = () => {
    queryClient.invalidateQueries({ queryKey: userKeys.addresses() });
  };
  const createAddress = useMutation({
    mutationFn: (data: AddressCreate) =>
      userService.profile.addresses.create(data),
    onSuccess: () => {
      invalidateAddresses();
    },
  });
  const updateAddress = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AddressUpdate }) =>
      userService.profile.addresses.update(id, data),
    onSuccess: invalidateAddresses,
  });
  const deleteAddress = useMutation({
    mutationFn: (id: number) => userService.profile.addresses.delete(id),
    onSuccess: invalidateAddresses,
  });
  const restoreAddress = useMutation({
    mutationFn: (id: number) => userService.profile.addresses.restore(id),
    onSuccess: invalidateAddresses,
  });
  return {
    createAddress: createAddress.mutateAsync,
    updateAddress: updateAddress.mutateAsync,
    deleteAddress: deleteAddress.mutateAsync,
    restoreAddress: restoreAddress.mutateAsync,
    isCreating: createAddress.isPending,
    isUpdating: updateAddress.isPending,
    isDeleting: deleteAddress.isPending,
    isRestoring: restoreAddress.isPending,
  };
};
