import { useState } from 'react'
import { ROUTES } from '../../shared/constants/routes'
import { useAuth } from '../../features/auth/context/AuthContext'
import NavLinks from './NavLinks'
import { Link } from 'react-router-dom'
import Drawer from './Drawer'

const Header = () => {
    const { isAuthenticated, logout } = useAuth()
    const [drawerOpen, setDrawerOpen] = useState(false)
    return (
        <>
            <header className="bg-background-elevated border-b border-neutral-200 shadow-md sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        to={ROUTES.HOME}
                        className="text-lg font-bold text-primary-500 hover:text-primary-600 transition-colors"
                    >
                        Food Store
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        {isAuthenticated && <NavLinks />}

                        {isAuthenticated ? (
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors" onClick={() => logout()}>
                                Cerrar sesión
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                    <Link to={ROUTES.LOGIN}>Iniciar sesión</Link>
                                </button>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                    <Link to={ROUTES.REGISTER}>Registrarse</Link>
                                </button>
                            </div>
                        )}
                    </div>
                    <button
                        className="md:hidden flex flex-col gap-1.5 p-2 text-text-primary hover:text-text-primary transition-colors"
                        onClick={() => setDrawerOpen(true)}
                        aria-label="Abrir menú"
                    >
                        <span className="block w-5 h-0.5 bg-current" />
                        <span className="block w-5 h-0.5 bg-current" />
                        <span className="block w-5 h-0.5 bg-current" />
                    </button>

                </div>
            </header>

            <Drawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
        </>
    )
}

export default Header