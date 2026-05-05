import { useState } from "react";
import { useIngredients } from "../hooks/useIngredients";
import { IngredientModal } from "../components/IngredientModal";
import { RowIngredient } from "../components/RowIngredient";

export const IngredientsPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const limit = 20;

  // Calculamos el offset para la API
  const offset = (page - 1) * limit;

  // El hook ahora recibe el searchTerm. React Query hará el fetch automáticamente al cambiar page o searchTerm.
  const {
    ingredients,
    isLoading,
    deleteIngredient,
    ingredientDetail,
    isDeleting,
  } = useIngredients(offset, limit, searchTerm, selectedId);

  const totalPages = ingredients ? Math.ceil(ingredients.total / limit) : 0;

  // Manejo de búsqueda: Solo reseteamos la página, el hook detecta el cambio de searchTerm
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleEditClick = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedId(null);
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
                <RowIngredient
                  key={item.id}
                  item={item}
                  onEdit={handleEditClick}
                  onDelete={deleteIngredient}
                  isDeleting={isDeleting} // Viene de tu hook useIngredients
                />
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
        ingredientData={ingredientDetail}
      />
    </div>
  );
};
