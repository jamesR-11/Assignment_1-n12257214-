import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  // Safe fallback if a test ever renders without AuthProvider
  const ctx = useAuth();
  const { user, logout } = ctx ?? { user: null, logout: () => {} };
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/login');
    }
  };

  return (
    <nav className="w-full bg-gray-100 border-b mb-6">
      <div className="max-w-5xl mx-auto p-3 flex items-center justify-between">
        <div className="flex gap-4">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          {user && <Link to="/attendance">Attendance</Link>}
          {user && <Link to="/tasks">Tasks</Link>}
          {user?.role === 'admin' && <Link to="/admin/attendance">Admin Attendance</Link>}
          {user?.role === 'admin' && <Link to="/admin/users">Admin Users</Link>}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span>{user?.email}</span>
              <button onClick={handleLogout} className="px-3 py-1 bg-blue-600 text-white rounded">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="px-3 py-1 bg-blue-600 text-white rounded">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
