import { useMemo, useState } from "react";
import type { AllergenFilterType } from "../components/AllergenFilterButtons";

type AllergenFilterable = {
  is_allergen: boolean;
};

export const useAllergenFilter = <T extends AllergenFilterable>(
  ingredients: T[],
) => {
  const [filterAllergen, setFilterAllergen] =
    useState<AllergenFilterType>("all");

  const filteredIngredients = useMemo(() => {
    return ingredients.filter((ing) => {
      switch (filterAllergen) {
        case "all":
          return true;

        case "allergen":
          return ing.is_allergen;

        case "safe":
          return !ing.is_allergen;

        default:
          return true;
      }
    });
  }, [ingredients, filterAllergen]);

  return {
    filterAllergen,
    filteredIngredients,
    setFilterAllergen,
  };
};
