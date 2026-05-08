import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DonationListing from './pages/DonationListing';
import RequestListing from './pages/RequestListing';
import DonorDashboard from './pages/DonorDashboard';
import NGODashboard from './pages/NGODashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
          <Toaster position="top-right" />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/donations" element={<DonationListing />} />
              <Route path="/requests" element={<RequestListing />} />
              
              <Route 
                path="/donor-dashboard" 
                element={<ProtectedRoute roles={['donor']}><DonorDashboard /></ProtectedRoute>} 
              />
              <Route 
                path="/ngo-dashboard" 
                element={<ProtectedRoute roles={['ngo']}><NGODashboard /></ProtectedRoute>} 
              />
              <Route 
                path="/admin-dashboard" 
                element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} 
              />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
