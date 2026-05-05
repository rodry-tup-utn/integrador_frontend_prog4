import { useState } from "react";
import { useIngredients } from "../hooks/useIngredients";
import { IngredientModal } from "../components/IngredientModal";
import type { IngredientPublic } from "../types/ingredient";

export const IngredientsPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIngredient, setSelectedIngredient] =
    useState<IngredientPublic | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const limit = 20;

  // Calculamos el offset para la API
  const offset = (page - 1) * limit;

  // El hook ahora recibe el searchTerm. React Query hará el fetch automáticamente al cambiar page o searchTerm.
  const { ingredients, isLoading, deleteIngredient } = useIngredients(
    offset,
    limit,
    searchTerm,
  );

  const totalPages = ingredients ? Math.ceil(ingredients.total / limit) : 0;

  // Manejo de búsqueda: Solo reseteamos la página, el hook detecta el cambio de searchTerm
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleEditClick = (ingredient: IngredientPublic) => {
    console.log(ingredient);
    setSelectedIngredient(ingredient);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedIngredient(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ingredientes</h1>
        <button
          onClick={() => handleAddClick()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Nuevo Ingrediente
        </button>
      </div>

      <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Buscar ingrediente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Buscar
        </button>
      </form>

      {/* Tabla (Mismo código que tenías) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          {/* ... thead ... */}
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Cargando...
                </td>
              </tr>
            ) : ingredients?.data.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No hay ingredientes.
                </td>
              </tr>
            ) : (
              ingredients?.data.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 text-sm text-gray-500">#{item.id}</td>
                  <td className="p-4 font-medium text-gray-800">{item.name}</td>
                  <td className="p-4">
                    {item.is_allergen ? (
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                        Sí
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        No
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-sm">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteIngredient(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Total: {ingredients?.total || 0}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-sm">
            Página {page} de {totalPages || 1}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isLoading}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal de Creación */}
      <IngredientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ingredientData={selectedIngredient}
      />
    </div>
  );
};
