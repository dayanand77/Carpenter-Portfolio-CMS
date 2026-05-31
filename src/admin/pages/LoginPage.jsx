import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, loginAdmin } from '../../shared/services/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setLoading(false);
      }
    });
    return unsub;
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await loginAdmin(email, password);
    setSubmitting(false);
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center font-body px-6">
      <div className="w-full max-w-[420px] bg-white border border-stone-250/70 shadow-xl rounded-lg p-8 animate-fadeIn">
        
        {/* Brand header */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shadow-inner">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h1 className="font-heading font-semibold text-stone-850 text-xl tracking-wider uppercase leading-none mt-2">Workshop Portal</h1>
          <p className="text-stone-400 font-light text-xs uppercase tracking-widest leading-none">Management Sign In</p>
        </div>

        {/* Error block */}
        {error && (
          <div className="bg-red-50 border-l-2 border-red-500 text-red-700 text-xs px-4 py-3 rounded mb-6 font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded border border-stone-250 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-600 text-sm text-stone-800 transition-colors"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded border border-stone-250 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-600 text-sm text-stone-800 transition-colors"
              placeholder="Enter password"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed text-white font-medium text-xs uppercase tracking-wider transition-colors duration-250 shadow-md shadow-amber-600/10 mt-2"
          >
            {submitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Help footer */}
        <div className="text-center text-stone-400 text-xs mt-8 pt-6 border-t border-stone-150">
          <span>Forgot password? Contact workspace developer.</span>
        </div>

      </div>
    </div>
  );
}
