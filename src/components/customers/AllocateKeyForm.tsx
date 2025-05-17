import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';

interface AllocateKeyFormProps {
  customerId: string;
  onClose: () => void;
}

const AllocateKeyForm: React.FC<AllocateKeyFormProps> = ({ customerId, onClose }) => {
  const { productKeys, categories, customers, allocateKey } = useAppContext();
  
  const [productKeyId, setProductKeyId] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  
  const customer = useMemo(() => {
    return customers.find(c => c.id === customerId);
  }, [customers, customerId]);
  
  const availableKeys = useMemo(() => {
    return productKeys.filter(key => key.status === 'available');
  }, [productKeys]);
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productKeyId) {
      setError('Please select a product key');
      return;
    }
    
    allocateKey({
      productKeyId,
      customerId,
      notes: notes.trim() || undefined,
    });
    
    onClose();
  };
  
  if (!customer) {
    return <p>Customer not found</p>;
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Allocating product key to: <span className="font-semibold">{customer.name}</span>
          </p>
        </div>
        
        <div>
          <label htmlFor="productKeyId" className="block text-sm font-medium text-gray-700">
            Product Key
          </label>
          {availableKeys.length === 0 ? (
            <p className="mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
              No available product keys. Please create a new key or deallocate an existing one.
            </p>
          ) : (
            <>
              <select
                id="productKeyId"
                name="productKeyId"
                className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  error ? 'border-red-300' : ''
                }`}
                value={productKeyId}
                onChange={(e) => {
                  setProductKeyId(e.target.value);
                  setError('');
                }}
              >
                <option value="">Select a product key</option>
                {availableKeys.map(key => (
                  <option key={key.id} value={key.id}>
                    {key.key} ({getCategoryName(key.categoryId)})
                  </option>
                ))}
              </select>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </>
          )}
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this allocation..."
          />
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onClose}
          type="button"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={availableKeys.length === 0 || !productKeyId}
        >
          Allocate Key
        </Button>
      </div>
    </form>
  );
};

export default AllocateKeyForm;