import { useQuery } from "@tanstack/react-query";
import { userKeys } from "../../types/user";
import { userService } from "../../services/userService";

export const useProfile = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => userService.profile.me(),
  });
};
