import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';

interface CustomerFormProps {
  customerId?: string;
  onClose: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customerId, onClose }) => {
  const { customers, addCustomer, updateCustomer } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  useEffect(() => {
    if (customerId) {
      const customerToEdit = customers.find(c => c.id === customerId);
      if (customerToEdit) {
        setFormData({
          name: customerToEdit.name,
          email: customerToEdit.email,
          phone: customerToEdit.phone || '',
          company: customerToEdit.company || '',
        });
      }
    }
  }, [customerId, customers]);
  
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      email: '',
      phone: '',
    };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    } else if (
      !customerId && 
      customers.some(c => c.email.toLowerCase() === formData.email.toLowerCase())
    ) {
      newErrors.email = 'Email already exists';
      valid = false;
    }
    
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format (e.g., +1234567890)';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (customerId) {
      const customerToUpdate = customers.find(c => c.id === customerId);
      if (customerToUpdate) {
        updateCustomer({
          ...customerToUpdate,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          company: formData.company || undefined,
        });
      }
    } else {
      addCustomer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
      });
    }
    
    onClose();
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${
              errors.name ? 'border-red-300' : ''
            }`}
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${
              errors.email ? 'border-red-300' : ''
            }`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            WhatsApp Number (with country code)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="+1234567890"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${
              errors.phone ? 'border-red-300' : ''
            }`}
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>
        
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
            value={formData.company}
            onChange={handleChange}
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
        <Button type="submit">
          {customerId ? 'Update' : 'Add'} Customer
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;