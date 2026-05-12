import { useAuth } from '../../features/auth/context/AuthContext';
import { ROUTES } from '../../shared/constants/routes';
import { Link, NavLink } from 'react-router-dom';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void
}

const Drawer = ({ isOpen, onClose }: DrawerProps) => {

    const { isAuthenticated, logout } = useAuth()

    const adminLinks = [
        { route: ROUTES.PRODUCTS, label: 'Productos' },
        { route: ROUTES.INGREDIENTS, label: 'Ingredientes' },
        { route: ROUTES.CATEGORIES, label: 'Categorías' },
    ]

    const publicLinks = [
        { route: ROUTES.HOME, label: 'Inicio' }
    ]

    const links = isAuthenticated ? [...publicLinks, ...adminLinks] : publicLinks

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            <div
                className={`
                    fixed top-0 right-0 z-50 h-full w-3/4 max-w-xs
                    bg-background-secondary shadow-xl
                    flex flex-col
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
                    <span className="font-semibold text-text-primary">Menú</span>
                    <button
                        onClick={onClose}
                        className="text-text-primary hover:text-text-primary transition-colors text-xl"
                    >
                        x
                    </button>
                </div>

                <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
                    {links.map(({ route, label }) => (
                        <NavLink
                            key={route}
                            to={route}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-primary-50 text-primary-500'
                                    : 'text-text-primary hover:bg-background-primary hover:text-text-primary'
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {isAuthenticated ? (
                    <div className="px-5 py-4 border-t border-neutral-200">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors" onClick={() => logout()}>
                            Cerrar sesión
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 p-3">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                            <Link to={ROUTES.LOGIN} onClick={onClose}>Iniciar sesión</Link>
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                            <Link to={ROUTES.REGISTER} onClick={onClose}>Registrarse</Link>
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default Drawer