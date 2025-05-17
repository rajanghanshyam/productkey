import React from 'react';
import { useAppContext } from '../context/AppContext';
import { KeyRound, Users, Tag, AlertCircle } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import StatusChart from '../components/dashboard/StatusChart';
import KeysByCategory from '../components/dashboard/KeysByCategory';
import RecentAllocations from '../components/dashboard/RecentAllocations';
import RenewalCalendar from '../components/dashboard/RenewalCalendar';

const Dashboard: React.FC = () => {
  const { productKeys, categories, customers, allocations } = useAppContext();
  
  const availableKeysCount = productKeys.filter(key => key.status === 'available').length;
  const expiredKeysCount = productKeys.filter(key => key.status === 'expired').length;
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Product Keys" 
          value={productKeys.length} 
          icon={<KeyRound className="h-6 w-6 text-white" />}
          color="bg-blue-600 text-white"
        />
        <StatCard 
          title="Available Keys" 
          value={availableKeysCount} 
          icon={<KeyRound className="h-6 w-6 text-white" />}
          color="bg-green-600 text-white"
        />
        <StatCard 
          title="Total Customers" 
          value={customers.length} 
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-purple-600 text-white"
        />
        <StatCard 
          title="Total Categories" 
          value={categories.length} 
          icon={<Tag className="h-6 w-6 text-white" />}
          color="bg-amber-600 text-white"
        />
      </div>
      
      {/* Expiring Keys Alert */}
      {expiredKeysCount > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                <span className="font-bold">{expiredKeysCount} product key{expiredKeysCount > 1 ? 's' : ''}</span> {expiredKeysCount > 1 ? 'have' : 'has'} expired
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Charts and Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <StatusChart />
        <KeysByCategory />
      </div>
      
      {/* Renewal Calendar */}
      <div className="mb-6">
        <RenewalCalendar />
      </div>
      
      {/* Recent Allocations */}
      <div className="mb-6">
        <RecentAllocations />
      </div>
    </div>
  );
};

export default Dashboard;