import React from 'react';
import { useAppContext } from '../../context/AppContext';

const RecentAllocations: React.FC = () => {
  const { allocations, customers, productKeys } = useAppContext();
  
  // Sort allocations by date (most recent first) and take only the latest 5
  const recentAllocations = [...allocations]
    .sort((a, b) => new Date(b.allocatedAt).getTime() - new Date(a.allocatedAt).getTime())
    .slice(0, 5);
  
  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };
  
  const getProductKey = (productKeyId: string) => {
    const key = productKeys.find(k => k.id === productKeyId);
    return key ? key.key : 'Unknown Key';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  if (recentAllocations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Allocations</h3>
        <p className="text-gray-500 text-center py-4">No allocations yet</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Allocations</h3>
      
      <div className="space-y-4">
        {recentAllocations.map(allocation => (
          <div key={allocation.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
            <div>
              <p className="font-medium">{getCustomerName(allocation.customerId)}</p>
              <p className="text-sm text-gray-600 truncate">{getProductKey(allocation.productKeyId)}</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">{formatDate(allocation.allocatedAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAllocations;