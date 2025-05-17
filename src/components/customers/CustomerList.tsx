import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Pencil, Trash2, User, Mail, Phone, Building2, Key, Calendar } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import CustomerForm from './CustomerForm';
import AllocateKeyForm from './AllocateKeyForm';
import { format } from 'date-fns';

const CustomerList: React.FC = () => {
  const { customers, deleteCustomer, allocations, productKeys } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<string | null>(null);
  const [allocatingToCustomer, setAllocatingToCustomer] = useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = searchTerm === '' || 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesSearch;
    });
  }, [customers, searchTerm]);

  const getCustomerAllocations = (customerId: string) => {
    return allocations
      .filter(a => a.customerId === customerId)
      .map(allocation => {
        const key = productKeys.find(k => k.id === allocation.productKeyId);
        return {
          ...allocation,
          key: key?.key || 'Unknown Key',
          allocatedDate: format(new Date(allocation.allocatedAt), 'MMM dd, yyyy')
        };
      });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
        <Button onClick={() => setShowAddModal(true)}>
          Add New Customer
        </Button>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search Customers
        </label>
        <input
          type="text"
          id="search"
          placeholder="Search by name, email, or company..."
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Allocated Keys
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => {
                  const customerAllocations = getCustomerAllocations(customer.id);
                  
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="bg-blue-100 rounded-full p-2 mr-3">
                            <User className="h-5 w-5 text-blue-700" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{customer.name}</div>
                            {customer.company && (
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <Building2 className="h-4 w-4 mr-1" />
                                {customer.company}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center text-gray-500">
                            <Mail className="h-4 w-4 mr-1" />
                            {customer.email}
                          </div>
                          {customer.phone && (
                            <div className="flex items-center text-gray-500 mt-1">
                              <Phone className="h-4 w-4 mr-1" />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        {customerAllocations.length > 0 ? (
                          <div className="space-y-2">
                            {customerAllocations.map(allocation => (
                              <div key={allocation.id} className="flex items-center text-sm">
                                <Key className="h-4 w-4 text-blue-600 mr-1" />
                                <span className="font-mono text-gray-700 mr-2">{allocation.key}</span>
                                <span className="text-xs text-gray-500">
                                  ({allocation.allocatedDate})
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No keys allocated</span>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <Button 
                            size="sm"
                            variant="outline" 
                            onClick={() => setAllocatingToCustomer(customer.id)}
                          >
                            Allocate Key
                          </Button>
                          
                          <button
                            onClick={() => setEditingCustomer(customer.id)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this customer?')) {
                                deleteCustomer(customer.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Customer"
      >
        <CustomerForm
          onClose={() => setShowAddModal(false)}
        />
      </Modal>
      
      {/* Edit Modal */}
      <Modal
        isOpen={editingCustomer !== null}
        onClose={() => setEditingCustomer(null)}
        title="Edit Customer"
      >
        {editingCustomer && (
          <CustomerForm
            customerId={editingCustomer}
            onClose={() => setEditingCustomer(null)}
          />
        )}
      </Modal>
      
      {/* Allocate Key Modal */}
      <Modal
        isOpen={allocatingToCustomer !== null}
        onClose={() => setAllocatingToCustomer(null)}
        title="Allocate Product Key"
      >
        {allocatingToCustomer && (
          <AllocateKeyForm
            customerId={allocatingToCustomer}
            onClose={() => setAllocatingToCustomer(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default CustomerList;