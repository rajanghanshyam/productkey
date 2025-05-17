import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';

const StatusChart: React.FC = () => {
  const { productKeys } = useAppContext();
  
  const statusCounts = useMemo(() => {
    const counts = {
      available: 0,
      allocated: 0,
      expired: 0,
    };
    
    productKeys.forEach(key => {
      counts[key.status]++;
    });
    
    return counts;
  }, [productKeys]);
  
  const total = productKeys.length;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Status Distribution</h3>
      
      <div className="flex w-full h-8 rounded-full overflow-hidden mb-4">
        {total > 0 ? (
          <>
            <div 
              className="bg-green-500" 
              style={{ width: `${(statusCounts.available / total) * 100}%` }}
              title={`Available: ${statusCounts.available}`}
            ></div>
            <div 
              className="bg-blue-500" 
              style={{ width: `${(statusCounts.allocated / total) * 100}%` }}
              title={`Allocated: ${statusCounts.allocated}`}
            ></div>
            <div 
              className="bg-red-500" 
              style={{ width: `${(statusCounts.expired / total) * 100}%` }}
              title={`Expired: ${statusCounts.expired}`}
            ></div>
          </>
        ) : (
          <div className="bg-gray-200 w-full"></div>
        )}
      </div>
      
      <div className="flex justify-between text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span>Available: {statusCounts.available}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span>Allocated: {statusCounts.allocated}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span>Expired: {statusCounts.expired}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusChart;