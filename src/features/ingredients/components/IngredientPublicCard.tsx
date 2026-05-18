import { Card, Text, Badge, Group, Button, Divider } from "@mantine/core";
import type { IngredientPublic } from "../types/ingredient";
interface Props {
  item: IngredientPublic;
}
export const IngredientPublicCard = ({ item }: Props) => (
  <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
    <Group justify="space-between" mb="xs">
      <Text fw={700} size="lg">
        {item.name}
      </Text>
      {item.is_allergen && (
        <Badge color="red" variant="light">
          ALÉRGENO
        </Badge>
      )}
    </Group>
    <Text size="sm" c="dimmed" style={{ flex: 1 }}>
      {item.description || "Sin descripción disponible."}
    </Text>
    <Divider my="md" />
    <Group justify="space-between">
      <Text size="xs" c="dimmed" tt="uppercase">
        Información Nutricional
      </Text>
      <Button variant="subtle" size="xs" color="orange">
        Ver detalles
      </Button>
    </Group>
  </Card>
);
