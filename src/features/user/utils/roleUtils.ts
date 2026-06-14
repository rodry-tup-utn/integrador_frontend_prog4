import type { UserRoleRead } from "../types/user";

export const isRoleExpired = (role: UserRoleRead) =>
  !!role.expires_at && new Date(role.expires_at).getTime() < Date.now();
