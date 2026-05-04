import { useAuth } from "../features/auth/context/AuthContext";

export const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Panel Principal</h1>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="mt-6">
          <p className="text-lg">
            ¡Bienvenido, <span className="font-semibold">{user?.name}</span>!
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Rol actual:</strong> {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
