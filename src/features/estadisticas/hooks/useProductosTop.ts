import { useQuery } from "@tanstack/react-query";
import { estadisticasService } from "../services/estadisticasService";
import { estadisticasKeys } from "../types/estadisticas";

export const useProductosTop = (limit = 5) => {
  return useQuery({
    queryKey: estadisticasKeys.productosTop(limit),
    queryFn: () => estadisticasService.productosTop(limit),
  });
};
