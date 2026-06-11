import { Modal, Tabs } from "@mantine/core";
import type { UserAdminRead } from "../../types/user";
import { AdminEditUserForm } from "./AdminEditUserForm";
import { AdminEditUserRoles } from "./AdminEditUserRoles";

interface Props {
  opened: boolean;
  onClose: () => void;
  user: UserAdminRead;
}

export const AdminUserEditModal = ({ opened, onClose, user }: Props) => {
  return (
    <Modal
      opened={opened}
      title={`Editar Usuario — ${user.lastname}, ${user.name}`}
      onClose={onClose}
      centered
      size="lg"
    >
      <Tabs defaultValue="data">
        <Tabs.List>
          <Tabs.Tab value="data">Datos</Tabs.Tab>
          <Tabs.Tab value="roles">Roles</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="data" pt="md">
          <AdminEditUserForm user={user} onClose={onClose} />
        </Tabs.Panel>

        <Tabs.Panel value="roles" pt="md">
          <AdminEditUserRoles user={user} onClose={onClose} />
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
};
