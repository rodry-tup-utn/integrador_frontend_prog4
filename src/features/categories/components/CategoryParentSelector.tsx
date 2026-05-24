import { useMemo } from "react";
import { Select } from "@mantine/core";

import { useCategoryTree } from "../hooks/useCategoryTree";
import type { CategoryNode } from "../types/category";

interface Props {
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  excludeId?: number;
}

function flattenTree(
  nodes: CategoryNode[],
  excludeId?: number,
  parents: string[] = [],
): { value: string; label: string }[] {
  return nodes
    .filter((n) => n.id !== excludeId)
    .flatMap((n) => {
      const path = [...parents, n.name];
      const current = { value: String(n.id), label: path.join(" > ") };
      const children = n.children?.length
        ? flattenTree(n.children, excludeId, path)
        : [];
      return [current, ...children];
    });
}

export const CategoryParentSelector = ({
  value,
  onChange,
  excludeId,
}: Props) => {
  const { data, isLoading } = useCategoryTree(4);

  const options = useMemo(
    () => flattenTree(data ?? [], excludeId),
    [data, excludeId],
  );

  return (
    <Select
      label="Categoría padre"
      placeholder="Buscar categoría..."
      data={options}
      value={value ? String(value) : null}
      onChange={(v) => onChange(v ? Number(v) : null)}
      searchable
      clearable
      nothingFoundMessage="Sin resultados"
      disabled={isLoading}
    />
  );
};
