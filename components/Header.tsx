
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, LogOut } from 'lucide-react';
import { useApp } from '../store';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin, setAdmin } = useApp();
  const navigate = useNavigate();

  const categories = ['오피니언', '최신기사', '기술', '경영', '사회', '문화', '영상', '제보하기'];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Top bar */}
        <div className="flex justify-between items-center py-4 border-b border-gray-100">
          <Link to="/" className="text-3xl font-bold text-blue-900 tracking-tighter">
            INNO <span className="text-gray-900">NEWS</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6 text-sm text-gray-500">
            <button className="hover:text-blue-600 flex items-center gap-1">
              <Search size={18} /> 검색
            </button>
            {isAdmin ? (
              <>
                <Link to="/admin" className="hover:text-blue-600 font-bold flex items-center gap-1">
                  <User size={18} /> 관리자메뉴
                </Link>
                <button onClick={() => { setAdmin(false); navigate('/'); }} className="hover:text-red-600 flex items-center gap-1">
                  <LogOut size={18} /> 로그아웃
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:text-blue-600 flex items-center gap-1">
                <User size={18} /> 관리자 로그인
              </Link>
            )}
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className={`md:flex ${isMenuOpen ? 'block' : 'hidden'} bg-white`}>
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 py-3 font-medium text-gray-700">
            {categories.map((cat) => (
              <li key={cat}>
                <Link 
                  to={cat === '영상' ? '/videos' : cat === '제보하기' ? '/report' : `/category/${cat}`}
                  className="hover:text-blue-600 transition-colors block py-2 md:py-0"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
