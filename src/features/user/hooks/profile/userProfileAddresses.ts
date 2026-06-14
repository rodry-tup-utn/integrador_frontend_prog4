import { useQuery } from "@tanstack/react-query";
import { userKeys } from "../../types/user";
import { userService } from "../../services/userService";

export const useProfileAddresses = () => {
  return useQuery({
    queryKey: userKeys.addresses(),
    queryFn: () => userService.profile.addresses.getAll(),
  });
};
