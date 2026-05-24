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
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { IngredientPublicCard } from "../components/IngredientPublicCard";
import { usePublicIngredientsList } from "../hooks/usePublicIngredientsList";
import AllergenFilterButtons from "../components/AllergenFilterButtons";
import { useAllergenFilter } from "../hooks/useAllergenFilter";
export const IngredientsPublicPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: ingredients, isLoading } = usePublicIngredientsList(
    0,
    50,
    searchTerm,
  );
  const { filterAllergen, filteredIngredients, setFilterAllergen } =
    useAllergenFilter(ingredients?.data || []);
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
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          maw={500}
          mx="auto"
          size="md"
        />
      </Stack>
      <AllergenFilterButtons
        onChange={setFilterAllergen}
        value={filterAllergen}
      />
      {isLoading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Card key={n} h={180} withBorder>
              <Skeleton h="100%" />
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {filteredIngredients?.map((item) => (
            <IngredientPublicCard key={item.id} item={item} />
          ))}
        </SimpleGrid>
      )}
      {!isLoading && filteredIngredients?.length === 0 && (
        <Center py="xl">
          <Text c="dimmed" size="lg">
            No se encontraron ingredientes.
          </Text>
        </Center>
      )}
    </Container>
  );
};
