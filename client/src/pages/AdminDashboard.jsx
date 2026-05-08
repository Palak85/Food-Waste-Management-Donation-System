import React, { useState, useEffect } from 'react';
import { Shield, Users, Package, Trash2, Activity } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, donations: 0, activeDonations: 0 });
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, donationsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/donations')
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setDonations(donationsRes.data.donations);
    } catch (error) {
      toast.error('Failed to load admin data. Are you an admin?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      setUsers(users.filter(u => u._id !== id));
      setStats(s => ({ ...s, users: s.users - 1 }));
    } catch (error) {
      toast.error('Error deleting user');
    }
  };

  const deleteDonation = async (id) => {
    if (!window.confirm('Delete this donation record?')) return;
    try {
      await api.delete(`/admin/donations/${id}`);
      toast.success('Donation removed');
      setDonations(donations.filter(d => d._id !== id));
      setStats(s => ({ ...s, donations: s.donations - 1 }));
    } catch (error) {
      toast.error('Error deleting donation');
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-500 font-bold">Loading Admin Panel...</div>;

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-100 text-red-600 rounded-lg"><Shield size={28} /></div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Command Center</h1>
          <p className="text-gray-500">Manage all users, donations, and platform activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div><p className="text-gray-500 text-sm">Total Users</p><p className="text-3xl font-bold">{stats.users}</p></div>
          <Users size={32} className="text-blue-500 opacity-50" />
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div><p className="text-gray-500 text-sm">Total Donations</p><p className="text-3xl font-bold">{stats.donations}</p></div>
          <Package size={32} className="text-green-500 opacity-50" />
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div><p className="text-gray-500 text-sm">Active Available</p><p className="text-3xl font-bold">{stats.activeDonations}</p></div>
          <Activity size={32} className="text-purple-500 opacity-50" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button 
            className={`flex-1 py-4 font-bold text-center ${activeTab === 'users' ? 'bg-gray-50 text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('users')}
          >
            Manage Users ({users.length})
          </button>
          <button 
            className={`flex-1 py-4 font-bold text-center ${activeTab === 'donations' ? 'bg-gray-50 text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('donations')}
          >
            Manage Donations ({donations.length})
          </button>
        </div>

        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b">
                {activeTab === 'users' ? (
                  <>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4">Food Item</th>
                    <th className="px-6 py-4">Donor Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activeTab === 'users' && users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium">{u.name}</td>
                  <td className="px-6 py-4 text-gray-600">{u.email}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs uppercase font-bold">{u.role}</span></td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteUser(u._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}

              {activeTab === 'donations' && donations.map(d => (
                <tr key={d._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium">{d.title}</td>
                  <td className="px-6 py-4 text-gray-600">{d.donor?.name || 'Unknown'}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs uppercase font-bold">{d.status}</span></td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteDonation(d._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
              
              {((activeTab === 'users' && users.length === 0) || (activeTab === 'donations' && donations.length === 0)) && (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-500">No data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
