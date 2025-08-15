import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function AdminUsers() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'user' });

  const isAdmin = user?.role === 'admin' || user?.email === 'admin@example.com';

  // ⬇️ Stable loader (fixes ESLint missing dependency warning)
  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await axiosInstance.get('/api/admin/users');
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]); // ✅ include load

  const startEdit = (u) => {
    setEditingId(u._id);
    setForm({ name: u.name || '', email: u.email || '', role: u.role || 'user' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', email: '', role: 'user' });
  };

  const handleSave = async () => {
    try {
      const { data } = await axiosInstance.put(`/api/admin/users/${editingId}`, form);
      setRows((prev) => prev.map((u) => (u._id === editingId ? data : u)));
      cancelEdit();
    } catch (e) {
      alert(e?.response?.data?.message || e.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axiosInstance.delete(`/api/admin/users/${id}`);
      setRows((prev) => prev.filter((u) => u._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || e.message || 'Delete failed');
    }
  };

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
        <h1 className="text-2xl font-semibold">Admin • Users</h1>
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
              <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Role</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6" colSpan={4}>
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={4}>
                  No users found.
                </td>
              </tr>
            ) : (
              rows.map((u) => {
                const isEditing = editingId === u._id;
                return (
                  <tr key={u._id} className="border-t">
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          className="w-full border rounded px-2 py-1"
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        />
                      ) : (
                        u.name || '—'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          className="w-full border rounded px-2 py-1"
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        />
                      ) : (
                        u.email || '—'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          className="border rounded px-2 py-1"
                          value={form.role}
                          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      ) : (
                        u.role || 'user'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSave}
                            className="px-3 py-1.5 rounded bg-green-600 text-white shadow hover:opacity-90"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1.5 rounded bg-gray-200 text-gray-900 hover:opacity-90"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(u)}
                            className="px-3 py-1.5 rounded bg-blue-600 text-white shadow hover:opacity-90"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(u._id)}
                            className="px-3 py-1.5 rounded bg-red-600 text-white shadow hover:opacity-90"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
