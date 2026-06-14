import { Card, Text, Badge, Group, Image } from "@mantine/core";
import type { IngredientPublic } from "../types/ingredient";
import placeholderImg from "../../../assets/placeholder-ingredient.jpg";

interface Props {
  item: IngredientPublic;
}

export const IngredientPublicCard = ({ item }: Props) => (
  <Card
    shadow="sm"
    radius="lg"
    withBorder
    padding={0}
    style={{ display: "flex", flexDirection: "column", height: "100%" }}
  >
    <Card.Section>
      <Image src={placeholderImg} h={200} fit="cover" alt={item.name} />
    </Card.Section>
    <div
      className="rounded"
      style={{
        background: item.is_allergen
          ? "linear-gradient(135deg, #a60303, #f55858)"
          : "linear-gradient(135deg, #078729, #4ad970)",
        padding: "12px 16px",
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Text fw={700} size="lg" c="white" truncate style={{ flex: 1 }}>
          {item.name}
        </Text>
        {item.is_allergen && (
          <Badge variant="white" size="sm">
            ALÉRGENO
          </Badge>
        )}
      </Group>
    </div>
    <div
      style={{
        padding: "12px 16px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Text size="sm" c="dimmed" lineClamp={3} style={{ flex: 1 }}>
        {item.description || "Sin descripción disponible."}
      </Text>
    </div>
  </Card>
);
