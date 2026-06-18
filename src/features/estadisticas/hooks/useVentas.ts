import { useQuery } from "@tanstack/react-query";
import { estadisticasService } from "../services/estadisticasService";
import type { VentasFilters } from "../types/estadisticas";
import { estadisticasKeys } from "../types/estadisticas";

export const useVentas = (filters?: VentasFilters) => {
  return useQuery({
    queryKey: estadisticasKeys.ventas(filters),
    queryFn: () => estadisticasService.ventas(filters),
  });
};
