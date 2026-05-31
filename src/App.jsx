import React, { useState, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { SettingsProvider } from './shared/contexts/SettingsContext';
import { CategoriesProvider } from './shared/contexts/CategoriesContext';
import { SubcategoriesProvider } from './shared/contexts/SubcategoriesContext';
import { GalleriesProvider } from './shared/contexts/GalleriesContext';

import CustomerLayout from './customer/layouts/CustomerLayout';
import ImageViewer from './customer/components/ImageViewer';
import ProtectedRoute from './admin/components/ProtectedRoute';

import HomePage from './customer/pages/HomePage';
import AboutPage from './customer/pages/AboutPage';
import ContactPage from './customer/pages/ContactPage';
import CategoryPage from './customer/pages/CategoryPage';
import GalleryPage from './customer/pages/GalleryPage';

import AdminLayout from './admin/layouts/AdminLayout';
import LoginPage from './admin/pages/LoginPage';
import DashboardPage from './admin/pages/DashboardPage';
import CategoriesPage from './admin/pages/CategoriesPage';
import SubcategoriesPage from './admin/pages/SubcategoriesPage';
import SettingsPage from './admin/pages/SettingsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  const [viewerImages, setViewerImages] = useState(null);
  const [viewerActiveIndex, setViewerActiveIndex] = useState(0);
  const [viewerSubtitle, setViewerSubtitle] = useState('');

  const handleImageClick = useCallback((images, activeIndex, subtitle) => {
    setViewerImages(images);
    setViewerActiveIndex(activeIndex || 0);
    setViewerSubtitle(subtitle || '');
  }, []);

  const handleViewerClose = useCallback(() => {
    setViewerImages(null);
    setViewerActiveIndex(0);
    setViewerSubtitle('');
  }, []);

  const handleViewerNext = useCallback(() => {
    if (viewerActiveIndex < viewerImages.length - 1) {
      setViewerActiveIndex(viewerActiveIndex + 1);
    }
  }, [viewerActiveIndex, viewerImages]);

  const handleViewerPrev = useCallback(() => {
    if (viewerActiveIndex > 0) {
      setViewerActiveIndex(viewerActiveIndex - 1);
    }
  }, [viewerActiveIndex]);

  return (
    <SettingsProvider>
      <CategoriesProvider>
      <SubcategoriesProvider>
      <GalleriesProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage onImageClick={handleImageClick} />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="category/:slug" element={<CategoryPage onImageClick={handleImageClick} />} />
          <Route path="gallery/:slug" element={<GalleryPage onImageClick={handleImageClick} />} />
        </Route>

        <Route path="/admin/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="subcategories" element={<SubcategoriesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {viewerImages && (
        <ImageViewer
          images={viewerImages}
          activeIndex={viewerActiveIndex}
          subtitle={viewerSubtitle}
          onClose={handleViewerClose}
          onNext={handleViewerNext}
          onPrev={handleViewerPrev}
        />
      )}
      </GalleriesProvider>
      </SubcategoriesProvider>
      </CategoriesProvider>
    </SettingsProvider>
  );
}

export default App;
