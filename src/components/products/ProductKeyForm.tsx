import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';

interface ProductKeyFormProps {
  keyId?: string;
  onClose: () => void;
}

const ProductKeyForm: React.FC<ProductKeyFormProps> = ({ keyId, onClose }) => {
  const { categories, productKeys, addProductKey, updateProductKey } = useAppContext();
  
  const [formData, setFormData] = useState({
    key: '',
    categoryId: categories[0]?.id || '',
    status: 'available',
    expiresAt: '',
  });
  
  const [errors, setErrors] = useState({
    key: '',
    categoryId: '',
    expiresAt: '',
  });
  
  useEffect(() => {
    if (keyId) {
      const keyToEdit = productKeys.find(k => k.id === keyId);
      if (keyToEdit) {
        setFormData({
          key: keyToEdit.key,
          categoryId: keyToEdit.categoryId,
          status: keyToEdit.status,
          expiresAt: keyToEdit.expiresAt ? new Date(keyToEdit.expiresAt).toISOString().split('T')[0] : '',
        });
      }
    }
  }, [keyId, productKeys]);
  
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      key: '',
      categoryId: '',
      expiresAt: '',
    };
    
    if (!formData.key.trim()) {
      newErrors.key = 'Product key is required';
      valid = false;
    } else if (
      !keyId && 
      productKeys.some(k => k.key.toLowerCase() === formData.key.toLowerCase())
    ) {
      newErrors.key = 'Product key already exists';
      valid = false;
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (keyId) {
      const keyToUpdate = productKeys.find(k => k.id === keyId);
      if (keyToUpdate) {
        updateProductKey({
          ...keyToUpdate,
          key: formData.key,
          categoryId: formData.categoryId,
          status: formData.status as 'available' | 'allocated' | 'expired',
          expiresAt: formData.expiresAt || undefined,
        });
      }
    } else {
      addProductKey({
        key: formData.key,
        categoryId: formData.categoryId,
        status: formData.status as 'available' | 'allocated' | 'expired',
        expiresAt: formData.expiresAt || undefined,
      });
    }
    
    onClose();
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  const generateRandomKey = () => {
    const segments = 4;
    const segmentLength = 5;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    let key = '';
    
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segmentLength; j++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      if (i < segments - 1) {
        key += '-';
      }
    }
    
    setFormData(prev => ({
      ...prev,
      key,
    }));
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="key" className="block text-sm font-medium text-gray-700">
            Product Key
          </label>
          <div className="mt-1 flex">
            <input
              type="text"
              id="key"
              name="key"
              className={`flex-grow rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 ${
                errors.key ? 'border-red-300' : ''
              }`}
              value={formData.key}
              onChange={handleChange}
            />
            <button
              type="button"
              className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={generateRandomKey}
            >
              Generate
            </button>
          </div>
          {errors.key && <p className="mt-1 text-sm text-red-600">{errors.key}</p>}
        </div>
        
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.categoryId ? 'border-red-300' : ''
            }`}
            value={formData.categoryId}
            onChange={handleChange}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="available">Available</option>
            <option value="allocated">Allocated</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700">
            Expiration Date
          </label>
          <input
            type="date"
            id="expiresAt"
            name="expiresAt"
            className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.expiresAt ? 'border-red-300' : ''
            }`}
            value={formData.expiresAt}
            onChange={handleChange}
          />
          {errors.expiresAt && <p className="mt-1 text-sm text-red-600">{errors.expiresAt}</p>}
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
        <Button type="submit">
          {keyId ? 'Update' : 'Add'} Key
        </Button>
      </div>
    </form>
  );
};

export default ProductKeyForm;