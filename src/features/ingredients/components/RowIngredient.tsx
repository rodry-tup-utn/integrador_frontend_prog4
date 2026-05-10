import { toast } from "sonner";
import type { IngredientPrivate } from "../types/ingredient";

interface RowIngredientProps {
  item: IngredientPrivate;
  onEdit: (id: string) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  isDeleting?: boolean;
  isRestoring?: boolean;
}

export const RowIngredient = ({
  item,
  onEdit,
  onDelete,
  onRestore,
  isDeleting,
  isRestoring,
}: RowIngredientProps) => {
  const isDeleted = !!item.deleted_at;

  const restoreAction = {
    text: `¿Restaurar "${item.name}"?`,
    label: "Restaurar",
    fn: () => onRestore(item.id),
    textLoading: "Restaurando...",
  };
  const deleteAction = {
    text: `¿Eliminar "${item.name}"?`,
    label: "Eliminar",
    fn: () => onDelete(item.id),
    textLoading: "Eliminando...",
  };

  const finalAction = isDeleted ? restoreAction : deleteAction;

  const handleAction = () => {
    toast(finalAction.text, {
      action: {
        label: finalAction.label,
        onClick: () => {
          finalAction.fn();
        },
      },
    });
  };

  const label =
    isRestoring || isDeleting ? finalAction.textLoading : finalAction.label;

  return (
    <tr
      className={`
        border-b border-gray-100 transition-all duration-200
        ${
          isDeleted
            ? "bg-gray-50 opacity-70 border-l-4 border-l-red-400"
            : "hover:bg-gray-50"
        }
      `}
    >
      <td className="p-4 text-sm text-gray-500 font-mono">#{item.id}</td>

      <td
        className={`p-4 font-medium transition-all ${
          isDeleted ? "text-gray-400 line-through" : "text-gray-800"
        }`}
      >
        {item.name}
      </td>

      <td className="p-4">
        {item.is_allergen ? (
          <span className="inline-flex items-center bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full border border-red-200">
            <span className="w-1.5 h-1.5 mr-1.5 bg-red-500 rounded-full"></span>
            Alérgeno
          </span>
        ) : (
          <span className="inline-flex items-center bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full border border-green-200">
            <span className="w-1.5 h-1.5 mr-1.5 bg-green-500 rounded-full"></span>
            Seguro
          </span>
        )}
      </td>

      <td className="p-4 text-sm">
        <div className="flex justify-center gap-3">
          <button
            onClick={() => onEdit(item.id.toString())}
            className={`
              px-4 py-2 rounded-2xl w-28 font-medium text-white transition-all
              ${
                isDeleted
                  ? "bg-gray-500 hover:bg-gray-600"
                  : "bg-teal-600 hover:bg-teal-800"
              }
              hover:cursor-pointer
            `}
          >
            {isDeleted ? "Detalle" : "Editar"}
          </button>

          <button
            onClick={handleAction}
            disabled={isDeleting || isRestoring}
            className={`
              px-4 py-2 w-28 rounded-2xl font-medium text-white transition-all
              ${
                isDeleting || isRestoring
                  ? "bg-gray-400 cursor-not-allowed"
                  : isDeleted
                    ? "bg-green-600 hover:bg-green-800 cursor-pointer"
                    : "bg-red-600 hover:bg-red-800 cursor-pointer"
              }
            `}
          >
            {label}
          </button>
        </div>
      </td>

      <td className="p-4 text-sm">
        <span
          className={`
            inline-flex items-center rounded-full px-3 py-1
            text-xs font-bold uppercase tracking-wide border
            ${
              isDeleted
                ? "bg-red-100 text-red-700 border-red-200"
                : "bg-emerald-100 text-emerald-700 border-emerald-200"
            }
          `}
        >
          {isDeleted ? "Eliminado" : "Activo"}
        </span>
      </td>
    </tr>
  );
};
