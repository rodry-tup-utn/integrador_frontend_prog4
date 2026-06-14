import { useQuery } from "@tanstack/react-query";
import { userKeys } from "../../types/user";
import { userService } from "../../services/userService";

export const useAdminUserDetail = (id: string | null) => {
  return useQuery({
    queryKey: userKeys.adminDetail(String(id)),

    queryFn: () => {
      if (!id) {
        throw new Error("Es necesario un id para acceder al usuario");
      }

      return userService.admin.getById(Number(id));
    },

    enabled: !!id,
  });
};
