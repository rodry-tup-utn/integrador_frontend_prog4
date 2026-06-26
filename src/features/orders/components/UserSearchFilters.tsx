import { Group, TextInput, Title } from "@mantine/core";

interface Props {
  userName: string;
  userEmail: string;
  userLastname: string;
  onUserNameChange: (value: string) => void;
  onUserEmailChange: (value: string) => void;
  onUserLastnameChange: (value: string) => void;
}

export const UserSearchFilters = ({
  userName,
  userEmail,
  userLastname,
  onUserNameChange,
  onUserEmailChange,
  onUserLastnameChange,
}: Props) => {
  return (
    <Group gap="sm" mb="md" wrap="wrap">
      <Title order={5}>Filtros por Usuario</Title>
      <TextInput
        placeholder="Apellido"
        value={userLastname}
        onChange={(e) => onUserLastnameChange(e.currentTarget.value)}
        w={{ base: "100%", sm: 180 }}
      />
      <TextInput
        placeholder="Nombre"
        value={userName}
        onChange={(e) => onUserNameChange(e.currentTarget.value)}
        w={{ base: "100%", sm: 180 }}
      />
      <TextInput
        placeholder="Email"
        value={userEmail}
        onChange={(e) => onUserEmailChange(e.currentTarget.value)}
        w={{ base: "100%", sm: 200 }}
      />
    </Group>
  );
};
