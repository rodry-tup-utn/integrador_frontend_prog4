import { useState } from "react";
import {
  Container,
  Title,
  Text,
  TextInput,
  SimpleGrid,
  Center,
  Stack,
  Skeleton,
  Card,
  SegmentedControl,
  Group,
  Pagination,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useDebouncedValue } from "@mantine/hooks";
import { IngredientPublicCard } from "../components/IngredientPublicCard";
import { usePublicIngredientsList } from "../hooks/usePublicIngredientsList";

const LIMIT = 12;

export const IngredientsPublicPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [allergenFilter, setAllergenFilter] = useState<string>("all");
  const [debouncedSearch] = useDebouncedValue(searchTerm, 300);

  const filters = {
    search: debouncedSearch || undefined,
    is_allergen:
      allergenFilter === "all"
        ? undefined
        : allergenFilter === "allergen"
          ? true
          : false,
    offset: (page - 1) * LIMIT,
    limit: LIMIT,
    sort_by: "name" as const,
    order: "asc" as const,
  };

  const { data: ingredients, isLoading } = usePublicIngredientsList(filters);
  const totalPages = ingredients ? Math.ceil(ingredients.total / LIMIT) : 0;

  return (
    <Container size="xl" py="xl">
      <Stack ta="center" mb="xl">
        <Title order={1}>Diccionario de Ingredientes</Title>
        <Text c="dimmed" maw={600} mx="auto">
          Transparencia total sobre los componentes de nuestros productos.
        </Text>
        <TextInput
          placeholder="Buscar por nombre..."
          leftSection={<IconSearch size={16} />}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.currentTarget.value);
            setPage(1);
          }}
          maw={500}
          mx="auto"
          size="md"
        />
      </Stack>
      <SegmentedControl
        value={allergenFilter}
        onChange={(v) => {
          setAllergenFilter(v);
          setPage(1);
        }}
        data={[
          { label: "Todos", value: "all" },
          { label: "Alérgenos", value: "allergen" },
          { label: "Seguros", value: "safe" },
        ]}
        mb="md"
      />
      {isLoading ? (
        <SimpleGrid cols={{ base: 1, sm: 3, lg: 4 }} spacing="lg">
          {Array.from({ length: LIMIT }, (_, i) => (
            <Card key={i} h={300} withBorder>
              <Skeleton h="100%" />
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 4, lg: 5 }} spacing="lg">
          {ingredients?.data?.map((item) => (
            <IngredientPublicCard key={item.id} item={item} />
          ))}
        </SimpleGrid>
      )}
      {!isLoading && (ingredients?.data?.length ?? 0) === 0 && (
        <Center py="xl">
          <Text c="dimmed" size="lg">
            No se encontraron ingredientes.
          </Text>
        </Center>
      )}
      {!isLoading && (ingredients?.data?.length ?? 0) > 0 && (
        <Group justify="space-between" mt="xl">
          <Text size="sm" c="dimmed">
            Total: {ingredients?.total ?? 0} ingredientes
          </Text>
          <Pagination total={totalPages || 1} value={page} onChange={setPage} />
        </Group>
      )}
    </Container>
  );
};
