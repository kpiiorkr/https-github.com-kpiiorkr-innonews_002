
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../store';
import { Clock, X, ChevronRight } from 'lucide-react';

const HIDE_GLOBAL_KEY = 'innonews_hide_all_until';
const CLOSED_POPUPS_KEY = 'innonews_closed_popups_data';
// 요청하신 풀 경로 대체 이미지로 업데이트
const DEFAULT_ARTICLE_IMAGE = 'https://media.istockphoto.com/id/1170028399/vector/white-half-tone-background.jpg?s=612x612&w=0&k=20&c=2L44isbJdJt3LW7yYOhqLLiByWELcujetoXKsx6QVdE=';

const Home: React.FC = () => {
  const { articles, ads } = useApp();
  const [showPopup, setShowPopup] = useState(false);
  const [currentPopupIdx, setCurrentPopupIdx] = useState(0);
  const [hideWeekChecked, setHideWeekChecked] = useState(false);

  // 기사 배치 전략
  const mainArticle = articles[0];
  const featuredArticles = articles.slice(1, 4);
  const subGridArticles = articles.slice(4, 7);
  const moreArticles = articles.slice(7);

  const popupAds = useMemo(() => {
    const globalHideUntil = localStorage.getItem(HIDE_GLOBAL_KEY);
    const now = new Date().getTime();
    if (globalHideUntil && now < parseInt(globalHideUntil)) return [];
    const closedDataRaw = localStorage.getItem(CLOSED_POPUPS_KEY);
    const closedData = closedDataRaw ? JSON.parse(closedDataRaw) : {};
    return ads.filter(ad => {
      if (ad.type !== 'popup' || !ad.isVisible) return false;
      const closedAt = closedData[ad.id];
      if (closedAt && now < closedAt + 24 * 60 * 60 * 1000) return false;
      return true;
    });
  }, [ads]);

  useEffect(() => {
    if (popupAds.length > 0) setShowPopup(true);
  }, [popupAds.length]);

  const handleHideWeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const until = new Date();
      until.setDate(until.getDate() + 7);
      localStorage.setItem(HIDE_GLOBAL_KEY, until.getTime().toString());
      setShowPopup(false);
    }
    setHideWeekChecked(e.target.checked);
  };

  const handleCloseSinglePopup = () => {
    const currentPopup = popupAds[currentPopupIdx];
    if (currentPopup) {
      const closedDataRaw = localStorage.getItem(CLOSED_POPUPS_KEY);
      const closedData = closedDataRaw ? JSON.parse(closedDataRaw) : {};
      closedData[currentPopup.id] = new Date().getTime();
      localStorage.setItem(CLOSED_POPUPS_KEY, JSON.stringify(closedData));
    }
    if (currentPopupIdx < popupAds.length - 1) setCurrentPopupIdx(prev => prev + 1);
    else setShowPopup(false);
  };

  const currentPopup = popupAds[currentPopupIdx];

  const getArticleImage = (url?: string) => {
    return (url && url.trim() !== '') ? url : DEFAULT_ARTICLE_IMAGE;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_ARTICLE_IMAGE;
  };

  return (
    <div className="space-y-16 relative">
      {/* 팝업 레이어 */}
      {showPopup && currentPopup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-md w-full relative animate-in zoom-in duration-300">
            <button onClick={handleCloseSinglePopup} className="absolute top-2 right-2 z-10 p-1 bg-black/50 text-white rounded-full hover:bg-black transition-colors"><X size={20} /></button>
            <div className="bg-gray-100 aspect-square overflow-hidden relative">
              <a href={currentPopup.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full group">
                <img src={currentPopup.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Ad" />
              </a>
            </div>
            <div className="bg-white px-4 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={hideWeekChecked} onChange={handleHideWeekChange} className="w-3.5 h-3.5 accent-blue-900" />
                  <span className="text-[11px] text-gray-500">1주일간 다시 보지 않기</span>
                </label>
                <button onClick={handleCloseSinglePopup} className="text-xs font-bold text-blue-900 underline">팝업 닫기</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section: 1 Large + 3 Side List */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 group">
          {mainArticle ? (
            <Link to={`/article/${mainArticle.id}`} className="block space-y-5">
              <div className="relative overflow-hidden rounded-sm shadow-sm aspect-video bg-gray-50">
                <img 
                  src={getArticleImage(mainArticle.image)} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt={mainArticle.title}
                  onError={handleImageError}
                />
                <div className="absolute top-4 left-4 bg-blue-900 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  TOP STORY - {mainArticle.category}
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-extrabold leading-tight text-gray-900 group-hover:text-blue-900 transition-colors tracking-tighter">
                  {mainArticle.title}
                </h2>
                <p className="text-gray-600 line-clamp-2 text-lg font-light leading-relaxed">
                  {mainArticle.content.replace(/\[IMG:.*?\]/g, '').substring(0, 200)}...
                </p>
                <div className="flex items-center text-xs text-gray-400 font-medium">
                   <Clock size={14} className="mr-1.5" /> {mainArticle.createdAt}
                </div>
              </div>
            </Link>
          ) : (
            <div className="bg-gray-100 aspect-video flex items-center justify-center text-gray-400 italic">게시된 기사가 없습니다.</div>
          )}
        </div>

        <div className="lg:col-span-4 flex flex-col divide-y divide-gray-100">
          {featuredArticles.map((article, idx) => (
            <Link key={article.id} to={`/article/${article.id}`} className="group py-6 first:pt-0 last:pb-0">
              <div className="flex gap-4">
                <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-sm bg-gray-50">
                  <img 
                    src={getArticleImage(article.image)} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    alt={article.title} 
                    onError={handleImageError}
                  />
                </div>
                <div className="flex flex-col justify-center space-y-2">
                  <div className="text-blue-700 text-[10px] font-bold uppercase tracking-wider">{article.category}</div>
                  <h3 className="font-bold text-base leading-snug group-hover:text-blue-700 transition-colors line-clamp-2 tracking-tight">
                    {article.title}
                  </h3>
                  <div className="text-[10px] text-gray-400 font-medium">{article.createdAt}</div>
                </div>
              </div>
            </Link>
          ))}
          {featuredArticles.length === 0 && <div className="py-10 text-gray-300 italic">추천 기사가 없습니다.</div>}
        </div>
      </section>

      {/* Editor's Choice: 3 Column Grid */}
      {subGridArticles.length > 0 && (
        <section className="bg-gray-50 -mx-4 px-4 py-16 md:-mx-8 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10 border-b border-gray-200 pb-4">
               <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Editor's Choice</h3>
               <Link to="/category/최신기사" className="text-sm font-bold text-gray-400 hover:text-blue-900 flex items-center transition-colors">전체보기 <ChevronRight size={16} /></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {subGridArticles.map(article => (
                <Link key={article.id} to={`/article/${article.id}`} className="group space-y-4">
                  <div className="aspect-video overflow-hidden rounded-sm shadow-sm bg-white">
                    <img 
                      src={getArticleImage(article.image)} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt={article.title} 
                      onError={handleImageError}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-blue-700 text-[10px] font-bold uppercase tracking-widest">{article.category}</div>
                    <h4 className="font-bold text-xl leading-tight group-hover:text-blue-900 transition-colors line-clamp-2 tracking-tighter">
                      {article.title}
                    </h4>
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                      {article.content.replace(/\[IMG:.*?\]/g, '').substring(0, 100)}...
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Feed: Grid Cards */}
      <section className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {moreArticles.map(article => (
            <Link key={article.id} to={`/article/${article.id}`} className="flex flex-col group border-b border-gray-100 pb-8 lg:border-b-0 lg:pb-0">
              <div className="aspect-[4/3] overflow-hidden rounded-sm bg-gray-100 mb-4">
                <img 
                  src={getArticleImage(article.image)} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={article.title} 
                  onError={handleImageError}
                />
              </div>
              <div className="space-y-2">
                <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{article.category}</div>
                <h5 className="font-bold text-base leading-snug group-hover:text-blue-700 transition-colors line-clamp-2 tracking-tight">
                  {article.title}
                </h5>
                <div className="text-[10px] text-gray-400 font-medium">{article.createdAt}</div>
              </div>
            </Link>
          ))}
        </div>
        {moreArticles.length === 0 && articles.length <= 7 && (
          <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-lg text-gray-300 font-medium">
            콘텐츠를 준비 중입니다.
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
