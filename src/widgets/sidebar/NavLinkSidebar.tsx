import { NavLink } from "@mantine/core";
import { type Icon } from "@tabler/icons-react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";

interface Props {
  links: { to: string; label: string; icon: Icon; roles?: string[] }[];
  MainIcon: Icon;
  title: string;
  opened?: boolean;
  userRoles: string[];
  onLinkClick?: () => void;
}

const NavLinkSidebar = ({
  links,
  title,
  MainIcon,
  opened,
  userRoles,
}: Props) => {
  const location = useLocation();
  return (
    <>
      <NavLink
        label={title}
        leftSection={<MainIcon size={24} />}
        childrenOffset={28}
        defaultOpened={opened === true}
        active
        variant="subtle"
      >
        {links
          .filter((l) => !l.roles || l.roles.some((r) => userRoles.includes(r)))
          .map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              component={RouterNavLink}
              to={to}
              label={label}
              leftSection={<Icon size={16} />}
              active={location.pathname === to}
              variant="light"
            />
          ))}
      </NavLink>
    </>
  );
};

export default NavLinkSidebar;
