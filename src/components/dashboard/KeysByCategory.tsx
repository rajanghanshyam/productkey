import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';

const KeysByCategory: React.FC = () => {
  const { productKeys, categories } = useAppContext();
  
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // Initialize counts for all categories
    categories.forEach(category => {
      counts[category.id] = 0;
    });
    
    // Count keys in each category
    productKeys.forEach(key => {
      if (counts[key.categoryId] !== undefined) {
        counts[key.categoryId]++;
      } else {
        counts['uncategorized'] = (counts['uncategorized'] || 0) + 1;
      }
    });
    
    return counts;
  }, [productKeys, categories]);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Keys by Category</h3>
      
      <div className="space-y-3">
        {categories.map(category => (
          <div key={category.id}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">{category.name}</span>
              <span className="text-sm font-medium">{categoryCounts[category.id] || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full" 
                style={{ 
                  width: `${(categoryCounts[category.id] / Math.max(1, productKeys.length)) * 100}%`,
                  backgroundColor: category.color
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeysByCategory;