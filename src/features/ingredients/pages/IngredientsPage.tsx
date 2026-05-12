import { useState } from "react";
import { useIngredients } from "../hooks/useIngredients";
import { IngredientModal } from "../components/IngredientModal";
import { RowIngredient } from "../components/RowIngredient";
import type { IngredientPrivate } from "../types/ingredient";
import { PlusCircleIcon } from "lucide-react";
import AllergenFilterButtons from "../components/AllergenFilterButtons";
import { useAllergenFilter } from "../hooks/useAllergenFilter";
import { toast } from "sonner";
export const IngredientsPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<IngredientPrivate | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const limit = 10;

  const offset = (page - 1) * limit;

  const {
    ingredients,
    isLoading,
    deleteIngredient,
    restoreIngredient,
    isRestoring,
    isDeleting,
  } = useIngredients(offset, limit, searchTerm);

  const { filterAllergen, filteredIngredients, setFilterAllergen } =
    useAllergenFilter(ingredients?.data || []);

  const totalPages = ingredients ? Math.ceil(ingredients.total / limit) : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleEditClick = (item: IngredientPrivate) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteIngredient(id);

      toast.success("Ingrediente eliminado");
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail || "Error al eliminar el ingrediente",
      );
    }
  };
  const handleRestore = async (id: number) => {
    try {
      await restoreIngredient(id);

      toast.success("Ingrediente restaurado");
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail || "Error al restaurar el ingrediente",
      );
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ingredientes</h1>
        <button
          onClick={() => handleAddClick()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <div className="flex items-center gap-2">
            <PlusCircleIcon /> Nuevo Ingrediente
          </div>
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

      <AllergenFilterButtons
        onChange={setFilterAllergen}
        value={filterAllergen}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-center border-collapse">
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
              filteredIngredients.map((item) => (
                <RowIngredient
                  key={item.id}
                  item={item}
                  onEdit={() => handleEditClick(item)}
                  onDelete={handleDelete}
                  onRestore={handleRestore}
                  isDeleting={isDeleting}
                  isRestoring={isRestoring}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

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

      <IngredientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ingredientData={selectedItem}
        isDeleted={!!selectedItem?.deleted_at}
      />
    </div>
  );
};
