import React from 'react';
import { KeyRound, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const Header: React.FC = () => {
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <KeyRound className="h-8 w-8 text-amber-400" />
          <h1 className="text-2xl font-bold">Dev Infotech KeyManager Pro</h1>
        </div>
        
        <nav className="flex items-center">
          <ul className="flex space-x-6 mr-8">
            <li>
              <Link 
                to="/" 
                className="hover:text-amber-200 transition-colors duration-200"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/keys" 
                className="hover:text-amber-200 transition-colors duration-200"
              >
                Product Keys
              </Link>
            </li>
            <li>
              <Link 
                to="/categories" 
                className="hover:text-amber-200 transition-colors duration-200"
              >
                Categories
              </Link>
            </li>
            <li>
              <Link 
                to="/customers" 
                className="hover:text-amber-200 transition-colors duration-200"
              >
                Customers
              </Link>
            </li>
            <li>
              <Link 
                to="/inventory" 
                className="hover:text-amber-200 transition-colors duration-200"
              >
                Inventory
              </Link>
            </li>
          </ul>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-amber-200 hover:text-amber-100 transition-colors duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;