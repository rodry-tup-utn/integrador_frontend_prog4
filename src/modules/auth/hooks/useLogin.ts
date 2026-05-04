import { useState } from "react";
import { authService } from "../../../services/authService";
import { useAuth } from "../context/AuthContext";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const executeLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const data = await authService.login(formData);

      login(data.access_token, data.user);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al iniciar sesión");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { executeLogin, loading, error };
};
