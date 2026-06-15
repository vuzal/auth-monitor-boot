import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import {
  Users, ShieldCheck, ShieldAlert, Activity,
  UserX, UserCheck, LogOut, RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

const Dashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalUsers: 0, totalLoginAttempts: 0, successAttempts: 0, failedAttempts: 0 });
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // 🛠️ Yeni vizual state

  // Dataları backend-dən çəkən funksiya
  const fetchData = async (manual = false) => {
    try {
      if (manual) setIsRefreshing(true);
      else setLoading(true);

      // 🛠️ MÜDAFİƏ: Sorğuları bir-birindən asılı etmirik
      try {
        const statsRes = await API.get('/admin/stats');
        setStats(statsRes.data);
      } catch (e) { console.error("Statistika çəkilə bilmədi:", e); }

      try {
        const usersRes = await API.get('/admin/users');
        setUsers(usersRes.data);
      } catch (e) { console.error("İstifadəçilər çəkilə bilmədi:", e); }

      try {
        const logsRes = await API.get('/admin/logs');
        console.log("Backend-dən gələn xam loqlar:", logsRes.data);
        setLogs(logsRes.data || []);
      } catch (e) { console.error("Loqlar çəkilə bilmədi (Endpoint-i yoxla):", e); }

    } catch (err) {
      console.error("Ümumi Data xətası:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Loqları qrafik üçün qruplaşdıran funksiya (Saatlıq trend)
  const prepareChartData = () => {
    const timeMap = {};
    
    // Son loqları tərsinə çeviririk ki, xronoloji ardıcıllıq düzgün olsun (köhnədən yeniyə)
    [...logs].reverse().forEach(log => {
      const date = new Date(log.attemptTime);
      // Saat və dəqiqə formatı (Məsələn: 14:30)
      const timeStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      
      if (!timeMap[timeStr]) {
        timeMap[timeStr] = { time: timeStr, Uğurlu: 0, Uğursuz: 0 };
      }
      
      if (log.successful) {
        timeMap[timeStr].Uğurlu += 1;
      } else {
        timeMap[timeStr].Uğursuz += 1;
      }
    });
    
    return Object.values(timeMap);
  };

  const chartData = prepareChartData();

  useEffect(() => {
    fetchData(); // İlk yüklənmədə normal işləsin
    const interval = setInterval(() => fetchData(false), 30000); // Arxa fonda səssiz yeniləsin
    return () => clearInterval(interval);
  }, []);

  // İstifadəçini bloklamaq funksiyası
  const handleBlockUser = async (userId, isBlocked) => {
    try {
      const endpoint = `/admin/users/${userId}/${isBlocked ? 'unblock' : 'block'}`;
      await API.put(endpoint);
      fetchData(); // Dataları yeniləyirik
    } catch (err) {
      alert("İstifadəçi statusu dəyişdirilərkən xəta!");
    }
  };

  if (loading && logs.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <RefreshCw className="animate-spin text-indigo-500" size={24} />
          <span>Dashboard yüklənir...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            AuthMonitor İdarəetmə Paneli
          </h1>
          <p className="text-sm text-slate-400 mt-1">Xoş gəldiniz, Admin <span className="text-indigo-400 font-semibold">{user?.username}</span></p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white px-4 py-2 rounded-xl border border-red-500/20 transition-all text-sm font-medium"
        >
          <LogOut size={16} />
          Sistemdən Çıx
        </button>
      </header>

      {/* 4 Əsas Statistika Kartı */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700/50 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Ümumi İstifadəçi</p>
            <h3 className="text-2xl font-bold mt-1 text-white">{stats.totalUsers}</h3>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><Users size={22} /></div>
        </div>

        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700/50 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Giriş Cəhdləri</p>
            <h3 className="text-2xl font-bold mt-1 text-white">{stats.totalLoginAttempts}</h3>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl"><Activity size={22} /></div>
        </div>

        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700/50 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Uğurlu Girişlər</p>
            <h3 className="text-2xl font-bold mt-1 text-emerald-400">{stats.successAttempts}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><ShieldCheck size={22} /></div>
        </div>

        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700/50 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Uğursuz Cəhdlər</p>
            <h3 className="text-2xl font-bold mt-1 text-red-400">{stats.failedAttempts !== undefined && stats.failedAttempts !== null 
        ? stats.failedAttempts 
        : (stats.totalLoginAttempts - stats.successAttempts || 0)}</h3>
          </div>
          <div className="p-3 bg-red-500/10 text-red-400 rounded-xl"><ShieldAlert size={22} /></div>
        </div>
      </div>

      {/* 📊 Canlı Analitika Qrafiki */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700/50 mb-8 shadow-sm">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Activity size={18} className="text-indigo-400" />
          Giriş Cəhdlərinin Canlı Trendi
        </h2>
        <div className="w-full h-[300px]">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              Qrafiki rəndərləmək üçün hələ yetərli loq məlumatı yoxdur.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px', color: '#f8fafc' }}
                  itemStyle={{ fontSize: '13px' }}
                />
                <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                <Area 
                  type="monotone" 
                  dataKey="Uğurlu" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSuccess)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Uğursuz" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorFailed)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Canlı Giriş Loqları Cədvəli */}
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700/50 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-indigo-400" />
              Canlı Giriş Loqları (Son 100)
            </h2>
            <button
              onClick={() => fetchData(true)}
              className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
              disabled={isRefreshing}
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin text-indigo-400" : ""} />
            </button>
          </div>
          <div className="overflow-x-auto max-h-[450px] overflow-y-auto border border-slate-700/50 rounded-xl">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900 text-xs text-slate-400 uppercase sticky top-0">
                <tr>
                  <th className="px-4 py-3">İstifadəçi</th>
                  <th className="px-4 py-3">IP Ünvanı</th>
                  <th className="px-4 py-3">Zaman</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Səbəb</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{log.username}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{log.ipAddress}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{new Date(log.attemptTime).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${log.successful ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                        {log.successful ? 'Uğurlu' : 'Uğursuz'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{log.failReason || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* İstifadəçi İdarəetmə Paneli */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700/50 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Users size={18} className="text-emerald-400" />
            İstifadəçi Siyahısı
          </h2>
          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/30">
                <div>
                  <h4 className="font-semibold text-sm text-white">{u.username}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{u.email}</p>
                  <span className="inline-block mt-1 text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-indigo-400 border border-slate-700">
                    {u.role}
                  </span>
                </div>
                {u.username !== 'vusal_dev' && (
                  <button
                    onClick={() => handleBlockUser(u.id, u.blocked)}
                    className={`p-2 rounded-xl border transition-all ${u.blocked
                        ? 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border-emerald-500/20'
                        : 'bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border-red-500/20'
                      }`}
                    title={u.blocked ? "Blokdan Çıxart" : "Blokla"}
                  >
                    {u.blocked ? <UserCheck size={16} /> : <UserX size={16} />}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;