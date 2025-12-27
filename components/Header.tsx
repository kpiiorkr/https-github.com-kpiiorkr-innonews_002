
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, LogOut } from 'lucide-react';
import { useApp } from '../store';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAdmin, setAdmin, navCategories } = useApp();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Top bar */}
        <div className="flex justify-between items-center py-4 border-b border-gray-100">
          <Link to="/" className="text-3xl font-bold text-blue-900 tracking-tighter">
            INNO <span className="text-gray-900">NEWS</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6 text-sm text-gray-500">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:text-blue-600 flex items-center gap-1 transition-colors"
            >
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

        {/* Search Bar Overlay */}
        {isSearchOpen && (
          <div className="py-4 border-b border-gray-100 animate-in slide-in-from-top duration-200">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input 
                type="text" 
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색어를 입력하세요 (제목, 본문)"
                className="w-full p-3 border border-blue-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 pr-12"
              />
              <button type="submit" className="absolute right-3 p-2 text-blue-900 hover:bg-blue-50 rounded-full">
                <Search size={20} />
              </button>
            </form>
          </div>
        )}

        {/* Navigation */}
        <nav className={`md:flex ${isMenuOpen ? 'block' : 'hidden'} bg-white`}>
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 py-3 font-medium text-gray-700">
            {navCategories.map((cat) => (
              <li key={cat}>
                <Link 
                  to={`/category/${cat}`}
                  className="hover:text-blue-600 transition-colors block py-2 md:py-0"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat}
                </Link>
              </li>
            ))}
            <li><Link to="/videos" className="hover:text-blue-600 transition-colors block py-2 md:py-0" onClick={() => setIsMenuOpen(false)}>영상</Link></li>
            <li><Link to="/report" className="hover:text-blue-600 transition-colors block py-2 md:py-0 font-bold text-red-600" onClick={() => setIsMenuOpen(false)}>제보하기</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
