import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6">
        {children}
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center text-sm">
        <p>© 2025 KeyManager Pro. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;