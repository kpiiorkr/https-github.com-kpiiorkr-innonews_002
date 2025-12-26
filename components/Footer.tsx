
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          <div className="w-48 mb-6 md:mb-0">
            <div className="text-2xl font-bold text-blue-900 tracking-tighter mb-2">INNO NEWS</div>
            <div className="text-xs text-gray-400">한국프로세스혁신협회</div>
          </div>
          
          <div className="flex-grow">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mb-6 font-medium">
              <li><a href="#" className="hover:underline">회사소개</a></li>
              <li><a href="#" className="hover:underline">광고안내</a></li>
              <li><a href="#" className="hover:underline">구독신청</a></li>
              <li><a href="#" className="hover:underline">고충처리인운영규정</a></li>
              <li><a href="#" className="hover:underline">청소년보호정책</a></li>
              <li><a href="#" className="hover:underline font-bold text-gray-900">개인정보처리방침</a></li>
              <li><a href="#" className="hover:underline">편집윤리규정</a></li>
              <li><a href="#" className="hover:underline">윤리자율규제지침</a></li>
              <li><a href="#" className="hover:underline text-gray-400">사이트맵</a></li>
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
