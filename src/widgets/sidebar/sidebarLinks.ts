import {
  IconUser,
  IconShoppingCart,
  IconShoppingBag,
  IconLock,
  IconEgg,
  IconPackage,
  IconClipboardList,
  IconChefHat,
  IconUsers,
  IconCategory,
  IconChartBar,
  IconSettings,
  IconBurger,
  IconMeat,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import { ROUTES } from "../../shared/constants/routes";
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
      {
        to: ROUTES.PUBLIC_PRODUCTS,
        label: "Nuestros Productos",
        icon: IconBurger,
      },
      {
        to: ROUTES.PUBLIC_INGREDIENTS,
        label: "Nuestros Ingredientes",
        icon: IconMeat,
      },
    ],
  },
  {
    title: "Usuario",
    icon: IconUser,
    links: [
      { to: ROUTES.PROFILE, label: "Perfil", icon: IconUser },
      {
        to: ROUTES.MY_ORDERS,
        label: "Mis Pedidos",
        icon: IconShoppingBag,
        roles: ["CLIENT", "ADMIN"],
      },

      { to: ROUTES.CHANGE_PASSWORD, label: "Contraseña", icon: IconLock },
    ],
  },
  {
    title: "Stock",
    icon: IconPackage,
    roles: ["ADMIN", "STOCK"],
    links: [
      { to: ROUTES.STOCK_INGREDIENTS, label: "Ingredientes", icon: IconEgg },
      { to: ROUTES.STOCK_PRODUCTS, label: "Productos", icon: IconPackage },
    ],
  },
  {
    title: "Órdenes",
    icon: IconClipboardList,
    roles: ["ADMIN", "ORDERS"],
    links: [
      {
        to: ROUTES.KITCHEN_BOARD,
        label: "Cocina",
        icon: IconChefHat,
      },
      {
        to: ROUTES.ORDERS_ADMIN,
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
      { to: ROUTES.ADMIN_USERS, label: "Usuarios", icon: IconUsers },
      { to: ROUTES.ADMIN_CATEGORIES, label: "Categorías", icon: IconCategory },
      { to: ROUTES.ADMIN_INGREDIENTS, label: "Ingredientes", icon: IconEgg },
      { to: ROUTES.ADMIN_METRICS, label: "Métricas", icon: IconChartBar },
      { to: ROUTES.ADMIN_CONFIG, label: "Configuración", icon: IconSettings },
      // { to: "/admin/metrics", label: "Métricas", icon: IconChartBar },
      // { to: "/admin/config", label: "Configuración", icon: IconSettings },
    ],
  },
];
