import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Package, AlertCircle, Plus, Minus, History } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { format } from 'date-fns';

const InventoryList: React.FC = () => {
  const { inventory, categories, addUsage, recordPurchase } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const filteredItems = useMemo(() => {
    if (!inventory) return [];
    
    return inventory.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || item.categoryId === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [inventory, searchTerm, categoryFilter]);

  const handleUsage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    addUsage({
      inventoryItemId: selectedItem,
      quantity,
      usageDate: new Date().toISOString(),
      notes: notes || undefined,
    });

    setShowUsageModal(false);
    setSelectedItem(null);
    setQuantity(1);
    setNotes('');
  };

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const item = inventory?.find(i => i.id === selectedItem);
    if (!item) return;

    recordPurchase({
      inventoryItemId: selectedItem,
      quantity,
      unitPrice: item.price,
      supplier: 'Default Supplier', // This could be enhanced with a supplier selection
      purchaseDate: new Date().toISOString(),
      notes: notes || undefined,
    });

    setShowPurchaseModal(false);
    setSelectedItem(null);
    setQuantity(1);
    setNotes('');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
        <Button onClick={() => setShowPurchaseModal(true)}>
          Record Purchase
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by name or SKU..."
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
            {categories?.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  ${item.price.toFixed(2)}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Stock Level:</span>
                  <span className={`font-medium ${
                    item.stockLevel <= item.reorderPoint ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {item.stockLevel}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600">Reorder Point:</span>
                  <span className="font-medium text-gray-700">{item.reorderPoint}</span>
                </div>
              </div>

              {item.stockLevel <= item.reorderPoint && (
                <div className="mt-3 flex items-center text-red-600 bg-red-50 p-2 rounded">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Low stock alert!</span>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedItem(item.id);
                    setShowUsageModal(true);
                  }}
                >
                  <Minus className="h-4 w-4 mr-1" />
                  Record Usage
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedItem(item.id);
                    setShowPurchaseModal(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Stock
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Usage Modal */}
      <Modal
        isOpen={showUsageModal}
        onClose={() => setShowUsageModal(false)}
        title="Record Usage"
      >
        <form onSubmit={handleUsage}>
          <div className="space-y-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity Used
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowUsageModal(false)} type="button">
              Cancel
            </Button>
            <Button type="submit">Record Usage</Button>
          </div>
        </form>
      </Modal>

      {/* Purchase Modal */}
      <Modal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        title="Record Purchase"
      >
        <form onSubmit={handlePurchase}>
          <div className="space-y-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity Purchased
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowPurchaseModal(false)} type="button">
              Cancel
            </Button>
            <Button type="submit">Record Purchase</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InventoryList;