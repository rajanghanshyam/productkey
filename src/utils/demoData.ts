import { ProductKey, Category, Customer, Allocation } from '../types';

export const generateDemoData = () => {
  // Create categories
  const categories: Category[] = [
    {
      id: '1',
      name: 'Developer Tools',
      description: 'IDEs and programming utilities',
      color: '#1E40AF', // Navy blue
    },
    {
      id: '2',
      name: 'Office Suite',
      description: 'Productivity and office applications',
      color: '#0D9488', // Teal
    },
    {
      id: '3',
      name: 'Security Software',
      description: 'Antivirus and security applications',
      color: '#7C3AED', // Purple
    },
    {
      id: 'uncategorized',
      name: 'Uncategorized',
      description: 'Products without a specific category',
      color: '#6B7280', // Gray
    },
  ];

  // Create customers
  const customers: Customer[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '555-123-4567',
      company: 'Tech Solutions Inc.',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@acme.org',
      phone: '555-987-6543',
      company: 'Acme Corporation',
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael.b@globex.net',
      phone: '555-456-7890',
      company: 'Globex Systems',
    },
  ];

  // Create product keys
  const productKeys: ProductKey[] = [
    {
      id: '1',
      key: 'DEV-12345-ABCDE-67890',
      categoryId: '1', // Developer Tools
      status: 'available',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      expiresAt: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(), // 335 days from now
    },
    {
      id: '2',
      key: 'OFF-54321-FGHIJ-09876',
      categoryId: '2', // Office Suite
      status: 'allocated',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
      expiresAt: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000).toISOString(), // 305 days from now
    },
    {
      id: '3',
      key: 'SEC-98765-KLMNO-43210',
      categoryId: '3', // Security Software
      status: 'available',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      expiresAt: new Date(Date.now() + 350 * 24 * 60 * 60 * 1000).toISOString(), // 350 days from now
    },
    {
      id: '4',
      key: 'DEV-67890-PQRST-12345',
      categoryId: '1', // Developer Tools
      status: 'allocated',
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
      expiresAt: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000).toISOString(), // 320 days from now
    },
    {
      id: '5',
      key: 'OFF-09876-UVWXY-54321',
      categoryId: '2', // Office Suite
      status: 'expired',
      createdAt: new Date(Date.now() - 380 * 24 * 60 * 60 * 1000).toISOString(), // 380 days ago
      expiresAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    },
  ];

  // Create allocations
  const allocations: Allocation[] = [
    {
      id: '1',
      productKeyId: '2', // OFF-54321-FGHIJ-09876
      customerId: '1', // John Smith
      allocatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      notes: 'Annual office suite license',
    },
    {
      id: '2',
      productKeyId: '4', // DEV-67890-PQRST-12345
      customerId: '2', // Sarah Johnson
      allocatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      notes: 'Development IDE license',
    },
  ];

  return { categories, customers, productKeys, allocations };
};