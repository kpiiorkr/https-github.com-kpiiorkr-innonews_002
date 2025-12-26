
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useApp } from '../store';
import { Clock, RefreshCw } from 'lucide-react';
import { TopAd } from '../components/Ads';

const ArticleDetail: React.FC = () => {
  const { id } = useParams();
  const { articles, reporters } = useApp();
  
  const article = articles.find(a => a.id === id);
  if (!article) return <Navigate to="/" />;

  const reporter = reporters.find(r => r.id === article.reporterId);

  return (
    <div className="max-w-4xl mx-auto">
      <TopAd />

      <header className="mb-8 border-b border-gray-100 pb-8">
        <div className="text-blue-700 font-bold mb-2 uppercase tracking-wide">{article.category}</div>
        <h1 className="text-4xl font-bold leading-tight mb-6 text-gray-900">{article.title}</h1>
        
        <div className="flex items-center text-gray-500 text-sm space-x-6">
          <span className="flex items-center"><Clock size={14} className="mr-1.5" /> 발행: {article.createdAt}</span>
          <span className="flex items-center"><RefreshCw size={14} className="mr-1.5" /> 업데이트: {article.updatedAt}</span>
        </div>
      </header>

      <div className="mb-10">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full max-h-[500px] object-cover rounded shadow-sm mb-4"
        />
      </div>

      <article className="prose prose-blue max-w-none text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">
        {article.content}
      </article>

      {/* Reporter Section */}
      <section className="mt-16 pt-10 border-t border-gray-200">
        {reporter ? (
          <div className="bg-gray-50 p-6 flex items-center gap-6 rounded-lg">
            <img 
              src={reporter.photo} 
              alt={reporter.name} 
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm"
            />
            <div>
              <div className="text-sm text-blue-700 font-bold mb-1">{reporter.role}</div>
              <div className="text-xl font-bold text-gray-900 mb-1">{reporter.name} 기자</div>
              <p className="text-sm text-gray-500">process@innonews.co.kr</p>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 italic">기자 정보를 불러올 수 없습니다.</div>
        )}
      </section>

      <div className="mt-12 flex justify-center">
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors rounded"
        >
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default ArticleDetail;
