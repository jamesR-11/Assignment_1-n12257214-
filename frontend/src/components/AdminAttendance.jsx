import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function AdminAttendance() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const isAdmin = user?.role === 'admin' || user?.email === 'admin@example.com';

  // ⬇️ Stable loader (fixes ESLint missing dependency warning)
  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await axiosInstance.get('/api/admin/attendance');
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]); // ✅ include load

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this attendance record?')) return;
    try {
      await axiosInstance.delete(`/api/admin/attendance/${id}`);
      setRows((prev) => prev.filter((r) => r._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || e.message || 'Delete failed');
    }
  };

  const fmt = (v) => (v ? new Date(v).toLocaleString() : '—');

  if (!isAdmin) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="rounded-md bg-yellow-50 border border-yellow-200 p-4">
          <p className="text-yellow-800 font-medium">Admin only page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Admin • Attendance</h1>
        <button
          onClick={load}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white shadow hover:opacity-90"
        >
          Refresh
        </button>
      </div>

      {err && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-red-700">
          {err}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border bg-white shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">User</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Login Time</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Logout Time</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6" colSpan={5}>
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={5}>
                  No attendance records yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="px-4 py-3">{r.user?.name || '—'}</td>
                  <td className="px-4 py-3">{r.user?.email || '—'}</td>
                  <td className="px-4 py-3">{fmt(r.loginTime)}</td>
                  <td className="px-4 py-3">{fmt(r.logoutTime)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="px-3 py-1.5 rounded bg-red-600 text-white shadow hover:opacity-90"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
