import { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";
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
  const executeLogin = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<boolean> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const userData = await login(formData);
      notifications.show({
        title: "Exito!",
        message: `Bienvenido ${userData.name}!`,
      });
      return true;
    } catch (err: any) {
      notifications.show({
        color: "red",
        title: "Error",
        message: err.response?.data?.detail || "Error al iniciar sesión",
      });
      return false;
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
  return { executeLogin, login, logout, loading, user };
};
