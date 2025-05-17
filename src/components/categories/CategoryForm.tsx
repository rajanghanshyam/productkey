import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';

interface CategoryFormProps {
  categoryId?: string;
  onClose: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ categoryId, onClose }) => {
  const { categories, addCategory, updateCategory } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#1E40AF', // Default color
  });
  
  const [errors, setErrors] = useState({
    name: '',
    color: '',
  });
  
  const colorOptions = [
    { value: '#1E40AF', label: 'Navy Blue' },
    { value: '#0D9488', label: 'Teal' },
    { value: '#7C3AED', label: 'Purple' },
    { value: '#D97706', label: 'Amber' },
    { value: '#DC2626', label: 'Red' },
    { value: '#059669', label: 'Green' },
    { value: '#7F1D1D', label: 'Brown' },
    { value: '#374151', label: 'Slate' },
  ];
  
  useEffect(() => {
    if (categoryId) {
      const categoryToEdit = categories.find(c => c.id === categoryId);
      if (categoryToEdit) {
        setFormData({
          name: categoryToEdit.name,
          description: categoryToEdit.description || '',
          color: categoryToEdit.color,
        });
      }
    }
  }, [categoryId, categories]);
  
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      color: '',
    };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
      valid = false;
    } else if (
      !categoryId && 
      categories.some(c => c.name.toLowerCase() === formData.name.toLowerCase())
    ) {
      newErrors.name = 'Category name already exists';
      valid = false;
    }
    
    if (!formData.color) {
      newErrors.color = 'Color is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (categoryId) {
      const categoryToUpdate = categories.find(c => c.id === categoryId);
      if (categoryToUpdate) {
        updateCategory({
          ...categoryToUpdate,
          name: formData.name,
          description: formData.description || undefined,
          color: formData.color,
        });
      }
    } else {
      addCategory({
        name: formData.name,
        description: formData.description || undefined,
        color: formData.color,
      });
    }
    
    onClose();
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
            Category Name
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
            disabled={categoryId === 'uncategorized'}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <select
            id="color"
            name="color"
            className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.color ? 'border-red-300' : ''
            }`}
            value={formData.color}
            onChange={handleChange}
          >
            {colorOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.color && <p className="mt-1 text-sm text-red-600">{errors.color}</p>}
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-2">Preview:</p>
          <div className="flex items-center">
            <div 
              className="w-6 h-6 rounded-full mr-2"
              style={{ backgroundColor: formData.color }}
            ></div>
            <span 
              className="text-sm font-medium" 
              style={{ color: formData.color }}
            >
              {formData.name || 'Category Name'}
            </span>
          </div>
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
          {categoryId ? 'Update' : 'Add'} Category
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;