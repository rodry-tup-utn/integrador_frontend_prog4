import { useIngredients } from "../hooks/useIngredients";
import { useState, useEffect } from "react";
import type { IngredientPublic } from "../types/ingredient";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ingredientData?: IngredientPublic | null; // Cambiado a null para resetear mejor
}

export const IngredientModal = ({ isOpen, onClose, ingredientData }: Props) => {
  const { createIngredient, updateIngredient, isCreating, isUpdating } =
    useIngredients();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_allergen: false,
  });

  // Efecto para cargar los datos si estamos editando
  useEffect(() => {
    if (ingredientData) {
      setFormData({
        name: ingredientData.name,
        description: ingredientData.description,
        is_allergen: ingredientData.is_allergen,
      });
    } else {
      // Si no hay data, reseteamos a valores iniciales
      setFormData({ name: "", description: "", is_allergen: false });
    }
  }, [ingredientData, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!ingredientData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && ingredientData) {
        await updateIngredient({ id: ingredientData.id, data: formData });
      } else {
        await createIngredient(formData);
      }

      onClose();
    } catch (error) {
      console.error("Error en la operación:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? "Editar Ingrediente" : "Nuevo Ingrediente"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_allergen"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={formData.is_allergen}
              onChange={(e) =>
                setFormData({ ...formData, is_allergen: e.target.checked })
              }
            />
            <label htmlFor="is_allergen" className="ml-2 text-sm text-gray-700">
              Es un alérgeno
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {isCreating || isUpdating
                ? "Guardando..."
                : isEditing
                  ? "Actualizar"
                  : "Crear Ingrediente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
