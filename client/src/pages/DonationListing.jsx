import { useState, useEffect } from 'react';
import { MapPin, Clock, Package, ChefHat, X, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../hooks/useAuth';

const CATEGORY_IMG = {
  cooked: 'https://images.unsplash.com/photo-1555244162-803834f87a4d?auto=format&fit=crop&q=80&w=800',
  raw: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
  packaged: 'https://images.unsplash.com/photo-1585399000684-d2f72d63b5e3?auto=format&fit=crop&q=80&w=800',
  beverage: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=800',
};

function CreateDonationModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    itemName: '', quantity: '', unit: 'kg', category: 'cooked',
    address: '', expiryTime: '', startTime: '', endTime: '', notes: '', imageUrl: ''
  });
  const [loading, setLoading] = useState(false);

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
          image: form.imageUrl || undefined
        }],
        pickupLocation: { address: form.address },
        availableTime: { startTime: form.startTime, endTime: form.endTime },
        notes: form.notes
      };
      const res = await api.post('/donations', payload);
      toast.success('Donation listed successfully!');
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
          <h2 className="text-xl font-bold text-gray-900">List a New Donation</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">Food Item Name *</label>
              <input required className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. Fresh Bread, Cooked Rice" value={form.itemName} onChange={e => setForm({...form, itemName: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Quantity *</label>
              <input required type="number" min="1" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="20" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Unit *</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                <option value="kg">kg</option>
                <option value="liters">liters</option>
                <option value="plates">plates</option>
                <option value="pieces">pieces</option>
                <option value="portions">portions</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Category *</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="cooked">Cooked</option>
                <option value="raw">Raw Produce</option>
                <option value="packaged">Packaged</option>
                <option value="beverage">Beverage</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Expires At</label>
              <input type="datetime-local" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" value={form.expiryTime} onChange={e => setForm({...form, expiryTime: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">Pickup Address *</label>
              <input required className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. 12 Main Street, Downtown" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Available From *</label>
              <input required type="datetime-local" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Available Until *</label>
              <input required type="datetime-local" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Image URL (Optional)</label>
              <input type="url" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="https://..." value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">Notes</label>
              <textarea rows="2" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="Any special instructions..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
            {loading ? 'Creating...' : 'List Donation'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function DonationListing() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [claiming, setClaiming] = useState(null);

  const fetchDonations = async () => {
    try {
      const res = await api.get('/donations');
      setDonations(res.data.donations);
    } catch {
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDonations(); }, []);

  const claimDonation = async (id) => {
    if (!user) return toast.error('Please log in to claim a donation');
    setClaiming(id);
    try {
      await api.patch(`/donations/${id}/claim`);
      toast.success('Donation claimed! The donor will be notified.');
      setDonations(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to claim donation');
    } finally {
      setClaiming(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] text-gray-500">Loading donations...</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {showModal && <CreateDonationModal onClose={() => setShowModal(false)} onCreated={(d) => setDonations(prev => [d, ...prev])} />}

      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Donations</h1>
          <p className="text-lg text-gray-500">{donations.length} listing{donations.length !== 1 ? 's' : ''} available right now</p>
        </div>
        {user && user.userType === 'donor' && (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-all shadow-md">
            <Plus size={18}/> Donate Food
          </button>
        )}
      </div>

      {donations.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Package size={48} className="mx-auto mb-4 opacity-40" />
          <p className="text-xl font-medium">No donations listed yet.</p>
          {user && <button onClick={() => setShowModal(true)} className="mt-4 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700">Be the first to donate!</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {donations.map((donation) => {
            const item = donation.foodItems?.[0];
            return (
              <div key={donation._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="relative h-52 overflow-hidden">
                  <img src={item?.image || CATEGORY_IMG[item?.category] || CATEGORY_IMG.cooked} alt={item?.itemName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-green-700 flex items-center gap-1.5 shadow-sm capitalize">
                    <ChefHat size={14}/> {item?.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item?.itemName || 'Food Donation'}</h3>
                  <p className="text-sm font-medium text-green-600 mb-4">by {donation.donorId?.name || 'Anonymous'}</p>
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center text-gray-600 text-sm gap-2">
                      <Package size={15} className="text-gray-400 shrink-0"/>
                      <span>{item?.quantity} {item?.unit}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm gap-2">
                      <MapPin size={15} className="text-gray-400 shrink-0"/>
                      <span className="truncate">{donation.pickupLocation?.address}</span>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(donation.pickupLocation?.address || '')}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline text-xs ml-auto"
                      >
                        View Map
                      </a>
                    </div>
                    {item?.expiryTime && (
                      <div className="flex items-center text-sm gap-2">
                        <Clock size={15} className="text-orange-400 shrink-0"/>
                        <span className="text-orange-600 font-medium">Expires: {new Date(item.expiryTime).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  
                  {(!user || user.userType !== 'donor') ? (
                    <button
                      onClick={() => claimDonation(donation._id)}
                      disabled={claiming === donation._id}
                      className="w-full bg-gray-50 hover:bg-green-600 hover:text-white text-gray-900 border border-gray-200 hover:border-green-600 font-medium py-2.5 rounded-xl transition-all duration-300 disabled:opacity-60"
                    >
                      {claiming === donation._id ? 'Claiming...' : 'Claim Donation'}
                    </button>
                  ) : (
                    <div className="w-full text-center py-2.5 bg-gray-100 text-gray-500 rounded-xl text-sm font-medium border border-gray-200">
                      Donors cannot claim
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
