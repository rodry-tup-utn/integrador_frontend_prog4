import { Stack, Text, Badge, Button, Divider, Group } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useAuth } from "../../features/auth/context/AuthContext";
import NavLinkSidebar from "./NavLinkSidebar";
import { sidebarSections } from "./sidebarLinks";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  onMobileClose?: () => void;
}

const Sidebar = ({ onMobileClose }: SidebarProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const visibleSections = sidebarSections.filter(
    (section) =>
      !section.roles || section.roles.some((r) => user?.roles.includes(r)),
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Stack h="100%" justify="space-between" px={'xs'} pt={'xs'} className="overflow-y-scroll">
      {/* Links */}
      <Stack gap={0} style={{ overflowY: "auto" }}>
        {visibleSections.map((section) => (
          <NavLinkSidebar
            key={section.title}
            title={section.title}
            MainIcon={section.icon}
            links={section.links}
            opened={section.opened || false}
            userRoles={user?.roles || []}
            onLinkClick={onMobileClose}
          />
        ))}
      </Stack>
      {/* User info + logout */}
      <Stack gap="xs" p="md">
        <Divider />
        <Group gap="sm">
          <Badge color="orange" size="sm" variant="light">
            {user?.roles[0]}
          </Badge>
          <Text size="sm" fw={600} style={{ flex: 1 }}>
            {user?.name} {user?.lastname}
          </Text>
        </Group>
        <Button
          variant="subtle"
          color="red"
          leftSection={<IconLogout size={16} />}
          onClick={() => handleLogout()}
          fullWidth
          size="compact-sm"
        >
          Cerrar sesión
        </Button>
      </Stack>
    </Stack>
  );
};
export default Sidebar;
