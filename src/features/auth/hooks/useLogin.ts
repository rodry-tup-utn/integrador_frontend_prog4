import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { notifications } from "@mantine/notifications";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const executeLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const user = await login(formData);
      if (user) {
        notifications.show({
          title: "Exito!",
          message: `Bienvenido ${user.name}!`,
        });
        return true;
      }
      throw new Error("Login failed");
    } catch (err: any) {
      notifications.show({
        color: "red",
        title: "Error",
        message: err.response?.data?.detail || "Error al iniciar sesión",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { executeLogin, loading };
};
