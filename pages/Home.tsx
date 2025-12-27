
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../store';
import { Clock, X } from 'lucide-react';

const HIDE_GLOBAL_KEY = 'innonews_hide_all_until';
const CLOSED_POPUPS_KEY = 'innonews_closed_popups_data';

const Home: React.FC = () => {
  const { articles, ads } = useApp();
  const [showPopup, setShowPopup] = useState(false);
  const [currentPopupIdx, setCurrentPopupIdx] = useState(0);
  const [hideWeekChecked, setHideWeekChecked] = useState(false);

  const mainArticle = articles[0];
  const subArticles = articles.slice(1, 4);
  const listArticles = articles.slice(4);

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

  return (
    <div className="space-y-12 relative">
      {/* 팝업 레이어 생략(기존 유지) */}
      {showPopup && currentPopup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-md w-full relative animate-in zoom-in duration-300">
            <button onClick={handleCloseSinglePopup} className="absolute top-2 right-2 z-10 p-1 bg-black/50 text-white rounded-full"><X size={20} /></button>
            <div className="bg-gray-100 aspect-square overflow-hidden relative">
              <a href={currentPopup.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full group">
                <img src={currentPopup.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </a>
            </div>
            <div className="bg-white px-4 py-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={hideWeekChecked} onChange={handleHideWeekChange} className="w-3.5 h-3.5 accent-blue-900" />
                  <span className="text-[11px] text-gray-500">1주일간 다시 보지 않기</span>
                </label>
                <button onClick={handleCloseSinglePopup} className="text-xs font-bold text-blue-900 underline">닫기</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 group">
          {mainArticle ? (
            <Link to={`/article/${mainArticle.id}`} className="block">
              <div className="relative overflow-hidden mb-4">
                {mainArticle.image && (
                  <img src={mainArticle.image} className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
                <div className="absolute top-4 left-4 bg-blue-700 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  {mainArticle.category}
                </div>
              </div>
              <h2 className="text-3xl font-bold leading-tight group-hover:text-blue-700 transition-colors tracking-tighter">
                {mainArticle.title}
              </h2>
              <p className="mt-3 text-gray-600 line-clamp-3 text-sm font-light leading-relaxed">
                {mainArticle.content.substring(0, 300)}...
              </p>
            </Link>
          ) : (
            <div className="bg-gray-100 aspect-video flex items-center justify-center text-gray-400 italic">게시된 기사가 없습니다.</div>
          )}
        </div>

        <div className="flex flex-col space-y-8">
          {subArticles.map(article => (
            <Link key={article.id} to={`/article/${article.id}`} className="group flex flex-col gap-2">
              {article.image && (
                <div className="w-full aspect-video overflow-hidden">
                  <img src={article.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
              )}
              <div>
                <div className="text-blue-700 text-[10px] font-bold mb-1 uppercase tracking-wider">{article.category}</div>
                <h3 className="font-bold text-base leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-gray-200 pt-10">
        <h3 className="text-xl font-bold mb-6 border-b-2 border-gray-900 inline-block">주요 소식</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {listArticles.map(article => (
            <Link key={article.id} to={`/article/${article.id}`} className="flex gap-4 group">
              {article.image && (
                <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-gray-100">
                  <img src={article.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
              )}
              <div className="flex flex-col justify-center">
                <h4 className="font-bold text-base leading-snug group-hover:text-blue-700 line-clamp-2 mb-1">
                  {article.title}
                </h4>
                <div className="text-[10px] text-gray-400">{article.createdAt}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
