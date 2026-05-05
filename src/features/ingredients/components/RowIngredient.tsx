interface Ingredient {
  id: number;
  name: string;
  is_allergen: boolean;
}

interface RowIngredientProps {
  item: Ingredient;
  onEdit: (id: string) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

export const RowIngredient = ({
  item,
  onEdit,
  onDelete,
  isDeleting,
}: RowIngredientProps) => {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="p-4 text-sm text-gray-500 font-mono">#{item.id}</td>

      <td className="p-4 font-medium text-gray-800">{item.name}</td>

      <td className="p-4">
        {item.is_allergen ? (
          <span className="inline-flex items-center bg-red-100 text-red-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 mr-1.5 bg-red-500 rounded-full"></span>
            Alérgeno
          </span>
        ) : (
          <span className="inline-flex items-center bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 mr-1.5 bg-green-500 rounded-full"></span>
            Seguro
          </span>
        )}
      </td>

      <td className="p-4 text-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEdit(item.id.toString())}
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-all"
          >
            Editar
          </button>

          <button
            onClick={() => {
              if (window.confirm(`¿Estás seguro de eliminar "${item.name}"?`)) {
                onDelete(item.id);
              }
            }}
            disabled={isDeleting}
            className={`text-red-600 hover:text-red-800 font-medium hover:underline transition-all ${
              isDeleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isDeleting ? "Borrando..." : "Borrar"}
          </button>
        </div>
      </td>
    </tr>
  );
};
