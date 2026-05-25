import {
  Button,
  SimpleGrid,
  Stack,
  Switch,
  TextInput,
  Group,
  Modal,
} from "@mantine/core";
import type { AddressCreate, AddressRead } from "../types/user";
import { useState } from "react";
import { IconDeviceFloppy } from "@tabler/icons-react";

interface Props {
  opened: boolean;
  addressData: AddressRead | null;
  title: string;
  onAction: (data: AddressCreate) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
  label: string;
}

const emptyInitialData: AddressCreate = {
  alias: "",
  line_one: "",
  line_two: "",
  city: "",
  province: "",
  zip_code: "",
  latitude: 0,
  longitude: 0,
  is_main: false,
};

const AddressModal = ({
  opened,
  title,
  addressData,
  onAction,
  onClose,
  isLoading,
  label,
}: Props) => {
  const initialData: AddressCreate = addressData
    ? {
        alias: addressData.alias,
        line_one: addressData.line_one,
        line_two: addressData.line_two ?? "",
        city: addressData.city,
        province: addressData.province,
        zip_code: addressData.zip_code,
        latitude: addressData.latitude,
        longitude: addressData.longitude,
        is_main: addressData.is_main,
      }
    : emptyInitialData;
  const [addressForm, setAddressForm] =
    useState<AddressCreate>(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAction(addressForm);
  };

  return (
    <Modal opened={opened} title={title} onClose={onClose} centered size="lg">
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          <TextInput
            label="Alias"
            placeholder="Casa, Trabajo, etc."
            required
            value={addressForm.alias}
            onChange={(e) =>
              setAddressForm({ ...addressForm, alias: e.currentTarget.value })
            }
          />
          <TextInput
            label="Calle"
            placeholder="Av. Siempre Viva 123"
            required
            value={addressForm.line_one}
            onChange={(e) =>
              setAddressForm({
                ...addressForm,
                line_one: e.currentTarget.value,
              })
            }
          />
          <TextInput
            label="Piso / Depto (opcional)"
            placeholder="Piso 3, Depto B"
            value={addressForm.line_two ?? ""}
            onChange={(e) =>
              setAddressForm({
                ...addressForm,
                line_two: e.currentTarget.value,
              })
            }
          />
          <SimpleGrid cols={2}>
            <TextInput
              label="Ciudad"
              placeholder="Ciudad"
              required
              value={addressForm.city}
              onChange={(e) =>
                setAddressForm({ ...addressForm, city: e.currentTarget.value })
              }
            />
            <TextInput
              label="Provincia"
              placeholder="Provincia"
              required
              value={addressForm.province}
              onChange={(e) =>
                setAddressForm({
                  ...addressForm,
                  province: e.currentTarget.value,
                })
              }
            />
          </SimpleGrid>
          <SimpleGrid cols={3}>
            <TextInput
              label="Código Postal"
              placeholder="CP"
              required
              value={addressForm.zip_code}
              onChange={(e) =>
                setAddressForm({
                  ...addressForm,
                  zip_code: e.currentTarget.value,
                })
              }
            />
            <TextInput
              label="Latitud"
              placeholder="-34.6037"
              type="number"
              value={addressForm.latitude}
              onChange={(e) =>
                setAddressForm({
                  ...addressForm,
                  latitude: parseFloat(e.currentTarget.value) || 0,
                })
              }
            />
            <TextInput
              label="Longitud"
              placeholder="-58.3816"
              type="number"
              value={addressForm.longitude}
              onChange={(e) =>
                setAddressForm({
                  ...addressForm,
                  longitude: parseFloat(e.currentTarget.value) || 0,
                })
              }
            />
          </SimpleGrid>
          <Switch
            label="Dirección principal"
            checked={addressForm.is_main ?? false}
            onChange={(e) =>
              setAddressForm({
                ...addressForm,
                is_main: e.currentTarget.checked,
              })
            }
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              leftSection={<IconDeviceFloppy size={16} />}
              loading={isLoading}
            >
              {label}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddressModal;
