import { Paper, Title, Stack, Radio, Loader, Alert, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { Link as RouterLink } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import type { AddressRead } from "../../user/types/user";

interface Props {
  addresses: AddressRead[] | undefined;
  isLoading: boolean;
  selectedAddressId: number | null;
  onChange: (id: number | null) => void;
}

const PICKUP_VALUE = "__retiro_local__";

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
    ) : (
      <Radio.Group
        value={selectedAddressId === null ? PICKUP_VALUE : String(selectedAddressId)}
        onChange={(v) => onChange(v === PICKUP_VALUE ? null : Number(v))}
      >
        <Stack gap="xs">
          <Radio
            value={PICKUP_VALUE}
            label={
              <Text>
                <Text component="span" fw={600}>Retiro en local</Text>
                {" — "}Retirás tu pedido en el local
              </Text>
            }
          />

          {addresses && addresses.length > 0 ? (
            addresses.map((addr) => (
              <Radio
                key={addr.id}
                value={String(addr.id)}
                label={`${addr.alias} — ${addr.line_one}, ${addr.city}, ${addr.province}`}
              />
            ))
          ) : (
            <Alert icon={<IconAlertCircle size={16} />} color="yellow">
              No tenés direcciones cargadas.{" "}
              <Text component={RouterLink} to={ROUTES.PROFILE} td="underline">
                Agregá una desde tu perfil
              </Text>
            </Alert>
          )}
        </Stack>
      </Radio.Group>
    )}
  </Paper>
);

export default AddressSelector;
