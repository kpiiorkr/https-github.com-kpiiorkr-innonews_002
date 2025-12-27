
import React, { useState } from 'react';
import { useApp } from '../store';
import { Article, Category, AdConfig } from '../types';
import { Plus, Trash2, Edit2, Settings, FileText, Image as ImageIcon, MessageSquare, Key, LayoutGrid, ExternalLink, X, Check, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { articles, addArticle, ads, updateAds, reports, reporters, adminPassword, updateAdminPassword, navCategories, updateNavCategories } = useApp();
  const [activeTab, setActiveTab] = useState<'articles' | 'ads' | 'reports' | 'password' | 'categories'>('articles');
  const [activeAdSubTab, setActiveAdSubTab] = useState<'sidebar' | 'top' | 'popup'>('sidebar');
  const navigate = useNavigate();

  // 광고 편집 상태
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Partial<AdConfig> | null>(null);

  // 비밀번호 변경 상태
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  
  // 카테고리 편집 상태
  const [editCats, setEditCats] = useState([...navCategories]);

  const [newArticle, setNewArticle] = useState({
    title: '',
    category: '기술' as Category,
    content: '',
    image: '',
    reporterId: 'rep1'
  });

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const article = {
      id: Math.random().toString(36).substr(2, 9),
      ...newArticle,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
    };
    addArticle(article as any);
    setNewArticle({ title: '', category: '기술', content: '', image: '', reporterId: 'rep1' });
    alert('기사가 등록되었습니다.');
  };

  const handleSaveAd = () => {
    if (!editingAd?.imageUrl || !editingAd?.linkUrl) return alert('이미지 경로와 링크 주소를 입력해주세요.');

    if (editingAd.id) {
      // 수정
      const newAds = ads.map(ad => ad.id === editingAd.id ? { ...ad, ...editingAd } as AdConfig : ad);
      updateAds(newAds);
    } else {
      // 추가 (최대 5개 체크)
      const currentTypeAds = ads.filter(ad => ad.type === activeAdSubTab);
      if (currentTypeAds.length >= 5) return alert('유형별 광고는 최대 5개까지만 등록 가능합니다.');

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

  const handleDeleteAd = (id: string) => {
    if (confirm('이 광고를 삭제하시겠습니까?')) {
      updateAds(ads.filter(ad => ad.id !== id));
    }
  };

  const handleToggleAdVisibility = (id: string) => {
    updateAds(ads.map(ad => ad.id === id ? { ...ad, isVisible: !ad.isVisible } : ad));
  };

  const handlePwChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.current !== adminPassword) return alert('현재 비밀번호가 일치하지 않습니다.');
    if (pwForm.next !== pwForm.confirm) return alert('새 비밀번호 확인이 일치하지 않습니다.');
    updateAdminPassword(pwForm.next);
    setPwForm({ current: '', next: '', confirm: '' });
    alert('비밀번호가 성공적으로 변경되었습니다.');
  };

  const handleUpdateCats = () => {
    updateNavCategories(editCats.filter(c => c.trim() !== ''));
    alert('메뉴 구성이 저장되었습니다.');
  };

  return (
    <div className="bg-gray-50 min-h-screen -mx-4 -my-8 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="text-blue-900" /> 관리자 대시보드
          </h1>
        </header>

        <div className="flex flex-wrap gap-2 mb-8">
          <button 
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all text-sm ${activeTab === 'articles' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
          >
            <FileText size={16} /> 기사 관리
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all text-sm ${activeTab === 'categories' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
          >
            <LayoutGrid size={16} /> 메뉴 관리
          </button>
          <button 
            onClick={() => setActiveTab('ads')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all text-sm ${activeTab === 'ads' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
          >
            <ImageIcon size={16} /> 광고 관리
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all text-sm ${activeTab === 'reports' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
          >
            <MessageSquare size={16} /> 제보 내역 ({reports.length})
          </button>
          <button 
            onClick={() => setActiveTab('password')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all text-sm ${activeTab === 'password' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
          >
            <Key size={16} /> 비밀번호 변경
          </button>
          <button 
            onClick={() => navigate('/videos')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 text-sm"
          >
            <ExternalLink size={16} /> 영상 메뉴 바로가기
          </button>
        </div>

        {/* 광고 관리 탭 */}
        {activeTab === 'ads' && (
          <div className="space-y-6">
            <div className="flex border-b border-gray-200 bg-white rounded-t-xl">
              <button 
                onClick={() => setActiveAdSubTab('sidebar')}
                className={`px-6 py-3 font-bold text-sm ${activeAdSubTab === 'sidebar' ? 'text-blue-900 border-b-2 border-blue-900' : 'text-gray-400'}`}
              >광고1. 우측 세로</button>
              <button 
                onClick={() => setActiveAdSubTab('top')}
                className={`px-6 py-3 font-bold text-sm ${activeAdSubTab === 'top' ? 'text-blue-900 border-b-2 border-blue-900' : 'text-gray-400'}`}
              >광고2. 상단 가로</button>
              <button 
                onClick={() => setActiveAdSubTab('popup')}
                className={`px-6 py-3 font-bold text-sm ${activeAdSubTab === 'popup' ? 'text-blue-900 border-b-2 border-blue-900' : 'text-gray-400'}`}
              >광고3. 그리드 팝업</button>
            </div>

            <div className="bg-white p-6 rounded-b-xl border border-t-0 border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">
                  {activeAdSubTab === 'sidebar' && '화면 우측 세로 광고 관리'}
                  {activeAdSubTab === 'top' && '게시물 상단 가로 광고 관리'}
                  {activeAdSubTab === 'popup' && '첫 화면 그리드 팝업 광고 관리'}
                  <span className="ml-2 text-sm font-normal text-gray-400">({ads.filter(ad => ad.type === activeAdSubTab).length}/5)</span>
                </h3>
                <button 
                  onClick={() => {
                    setEditingAd({ type: activeAdSubTab, isVisible: true });
                    setIsAdModalOpen(true);
                  }}
                  className="bg-blue-900 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-bold"
                >
                  <Plus size={16} /> 광고 추가
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {ads.filter(ad => ad.type === activeAdSubTab).map(ad => (
                  <div key={ad.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    <img src={ad.imageUrl} alt="Ad Preview" className="w-20 h-20 object-cover bg-gray-100 rounded border" />
                    <div className="flex-grow">
                      <div className="font-bold text-sm truncate max-w-xs">{ad.linkUrl}</div>
                      <div className={`text-xs mt-1 ${ad.isVisible ? 'text-green-600' : 'text-gray-400'}`}>
                        {ad.isVisible ? '노출 중' : '숨김 상태'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleToggleAdVisibility(ad.id)} className="p-2 text-gray-500 hover:bg-white rounded border">
                        {ad.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button 
                        onClick={() => {
                          setEditingAd(ad);
                          setIsAdModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-white rounded border"
                      ><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteAd(ad.id)} className="p-2 text-red-600 hover:bg-white rounded border"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
                {ads.filter(ad => ad.type === activeAdSubTab).length === 0 && (
                  <div className="text-center py-10 text-gray-400 italic border-2 border-dashed rounded-lg">등록된 광고가 없습니다.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 광고 편집 모달 */}
        {isAdModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl">
              <h2 className="text-xl font-bold mb-6">{editingAd?.id ? '광고 수정' : '새 광고 등록'}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1">이미지 URL</label>
                  <input 
                    type="text" value={editingAd?.imageUrl || ''} onChange={e => setEditingAd({...editingAd, imageUrl: e.target.value})}
                    className="w-full p-2 border rounded" placeholder="https://..."
                  />
                  {editingAd?.imageUrl && (
                    <img src={editingAd.imageUrl} className="mt-2 w-full h-32 object-contain bg-gray-50 border rounded" alt="Preview" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">링크 주소</label>
                  <input 
                    type="text" value={editingAd?.linkUrl || ''} onChange={e => setEditingAd({...editingAd, linkUrl: e.target.value})}
                    className="w-full p-2 border rounded" placeholder="https://..."
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button onClick={handleSaveAd} className="flex-grow py-3 bg-blue-900 text-white font-bold rounded flex items-center justify-center gap-2">
                    <Check size={18} /> 저장하기
                  </button>
                  <button onClick={() => setIsAdModalOpen(false)} className="px-6 py-3 border rounded font-bold">취소</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 나머지 탭들은 기존 코드 유지 (Articles, Categories, Reports, Password) */}
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
                      {navCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <LayoutGrid size={20} className="text-blue-600" /> 상단 메뉴(카테고리) 관리
            </h2>
            <div className="space-y-3 mb-6">
              {editCats.map((cat, idx) => (
                <div key={idx} className="flex gap-2">
                  <input 
                    type="text" value={cat} onChange={(e) => {
                      const updated = [...editCats];
                      updated[idx] = e.target.value;
                      setEditCats(updated);
                    }}
                    className="flex-grow p-2 border rounded"
                  />
                  <button onClick={() => setEditCats(prev => prev.filter((_, i) => i !== idx))} className="text-red-500 p-2"><Trash2 size={18} /></button>
                </div>
              ))}
              <button 
                onClick={() => setEditCats(prev => [...prev, ''])}
                className="w-full py-2 border-2 border-dashed border-gray-200 text-gray-400 rounded hover:bg-gray-50"
              >
                + 메뉴 추가
              </button>
            </div>
            <button onClick={handleUpdateCats} className="w-full py-3 bg-blue-900 text-white font-bold rounded">메뉴 구성 저장</button>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Key size={20} className="text-blue-600" /> 관리자 비밀번호 변경
            </h2>
            <form onSubmit={handlePwChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">현재 비밀번호</label>
                <input type="password" required value={pwForm.current} onChange={e => setPwForm({...pwForm, current: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">새 비밀번호</label>
                <input type="password" required value={pwForm.next} onChange={e => setPwForm({...pwForm, next: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">새 비밀번호 확인</label>
                <input type="password" required value={pwForm.confirm} onChange={e => setPwForm({...pwForm, confirm: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <button type="submit" className="w-full py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700">비밀번호 변경 저장</button>
            </form>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold mb-6">제보 수신함</h2>
            <div className="space-y-4">
              {reports.length === 0 ? (
                <div className="text-center py-20 text-gray-400 italic">도착한 제보가 없습니다.</div>
              ) : (
                reports.map(report => (
                  <div key={report.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-base">{report.title}</h4>
                      <span className="text-xs text-gray-400">{report.submittedAt}</span>
                    </div>
                    <div className="text-gray-600 mb-4 whitespace-pre-wrap">{report.content}</div>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <div>제보자: {report.name} ({report.email} / {report.phone})</div>
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
