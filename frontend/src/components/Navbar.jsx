import axiosInstance from '../axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (user?.token) {
        await axiosInstance.post('/api/auth/logout', {}, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      }
    } catch (e) {
      // ignore API errors; still clear local state
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">Task Manager</Link>
      <div>
        {user ? (
          <>
            <span className="mr-4">Hello, {user.name}</span>
            <Link to="/attendance" className="bg-purple-500 px-4 py-2 rounded hover:bg-purple-700 mr-2">
              Attendance
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-900 mr-2">
              Login
            </Link>
            <Link to="/register" className="bg-green-500 px-4 py-2 rounded hover:bg-green-700">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
