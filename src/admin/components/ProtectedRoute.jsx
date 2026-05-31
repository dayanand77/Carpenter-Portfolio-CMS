import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../shared/services/firebase';

export default function ProtectedRoute() {
  const [authState, setAuthState] = useState({ checking: true, authenticated: false });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthState({ checking: false, authenticated: !!user });
    });
    return unsub;
  }, []);

  if (authState.checking) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authState.authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
