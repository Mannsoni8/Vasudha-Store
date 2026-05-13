import { useState, useEffect } from 'react';
import { FiUsers } from 'react-icons/fi';
import { authAPI } from '../../utils/api';
import { Spinner } from '../common';

export default function AdminUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAPI.getAllUsers()
      .then(({ data }) => setUsers(data.users))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-800">Customers</h1>
        <p className="text-gray-500 text-sm">{users.length} registered users</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3">Name</th>
                  <th className="text-left px-5 py-3">Email</th>
                  <th className="text-left px-5 py-3">Role</th>
                  <th className="text-left px-5 py-3">Phone</th>
                  <th className="text-left px-5 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-maroon-100 rounded-full flex items-center justify-center text-maroon-800 font-bold text-sm shrink-0">
                          {u.name[0].toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge text-xs px-2.5 py-1 ${u.role === 'admin' ? 'bg-maroon-100 text-maroon-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{u.phone || '—'}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
