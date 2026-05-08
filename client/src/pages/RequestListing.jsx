import { useState, useEffect } from 'react';
import { MapPin, Users, Calendar, X, Plus, Trash2 } from 'lucide-react';
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
      toast.success('Request posted successfully!');
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
          <h2 className="text-xl font-bold text-gray-900">Post a Food Request</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Request Title *</label>
            <input required className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Meals for Homeless Shelter" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
            <textarea rows="2" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="What kind of food do you need?" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">People to Feed *</label>
              <input required type="number" min="1" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="100" value={form.peopleToFeed} onChange={e => setForm({...form, peopleToFeed: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Urgency *</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.urgency} onChange={e => setForm({...form, urgency: e.target.value})}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Location *</label>
            <input required className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Eastside Community Center" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Date Needed *</label>
            <input required className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Tomorrow, 6:00 PM or Flexible" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
            {loading ? 'Posting...' : 'Post Request'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function RequestListing() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [fulfilling, setFulfilling] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests');
      setRequests(res.data.requests);
    } catch {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const fulfillRequest = async (id) => {
    if (!user) return toast.error('Please log in to fulfill a request');
    setFulfilling(id);
    try {
      await api.patch(`/requests/${id}/fulfill`);
      toast.success('You have volunteered to fulfill this request!');
      setRequests(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fulfill request');
    } finally {
      setFulfilling(null);
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
      toast.error(err.response?.data?.message || 'Failed to delete request');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] text-gray-500">Loading requests...</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {showModal && <CreateRequestModal onClose={() => setShowModal(false)} onCreated={(r) => setRequests(prev => [r, ...prev])} />}

      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Food Requests</h1>
          <p className="text-lg text-gray-500">{requests.length} open request{requests.length !== 1 ? 's' : ''} from NGOs</p>
        </div>
        {user && user.userType === 'ngo' && (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md">
            <Plus size={18}/> Post Request
          </button>
        )}
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Users size={48} className="mx-auto mb-4 opacity-40"/>
          <p className="text-xl font-medium">No open requests right now.</p>
          {user && <button onClick={() => setShowModal(true)} className="mt-4 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700">Post the first request</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {requests.map((req) => (
            <div key={req._id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{req.title}</h3>
                  <p className="text-sm font-medium text-blue-600">{req.ngoId?.name || 'NGO'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${req.urgency === 'High' ? 'bg-red-100 text-red-700' : req.urgency === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                    {req.urgency} Urgency
                  </span>
                  {user && req.ngoId?._id === user?._id && (
                    <button onClick={() => deleteRequest(req._id)} disabled={deleting === req._id} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16}/>
                    </button>
                  )}
                </div>
              </div>
              {req.description && <p className="text-gray-600 text-sm mb-4 leading-relaxed italic">"{req.description}"</p>}
              <div className="grid grid-cols-2 gap-y-2 mb-5">
                <div className="flex items-center text-sm text-gray-600 gap-2">
                  <Users size={15} className="text-gray-400"/>
                  <span>Feeds <strong>{req.peopleToFeed}</strong> people</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 gap-2">
                  <MapPin size={15} className="text-gray-400"/>
                  <span className="truncate">{req.location}</span>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(req.location || '')}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 underline text-xs ml-auto"
                  >
                    View Map
                  </a>
                </div>
                <div className="flex items-center text-sm text-gray-600 gap-2">
                  <Calendar size={15} className="text-gray-400"/>
                  <span>{req.date}</span>
                </div>
              </div>
              
              {user && req.ngoId?._id !== user?._id && (
                <button
                  onClick={() => fulfillRequest(req._id)}
                  disabled={fulfilling === req._id}
                  className="w-full bg-blue-50 text-blue-700 font-semibold py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-colors duration-300 border border-blue-100 hover:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {fulfilling === req._id ? 'Processing...' : 'Fulfill This Request'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
