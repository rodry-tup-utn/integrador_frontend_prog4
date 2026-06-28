import { openConfirmModal, closeAllModals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconExclamationCircleFilled } from "@tabler/icons-react";
import { extractApiErrorMessage } from "../helpers/apiErrors";

interface Props {
  title: string;
  confirmLabel: string;
  color?: string;
  onConfirm: () => Promise<unknown>;
  successMessage: string;
  showSuccess?: boolean;
}

export const showConfirm = ({
  title,
  confirmLabel,
  color = "cyan",
  onConfirm,
  successMessage = "La operación se realizó correctamente",
  showSuccess = true,
}: Props) => {
  openConfirmModal({
    title,
    labels: { confirm: confirmLabel, cancel: "Cancelar" },
    confirmProps: { color },
    closeOnConfirm: true,
    centered: true,
    onConfirm: async () => {
      try {
        await onConfirm();
        closeAllModals();
        if (showSuccess) {
          notifications.show({
            title: "Operación Exitosa",
            color: "green",
            message: successMessage,
            autoClose: 4000,
          });
        }
      } catch (error: unknown) {
        const errorMessage = extractApiErrorMessage(error);

        notifications.show({
          title: "Error al procesar la operación",
          color: "red",
          message: errorMessage,
          radius: "lg",
          icon: <IconExclamationCircleFilled />,
          autoClose: 6000,
        });
      }
    },
  });
};
