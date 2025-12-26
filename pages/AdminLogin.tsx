
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { Lock } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const { setAdmin } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (id === 'admin' && pw === 'admin') {
      setAdmin(true);
      navigate('/admin');
    } else {
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-20">
      <div className="bg-white p-8 border border-gray-200 shadow-lg rounded-xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-900">
            <Lock size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-8">관리자 로그인</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
            <input 
              type="text" value={id} onChange={(e) => setId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input 
              type="password" value={pw} onChange={(e) => setPw(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="admin"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-blue-900 text-white font-bold rounded hover:bg-blue-800 transition-colors mt-6"
          >
            로그인
          </button>
        </form>
        
        <p className="mt-6 text-center text-xs text-gray-400">
          관리자 권한이 필요합니다. 승인되지 않은 접근은 법적 처벌을 받을 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
