import { useQuery } from "@tanstack/react-query";
import { estadisticasService } from "../services/estadisticasService";
import { estadisticasKeys } from "../types/estadisticas";

export const useResumen = () => {
  return useQuery({
    queryKey: estadisticasKeys.resumen(),
    queryFn: estadisticasService.resumen,
  });
};
