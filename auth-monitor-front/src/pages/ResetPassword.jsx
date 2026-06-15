import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Layihədəki router kitabxanasına görə uyğunlaşdırıla bilər (məs: react-router-dom)
import API from '../services/api';
import { Lock, CheckCircle2, ShieldAlert } from 'lucide-react';

const ResetPassword = () => {
  // URL-dən token parametrini oxumaq üçün searchParams istifadə edirik
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Ön fonda bəsit şifrə uyğunluğu yoxlanışı
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      // POST http://localhost:8080/api/auth/reset-password?token=xyz
      const res = await API.post(`/auth/reset-password?token=${token}`, { password });
      
      if (res.status === 200) {
        setMessage(res.data.message || 'Your password has been successfully updated.');
        // 3 saniyə sonra istifadəçini avtomatik Login səhifəsinə yönləndiririk
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password. Link might be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">Reset Password</h2>
          <p className="text-slate-400 text-sm mt-1">
            Please type your secure new password below.
          </p>
        </div>

        {message && (
          <div className="mb-5 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm flex items-start gap-3">
            <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{message}</p>
              <p className="text-xs text-emerald-500/80 mt-1">Redirecting to login page in 3 seconds...</p>
            </div>
          </div>
        )}

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
                New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating password...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;