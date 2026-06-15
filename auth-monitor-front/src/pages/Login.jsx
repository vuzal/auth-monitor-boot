import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { ShieldAlert, Lock, User } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Bizim ağıllı API instansiyası ilə backend-ə sorğu atırıq
      const res = await API.post('/auth/login', { username, password });
      
      if (res.status === 200) {
        login(res.data);
        
        // 🛠️ MÜDAFİƏ: Gələn rolu string-ə çevirib, böyük hərflərlə "ADMIN" sözünü axtarırıq
        const userRole = String(res.data?.role || "").toUpperCase();
        
        console.log("Backend-dən gələn real rol:", userRole);

        if (userRole.includes("ADMIN")) {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/";
        }
      }
    } catch (err) {
      // Sənin dediyin ssenarini (500 və ya 401 gəlməsindən asılı olmayaraq) idarə edirik
      const backendMessage = err.response?.data?.message || "";
      
      if (backendMessage.includes("Bad credentials")) {
        setError("İstifadəçi adı və ya şifrə yanlışdır!");
      } else if (backendMessage.includes("temporarily blocked")) {
        setError("Bu IP ünvanı çoxlu uğursuz cəhdə görə 5 dəqiqəlik BLOKLANIB!");
      } else {
        setError("Sistemdə gözlənilməyən xəta baş verdi. Yenidən yoxlayın.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-500/10 rounded-xl text-indigo-400 mb-3">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white">Xoş Gəldiniz</h2>
          <p className="text-slate-400 text-sm mt-1">Sistemə daxil olmaq üçün məlumatları doldurun</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm flex items-center gap-2">
            <ShieldAlert size={18} className="shrink-0" />
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
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                placeholder="İstifadəçi adınızı yazın"
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
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Yoxlanılır...' : 'Giriş Et'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-slate-400">
          Hesabınız yoxdur?{' '}
          <a href="/register" className="text-indigo-400 hover:underline">
            Qeydiyyatdan keçin
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;