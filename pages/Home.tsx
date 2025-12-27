
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../store';
import { Clock, X } from 'lucide-react';

const Home: React.FC = () => {
  const { articles, ads } = useApp();
  const [showPopup, setShowPopup] = useState(false);
  // 현재 노출 중인 팝업의 인덱스 관리
  const [currentPopupIdx, setCurrentPopupIdx] = useState(0);
  
  const mainArticle = articles[0];
  const subArticles = articles.slice(1, 4);
  const listArticles = articles.slice(4);

  // 노출 설정된 팝업 광고들
  const popupAds = useMemo(() => ads.filter(ad => ad.type === 'popup' && ad.isVisible), [ads]);

  useEffect(() => {
    if (popupAds.length > 0) {
      setShowPopup(true);
    }
  }, [popupAds.length]);

  // '닫기' 클릭 시 다음 팝업으로 넘어가거나 전체 종료
  const handleClosePopup = () => {
    if (currentPopupIdx < popupAds.length - 1) {
      setCurrentPopupIdx(prev => prev + 1);
    } else {
      setShowPopup(false);
    }
  };

  const currentPopup = popupAds[currentPopupIdx];

  return (
    <div className="space-y-12 relative">
      {/* 팝업 광고 레이어: 순차 노출 방식 */}
      {showPopup && currentPopup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4">
          {/* 사이즈를 1/2 수준인 max-w-md로 축소 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-md w-full relative animate-in zoom-in duration-300">
            <button 
              onClick={handleClosePopup}
              className="absolute top-2 right-2 z-10 p-1 bg-black/50 text-white rounded-full hover:bg-black transition-colors"
            >
              <X size={20} />
            </button>
            <div className="bg-gray-100 aspect-square overflow-hidden relative">
              <a href={currentPopup.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full group">
                <img 
                  src={currentPopup.imageUrl} 
                  alt="Popup Ad" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </a>
              {/* 여러 개일 때 현재 순서 표시 */}
              {popupAds.length > 1 && (
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-0.5 rounded-full text-[10px]">
                  {currentPopupIdx + 1} / {popupAds.length}
                </div>
              )}
            </div>
            <div className="bg-white p-3 flex justify-between items-center border-t">
              <span className="text-[10px] text-gray-400 font-bold tracking-tighter">INNO NEWS ADVERTISEMENT</span>
              <button 
                onClick={handleClosePopup} 
                className="text-sm font-bold text-blue-900 hover:text-blue-700"
              >
                {currentPopupIdx < popupAds.length - 1 ? '현재 광고 닫기' : '닫기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Featured Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Big Article */}
        <div className="lg:col-span-2 group">
          {mainArticle ? (
            <Link to={`/article/${mainArticle.id}`} className="block">
              <div className="relative overflow-hidden mb-4">
                <img 
                  src={mainArticle.image} 
                  alt={mainArticle.title}
                  className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-blue-700 text-white px-3 py-1 text-xs font-bold">
                  {mainArticle.category}
                </div>
              </div>
              <h2 className="text-3xl font-bold leading-tight group-hover:text-blue-700 transition-colors">
                {mainArticle.title}
              </h2>
              <p className="mt-3 text-gray-600 line-clamp-3">
                {mainArticle.content}
              </p>
              <div className="mt-4 flex items-center text-xs text-gray-400">
                <Clock size={14} className="mr-1" /> {mainArticle.createdAt}
              </div>
            </Link>
          ) : (
            <div className="bg-gray-100 aspect-video flex items-center justify-center text-gray-400 italic">게시된 기사가 없습니다.</div>
          )}
        </div>

        {/* Side Top Articles */}
        <div className="flex flex-col space-y-8">
          {subArticles.map(article => (
            <Link key={article.id} to={`/article/${article.id}`} className="group flex flex-col md:flex-row lg:flex-col gap-4">
              <div className="w-full md:w-48 lg:w-full aspect-video overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex-grow">
                <div className="text-blue-700 text-[10px] font-bold mb-1 uppercase tracking-wider">{article.category}</div>
                <h3 className="font-bold text-lg leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
          {subArticles.length === 0 && (
            <div className="text-gray-300 italic py-10 text-center border border-dashed rounded">추가 기사가 없습니다.</div>
          )}
        </div>
      </section>

      {/* Secondary List Section */}
      <section className="border-t border-gray-200 pt-10">
        <h3 className="text-xl font-bold mb-6 border-b-2 border-gray-900 inline-block">주요 소식</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {listArticles.map(article => (
            <Link key={article.id} to={`/article/${article.id}`} className="flex gap-4 group">
              <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-gray-100">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div>
                <h4 className="font-bold text-base leading-snug group-hover:text-blue-700 line-clamp-2 mb-1">
                  {article.title}
                </h4>
                <div className="text-xs text-gray-400">{article.createdAt}</div>
              </div>
            </Link>
          ))}
          {listArticles.length === 0 && articles.length <= 4 && (
            <div className="col-span-full py-10 text-center text-gray-400">표시할 기사가 더 없습니다.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
