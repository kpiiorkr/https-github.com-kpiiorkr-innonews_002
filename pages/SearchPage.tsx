
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useApp } from '../store';
import { Search, PlayCircle } from 'lucide-react';

const DEFAULT_ARTICLE_IMAGE = 'https://media.istockphoto.com/id/1170028399/vector/white-half-tone-background.jpg?s=612x612&w=0&k=20&c=2L44isbJdJt3LW7yYOhqLLiByWELcujetoXKsx6QVdE=';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const { articles, videos } = useApp();

  const searchResults = articles.filter(article => 
    article.title.toLowerCase().includes(query.toLowerCase()) || 
    article.content.toLowerCase().includes(query.toLowerCase())
  );

  const searchVideos = videos.filter(video => 
    video.title.toLowerCase().includes(query.toLowerCase()) || 
    (video.description && video.description.toLowerCase().includes(query.toLowerCase()))
  );

  const getArticleImage = (url?: string) => {
    return (url && url.trim() !== '') ? url : DEFAULT_ARTICLE_IMAGE;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_ARTICLE_IMAGE;
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="border-b-2 border-blue-900 pb-4 flex items-center gap-3">
        <Search className="text-blue-900" size={32} />
        <h1 className="text-3xl font-bold">
          '<span className="text-blue-700">{query}</span>' 검색 결과
        </h1>
      </div>

      {/* 기사 검색 결과 */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h2 className="text-xl font-bold text-gray-900">기사 ({searchResults.length})</h2>
        </div>
        <div className="space-y-10">
          {searchResults.map(article => (
            <Link key={article.id} to={`/article/${article.id}`} className="flex flex-col md:flex-row gap-6 group">
              <div className="w-full md:w-1/3 aspect-video overflow-hidden rounded shadow-sm bg-gray-100">
                <img 
                  src={getArticleImage(article.image)} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={handleImageError}
                />
              </div>
              <div className="flex-grow space-y-2">
                <div className="text-blue-700 text-xs font-bold uppercase">{article.category}</div>
                <h2 className="text-xl font-bold group-hover:text-blue-700 transition-colors line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
                  {article.content.replace(/\[IMG:.*?\]/g, '')}
                </p>
                <div className="text-xs text-gray-400">{article.createdAt}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 영상 검색 결과 */}
      {searchVideos.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-gray-200">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h2 className="text-xl font-bold text-gray-900">영상 뉴스 ({searchVideos.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {searchVideos.map(video => {
              const ytId = getYoutubeId(video.youtubeUrl);
              const thumbUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
              return (
                <Link key={video.id} to="/videos" className="group">
                  <div className="aspect-video bg-black rounded overflow-hidden relative mb-2 shadow-sm">
                    <img src={thumbUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <PlayCircle className="text-white opacity-80" size={40} />
                    </div>
                  </div>
                  <h3 className="font-bold text-sm line-clamp-2 group-hover:text-blue-700">{video.title}</h3>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {searchResults.length === 0 && searchVideos.length === 0 && (
        <div className="py-24 text-center">
          <Search size={64} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold text-xl">검색 결과가 없습니다.</p>
          <p className="text-gray-400 mt-2">다른 검색어로 다시 시도해보세요.</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
