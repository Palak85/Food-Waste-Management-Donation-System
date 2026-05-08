import { useState, useEffect } from 'react';
import { Heart, Activity, CheckCircle, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../hooks/useAuth';

function CreateRequestModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', peopleToFeed: '', urgency: 'Medium', location: '', date: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/requests', { ...form, peopleToFeed: Number(form.peopleToFeed) });
      toast.success('Request posted!');
      onCreated(res.data.request);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Post a Food Request</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Title *</label>
            <input required className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Meals for Weekend Shelter" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
            <textarea rows="2" className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="What food do you need?" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">People to Feed *</label>
              <input required type="number" min="1" className="w-full border rounded-lg px-3 py-2 text-sm outline-none" value={form.peopleToFeed} onChange={e => setForm({...form, peopleToFeed: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Urgency</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm outline-none" value={form.urgency} onChange={e => setForm({...form, urgency: e.target.value})}>
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Location *</label>
            <input required className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Community Center, City" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Date Needed *</label>
            <input required className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Today 6PM, Flexible" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50">
            {loading ? 'Posting...' : 'Post Request'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function NGODashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchMyRequests = async () => {
    try {
      const res = await api.get('/requests/my/requests');
      setRequests(res.data.requests);
    } catch {
      toast.error('Could not load your requests');
    }
  };

  const fetchMyClaims = async () => {
    try {
      const res = await api.get('/donations/my/claims');
      setClaims(res.data.claims);
    } catch {
      toast.error('Could not load your claimed donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchMyRequests(); 
    fetchMyClaims();
  }, []);

  const updateClaimStatus = async (id, status) => {
    try {
      await api.patch(`/donations/${id}/status`, { status });
      toast.success(`Status updated successfully!`);
      fetchMyClaims();
    } catch (err) {
      toast.error('Failed to update tracking status');
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm('Delete this request?')) return;
    setDeleting(id);
    try {
      await api.delete(`/requests/${id}`);
      toast.success('Request deleted');
      setRequests(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting request');
    } finally {
      setDeleting(null);
    }
  };

  const totalPeopleFed = requests.reduce((sum, r) => sum + (r.peopleToFeed || 0), 0);
  const fulfilled = requests.filter(r => r.status === 'fulfilled').length;

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] text-gray-500">Loading dashboard...</div>;

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      {showModal && <CreateRequestModal onClose={() => setShowModal(false)} onCreated={(r) => setRequests(prev => [r, ...prev])} />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, {user?.name || 'NGO'}!</h1>
          <p className="text-gray-500">Manage food requests and track incoming donations.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 shadow-md transition-all">
          <Plus size={18}/> Create Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><Heart size={24}/></div>
          <div><p className="text-sm text-gray-500">Active Requests</p><p className="text-3xl font-bold">{requests.filter(r => r.status === 'open').length}</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-xl"><CheckCircle size={24}/></div>
          <div><p className="text-sm text-gray-500">Fulfilled</p><p className="text-3xl font-bold">{fulfilled}</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-xl"><Activity size={24}/></div>
          <div><p className="text-sm text-gray-500">Total People in Need</p><p className="text-3xl font-bold">{totalPeopleFed}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Your Requests</h2>
        </div>
        {requests.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Heart size={40} className="mx-auto mb-3 opacity-40"/>
            <p className="font-medium">No requests yet. Create one to get donations!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-500 text-sm">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">People</th>
                  <th className="px-6 py-4">Urgency</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Fulfilled By</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium">{r.title}</td>
                    <td className="px-6 py-4 text-gray-600">{r.peopleToFeed}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${r.urgency === 'High' ? 'bg-red-100 text-red-700' : r.urgency === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                        {r.urgency}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md capitalize ${r.status === 'open' ? 'bg-blue-100 text-blue-700' : r.status === 'fulfilled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.fulfilledBy?.name || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      {r.status === 'open' && (
                        <button onClick={() => deleteRequest(r._id)} disabled={deleting === r._id} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16}/>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Claimed Donations Tracking */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-10">
        <div className="px-6 py-5 border-b border-gray-100 bg-green-50/30">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Heart className="text-green-600" size={20}/> Active Food Pickups</h2>
        </div>
        {claims.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <CheckCircle size={40} className="mx-auto mb-3 opacity-40"/>
            <p className="font-medium">You haven't claimed any donations yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-500 text-sm">
                  <th className="px-6 py-4">Food Item</th>
                  <th className="px-6 py-4">Donor</th>
                  <th className="px-6 py-4">Pickup Location</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4 text-right">Update Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {claims.map(c => {
                  const item = c.foodItems?.[0];
                  return (
                    <tr key={c._id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium">{item?.itemName} <span className="text-xs text-gray-500 block">{item?.quantity} {item?.unit}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-600">{c.donorId?.name}<br/>{c.donorId?.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-[150px]">
                        <span className="truncate block">{c.pickupLocation?.address}</span>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.pickupLocation?.address || '')}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-xs">View Map</a>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md capitalize ${
                          c.status === 'accepted' || c.status === 'claimed' ? 'bg-blue-100 text-blue-700' : 
                          c.status === 'picked_up' ? 'bg-purple-100 text-purple-700' :
                          c.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {(c.status === 'accepted' || c.status === 'claimed') && (
                          <button onClick={() => updateClaimStatus(c._id, 'picked_up')} className="px-3 py-1.5 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg text-xs font-bold transition">Mark Picked Up</button>
                        )}
                        {c.status === 'picked_up' && (
                          <button onClick={() => updateClaimStatus(c._id, 'delivered')} className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-xs font-bold transition">Mark Delivered</button>
                        )}
                        {c.status === 'delivered' && (
                          <span className="text-xs text-gray-400 italic">Completed</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
