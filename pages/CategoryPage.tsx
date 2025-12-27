
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../store';
import { Category } from '../types';
import { TopAd } from '../components/Ads';

const DEFAULT_ARTICLE_IMAGE = 'https://media.istockphoto.com/id/1170028399/vector/white-half-tone-background.jpg?s=612x612&w=0&k=20&c=2L44isbJdJt3LW7yYOhqLLiByWELcujetoXKsx6QVdE=';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams();
  const { articles } = useApp();
  
  const filteredArticles = categoryName === '최신기사' 
    ? articles 
    : articles.filter(a => a.category === categoryName as Category);

  const getArticleImage = (url?: string) => {
    return (url && url.trim() !== '') ? url : DEFAULT_ARTICLE_IMAGE;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_ARTICLE_IMAGE;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <TopAd />
      <div className="mb-12 border-b-4 border-blue-900 pb-4">
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">{categoryName}</h1>
      </div>

      <div className="space-y-12">
        {filteredArticles.map(article => (
          <Link key={article.id} to={`/article/${article.id}`} className="flex flex-col md:flex-row gap-8 group">
            <div className="w-full md:w-2/5 aspect-video bg-gray-100 overflow-hidden rounded-sm shadow-sm">
              <img 
                src={getArticleImage(article.image)} 
                alt={article.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={handleImageError}
              />
            </div>
            <div className="w-full md:w-3/5 flex flex-col justify-center space-y-4">
              <div className="text-blue-700 text-xs font-bold uppercase tracking-widest">{article.category}</div>
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors tracking-tighter leading-tight">
                {article.title}
              </h2>
              <p className="text-gray-600 line-clamp-2 leading-relaxed font-light">
                {article.content.replace(/\[IMG:.*?\]/g, '')}
              </p>
              <div className="text-xs text-gray-400 font-medium">
                {article.createdAt}
              </div>
            </div>
          </Link>
        ))}
        {filteredArticles.length === 0 && (
          <div className="py-24 text-center text-gray-300 font-bold border-2 border-dashed rounded-lg">해당 카테고리에 등록된 기사가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
