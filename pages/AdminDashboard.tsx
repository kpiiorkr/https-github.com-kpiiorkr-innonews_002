
import React, { useState, useMemo } from 'react';
import { useApp } from '../store';
import { Article, Category, AdConfig, Reporter } from '../types';
import { Plus, Trash2, Edit2, Settings, FileText, Image as ImageIcon, MessageSquare, Key, LayoutGrid, Users, UserPlus, ArrowUp, ArrowDown, LayoutTemplate, Search, Check, X } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { 
    articles, addArticle, editArticle, updateArticles,
    ads, updateAds, 
    reports, 
    reporters, updateReporters, 
    adminPassword, updateAdminPassword, 
    navCategories, updateNavCategories 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'articles' | 'ads' | 'reports' | 'password' | 'categories' | 'reporters'>('articles');
  const [activeAdSubTab, setActiveAdSubTab] = useState<'sidebar' | 'top' | 'popup' | 'bottom'>('sidebar');

  // Article States
  const [searchTerm, setSearchTerm] = useState('');
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);

  // Layout Slot State
  const [isSlotPickerOpen, setIsSlotPickerOpen] = useState(false);
  const [targetSlotIndex, setTargetSlotIndex] = useState<number | null>(null);

  // Other States
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Partial<AdConfig> | null>(null);
  const [isReporterModalOpen, setIsReporterModalOpen] = useState(false);
  const [editingReporter, setEditingReporter] = useState<Partial<Reporter> | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newPw, setNewPw] = useState('');

  const filteredArticles = useMemo(() => {
    if (!searchTerm.trim()) return articles;
    return articles.filter(a => 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [articles, searchTerm]);

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle?.title || !editingArticle?.reporterId) return alert('제목과 기자를 선택해주세요.');

    if (editingArticle.id) {
      // Update
      const updated = {
        ...editingArticle,
        updatedAt: new Date().toLocaleString()
      } as Article;
      editArticle(updated);
      alert('기사가 성공적으로 수정되었습니다.');
    } else {
      // Add New
      const article = {
        id: Math.random().toString(36).substr(2, 9),
        ...editingArticle,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
      } as Article;
      addArticle(article);
      alert('새 기사가 발행되었습니다.');
    }
    setIsArticleModalOpen(false);
    setEditingArticle(null);
  };

  const assignArticleToSlot = (article: Article) => {
    if (targetSlotIndex === null) return;
    const newArticles = [...articles];
    const currentIndex = newArticles.findIndex(a => a.id === article.id);
    if (currentIndex > -1) {
      const [item] = newArticles.splice(currentIndex, 1);
      newArticles.splice(targetSlotIndex, 0, item);
      updateArticles(newArticles);
    }
    setIsSlotPickerOpen(false);
    setTargetSlotIndex(null);
  };

  const insertImageTag = () => {
    const url = prompt('본문에 삽입할 이미지 주소(URL)를 입력하세요.');
    if (url && url.trim()) {
      setEditingArticle(prev => ({
        ...prev,
        content: (prev?.content || '') + `\n[IMG:${url.trim()}]\n`
      }));
    }
  };

  const handleSaveAd = () => {
    if (!editingAd?.imageUrl || !editingAd?.linkUrl) return alert('이미지 경로와 링크 주소를 입력해주세요.');
    if (editingAd.id) {
      updateAds(ads.map(ad => ad.id === editingAd.id ? { ...ad, ...editingAd } as AdConfig : ad));
    } else {
      const newAd: AdConfig = { id: Math.random().toString(36).substr(2, 9), type: activeAdSubTab, imageUrl: editingAd.imageUrl || '', linkUrl: editingAd.linkUrl || '', isVisible: true };
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
      const newRep: Reporter = { id: Math.random().toString(36).substr(2, 9), name: editingReporter.name || '', role: editingReporter.role || '', photo: editingReporter.photo || 'https://via.placeholder.com/150', email: editingReporter.email || '' };
      updateReporters([...reporters, newRep]);
    }
    setIsReporterModalOpen(false);
    setEditingReporter(null);
  };

  // Fix: Added handleAddCategory function
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return alert('카테고리 이름을 입력하세요.');
    if (navCategories.includes(newCategoryName.trim())) return alert('이미 존재하는 카테고리입니다.');
    updateNavCategories([...navCategories, newCategoryName.trim()]);
    setNewCategoryName('');
  };

  // Fix: Added moveCategory function
  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newCats = [...navCategories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCats.length) return;
    [newCats[index], newCats[targetIndex]] = [newCats[targetIndex], newCats[index]];
    updateNavCategories(newCats);
  };

  // Fix: Added handleDeleteCategory function
  const handleDeleteCategory = (cat: string) => {
    if (confirm(`'${cat}' 카테고리를 삭제하시겠습니까?`)) {
      updateNavCategories(navCategories.filter(c => c !== cat));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen -mx-4 -my-8 p-8 pb-24">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 tracking-tighter uppercase italic">
            <Settings className="text-blue-900" /> Admin Panel
          </h1>
          <button 
            onClick={() => { setEditingArticle({ category: navCategories[0] as Category, reporterId: reporters[0]?.id }); setIsArticleModalOpen(true); }}
            className="bg-blue-900 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:bg-black transition-all"
          >
            <Plus size={20} /> 기사 새로 쓰기
          </button>
        </header>

        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'articles', icon: LayoutTemplate, label: '첫 화면 배치 & 전체 기사' },
            { id: 'reporters', icon: Users, label: '기자 관리' },
            { id: 'categories', icon: LayoutGrid, label: '메뉴 관리' },
            { id: 'ads', icon: ImageIcon, label: '광고 관리' },
            { id: 'reports', icon: MessageSquare, label: '제보 확인' },
            { id: 'password', icon: Key, label: '보안 설정' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all text-sm ${activeTab === tab.id ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:border-blue-200'}`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'articles' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* 1. 첫 화면 슬롯 배치 관리 */}
            <section className="bg-white p-8 rounded-2xl border border-blue-100 shadow-xl ring-1 ring-blue-50">
              <div className="flex items-center gap-2 mb-6">
                <LayoutTemplate className="text-blue-900" size={24} />
                <h2 className="text-xl font-black text-gray-900 uppercase">메인 페이지 슬롯 배치 (Top 7)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {articles.slice(0, 7).map((art, idx) => (
                  <div key={art.id} className={`p-4 border rounded-xl relative group transition-all ${idx === 0 ? 'md:col-span-2 md:row-span-2 bg-blue-50/50 border-blue-200' : 'bg-white border-gray-100'}`}>
                    <div className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${idx === 0 ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {idx + 1}
                    </div>
                    <div className="mt-6">
                      <div className="text-[10px] text-blue-700 font-bold uppercase mb-1">{idx === 0 ? '메인 대형 헤드라인' : idx < 4 ? '사이드 리스트' : '중간 그리드'}</div>
                      <h3 className="font-bold text-sm text-gray-900 line-clamp-2 mb-4 h-10">{art.title}</h3>
                      <button 
                        onClick={() => { setTargetSlotIndex(idx); setIsSlotPickerOpen(true); }}
                        className="w-full py-2 border border-blue-100 rounded-lg text-xs font-bold text-blue-900 hover:bg-blue-900 hover:text-white transition-all bg-white shadow-sm"
                      >
                        기사 변경
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. 전체 기사 관리 & 검색 */}
            <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="text-gray-400" /> 라이브러리 (전체 기사 관리)
                </h2>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="제목 또는 내용 검색..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="divide-y divide-gray-100 border rounded-xl overflow-hidden">
                {filteredArticles.map((art) => (
                  <div key={art.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
                    <img src={art.image} className="w-16 h-10 object-cover rounded bg-gray-100" />
                    <div className="flex-grow min-w-0">
                      <div className="font-bold text-sm text-gray-900 truncate">{art.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-blue-700 uppercase">{art.category}</span>
                        <span className="text-[10px] text-gray-400">{art.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingArticle(art); setIsArticleModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="기사 수정"><Edit2 size={18}/></button>
                      <button onClick={() => { if(confirm('이 기사를 영구적으로 삭제하시겠습니까?')) updateArticles(articles.filter(a => a.id !== art.id)) }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="삭제"><Trash2 size={18}/></button>
                    </div>
                  </div>
                ))}
                {filteredArticles.length === 0 && (
                  <div className="py-20 text-center text-gray-400 font-bold">검색 결과가 없습니다.</div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* 모달: 기사 발행/수정 에디터 */}
        {isArticleModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-gray-900">{editingArticle?.id ? '기사 수정하기' : '새 기사 발행'}</h2>
                <button onClick={() => setIsArticleModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
              </div>
              <form onSubmit={handleSaveArticle} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase text-gray-400">기사 제목</label>
                    <input type="text" required value={editingArticle?.title || ''} onChange={e => setEditingArticle({...editingArticle, title: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-100" placeholder="기사 제목을 입력하세요" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase text-gray-400">카테고리</label>
                    <select value={editingArticle?.category} onChange={e => setEditingArticle({...editingArticle, category: e.target.value as Category})} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-100">
                      {navCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase text-gray-400">메인 썸네일 URL</label>
                    <input type="text" value={editingArticle?.image || ''} onChange={e => setEditingArticle({...editingArticle, image: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-100" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase text-gray-400">담당 기자</label>
                    <select value={editingArticle?.reporterId} onChange={e => setEditingArticle({...editingArticle, reporterId: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-100">
                      {reporters.map(r => <option key={r.id} value={r.id}>{r.name} ({r.role})</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold uppercase text-gray-400">기사 본문</label>
                    <button type="button" onClick={insertImageTag} className="text-[11px] bg-blue-50 text-blue-900 px-3 py-1.5 rounded-md hover:bg-blue-100 flex items-center gap-1.5 border border-blue-200 transition-colors font-bold">
                      <ImageIcon size={14} /> 본문 내 이미지 삽입
                    </button>
                  </div>
                  <textarea required rows={12} value={editingArticle?.content || ''} onChange={e => setEditingArticle({...editingArticle, content: e.target.value})} className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-100 font-light leading-relaxed text-lg" placeholder="내용을 입력하세요..."></textarea>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-grow py-4 bg-blue-900 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-black transition-all">저장 및 발행</button>
                  <button type="button" onClick={() => setIsArticleModalOpen(false)} className="px-8 py-4 border rounded-2xl font-bold hover:bg-gray-50">취소</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 모달: 슬롯 기사 선택기 (Slot Picker) */}
        {isSlotPickerOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{targetSlotIndex! + 1}번 슬롯에 배치할 기사 선택</h2>
                <button onClick={() => { setIsSlotPickerOpen(false); setTargetSlotIndex(null); }} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
              </div>
              <div className="mb-4">
                <input 
                  type="text" placeholder="기사 검색..." 
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="max-h-96 overflow-y-auto divide-y">
                {filteredArticles.map(art => (
                  <button 
                    key={art.id} 
                    onClick={() => assignArticleToSlot(art)}
                    className="w-full p-4 text-left hover:bg-blue-50 transition-colors flex gap-3 items-center"
                  >
                    <img src={art.image} className="w-12 h-12 object-cover rounded" />
                    <div className="min-w-0">
                      <div className="font-bold text-sm truncate">{art.title}</div>
                      <div className="text-[10px] text-gray-400">{art.category} | {art.createdAt}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 기자 관리 탭 */}
        {activeTab === 'reporters' && (
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">기자 정보 관리</h2>
              <button onClick={() => { setEditingReporter({}); setIsReporterModalOpen(true); }} className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><UserPlus size={18} /> 기자 추가</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reporters.map(r => (
                <div key={r.id} className="flex items-center gap-4 p-4 border rounded-xl hover:border-blue-200 transition-colors">
                  <img src={r.photo} alt={r.name} className="w-12 h-12 rounded-full object-cover bg-gray-100" />
                  <div className="flex-grow min-w-0">
                    <div className="font-bold text-gray-900 truncate">{r.name}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">{r.role}</div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingReporter(r); setIsReporterModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => { if(confirm('기자를 삭제하시겠습니까?')) updateReporters(reporters.filter(rep => rep.id !== r.id)) }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 보안 설정 탭 */}
        {activeTab === 'password' && (
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm max-w-md animate-in fade-in duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-900">관리자 보안 설정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">현재 비밀번호</label>
                <div className="p-3 bg-gray-50 border rounded text-gray-400 font-mono">••••••</div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">새 비밀번호</label>
                <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="새로운 패스워드 입력" className="w-full p-3 border rounded-lg outline-none focus:ring-1 focus:ring-blue-900" />
              </div>
              <button onClick={() => { if(newPw.trim()) { updateAdminPassword(newPw.trim()); alert('비밀번호가 성공적으로 변경되었습니다.'); setNewPw(''); } else { alert('비밀번호를 입력해주세요.'); } }} className="w-full py-4 bg-blue-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-colors">비밀번호 업데이트</button>
            </div>
          </div>
        )}

        {/* 카테고리 관리 탭 */}
        {activeTab === 'categories' && (
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm animate-in fade-in duration-300">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">상단 메뉴 구성</h2>
            <div className="flex gap-2 mb-8">
              <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="추가할 메뉴 이름 입력" className="flex-grow p-3 border rounded-lg outline-none" />
              <button onClick={handleAddCategory} className="bg-blue-900 text-white px-6 py-3 rounded-lg font-bold">추가</button>
            </div>
            <div className="space-y-2">
              {navCategories.map((cat, idx) => (
                <div key={cat} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 group">
                  <span className="font-bold text-gray-700">{cat}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => moveCategory(idx, 'up')} disabled={idx === 0} className="p-2 text-gray-400 hover:text-blue-900 disabled:opacity-20 bg-white border rounded"><ArrowUp size={18}/></button>
                    <button onClick={() => moveCategory(idx, 'down')} disabled={idx === navCategories.length - 1} className="p-2 text-gray-400 hover:text-blue-900 disabled:opacity-20 bg-white border rounded"><ArrowDown size={18}/></button>
                    <button onClick={() => handleDeleteCategory(cat)} className="p-2 text-red-400 hover:text-red-600 ml-4 bg-white border rounded"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 광고 관리 탭 */}
        {activeTab === 'ads' && (
           <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm animate-in fade-in duration-300">
             <div className="flex border-b mb-6 overflow-x-auto">
               {['sidebar', 'top', 'popup', 'bottom'].map(t => (
                 <button key={t} onClick={() => setActiveAdSubTab(t as any)} className={`px-6 py-3 text-sm font-bold transition-all whitespace-nowrap ${activeAdSubTab === t ? 'text-blue-900 border-b-4 border-blue-900' : 'text-gray-400 hover:text-gray-600'}`}>
                   {t === 'sidebar' && '우측 사이드'} {t === 'top' && '본문 상단'} {t === 'popup' && '팝업'} {t === 'bottom' && '본문 하단'}
                 </button>
               ))}
             </div>
             <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between">
               <p className="text-sm text-blue-800 font-medium">영역에 적합한 가로/세로 비율의 이미지를 사용해주세요.</p>
               <button onClick={() => { setEditingAd({ type: activeAdSubTab, isVisible: true }); setIsAdModalOpen(true); }} className="bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1"><Plus size={16}/> 광고 추가</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ads.filter(a => a.type === activeAdSubTab).map(ad => (
                  <div key={ad.id} className="flex flex-col border rounded-xl overflow-hidden shadow-sm bg-gray-50 group border-gray-200">
                    <div className="aspect-[21/9] bg-gray-200 relative overflow-hidden"><img src={ad.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /><div className="absolute top-2 right-2 flex gap-1"><button onClick={() => { setEditingAd(ad); setIsAdModalOpen(true); }} className="p-2 bg-white/90 rounded-full shadow hover:bg-white text-blue-600"><Edit2 size={14}/></button><button onClick={() => updateAds(ads.filter(a => a.id !== ad.id))} className="p-2 bg-white/90 rounded-full shadow hover:bg-white text-red-600"><Trash2 size={14}/></button></div></div>
                    <div className="p-4 border-t border-gray-100 text-xs"><span className="text-blue-900 font-bold">연결 링크:</span> {ad.linkUrl}</div>
                  </div>
                ))}
             </div>
           </div>
        )}

        {/* 제보 내역 탭 */}
        {activeTab === 'reports' && (
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm animate-in fade-in duration-300">
            <h2 className="text-xl font-bold mb-6">제보 내역 관리</h2>
            <div className="space-y-4">
              {reports.length > 0 ? reports.map(report => (
                <div key={report.id} className="p-5 border rounded-xl bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3"><h3 className="font-bold text-lg text-gray-900">{report.title}</h3><span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded">{report.submittedAt}</span></div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{report.content}</p>
                  <div className="flex flex-wrap gap-4 text-[11px] font-bold text-gray-500 uppercase tracking-tighter">
                    <span className="text-blue-900">제보자: {report.name}</span><span>연락처: {report.phone}</span><span>이메일: {report.email}</span>
                  </div>
                </div>
              )) : <div className="py-24 text-center border-2 border-dashed rounded-xl text-gray-300 font-bold">수신된 제보가 없습니다.</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
