import { Outlet } from 'react-router-dom'
import Header from '../../widgets/header/Header'


const MainLayout = () => {
    return (
        <div className="min-h-screen bg-background-primary flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col w-full">
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout