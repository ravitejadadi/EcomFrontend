import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Mail, Calendar, Trash2, RefreshCw, X, AlertCircle } from 'lucide-react';
import { apiFetch } from '../../utils/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const navigate = useNavigate();

    const currentUser = (() => {
        try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
    })();

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await apiFetch('/users');
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, [navigate]);

    const handleRoleToggle = async (user) => {
        const newRole = user.role === 'admin' ? 'customer' : 'admin';
        setActionLoading(user._id);
        setError('');
        try {
            const res = await apiFetch(`/users/${user._id}`, {
                method: 'PUT',
                body: JSON.stringify({ role: newRole }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update role');
            setUsers(users.map(u => u._id === user._id ? { ...u, role: newRole } : u));
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (userId) => {
        setActionLoading(userId);
        setConfirmDelete(null);
        setError('');
        try {
            const res = await apiFetch(`/users/${userId}`, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to delete user');
            setUsers(users.filter(u => u._id !== userId));
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black font-display uppercase tracking-tight text-neutral-900">Users Directory</h1>
                    <p className="text-neutral-500 text-sm mt-1">Manage registered customers and administrators</p>
                </div>
                <button onClick={fetchUsers} className="btn btn-outline btn-sm flex items-center gap-2 self-start sm:self-auto uppercase">
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md flex gap-3 text-red-700 text-sm">
                    <AlertCircle size={20} className="flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Total Users</p>
                    <p className="text-3xl font-black">{users.length}</p>
                </div>
                <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Customers</p>
                    <p className="text-3xl font-black">{users.filter(u => u.role === 'customer').length}</p>
                </div>
                <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm col-span-2 md:col-span-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Admins</p>
                    <p className="text-3xl font-black">{users.filter(u => u.role === 'admin').length}</p>
                </div>
            </div>

            {/* Users table */}
            <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-100">
                                <th className="p-4">User Details</th>
                                <th className="p-4">Email Address</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Registered</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-neutral-400">Loading registered users...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-neutral-400">No users found in database.</td>
                                </tr>
                            ) : (
                                users.map((u) => {
                                    const isSelf = currentUser?.id === u._id || currentUser?._id === u._id;
                                    const isWorking = actionLoading === u._id;
                                    return (
                                        <tr key={u._id} className="hover:bg-neutral-50/30">
                                            <td className="p-4 font-bold text-neutral-800">
                                                <div className="flex items-center gap-2">
                                                    {u.role === 'admin' ? (
                                                        <div className="p-1.5 bg-neutral-900 text-white rounded-md">
                                                            <Shield size={16} />
                                                        </div>
                                                    ) : (
                                                        <div className="p-1.5 bg-neutral-100 text-neutral-600 rounded-md">
                                                            <User size={16} />
                                                        </div>
                                                    )}
                                                    <span>{u.name}</span>
                                                    {isSelf && <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full uppercase">You</span>}
                                                </div>
                                            </td>
                                            <td className="p-4 text-neutral-600">
                                                <div className="flex items-center gap-2 font-medium">
                                                    <Mail size={14} className="text-neutral-400" />
                                                    <span>{u.email}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                                    u.role === 'admin' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700'
                                                }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="p-4 text-neutral-500 text-xs font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-neutral-400" />
                                                    <span>
                                                        {new Date(u.createdAt).toLocaleDateString('en-IN', {
                                                            day: '2-digit', month: 'short', year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleRoleToggle(u)}
                                                        disabled={isSelf || isWorking}
                                                        title={u.role === 'admin' ? 'Demote to Customer' : 'Promote to Admin'}
                                                        className="px-3 py-1.5 text-xs font-bold rounded-md border border-neutral-300 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                                                    >
                                                        <Shield size={12} />
                                                        {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDelete(u)}
                                                        disabled={isSelf || isWorking}
                                                        title="Delete user"
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirm Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold font-display uppercase">Delete User</h3>
                            <button onClick={() => setConfirmDelete(null)} className="p-1 hover:bg-neutral-100 rounded-md">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-neutral-600 text-sm mb-6">
                            Are you sure you want to permanently delete <strong>{confirmDelete.name}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmDelete(null)} className="btn btn-outline flex-1 uppercase text-sm">
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(confirmDelete._id)}
                                className="btn flex-1 uppercase text-sm bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
