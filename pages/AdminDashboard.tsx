
import React, { useState } from 'react';
import { useApp } from '../store';
import { Article, Category, AdConfig, Reporter } from '../types';
import { Plus, Trash2, Edit2, Settings, FileText, Image as ImageIcon, MessageSquare, Key, LayoutGrid, ExternalLink, X, Check, Eye, EyeOff, Users, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { articles, addArticle, ads, updateAds, reports, reporters, updateReporters, adminPassword, updateAdminPassword, navCategories, updateNavCategories } = useApp();
  const [activeTab, setActiveTab] = useState<'articles' | 'ads' | 'reports' | 'password' | 'categories' | 'reporters'>('articles');
  const [activeAdSubTab, setActiveAdSubTab] = useState<'sidebar' | 'top' | 'popup' | 'bottom'>('sidebar');
  const navigate = useNavigate();

  // 광고 편집 상태
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Partial<AdConfig> | null>(null);

  // 기자 편집 상태
  const [isReporterModalOpen, setIsReporterModalOpen] = useState(false);
  const [editingReporter, setEditingReporter] = useState<Partial<Reporter> | null>(null);

  const [newArticle, setNewArticle] = useState({
    title: '',
    category: '기술' as Category,
    content: '',
    image: '',
    reporterId: reporters[0]?.id || ''
  });

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.reporterId) return alert('기자를 선택해주세요.');
    const article = {
      id: Math.random().toString(36).substr(2, 9),
      ...newArticle,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
    };
    addArticle(article as any);
    setNewArticle({ title: '', category: '기술', content: '', image: '', reporterId: reporters[0]?.id || '' });
    alert('기사가 등록되었습니다.');
  };

  const insertImageTag = () => {
    const url = prompt('이미지 URL을 입력하세요 (Cloudinary 등):');
    if (url) {
      setNewArticle(prev => ({
        ...prev,
        content: prev.content + `\n[IMG:${url}]\n`
      }));
    }
  };

  const handleSaveAd = () => {
    if (!editingAd?.imageUrl || !editingAd?.linkUrl) return alert('이미지 경로와 링크 주소를 입력해주세요.');

    if (editingAd.id) {
      const newAds = ads.map(ad => ad.id === editingAd.id ? { ...ad, ...editingAd } as AdConfig : ad);
      updateAds(newAds);
    } else {
      const newAd: AdConfig = {
        id: Math.random().toString(36).substr(2, 9),
        type: activeAdSubTab,
        imageUrl: editingAd.imageUrl || '',
        linkUrl: editingAd.linkUrl || '',
        isVisible: true
      };
      updateAds([...ads, newAd]);
    }
    setIsAdModalOpen(false);
    setEditingAd(null);
  };

  const handleSaveReporter = () => {
    if (!editingReporter?.name || !editingReporter?.role) return alert('이름과 역할을 입력해주세요.');
    if (editingReporter.id) {
      updateReporters(reporters.map(r => r.id === editingReporter.id ? { ...r, ...editingReporter } as Reporter : r));
    } else {
      const newRep: Reporter = {
        id: Math.random().toString(36).substr(2, 9),
        name: editingReporter.name || '',
        role: editingReporter.role || '',
        photo: editingReporter.photo || 'https://via.placeholder.com/150',
        // Added email support in save logic
        email: editingReporter.email || ''
      };
      updateReporters([...reporters, newRep]);
    }
    setIsReporterModalOpen(false);
    setEditingReporter(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen -mx-4 -my-8 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 tracking-tighter">
            <Settings className="text-blue-900" /> 관리자 대시보드
          </h1>
        </header>

        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setActiveTab('articles')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all text-xs ${activeTab === 'articles' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200'}`}>
            <FileText size={14} /> 기사 관리
          </button>
          <button onClick={() => setActiveTab('reporters')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all text-xs ${activeTab === 'reporters' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200'}`}>
            <Users size={14} /> 기자 관리
          </button>
          <button onClick={() => setActiveTab('categories')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all text-xs ${activeTab === 'categories' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200'}`}>
            <LayoutGrid size={14} /> 메뉴 관리
          </button>
          <button onClick={() => setActiveTab('ads')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all text-xs ${activeTab === 'ads' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200'}`}>
            <ImageIcon size={14} /> 광고 관리
          </button>
          <button onClick={() => setActiveTab('reports')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all text-xs ${activeTab === 'reports' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200'}`}>
            <MessageSquare size={14} /> 제보 내역
          </button>
          <button onClick={() => setActiveTab('password')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all text-xs ${activeTab === 'password' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200'}`}>
            <Key size={14} /> 비밀번호
          </button>
        </div>

        {/* 기자 관리 탭 */}
        {activeTab === 'reporters' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">기자 정보 관리</h2>
              <button onClick={() => { setEditingReporter({}); setIsReporterModalOpen(true); }} className="bg-blue-900 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-1">
                <UserPlus size={14} /> 기자 추가
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reporters.map(r => (
                <div key={r.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img src={r.photo} alt={r.name} className="w-12 h-12 rounded-full object-cover bg-gray-100" />
                  <div className="flex-grow">
                    <div className="font-bold text-sm">{r.name}</div>
                    <div className="text-xs text-gray-400">{r.role}</div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingReporter(r); setIsReporterModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={14} /></button>
                    <button onClick={() => { if(confirm('삭제하시겠습니까?')) updateReporters(reporters.filter(rep => rep.id !== r.id)) }} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 기사 관리 탭 */}
        {activeTab === 'articles' && (
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">새 기사 등록</h2>
            <form onSubmit={handleAddArticle} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">제목</label>
                  <input type="text" required value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} className="w-full p-2 border rounded text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">카테고리</label>
                  <select value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as Category})} className="w-full p-2 border rounded text-sm">
                    {navCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">메인 이미지 URL (비워두면 표시 안됨)</label>
                <input type="text" placeholder="https://..." value={newArticle.image} onChange={e => setNewArticle({...newArticle, image: e.target.value})} className="w-full p-2 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">담당 기자</label>
                <select value={newArticle.reporterId} onChange={e => setNewArticle({...newArticle, reporterId: e.target.value})} className="w-full p-2 border rounded text-sm">
                  <option value="">선택하세요</option>
                  {reporters.map(r => <option key={r.id} value={r.id}>{r.name} ({r.role})</option>)}
                </select>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold">본문 내용</label>
                  <button type="button" onClick={insertImageTag} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 flex items-center gap-1 border">
                    <ImageIcon size={12} /> 본문 내 이미지 삽입
                  </button>
                </div>
                <textarea required rows={12} value={newArticle.content} onChange={e => setNewArticle({...newArticle, content: e.target.value})} className="w-full p-2 border rounded text-sm font-light leading-relaxed"></textarea>
                <p className="text-[10px] text-gray-400 mt-1">※ [IMG:URL] 형식으로 이미지가 본문에 삽입됩니다.</p>
              </div>
              <button type="submit" className="w-full py-3 bg-blue-900 text-white font-bold rounded">기사 발행</button>
            </form>
          </section>
        )}

        {/* 기자 모달 */}
        {isReporterModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-2xl">
              <h2 className="text-lg font-bold mb-4">{editingReporter?.id ? '기자 정보 수정' : '새 기자 등록'}</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold mb-1">이름</label>
                  <input type="text" value={editingReporter?.name || ''} onChange={e => setEditingReporter({...editingReporter, name: e.target.value})} className="w-full p-2 border rounded text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">소속 및 직함</label>
                  <input type="text" value={editingReporter?.role || ''} onChange={e => setEditingReporter({...editingReporter, role: e.target.value})} className="w-full p-2 border rounded text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">프로필 이미지 URL</label>
                  <input type="text" value={editingReporter?.photo || ''} onChange={e => setEditingReporter({...editingReporter, photo: e.target.value})} className="w-full p-2 border rounded text-sm" />
                </div>
                {/* Added Email Input field in the modal */}
                <div>
                  <label className="block text-xs font-bold mb-1">이메일</label>
                  <input type="text" value={editingReporter?.email || ''} onChange={e => setEditingReporter({...editingReporter, email: e.target.value})} className="w-full p-2 border rounded text-sm" />
                </div>
                <div className="flex gap-2 pt-4">
                  <button onClick={handleSaveReporter} className="flex-grow py-2 bg-blue-900 text-white font-bold rounded text-sm">저장</button>
                  <button onClick={() => setIsReporterModalOpen(false)} className="px-4 py-2 border rounded text-sm">취소</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 광고/비밀번호/기타 탭 생략(기존 유지) */}
        {activeTab === 'ads' && (
           <div className="bg-white p-6 rounded-xl border border-gray-200">
             <div className="flex border-b mb-4">
               {['sidebar', 'top', 'popup', 'bottom'].map(t => (
                 <button key={t} onClick={() => setActiveAdSubTab(t as any)} className={`px-4 py-2 text-xs font-bold ${activeAdSubTab === t ? 'text-blue-900 border-b-2 border-blue-900' : 'text-gray-400'}`}>
                   {t === 'sidebar' && '우측'} {t === 'top' && '상단'} {t === 'popup' && '팝업'} {t === 'bottom' && '본문하단'}
                 </button>
               ))}
             </div>
             <button onClick={() => { setEditingAd({ type: activeAdSubTab, isVisible: true }); setIsAdModalOpen(true); }} className="mb-4 bg-blue-900 text-white px-3 py-1.5 rounded text-xs">광고 추가</button>
             <div className="space-y-2">
                {ads.filter(a => a.type === activeAdSubTab).map(ad => (
                  <div key={ad.id} className="flex items-center gap-4 p-3 border rounded text-xs">
                    <img src={ad.imageUrl} className="w-10 h-10 object-cover" />
                    <span className="flex-grow truncate">{ad.linkUrl}</span>
                    <button onClick={() => updateAds(ads.filter(a => a.id !== ad.id))} className="text-red-500"><Trash2 size={14}/></button>
                  </div>
                ))}
             </div>
           </div>
        )}

        {isAdModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-2xl">
              <h2 className="text-lg font-bold mb-4">광고 설정</h2>
              <div className="space-y-3 text-sm">
                <input type="text" placeholder="이미지 URL" value={editingAd?.imageUrl || ''} onChange={e => setEditingAd({...editingAd, imageUrl: e.target.value})} className="w-full p-2 border rounded" />
                <input type="text" placeholder="링크 URL" value={editingAd?.linkUrl || ''} onChange={e => setEditingAd({...editingAd, linkUrl: e.target.value})} className="w-full p-2 border rounded" />
                <div className="flex gap-2 pt-2">
                  <button onClick={handleSaveAd} className="flex-grow py-2 bg-blue-900 text-white font-bold rounded">저장</button>
                  <button onClick={() => setIsAdModalOpen(false)} className="px-4 py-2 border rounded">취소</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;