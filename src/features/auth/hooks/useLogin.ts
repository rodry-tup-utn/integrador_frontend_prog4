import { useState, useEffect } from "react";
import type { UserSessionRead } from "../../user/types/user";
import { authService } from "../services/authService";
export const useLogin = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserSessionRead | null>(null);

  useEffect(() => {
    authService
      .session()
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (formData: FormData): Promise<UserSessionRead> => {
    setLoading(true);
    try {
      await authService.login(formData);
      const userData = await authService.session();
      setUser(userData);
      return userData;
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    setUser(null);
  };
  return { login, logout, loading, user };
};
