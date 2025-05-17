import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProductKeysPage from './pages/ProductKeysPage';
import CategoriesPage from './pages/CategoriesPage';
import CustomersPage from './pages/CustomersPage';
import InventoryPage from './pages/InventoryPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/keys" element={
            <PrivateRoute>
              <Layout>
                <ProductKeysPage />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/categories" element={
            <PrivateRoute>
              <Layout>
                <CategoriesPage />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/customers" element={
            <PrivateRoute>
              <Layout>
                <CustomersPage />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/inventory" element={
            <PrivateRoute>
              <Layout>
                <InventoryPage />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;