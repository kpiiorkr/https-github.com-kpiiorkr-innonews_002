
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../store';
import { Category } from '../types';
import { TopAd } from '../components/Ads';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams();
  const { articles } = useApp();
  
  const filteredArticles = categoryName === '최신기사' 
    ? articles 
    : articles.filter(a => a.category === categoryName as Category);

  return (
    <div>
      <TopAd />
      <div className="mb-8 border-b border-gray-900 pb-2">
        <h1 className="text-3xl font-bold">{categoryName}</h1>
      </div>

      <div className="space-y-10">
        {filteredArticles.map(article => (
          <Link key={article.id} to={`/article/${article.id}`} className="flex flex-col md:flex-row gap-6 group">
            <div className="w-full md:w-1/3 aspect-video bg-gray-100 overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="w-full md:w-2/3 flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-700 transition-colors">
                {article.title}
              </h2>
              <p className="text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                {article.content}
              </p>
              <div className="text-sm text-gray-400">
                {article.createdAt}
              </div>
            </div>
          </Link>
        ))}
        {filteredArticles.length === 0 && (
          <div className="py-20 text-center text-gray-400">해당 카테고리에 등록된 기사가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
