import { useState } from "react";
import { IngredientPublicCard } from "../components/IngredientPublicCard";
import { usePublicIngredients } from "../hooks/usePublicIngredients";

export const IngredientsPublicPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAllergen, setFilterAllergen] = useState<boolean | null>(null);

  // Hook configurado para vista pública (offset, limit, search, selectedId)
  const { ingredients, isLoading } = usePublicIngredients(0, 50, searchTerm);

  // Filtrado local para la UI de alérgenos
  const filteredIngredients = ingredients?.data?.filter((ing) => {
    if (filterAllergen === null) return true;
    return ing.is_allergen === filterAllergen;
  });

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
        <div className="flex justify-center gap-3 mb-10">
          <button
            onClick={() => setFilterAllergen(null)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              filterAllergen === null
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterAllergen(true)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              filterAllergen === true
                ? "bg-red-500 text-white"
                : "bg-white text-red-500 border border-red-200"
            }`}
          >
            Solo Alérgenos ⚠️
          </button>
        </div>

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
