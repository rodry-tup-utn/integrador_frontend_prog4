import { Center, Stack, Text } from "@mantine/core";
import { IconMoodSad } from "@tabler/icons-react";

interface NotFoundStateProps {
  message?: string;
}

const NotFoundState = ({ message = "No encontrado" }: NotFoundStateProps) => (
  <Center py={80}>
    <Stack align="center" gap="sm">
      <IconMoodSad size={48} stroke={1} color="gray" />
      <Text size="sm" c="dimmed">
        {message}
      </Text>
    </Stack>
  </Center>
);

export default NotFoundState;
