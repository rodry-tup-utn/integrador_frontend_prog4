import { ROUTES } from "../../shared/constants/routes";
import { useAuth } from "../../features/auth/context/AuthContext";
import { NavLink } from "react-router-dom";

const NavLinks = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="flex items-center gap-6">
      <NavLink
        to={ROUTES.HOME}
        className={({ isActive }) =>
          `text-sm font-medium transition-colors ${
            isActive
              ? "text-primary-500"
              : "text-primary-900 hover:text-text-primary"
          }`
        }
      >
        Inicio
      </NavLink>
      {isAuthenticated && (
        <>
          <NavLink
            to={ROUTES.PRODUCTS}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? "text-primary-500"
                  : "text-primary-900 hover:text-text-primary"
              }`
            }
          >
            Productos
          </NavLink>
          <NavLink
            to={
              user?.role == "ADMIN"
                ? ROUTES.INGREDIENTS
                : ROUTES.PUBLICINGREDIENTS
            }
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? "text-primary-500"
                  : "text-primary-900 hover:text-text-primary"
              }`
            }
          >
            Ingredientes
          </NavLink>
          <NavLink
            to={ROUTES.CATEGORIES}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? "text-primary-500"
                  : "text-primary-900 hover:text-text-primary"
              }`
            }
          >
            Categorías
          </NavLink>
        </>
      )}
    </nav>
  );
};

export default NavLinks;
