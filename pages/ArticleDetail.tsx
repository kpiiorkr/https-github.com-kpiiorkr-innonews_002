
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useApp } from '../store';
import { Clock, RefreshCw } from 'lucide-react';
import { TopAd, BottomAd } from '../components/Ads';

const ArticleDetail: React.FC = () => {
  const { id } = useParams();
  const { articles, reporters } = useApp();
  
  const article = articles.find(a => a.id === id);
  if (!article) return <Navigate to="/" />;

  const reporter = reporters.find(r => r.id === article.reporterId);

  // 본문 내 이미지 태그 [IMG:URL]를 실제 img 태그로 변환하여 렌더링하는 함수
  const renderContent = (content: string) => {
    const parts = content.split(/(\[IMG:.*?\])/g);
    return parts.map((part, index) => {
      const imgMatch = part.match(/\[IMG:(.*?)\]/);
      if (imgMatch) {
        const url = imgMatch[1];
        return (
          <div key={index} className="my-8 flex justify-center">
            <img src={url} alt="기사 이미지" className="max-w-full h-auto rounded shadow-md" />
          </div>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <TopAd />

      <header className="mb-8 border-b border-gray-100 pb-8">
        <div className="text-blue-700 font-bold mb-2 uppercase tracking-wide text-sm">{article.category}</div>
        <h1 className="text-4xl font-bold leading-tight mb-6 text-gray-900">{article.title}</h1>
        
        <div className="flex flex-wrap items-center text-gray-400 text-xs gap-6">
          <span className="flex items-center"><Clock size={12} className="mr-1.5" /> 발행: {article.createdAt}</span>
          <span className="flex items-center"><RefreshCw size={12} className="mr-1.5" /> 업데이트: {article.updatedAt}</span>
        </div>
      </header>

      {/* 메인 이미지가 있을 때만 렌더링 */}
      {article.image && article.image.trim() !== '' && (
        <div className="mb-10">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full max-h-[500px] object-cover rounded shadow-sm mb-4"
          />
        </div>
      )}

      <article className="prose prose-blue max-w-none text-gray-800 leading-relaxed text-lg whitespace-pre-wrap mb-16">
        {renderContent(article.content)}
      </article>

      {/* 광고4: 본문 하단 광고 - 다른 요소와 겹치지 않게 명확한 블록 처리 */}
      <div className="relative py-12 border-t border-gray-100">
        <BottomAd />
      </div>

      {/* Reporter Section */}
      <section className="mt-8 pt-10 border-t border-gray-200">
        {reporter ? (
          <div className="bg-gray-50 p-6 flex items-center gap-6 rounded-lg">
            <img 
              src={reporter.photo} 
              alt={reporter.name} 
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm"
            />
            <div>
              <div className="text-xs text-blue-700 font-bold mb-1">{reporter.role}</div>
              <div className="text-xl font-bold text-gray-900 mb-1">{reporter.name} 기자</div>
              <p className="text-sm text-gray-500">{reporter.email || 'process@innonews.co.kr'}</p>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 italic">기자 정보를 불러올 수 없습니다.</div>
        )}
      </section>

      <div className="mt-12 flex justify-center">
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors rounded text-sm font-medium"
        >
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default ArticleDetail;
