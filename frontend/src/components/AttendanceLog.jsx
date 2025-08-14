import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function AttendanceLog() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get('/api/attendance/my', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRows(data);
      } catch (err) {
        console.error(err);
        alert('Failed to load attendance log');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Login/Logout History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">User</th>
              <th className="px-4 py-2 border">Login Time</th>
              <th className="px-4 py-2 border">Logout Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id}>
                <td className="px-4 py-2 border">{user?.name || 'Me'}</td>
                <td className="px-4 py-2 border">{new Date(r.loginAt).toLocaleString()}</td>
                <td className="px-4 py-2 border">{r.logoutAt ? new Date(r.logoutAt).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
