import { useState } from "react";
import { IngredientPublicCard } from "../components/IngredientPublicCard";
import { usePublicIngredientsList } from "../hooks/usePublicIngredientsList";
import AllergenFilterButtons from "../components/AllergenFilterButtons";
import { useAllergenFilter } from "../hooks/useAllergenFilter";

export const IngredientsPublicPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: ingredients, isLoading } = usePublicIngredientsList(
    0,
    50,
    searchTerm,
  );
  const { filterAllergen, filteredIngredients, setFilterAllergen } =
    useAllergenFilter(ingredients?.data || []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Diccionario de Ingredientes
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Transparencia total sobre los componentes de nuestros productos para
            tu seguridad alimentaria.
          </p>

          {/* Buscador */}
          <div className="mt-8 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Buscar por nombre (ej: Harina, Leche)..."
              className="w-full px-6 py-4 border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filtros de Alérgenos */}
        <AllergenFilterButtons
          onChange={setFilterAllergen}
          value={filterAllergen}
        />

        {/* Grid de Contenido */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-48 bg-gray-200 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredIngredients?.map((item) => (
              <IngredientPublicCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Estado Vacío */}
        {!isLoading && filteredIngredients?.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 text-xl font-medium">
              No se encontraron ingredientes con ese nombre.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
