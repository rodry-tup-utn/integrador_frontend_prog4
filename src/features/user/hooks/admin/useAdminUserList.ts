import { useQuery } from "@tanstack/react-query";
import { userKeys } from "../../types/user";
import { userService } from "../../services/userService";

export const useAdminUserList = (offset = 0, limit = 20, search = "") => {
  return useQuery({
    queryKey: userKeys.adminList({ offset, limit, search }),

    queryFn: () =>
      search
        ? userService.admin.search(search, offset, limit)
        : userService.admin.getAll(offset, limit),
  });
};
