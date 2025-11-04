// src/routes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import {SignInPage} from '../pages/SignInPage';
import {SignUpPage} from '../pages/SignUpPage';
import { MemoPage } from '../pages/MemoPage';
import CategoryPage from '../pages/CategoryPage';
import { useAuth } from '../services/useAuth';
import SignUpSuccess from '../components/auth/SignUpSuccess';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useAuth();

  // ถ้ากำลังโหลดข้อมูล แสดงหน้าโหลด
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  // ถ้าไม่มี session ให้ redirect ไปหน้า sign in
  if (!session) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/signup-success" element={<SignUpSuccess />} />
      
      {/* Protected routes */}
      <Route 
        path="/memos" 
        element={
          <ProtectedRoute>
            <MemoPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/categories" 
        element={
          <ProtectedRoute>
            <CategoryPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Default route */}
      <Route path="/" element={<Navigate to="/memos" replace />} />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/memos" replace />} />
    </Routes>
  );
};