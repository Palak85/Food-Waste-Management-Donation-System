import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, MapPin, Shield, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!user) return <div className="text-center py-20 text-gray-500">Loading Profile...</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Profile</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-green-600 p-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-green-500">
            <User size={48} className="text-green-600" />
          </div>
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-1">{user.name}</h2>
            <p className="text-green-100 uppercase tracking-widest text-sm font-semibold flex items-center gap-2 justify-center sm:justify-start">
              <Shield size={14} /> {user.userType} Account
            </p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Email Address</p>
              <p className="text-lg text-gray-900 font-semibold">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Account Status</p>
              <p className="text-lg text-green-600 font-semibold flex items-center gap-2">
                Active
              </p>
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              onClick={() => toast('Edit profile feature coming soon!', { icon: '✏️' })}
              className="w-full sm:w-auto bg-gray-100 text-gray-800 font-semibold py-3 px-8 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
