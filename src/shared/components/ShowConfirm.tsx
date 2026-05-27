import { notifications } from "@mantine/notifications";
import { Button, Group, Stack, Text } from "@mantine/core";
import { extractApiErrorMessage } from "../helpers/apiErrors";

interface Props {
  title: string;
  confirmLabel: string;
  color?: string;
  onConfirm: () => Promise<unknown>;
  successMessage: string;
}

export const showConfirm = ({
  title,
  confirmLabel,
  color = "cyan",
  onConfirm,
  successMessage = "La operación se realizó correctamente",
}: Props) => {
  const onClick = async () => {
    notifications.clean();

    try {
      await onConfirm();
      notifications.show({
        title: "Operación Exitosa",
        color: "green",
        message: successMessage,
        autoClose: 4000,
      });
    } catch (error: unknown) {
      const errorMessage = extractApiErrorMessage(error);

      notifications.show({
        title: "Error al procesar la operación",
        color: "red",
        message: errorMessage,
        autoClose: 6000,
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
          <Button size="xs" color={color} onClick={onClick}>
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
