import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu, X, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-green-600">
            FoodShare
          </Link>

          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/donations" className="text-gray-700 hover:text-green-600 font-medium">Donations</Link>
            <Link to="/requests" className="text-gray-700 hover:text-green-600 font-medium">Requests</Link>
            
            {user ? (
              <>
                <span className="text-gray-700 font-medium">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium transition"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-green-600 font-medium">Login</Link>
                <Link to="/register" className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700 transition shadow-md">Register</Link>
              </>
            )}
          </div>

          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-3 px-2 border-t mt-2">
            <Link to="/donations" className="block text-gray-700 hover:text-green-600 font-medium px-2 py-1">Donations</Link>
            <Link to="/requests" className="block text-gray-700 hover:text-green-600 font-medium px-2 py-1">Requests</Link>
            {user ? (
              <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left text-red-600 font-medium px-2 py-1">
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link to="/login" className="block text-center text-gray-700 font-medium py-2 border rounded-lg">Login</Link>
                <Link to="/register" className="block text-center bg-green-600 text-white font-medium py-2 rounded-lg shadow-sm">Register</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
