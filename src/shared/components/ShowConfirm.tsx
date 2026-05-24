import { notifications } from "@mantine/notifications";
import { Button, Group, Stack, Text } from "@mantine/core";
interface Props {
  title: string;
  confirmLabel: string;
  color?: string;
  onConfirm: () => void | Promise<void>;
  successMessage: string;
}
export const showConfirm = ({
  title,
  confirmLabel,
  color = "cyan",
  onConfirm,
  successMessage = "Operación exitosa",
}: Props) => {
  const onClick = async () => {
    try {
      await onConfirm();
      notifications.clean();
      notifications.show({
        title: "Operación Exitosa",
        color: "green",
        message: successMessage,
      });
    } catch (e: any) {
      notifications.show({
        title: "Error al procesar la operacion",
        color: "red",
        message: e.response?.data?.detail || "Error",
      });
    }
  };

  notifications.show({
    color,
    withBorder: true,
    autoClose: false, // no se cierra solo
    message: (
      <Stack gap="md">
        <Text size="md">{title}</Text>
        <Group justify="flex-end">
          <Button
            size="xs"
            color={color}
            onClick={() => {
              onClick();
              notifications.clean(); // cierra la notif
            }}
          >
            {confirmLabel}
          </Button>
          <Button
            size="xs"
            color="cyan"
            onClick={() => notifications.clean()} // cierra la notif
          >
            Cancelar
          </Button>
        </Group>
      </Stack>
    ),
  });
};
