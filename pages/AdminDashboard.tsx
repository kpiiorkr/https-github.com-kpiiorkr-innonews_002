
import React, { useState } from 'react';
import { useApp } from '../store';
import { Article, Category, Video, AdConfig } from '../types';
import { Plus, Trash2, Edit2, Settings, FileText, Video as VideoIcon, Image as ImageIcon, MessageSquare } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { articles, addArticle, videos, updateVideos, ads, updateAds, reports, reporters } = useApp();
  const [activeTab, setActiveTab] = useState<'articles' | 'videos' | 'ads' | 'reports'>('articles');

  const [newArticle, setNewArticle] = useState({
    title: '',
    category: '기술' as Category,
    content: '',
    image: '',
    reporterId: 'rep1'
  });

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const article: Article = {
      id: Math.random().toString(36).substr(2, 9),
      ...newArticle,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
    };
    addArticle(article);
    setNewArticle({ title: '', category: '기술', content: '', image: '', reporterId: 'rep1' });
    alert('기사가 등록되었습니다.');
  };

  return (
    <div className="bg-gray-50 min-h-screen -mx-4 -my-8 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="text-blue-900" /> 관리자 대시보드
          </h1>
        </header>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'articles' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
          >
            <FileText size={18} /> 기사 관리
          </button>
          <button 
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'videos' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
          >
            <VideoIcon size={18} /> 영상 관리
          </button>
          <button 
            onClick={() => setActiveTab('ads')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'ads' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
          >
            <ImageIcon size={18} /> 광고 관리
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'reports' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
          >
            <MessageSquare size={18} /> 제보 내역 ({reports.length})
          </button>
        </div>

        {/* Article Management */}
        {activeTab === 'articles' && (
          <div className="space-y-8">
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus size={20} className="text-blue-600" /> 새 기사 등록
              </h2>
              <form onSubmit={handleAddArticle} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">제목</label>
                    <input 
                      type="text" required value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})}
                      className="w-full p-2 border rounded border-gray-300" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">카테고리</label>
                    <select 
                      value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as Category})}
                      className="w-full p-2 border rounded border-gray-300"
                    >
                      <option value="오피니언">오피니언</option>
                      <option value="기술">기술</option>
                      <option value="경영">경영</option>
                      <option value="사회">사회</option>
                      <option value="문화">문화</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">이미지 URL</label>
                  <input 
                    type="text" placeholder="https://..." value={newArticle.image} onChange={e => setNewArticle({...newArticle, image: e.target.value})}
                    className="w-full p-2 border rounded border-gray-300" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">기자 선택</label>
                  <select 
                    value={newArticle.reporterId} onChange={e => setNewArticle({...newArticle, reporterId: e.target.value})}
                    className="w-full p-2 border rounded border-gray-300"
                  >
                    {reporters.map(r => <option key={r.id} value={r.id}>{r.name} ({r.role})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">본문 내용</label>
                  <textarea 
                    required rows={10} value={newArticle.content} onChange={e => setNewArticle({...newArticle, content: e.target.value})}
                    className="w-full p-2 border rounded border-gray-300"
                  ></textarea>
                </div>
                <button type="submit" className="w-full py-3 bg-blue-700 text-white font-bold rounded hover:bg-blue-800">기사 발행하기</button>
              </form>
            </section>

            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6">기사 목록</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">제목</th>
                      <th className="p-3 text-left">카테고리</th>
                      <th className="p-3 text-left">발행일</th>
                      <th className="p-3 text-center">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {articles.map(article => (
                      <tr key={article.id} className="hover:bg-gray-50">
                        <td className="p-3 font-medium">{article.title}</td>
                        <td className="p-3 text-blue-600 font-bold">{article.category}</td>
                        <td className="p-3 text-gray-500">{article.createdAt}</td>
                        <td className="p-3">
                          <div className="flex justify-center gap-2">
                            <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                            <button className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* Video Management */}
        {activeTab === 'videos' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold mb-6">영상 뉴스 관리</h2>
            <p className="text-sm text-gray-500 mb-8">유튜브 링크와 썸네일 설정을 관리합니다.</p>
            {/* Simple Mock list - UI only for demonstration */}
            <div className="grid grid-cols-1 gap-6">
              {videos.map(v => (
                <div key={v.id} className="flex gap-4 p-4 border rounded-lg items-center">
                  <div className="w-40 aspect-video bg-black flex items-center justify-center text-white text-[10px]">Thumbnail</div>
                  <div className="flex-grow">
                    <div className="font-bold">{v.title}</div>
                    <div className="text-xs text-blue-600 truncate">{v.youtubeUrl}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-gray-100 text-sm rounded">수정</button>
                    <button className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded">삭제</button>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-400 rounded-lg hover:bg-gray-50">+ 새 영상 추가</button>
            </div>
          </div>
        )}

        {/* Ads Management */}
        {activeTab === 'ads' && (
          <div className="space-y-8">
            {ads.map(ad => (
              <div key={ad.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  {ad.type === 'sidebar' ? '사이드바 세로 광고' : '상단 배너 광고'}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${ad.isVisible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {ad.isVisible ? '활성' : '비활성'}
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-1">이미지 URL</label>
                    <input type="text" defaultValue={ad.imageUrl} className="w-full p-2 border rounded text-sm mb-3" />
                    <label className="block text-sm mb-1">링크 연결 주소</label>
                    <input type="text" defaultValue={ad.linkUrl} className="w-full p-2 border rounded text-sm" />
                  </div>
                  <div className="flex items-center justify-center bg-gray-100 border rounded min-h-[100px]">
                    <img src={ad.imageUrl} alt="preview" className="max-h-full max-w-full object-contain" />
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button className="px-4 py-2 bg-blue-900 text-white rounded text-sm font-bold">설정 저장</button>
                  <button className={`px-4 py-2 rounded text-sm font-bold ${ad.isVisible ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                    {ad.isVisible ? '광고 중단' : '광고 시작'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reports Management */}
        {activeTab === 'reports' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold mb-6">제보 수신함</h2>
            <div className="space-y-4">
              {reports.length === 0 ? (
                <div className="text-center py-20 text-gray-400 italic">도착한 제보가 없습니다.</div>
              ) : (
                reports.map(report => (
                  <div key={report.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg">{report.title}</h4>
                      <span className="text-xs text-gray-400">{report.submittedAt}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-4 line-clamp-2">{report.content}</div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex gap-4">
                        <span className="font-bold">제보자: {report.name}</span>
                        <span>{report.email} / {report.phone}</span>
                      </div>
                      {report.fileName && (
                        <div className="text-blue-600 bg-blue-50 px-2 py-1 rounded">첨부: {report.fileName}</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
