import { Paper, Title, Stack, Radio, Loader, Alert, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { Link as RouterLink } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import type { AddressRead } from "../../user/types/user";

interface Props {
  addresses: AddressRead[] | undefined;
  isLoading: boolean;
  selectedAddressId: number | null;
  onChange: (id: number) => void;
}

const AddressSelector = ({
  addresses,
  isLoading,
  selectedAddressId,
  onChange,
}: Props) => (
  <Paper withBorder p="md" radius="md">
    <Title order={4} mb="sm">
      Dirección de envío
    </Title>
    {isLoading ? (
      <Loader size="sm" />
    ) : addresses && addresses.length > 0 ? (
      <Radio.Group
        value={String(selectedAddressId)}
        onChange={(v) => onChange(Number(v))}
      >
        <Stack gap="xs">
          {addresses.map((addr) => (
            <Radio
              key={addr.id}
              value={String(addr.id)}
              label={`${addr.alias} — ${addr.line_one}, ${addr.city}, ${addr.province}`}
            />
          ))}
        </Stack>
      </Radio.Group>
    ) : (
      <Alert icon={<IconAlertCircle size={16} />} color="yellow">
        No tenés direcciones cargadas.{" "}
        <Text component={RouterLink} to={ROUTES.PROFILE} td="underline">
          Agregá una desde tu perfil
        </Text>
      </Alert>
    )}
  </Paper>
);

export default AddressSelector;
