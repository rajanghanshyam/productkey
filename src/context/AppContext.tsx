import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductKey, Category, Customer, Allocation } from '../types';
import { generateDemoData } from '../utils/demoData';

interface AppContextType {
  productKeys: ProductKey[];
  categories: Category[];
  customers: Customer[];
  allocations: Allocation[];
  addProductKey: (key: Omit<ProductKey, 'id' | 'createdAt'>) => void;
  updateProductKey: (key: ProductKey) => void;
  deleteProductKey: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  allocateKey: (allocation: Omit<Allocation, 'id' | 'allocatedAt'>) => void;
  deallocateKey: (productKeyId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productKeys, setProductKeys] = useState<ProductKey[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize with demo data or load from localStorage
  useEffect(() => {
    const storedProductKeys = localStorage.getItem('productKeys');
    const storedCategories = localStorage.getItem('categories');
    const storedCustomers = localStorage.getItem('customers');
    const storedAllocations = localStorage.getItem('allocations');

    if (storedProductKeys && storedCategories && storedCustomers && storedAllocations) {
      setProductKeys(JSON.parse(storedProductKeys));
      setCategories(JSON.parse(storedCategories));
      setCustomers(JSON.parse(storedCustomers));
      setAllocations(JSON.parse(storedAllocations));
    } else {
      const demoData = generateDemoData();
      setProductKeys(demoData.productKeys);
      setCategories(demoData.categories);
      setCustomers(demoData.customers);
      setAllocations(demoData.allocations);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('productKeys', JSON.stringify(productKeys));
      localStorage.setItem('categories', JSON.stringify(categories));
      localStorage.setItem('customers', JSON.stringify(customers));
      localStorage.setItem('allocations', JSON.stringify(allocations));
    }
  }, [productKeys, categories, customers, allocations, isInitialized]);

  const addProductKey = (key: Omit<ProductKey, 'id' | 'createdAt'>) => {
    const newKey: ProductKey = {
      ...key,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setProductKeys([...productKeys, newKey]);
  };

  const updateProductKey = (key: ProductKey) => {
    setProductKeys(productKeys.map(k => (k.id === key.id ? key : k)));
  };

  const deleteProductKey = (id: string) => {
    setProductKeys(productKeys.filter(k => k.id !== id));
    // Also remove any allocations for this key
    setAllocations(allocations.filter(a => a.productKeyId !== id));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (category: Category) => {
    setCategories(categories.map(c => (c.id === category.id ? category : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    // Update any product keys in this category to uncategorized
    setProductKeys(
      productKeys.map(k => 
        k.categoryId === id ? { ...k, categoryId: 'uncategorized' } : k
      )
    );
  };

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
    };
    setCustomers([...customers, newCustomer]);
  };

  const updateCustomer = (customer: Customer) => {
    setCustomers(customers.map(c => (c.id === customer.id ? customer : c)));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
    // Deallocate any keys assigned to this customer
    const customerAllocations = allocations.filter(a => a.customerId === id);
    customerAllocations.forEach(allocation => {
      deallocateKey(allocation.productKeyId);
    });
    setAllocations(allocations.filter(a => a.customerId !== id));
  };

  const allocateKey = (allocation: Omit<Allocation, 'id' | 'allocatedAt'>) => {
    const newAllocation: Allocation = {
      ...allocation,
      id: Date.now().toString(),
      allocatedAt: new Date().toISOString(),
    };
    setAllocations([...allocations, newAllocation]);
    
    // Update the key's status to allocated
    setProductKeys(
      productKeys.map(k => 
        k.id === allocation.productKeyId ? { ...k, status: 'allocated' } : k
      )
    );
  };

  const deallocateKey = (productKeyId: string) => {
    setAllocations(allocations.filter(a => a.productKeyId !== productKeyId));
    
    // Update the key's status back to available
    setProductKeys(
      productKeys.map(k => 
        k.id === productKeyId ? { ...k, status: 'available' } : k
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        productKeys,
        categories,
        customers,
        allocations,
        addProductKey,
        updateProductKey,
        deleteProductKey,
        addCategory,
        updateCategory,
        deleteCategory,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        allocateKey,
        deallocateKey,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};