import React from 'react';
import { useAuth } from '../hooks/useAuth';

export default function NGODashboard() {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6">NGO Dashboard</h1>
      <p className="text-gray-600">Welcome, {user?.name || 'NGO'}! Manage your requests and claims here.</p>
    </div>
  );
}
