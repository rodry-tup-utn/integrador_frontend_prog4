import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ingredientService } from "../../../services/ingredientService";
import type {
  IngredientCreate,
  IngredientList,
} from "../../../types/ingredient";

export const useIngredients = () => {
  const [ingredients, setIngredients] = useState<IngredientList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchIngredients = useCallback(async (offset = 0, limit = 20) => {
    setLoading(true);
    try {
      const data = await ingredientService.admin.getAll(offset, limit);
      setIngredients(data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail || "Error al cargar ingredientes",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createIngredient = async (data: IngredientCreate) => {
    setLoading(true);
    try {
      await ingredientService.admin.create(data);
      toast.success("Ingrediente creado correctamente");
      await fetchIngredients();
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Error al crear ingrediente");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteIngredient = async (id: number) => {
    try {
      await ingredientService.admin.delete(id);
      toast.success("Ingrediente eliminado");
      await fetchIngredients();
    } catch (error: any) {
      toast.error("No se pudo eliminar el ingrediente");
    }
  };

  const restoreIngredient = async (id: number) => {
    try {
      await ingredientService.admin.restore(id);
      toast.success("Ingrediente restaurado");
      await fetchIngredients();
    } catch (error: any) {
      toast.error("Error al restaurar");
    }
  };

  const searchIngredient = async (
    query: string,
    offset: number = 0,
    limit: number = 20,
  ) => {
    try {
      const data = await ingredientService.admin.search(query, offset, limit);
      setIngredients(data);
    } catch (error: any) {
      toast.error(error.msg || "Error al buscar el ingrediente");
    }
  };

  return {
    ingredients,
    loading,
    fetchIngredients,
    createIngredient,
    deleteIngredient,
    restoreIngredient,
    searchIngredient,
  };
};
