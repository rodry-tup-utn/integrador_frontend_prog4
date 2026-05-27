import {
  IconUser,
  IconShoppingCart,
  IconShoppingBag,
  IconLock,
  IconEgg,
  IconPackage,
  IconClipboardList,
  IconUsers,
  IconCategory,
  IconChartBar,
  IconSettings,
  IconBurger,
  IconMeat,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
export interface SidebarLink {
  to: string;
  label: string;
  icon: Icon;
  roles?: string[];
}
export interface SidebarSection {
  title: string;
  icon: Icon;
  opened?: boolean;
  links: SidebarLink[];
  roles?: string[]; // sección completa filtrada por rol
}
export const sidebarSections: SidebarSection[] = [
  {
    title: "Tienda",
    icon: IconShoppingCart,
    opened: true,
    links: [
      { to: "/products", label: "Nuestros Productos", icon: IconBurger },
      { to: "/ingredients", label: "Nuestros Ingredientes", icon: IconMeat },
    ],
  },
  {
    title: "Usuario",
    icon: IconUser,
    links: [
      { to: "/profile", label: "Perfil", icon: IconUser },
      {
        to: "/cart",
        label: "Carrito",
        icon: IconShoppingCart,
        roles: ["CLIENT", "ADMIN"],
      },
      {
        to: "/user/orders",
        label: "Mis Pedidos",
        icon: IconShoppingBag,
        roles: ["CLIENT", "ADMIN"],
      },

      { to: "/change-password", label: "Contraseña", icon: IconLock },
    ],
  },
  {
    title: "Stock",
    icon: IconPackage,
    roles: ["ADMIN", "STOCK"],
    links: [
      { to: "/stock/ingredients", label: "Ingredientes", icon: IconEgg },
      { to: "/stock/products", label: "Productos", icon: IconPackage },
    ],
  },
  {
    title: "Órdenes",
    icon: IconClipboardList,
    roles: ["ADMIN", "ORDERS"],
    links: [
      {
        to: "/orders",
        label: "Todos los Pedidos",
        icon: IconClipboardList,
      },
    ],
  },
  {
    title: "Admin",
    icon: IconSettings,
    roles: ["ADMIN"],
    links: [
      { to: "/admin/users", label: "Usuarios", icon: IconUsers },
      { to: "/admin/categories", label: "Categorías", icon: IconCategory },
      { to: "/admin/ingredients", label: "Ingredientes", icon: IconEgg },
      { to: "/admin/products", label: "Productos", icon: IconPackage },
      { to: "/admin/metrics", label: "Métricas", icon: IconChartBar },
      { to: "/admin/config", label: "Configuración", icon: IconSettings },
    ],
  },
];
