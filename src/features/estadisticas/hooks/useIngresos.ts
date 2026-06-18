import { useQuery } from "@tanstack/react-query";
import { estadisticasService } from "../services/estadisticasService";
import { estadisticasKeys } from "../types/estadisticas";

export const useIngresos = (params?: { desde?: string; hasta?: string }) => {
  return useQuery({
    queryKey: estadisticasKeys.ingresos(params),
    queryFn: () => estadisticasService.ingresos(params),
  });
};
