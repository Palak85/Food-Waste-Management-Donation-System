import { useState, useEffect } from 'react';
import { Package, Utensils, TrendingUp, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../hooks/useAuth';

function CreateDonationModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    itemName: '', quantity: '', unit: 'kg', category: 'cooked',
    address: '', expiryTime: '', startTime: '', endTime: '', notes: '', imageBase64: ''
  });
  const [loading, setLoading] = useState(false);

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const currentDateTime = now.toISOString().slice(0, 16);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error("Image must be less than 5MB");
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, imageBase64: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        foodItems: [{ 
          itemName: form.itemName, 
          quantity: Number(form.quantity), 
          unit: form.unit, 
          category: form.category, 
          expiryTime: form.expiryTime || undefined,
          image: form.imageBase64 || undefined
        }],
        pickupLocation: { address: form.address },
        availableTime: { startTime: form.startTime, endTime: form.endTime },
        notes: form.notes
      };
      const res = await api.post('/donations', payload);
      toast.success('Donation listed!');
      onCreated(res.data.donation);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">List a New Donation</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">Food Item Name *</label>
              <input required className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. Fresh Bread" value={form.itemName} onChange={e => setForm({...form, itemName: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Quantity *</label>
              <input required type="number" min="1" className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Unit *</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm outline-none" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                <option value="kg">kg</option><option value="liters">liters</option><option value="plates">plates</option><option value="pieces">pieces</option><option value="portions">portions</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Category *</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm outline-none" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="cooked">Cooked</option><option value="raw">Raw Produce</option><option value="packaged">Packaged</option><option value="beverage">Beverage</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Expires At</label>
              <input type="datetime-local" min={currentDateTime} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" value={form.expiryTime} onChange={e => setForm({...form, expiryTime: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">Pickup Address *</label>
              <input required className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" placeholder="Street, Area, City" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Available From *</label>
              <input required type="datetime-local" min={currentDateTime} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Available Until *</label>
              <input required type="datetime-local" min={form.startTime || currentDateTime} className="w-full border rounded-lg px-3 py-2 text-sm outline-none" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Upload Image (Optional)</label>
              <input type="file" accept="image/*" className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" onChange={handleImageChange} />
              {form.imageBase64 && <p className="text-xs text-green-600 mt-1">Image selected successfully!</p>}
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50">
            {loading ? 'Listing...' : 'List Donation'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function DonorDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchMyDonations = async () => {
    try {
      const res = await api.get('/donations/my/donations');
      setDonations(res.data.donations);
    } catch {
      toast.error('Could not load your donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyDonations(); }, []);

  const deleteDonation = async (id) => {
    if (!window.confirm('Remove this donation?')) return;
    setDeleting(id);
    try {
      await api.delete(`/donations/${id}`);
      toast.success('Donation removed');
      setDonations(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error removing donation');
    } finally {
      setDeleting(null);
    }
  };

  const totalPeopleFed = donations.filter(d => d.status === 'claimed').length * 30;

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] text-gray-500">Loading dashboard...</div>;

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      {showModal && <CreateDonationModal onClose={() => setShowModal(false)} onCreated={(d) => setDonations(prev => [d, ...prev])} />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, {user?.name || 'Donor'}!</h1>
          <p className="text-gray-500">Your impact overview and donation history.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 shadow-md transition-all">
          <Plus size={18}/> New Donation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-xl"><Package size={24}/></div>
          <div><p className="text-sm text-gray-500">Total Donations</p><p className="text-3xl font-bold">{donations.length}</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><Utensils size={24}/></div>
          <div><p className="text-sm text-gray-500">Est. People Fed</p><p className="text-3xl font-bold">{totalPeopleFed}</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-xl"><TrendingUp size={24}/></div>
          <div><p className="text-sm text-gray-500">Claimed Donations</p><p className="text-3xl font-bold">{donations.filter(d => d.status === 'claimed').length}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Your Donations</h2>
        </div>
        {donations.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Package size={40} className="mx-auto mb-3 opacity-40"/>
            <p className="font-medium">No donations yet. Start by listing food!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-500 text-sm">
                  <th className="px-6 py-4">Food Item</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Claimed By</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {donations.map(d => {
                  const item = d.foodItems?.[0];
                  return (
                    <tr key={d._id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium">{item?.itemName}</td>
                      <td className="px-6 py-4 text-gray-600">{item?.quantity} {item?.unit}</td>
                      <td className="px-6 py-4 text-gray-600 max-w-[150px] truncate">
                        {d.pickupLocation?.address}
                        <br/>
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.pickupLocation?.address || '')}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 underline text-xs"
                        >
                          Map
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md capitalize ${d.status === 'available' ? 'bg-orange-100 text-orange-700' : d.status === 'claimed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{d.claimedBy?.name || '—'}</td>
                      <td className="px-6 py-4 text-right">
                        {d.status === 'available' && (
                          <button onClick={() => deleteDonation(d._id)} disabled={deleting === d._id} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16}/>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
