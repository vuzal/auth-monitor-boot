import React, { useState } from 'react';
import API from '../services/api';
import { UserPlus, Mail, Lock, User, CheckCircle2, AlertCircle } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await API.post('/users/register', { username, email, password });
      if (res.status === 201 || res.status === 200) {
        setSuccess(true);
        setUsername('');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Qeydiyyat zamanı xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-emerald-500/10 rounded-xl text-emerald-400 mb-3">
            <UserPlus size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white">Yeni Hesab Yarat</h2>
          <p className="text-slate-400 text-sm mt-1">Platformaya qoşulmaq üçün formun doldurun</p>
        </div>

        {success && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>Qeydiyyat uğurla tamamlandı! Giriş edə bilərsiniz.</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">İstifadəçi Adı</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <User size={18} />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                placeholder="İstifadəçi adı seçin"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">E-poçt Ünvanı</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                placeholder="nümunə@mail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Şifrə</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Lock size={18} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                placeholder="Güclü şifrə daxil edin"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Tamamlanır...' : 'Qeydiyyatı Bitir'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-slate-400">
          Artıq hesabınız var?{' '}
          <a href="/login" className="text-emerald-400 hover:underline">
            Giriş edin
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;