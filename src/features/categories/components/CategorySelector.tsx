import { useMemo } from "react";
import { Select, Breadcrumbs, Anchor } from "@mantine/core";
import { useCategoryTree } from "../hooks/useCategoryTree";
import type { CategoryNode } from "../types/category";

interface Props {
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  excludeId?: number;
  label?: string;
  showBreadcrumbs?: boolean;
  onlyLeaves?: boolean;
  isRequired?: boolean
}

function flattenTree(
  nodes: CategoryNode[],
  excludeId?: number,
  onlyLeaves?: boolean,
  parents: string[] = [],
): { value: string; label: string }[] {
  return nodes
    .filter((n) => n.id !== excludeId)
    .flatMap((n) => {
      const path = [...parents, n.name];
      const items: { value: string; label: string }[] = [];
      if (!onlyLeaves || !n.has_children) {
        items.push({ value: String(n.id), label: path.join(" > ") });
      }
      const children = n.children?.length
        ? flattenTree(n.children, excludeId, onlyLeaves, path)
        : [];
      return [...items, ...children];
    });
}

function buildPathMap(
  nodes: CategoryNode[],
  parents: string[] = [],
): Map<number, string[]> {
  const map = new Map<number, string[]>();
  for (const n of nodes) {
    const path = [...parents, n.name];
    map.set(n.id, path);
    if (n.children?.length) {
      const childMap = buildPathMap(n.children, path);
      childMap.forEach((v, k) => map.set(k, v));
    }
  }
  return map;
}

export const CategorySelector = ({
  value,
  onChange,
  excludeId,
  label = "Categoría padre",
  showBreadcrumbs = false,
  onlyLeaves = false,
  isRequired,
}: Props) => {
  const { data, isLoading } = useCategoryTree(4);

  const options = useMemo(
    () => flattenTree(data ?? [], excludeId, onlyLeaves),
    [data, excludeId, onlyLeaves],
  );

  const pathMap = useMemo(() => buildPathMap(data ?? []), [data]);

  const selectedPath = value ? pathMap.get(value) : undefined;

  return (
    <>
      <Select
        label={label}
        placeholder="Buscar categoría..."
        data={options}
        value={value ? String(value) : null}
        onChange={(v) => onChange(v ? Number(v) : null)}
        searchable
        clearable
        required={isRequired}
        nothingFoundMessage="Sin resultados"
        disabled={isLoading}
      />
      {showBreadcrumbs && selectedPath && (
        <Breadcrumbs separator=">" mt="xs">
          {selectedPath.map((name, index) => (
            <Anchor
              key={index}
              size="sm"
              c="dimmed"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              {name}
            </Anchor>
          ))}
        </Breadcrumbs>
      )}
    </>
  );
};
