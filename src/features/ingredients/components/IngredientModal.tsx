import { useIngredients } from "../hooks/useIngredients";
import { useState, useEffect } from "react";
import type { IngredientPrivate } from "../types/ingredient";
import { X, Calendar, Clock, AlertTriangle } from "lucide-react"; // Si usas lucide-react
import { formatDate } from "../helpers/helpers";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ingredientData?: IngredientPrivate | null;
  isDeleted: boolean;
}

const initialState = { name: "", description: "", is_allergen: false };

export const IngredientModal = ({
  isOpen,
  onClose,
  ingredientData,
  isDeleted,
}: Props) => {
  const { createIngredient, updateIngredient, isCreating, isUpdating } =
    useIngredients();
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (ingredientData) {
      setFormData({
        name: ingredientData.name,
        description: ingredientData.description || "",
        is_allergen: ingredientData.is_allergen,
      });
    } else {
      setFormData(initialState);
    }
  }, [ingredientData, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!ingredientData;
  const isLoading = isCreating || isUpdating;

  const actionConfig = isDeleted
    ? null
    : isEditing && ingredientData
      ? {
          successMessage: "editado",
          submit: () =>
            updateIngredient({
              id: ingredientData.id,
              data: formData,
            }),
        }
      : {
          successMessage: "creado",
          submit: () => createIngredient(formData),
        };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!actionConfig) return;

    try {
      const result = await actionConfig.submit();

      toast.success(
        `Ingrediente ${result.name} ${actionConfig.successMessage} exitosamente`,
      );

      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail || "Error al ejecutar la operación",
      );
    }
  };

  const title = isDeleted
    ? "Detalle Ingrediente"
    : isEditing
      ? "Editar Ingrediente"
      : "Nuevo Ingrediente";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col border border-gray-200">
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            {isEditing && (
              <p className="text-xs text-gray-500 font-mono">
                ID: {ingredientData.id}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-5">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nombre
              </label>
              <input
                disabled={isDeleted}
                type="text"
                required
                placeholder="Ej. Harina de Trigo"
                className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                placeholder="Detalles del ingrediente..."
                className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                rows={3}
                value={formData.description}
                disabled={isDeleted}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* Alérgeno */}
            <div
              className={`flex items-center p-3 rounded-xl border transition-colors ${formData.is_allergen ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}
            >
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="is_allergen"
                    className="h-5 w-5 text-red-600 border-gray-300 rounded-md focus:ring-red-500 cursor-pointer"
                    checked={formData.is_allergen}
                    disabled={isDeleted}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_allergen: e.target.checked,
                      })
                    }
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="is_allergen"
                    className="font-semibold text-gray-800 cursor-pointer flex items-center gap-2"
                  >
                    {formData.is_allergen && (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    ¿Es un alérgeno?
                  </label>
                  <p className="text-gray-500 text-xs">
                    Marcar si requiere advertencia sanitaria.
                  </p>
                </div>
              </div>
            </div>

            {/* Metadatos (Solo en edición) */}
            {isEditing && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-[11px] text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <div>
                    <p className="font-bold uppercase opacity-70">Creado</p>
                    <p>{formatDate(ingredientData.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 border-l pl-4">
                  <Clock className="w-3.5 h-3.5" />
                  <div>
                    <p className="font-bold uppercase opacity-70">
                      Actualizado
                    </p>
                    <p>
                      {ingredientData.updated_at
                        ? formatDate(ingredientData.updated_at)
                        : "Sin cambios"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Acciones */}
          {!isDeleted && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:bg-blue-300 shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando...
                  </span>
                ) : isEditing ? (
                  "Guardar Cambios"
                ) : (
                  "Crear Ingrediente"
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
