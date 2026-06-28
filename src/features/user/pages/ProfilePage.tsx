import { useState } from "react";
import {
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconPlus, IconCircleCheckFilled, IconExclamationCircleFilled } from "@tabler/icons-react";
import { useProfile } from "../hooks/profile/useProfile";
import { useProfileMutations } from "../hooks/profile/useProfileMutations";
import { useProfileAddresses } from "../hooks/profile/userProfileAddresses";
import { useProfileAddressMutations } from "../hooks/profile/useProfileAddressMutations";
import { showConfirm } from "../../../shared/components/ShowConfirm";
import { extractApiErrorMessage } from "../../../shared/helpers/apiErrors";
import type { AddressCreate, AddressRead, UserUpdate } from "../types/user";
import AddressModal from "./AddressModal";
import ProfileInfoCard from "../components/ProfileInfoCard";
import AddressCard from "../components/AddressCard";
import { notifications } from "@mantine/notifications";

export const ProfilePage = () => {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: addresses, isLoading: addressesLoading } =
    useProfileAddresses();
  const { updateProfile, updatingProfile } = useProfileMutations();
  const {
    createAddress,
    updateAddress,
    deleteAddress,
    isCreating,
    isUpdating,
  } = useProfileAddressMutations();

  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState<UserUpdate>({});
  const [selectedAddress, setSelectedAddress] = useState<AddressRead | null>(
    null,
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newModalOpen, setNewModalOpen] = useState(false);

  const cancelEdit = () => {
    setEditing(false);
    setUserData({});
  };

  const handleSaveProfile = async () => {
    await updateProfile(userData);
    setEditing(false);
  };

  const handleCreateAddress = async (data: AddressCreate) => {
    try {
      await createAddress(data);
      notifications.show({
        title: "Dirección agregada",
        message: `Direccion ${data.alias} agregada!`,
        color: "green",
        radius: "lg",
        icon: <IconCircleCheckFilled />,
      });
      setNewModalOpen(false);
    } catch (error: unknown) {
      notifications.show({
        title: "Error al crear dirección",
        message: extractApiErrorMessage(error, "No se pudo crear la direccion"),
        color: "red",
        radius: "lg",
        icon: <IconExclamationCircleFilled />,
      });
    }
  };

  const handleOpenEdit = (data: AddressRead) => {
    setSelectedAddress(data);
    setEditModalOpen(true);
  };

  const handleUpdateAddress = async (data: AddressCreate) => {
    if (!selectedAddress) return;
    try {
      await updateAddress({ id: selectedAddress.id, data: data });
      notifications.show({
        title: "Dirección actualizada",
        message: `Direccion ${selectedAddress.alias} actualizada correctamente`,
        color: "green",
        radius: "lg",
        icon: <IconCircleCheckFilled />,
      });
      setEditModalOpen(false);
    } catch (error: unknown) {
      notifications.show({
        title: "Error al actualizar dirección",
        message: extractApiErrorMessage(
          error,
          "No se pudo actualizar la direccion",
        ),
        color: "red",
        radius: "lg",
        icon: <IconExclamationCircleFilled />,
      });
    }
  };

  const handleDeleteAddress = (addr: AddressRead) => {
    showConfirm({
      title: `¿Eliminar dirección "${addr.alias}"?`,
      confirmLabel: "Eliminar",
      color: "red",
      onConfirm: () => deleteAddress(addr.id),
      successMessage: `Dirección "${addr.alias}" eliminada`,
    });
  };

  const handleEditing = () => {
    setUserData({
      name: profile?.name,
      lastname: profile?.lastname,
      email: profile?.email,
    });
    setEditing(true);
  };

  if (profileLoading) {
    return <Text> Cargando perfil...</Text>;
  }

  if (!profile) {
    return <Text>No se pudo cargar el perfil.</Text>;
  }

  return (
    <Container size="md">
      <Stack gap="lg">
        <Title order={2}>Mi Perfil</Title>
        <ProfileInfoCard
          profile={profile}
          editing={editing}
          formData={userData}
          updatingProfile={updatingProfile}
          onStartEdit={handleEditing}
          onCancelEdit={cancelEdit}
          onSaveProfile={handleSaveProfile}
          onChange={(field, value) =>
            setUserData({ ...userData, [field]: value })
          }
        />

        <Paper shadow="sm" withBorder bd={"2px solid teal"} radius="xl" p="lg">
          <Group justify="space-between" mb="md">
            <Title order={4}>Direcciones</Title>
            <Button
              variant="light"
              leftSection={<IconPlus size={16} />}
              onClick={() => setNewModalOpen(true)}
            >
              Agregar
            </Button>
          </Group>

          {addressesLoading ? (
            <Text>Cargando direcciones...</Text>
          ) : !addresses?.length ? (
            <Text c="dimmed" py="xl" ta="center">
              No tenés direcciones registradas.
            </Text>
          ) : (
            <Stack gap="sm">
              {addresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  address={addr}
                  onEdit={() => handleOpenEdit(addr)}
                  onDelete={() => handleDeleteAddress(addr)}
                />
              ))}
            </Stack>
          )}
        </Paper>
        <AddressModal
          key="new"
          title="Nueva Direccion"
          label="Agregar"
          opened={newModalOpen}
          onAction={handleCreateAddress}
          onClose={() => setNewModalOpen(false)}
          isLoading={isCreating}
          addressData={null}
        />
        <AddressModal
          key={selectedAddress?.id ?? "edit"}
          title="Editar Direccion"
          label="Actualizar"
          opened={editModalOpen}
          onAction={handleUpdateAddress}
          onClose={() => setEditModalOpen(false)}
          isLoading={isUpdating}
          addressData={selectedAddress}
        />
      </Stack>
    </Container>
  );
};
