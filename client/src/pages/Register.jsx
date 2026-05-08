import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [formData, setFormData] = useState({ 
    name: '', email: '', phone: '', password: '', userType: 'donor', organizationName: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        formData
      );

      if (response.data.success) {
        login(response.data.user, response.data.token);
        navigate(
          response.data.user.userType === 'donor' 
            ? '/donor-dashboard' 
            : '/ngo-dashboard'
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Register</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select name="userType" value={formData.userType} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
              <option value="donor">Donor (Restaurant/Individual)</option>
              <option value="ngo">NGO (Receiver)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Organization Name (Optional)</label>
            <input type="text" name="organizationName" value={formData.organizationName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 mt-4">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account? 
          <a href="/login" className="text-green-600 hover:underline ml-1">Login</a>
        </p>
      </div>
    </div>
  );
}
