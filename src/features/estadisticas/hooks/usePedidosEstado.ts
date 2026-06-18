import { useQuery } from "@tanstack/react-query";
import { estadisticasService } from "../services/estadisticasService";
import { estadisticasKeys } from "../types/estadisticas";

export const usePedidosEstado = () => {
  return useQuery({
    queryKey: estadisticasKeys.pedidosEstado(),
    queryFn: estadisticasService.pedidosEstado,
  });
};
