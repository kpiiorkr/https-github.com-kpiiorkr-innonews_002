
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          <div className="w-48 mb-6 md:mb-0">
            <Link to="/" className="text-2xl font-bold text-blue-900 tracking-tighter mb-2 block">INNO NEWS</Link>
            <div className="text-xs text-gray-400">한국프로세스혁신협회</div>
          </div>
          
          <div className="flex-grow">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mb-6 font-medium">
              <li><Link to="/info/intro" className="hover:underline">회사소개</Link></li>
              <li><Link to="/info/ads" className="hover:underline">광고안내</Link></li>
              <li><Link to="/info/subscribe" className="hover:underline">구독신청</Link></li>
              <li><Link to="/info/resolve" className="hover:underline">고충처리인운영규정</Link></li>
              <li><Link to="/info/teen" className="hover:underline">청소년보호정책</Link></li>
              <li><Link to="/info/privacy" className="hover:underline font-bold text-gray-900">개인정보처리방침</Link></li>
              <li><Link to="/info/ethics" className="hover:underline">편집윤리규정</Link></li>
              <li><Link to="/info/ethicalautonomy" className="hover:underline">윤리자율규제지침</Link></li>
              <li><Link to="/info/newspaperethics" className="hover:underline">윤리실천요강</Link></li>
              <li><Link to="/info/sitemap" className="hover:underline text-gray-400">사이트맵</Link></li>
            </ul>

            <div className="text-xs text-gray-500 leading-relaxed space-y-1">
              <p>한국프로세스혁신협회 : (05030) 서울시 광진구 자양강변길 115, STA타워</p>
              <p>한국프로세스혁신협회 산하 미디어사업부</p>
              <p>등록일자 : 2025.12.26 발행인 : 강승원, 편집인 : 한국프로세스혁신협회</p>
            </div>
            
            <p className="mt-6 text-xs text-gray-400 uppercase tracking-widest">
              Copyright ⓒ INNO NEWS(한국프로세스혁신협회), All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
