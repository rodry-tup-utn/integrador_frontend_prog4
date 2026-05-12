import { useState } from "react";
import { toast } from "sonner";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const executeLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const data = await authService.login(formData);
      login(data.user, data.access_token);
      toast.success(`Bienvenido ${data.user.name}!`);
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Error al iniciar sesión");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { executeLogin, loading };
};
