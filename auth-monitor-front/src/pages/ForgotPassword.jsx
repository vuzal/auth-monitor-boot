import React, { useState } from 'react';
import API from '../services/api';
import { Mail, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // Backend-dəki /api/auth/forgot-password endpointinə sorğu atırıq
      const res = await API.post('/auth/forgot-password', { email });
      if (res.status === 200) {
        setMessage(res.data.message || 'Reset link has been sent to your email.');
      }
    } catch (err) {
      // Backend-dən gələn ingiliscə xətanı ekranda göstəririk
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">Forgot Password?</h2>
          <p className="text-slate-400 text-sm mt-1">
            Enter your email address and we will send you a secure link to reset your password.
          </p>
        </div>

        {/* Uğurlu bildiriş kartı */}
        {message && (
          <div className="mb-5 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm flex items-start gap-3">
            <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        {/* Xəta bildiriş kartı */}
        {error && (
          <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-start gap-3">
            <ShieldAlert size={20} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                  placeholder="Enter your registered email"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <a
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:underline font-medium transition-all"
          >
            <ArrowLeft size={16} />
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;