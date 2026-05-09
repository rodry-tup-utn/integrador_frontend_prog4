export type AllergenFilterType = "all" | "allergen" | "safe";

interface Props {
  value: AllergenFilterType;
  onChange: (type: AllergenFilterType) => void;
}

const AllergenFilterButtons = ({ value, onChange }: Props) => {
  const filterButtonClass = (isActive: boolean, activeStyle: string) =>
    `px-6 py-2 rounded-full text-sm font-bold transition-all ${
      isActive ? activeStyle : "bg-white text-gray-600 border border-gray-200"
    }`;
  return (
    <div className="flex justify-center gap-3 mb-10">
      <button
        onClick={() => onChange("all")}
        className={filterButtonClass(value === "all", "bg-gray-900 text-white")}
      >
        Todos
      </button>

      <button
        onClick={() => onChange("allergen")}
        className={filterButtonClass(
          value === "allergen",
          "bg-red-500 text-white",
        )}
      >
        Solo Alérgenos ⚠️
      </button>

      <button
        onClick={() => onChange("safe")}
        className={filterButtonClass(
          value === "safe",
          "bg-green-500 text-white",
        )}
      >
        Solo Seguros
      </button>
    </div>
  );
};

export default AllergenFilterButtons;
