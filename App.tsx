
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store';
import Layout from './components/Layout';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import CategoryPage from './pages/CategoryPage';
import ReportPage from './pages/ReportPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import VideosPage from './pages/VideosPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useApp();
  if (!isAdmin) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/article/:id" element={<Layout><ArticleDetail /></Layout>} />
      <Route path="/category/:categoryName" element={<Layout><CategoryPage /></Layout>} />
      <Route path="/report" element={<Layout><ReportPage /></Layout>} />
      <Route path="/videos" element={<Layout><VideosPage /></Layout>} />
      <Route path="/login" element={<Layout><AdminLogin /></Layout>} />
      <Route path="/admin" element={
        <ProtectedRoute>
          <Layout><AdminDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
};

export default App;
