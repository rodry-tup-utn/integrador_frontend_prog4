import type { IngredientPublic } from "../types/ingredient";

interface Props {
  item: IngredientPublic;
}

export const IngredientPublicCard = ({ item }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
        {item.is_allergen && (
          <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-md border border-red-100">
            ALÉRGENO ⚠️
          </span>
        )}
      </div>

      <p className="text-gray-600 text-sm leading-relaxed grow">
        {item.description || "Sin descripción disponible."}
      </p>

      <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Información Nutricional
        </span>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors">
          Ver detalles
        </button>
      </div>
    </div>
  );
};
