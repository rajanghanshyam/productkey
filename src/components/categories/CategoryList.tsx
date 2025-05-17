import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Pencil, Trash2, Tag } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import CategoryForm from './CategoryForm';

const CategoryList: React.FC = () => {
  const { categories, deleteCategory, productKeys } = useAppContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const getKeyCount = (categoryId: string) => {
    return productKeys.filter(key => key.categoryId === categoryId).length;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
        <Button
          onClick={() => setShowAddModal(true)}
        >
          Add New Category
        </Button>
      </div>
      
      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <div 
            key={category.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transform transition-transform hover:scale-105"
          >
            <div 
              className="h-2"
              style={{ backgroundColor: category.color }}
            ></div>
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Tag className="h-5 w-5 mr-2" style={{ color: category.color }} />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {category.name}
                  </h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingCategory(category.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this category?')) {
                        deleteCategory(category.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                    disabled={category.id === 'uncategorized'}
                  >
                    <Trash2 className={`h-5 w-5 ${category.id === 'uncategorized' ? 'opacity-30 cursor-not-allowed' : ''}`} />
                  </button>
                </div>
              </div>
              
              {category.description && (
                <p className="mt-2 text-sm text-gray-600">
                  {category.description}
                </p>
              )}
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {getKeyCount(category.id)} keys
                </span>
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: `${category.color}20`,
                    color: category.color
                  }}
                >
                  {category.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Category"
      >
        <CategoryForm
          onClose={() => setShowAddModal(false)}
        />
      </Modal>
      
      {/* Edit Modal */}
      <Modal
        isOpen={editingCategory !== null}
        onClose={() => setEditingCategory(null)}
        title="Edit Category"
      >
        {editingCategory && (
          <CategoryForm
            categoryId={editingCategory}
            onClose={() => setEditingCategory(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default CategoryList;