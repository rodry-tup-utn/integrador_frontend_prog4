import { useQuery } from "@tanstack/react-query";
import { ingredientService } from "../services/ingredientService";
import { ingredientsKeys } from "../types/ingredient";

export const useMeasurementUnits = () => {
  return useQuery({
    queryKey: [...ingredientsKeys.all, "measurement-units"],
    queryFn: ingredientService.public.getMeasurementUnits,
    staleTime: Infinity,
  });
};
