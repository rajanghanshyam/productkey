import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Pencil, Trash2, Key, Copy } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import ProductKeyForm from './ProductKeyForm';

const ProductKeyList: React.FC = () => {
  const { productKeys, categories, deleteProductKey } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredKeys = useMemo(() => {
    return productKeys.filter(key => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        key.key.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = categoryFilter === 'all' || key.categoryId === categoryFilter;
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || key.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [productKeys, searchTerm, categoryFilter, statusFilter]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const handleCopyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'allocated':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product Keys</h2>
        <Button
          onClick={() => setShowAddModal(true)}
        >
          Add New Key
        </Button>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search keys..."
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="allocated">Allocated</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>
      
      {/* Keys Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredKeys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No product keys found
                  </td>
                </tr>
              ) : (
                filteredKeys.map((key) => (
                  <tr key={key.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Key className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-mono">{key.key}</span>
                        <button 
                          onClick={() => handleCopyKey(key.id, key.key)}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                          title="Copy to clipboard"
                        >
                          {copiedId === key.id ? (
                            <span className="text-green-500 text-xs">Copied!</span>
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getCategoryName(key.categoryId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(key.status)}`}>
                        {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(key.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(key.expiresAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setEditingKey(key.id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this key?')) {
                            deleteProductKey(key.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product Key"
      >
        <ProductKeyForm
          onClose={() => setShowAddModal(false)}
        />
      </Modal>
      
      {/* Edit Modal */}
      <Modal
        isOpen={editingKey !== null}
        onClose={() => setEditingKey(null)}
        title="Edit Product Key"
      >
        {editingKey && (
          <ProductKeyForm
            keyId={editingKey}
            onClose={() => setEditingKey(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default ProductKeyList;