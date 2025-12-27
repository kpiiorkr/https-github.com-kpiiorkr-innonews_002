
import React, { useState } from 'react';
import { useApp } from '../store';
import { Article, Category, AdConfig, Reporter } from '../types';
import { Plus, Trash2, Edit2, Settings, FileText, Image as ImageIcon, MessageSquare, Key, LayoutGrid, Users, UserPlus, ArrowUp, ArrowDown } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { 
    articles, addArticle, updateArticles,
    ads, updateAds, 
    reports, 
    reporters, updateReporters, 
    adminPassword, updateAdminPassword, 
    navCategories, updateNavCategories 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'articles' | 'ads' | 'reports' | 'password' | 'categories' | 'reporters'>('articles');
  const [activeAdSubTab, setActiveAdSubTab] = useState<'sidebar' | 'top' | 'popup' | 'bottom'>('sidebar');

  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Partial<AdConfig> | null>(null);

  const [isReporterModalOpen, setIsReporterModalOpen] = useState(false);
  const [editingReporter, setEditingReporter] = useState<Partial<Reporter> | null>(null);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newPw, setNewPw] = useState('');

  const [newArticle, setNewArticle] = useState({
    title: '',
    category: navCategories[0] as Category,
    content: '',
    image: '',
    reporterId: reporters[0]?.id || ''
  });

  const moveArticle = (index: number, direction: 'up' | 'down') => {
    const newArticles = [...articles];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newArticles.length) return;
    
    [newArticles[index], newArticles[targetIndex]] = [newArticles[targetIndex], newArticles[index]];
    updateArticles(newArticles);
  };

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
    setNewArticle({ title: '', category: navCategories[0] as Category, content: '', image: '', reporterId: reporters[0]?.id || '' });
    alert('기사가 등록되었습니다. 순서 조정을 통해 배치를 변경하세요.');
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    if (navCategories.includes(newCategoryName)) return alert('이미 존재하는 메뉴입니다.');
    updateNavCategories([...navCategories, newCategoryName.trim()]);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (cat: string) => {
    if (confirm(`'${cat}' 메뉴를 삭제하시겠습니까?`)) {
      updateNavCategories(navCategories.filter(c => c !== cat));
    }
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newCats = [...navCategories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCats.length) return;
    [newCats[index], newCats[targetIndex]] = [newCats[targetIndex], newCats[index]];
    updateNavCategories(newCats);
  };

  const insertImageTag = () => {
    const url = prompt('본문에 삽입할 이미지 주소(URL)를 입력하세요.\n(예: https://example.com/image.jpg)');
    if (url && url.trim()) {
      setNewArticle(prev => ({
        ...prev,
        content: prev.content + `\n[IMG:${url.trim()}]\n`
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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 tracking-tighter uppercase italic">
            <Settings className="text-blue-900" /> Admin Panel
          </h1>
        </header>

        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'articles', icon: FileText, label: '기사 & 배치' },
            { id: 'reporters', icon: Users, label: '기자 관리' },
            { id: 'categories', icon: LayoutGrid, label: '메뉴 관리' },
            { id: 'ads', icon: ImageIcon, label: '광고 관리' },
            { id: 'reports', icon: MessageSquare, label: '제보 확인' },
            { id: 'password', icon: Key, label: '보안 설정' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all text-sm ${activeTab === tab.id ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:border-blue-200'}`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* 기자 관리 탭 복원 */}
        {activeTab === 'reporters' && (
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">기자 정보 관리</h2>
              <button 
                onClick={() => { setEditingReporter({}); setIsReporterModalOpen(true); }}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
              >
                <UserPlus size={18} /> 기자 추가
              </button>
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

        {/* 보안 설정 탭 복원 */}
        {activeTab === 'password' && (
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm max-w-md animate-in fade-in duration-300">
            <h2 className="text-xl font-bold mb-6">관리자 보안 설정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">현재 비밀번호</label>
                <div className="p-3 bg-gray-50 border rounded text-gray-400 font-mono">••••••</div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">새 비밀번호</label>
                <input 
                  type="password" 
                  value={newPw} 
                  onChange={e => setNewPw(e.target.value)}
                  placeholder="새로운 패스워드 입력" 
                  className="w-full p-3 border rounded-lg outline-none focus:ring-1 focus:ring-blue-900" 
                />
              </div>
              <button 
                onClick={() => {
                  if(newPw.trim()) {
                    updateAdminPassword(newPw.trim());
                    alert('비밀번호가 성공적으로 변경되었습니다.');
                    setNewPw('');
                  } else {
                    alert('비밀번호를 입력해주세요.');
                  }
                }}
                className="w-full py-4 bg-blue-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-colors"
              >
                비밀번호 업데이트
              </button>
            </div>
          </div>
        )}

        {/* 카테고리 관리 */}
        {activeTab === 'categories' && (
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm animate-in fade-in duration-300">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">상단 메뉴 설정</h2>
            <div className="flex gap-2 mb-8">
              <input 
                type="text" 
                value={newCategoryName} 
                onChange={e => setNewCategoryName(e.target.value)}
                placeholder="새 메뉴 이름 입력"
                className="flex-grow p-3 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
              />
              <button onClick={handleAddCategory} className="bg-blue-900 text-white px-6 py-3 rounded-lg font-bold">추가</button>
            </div>
            <div className="space-y-2">
              {navCategories.map((cat, idx) => (
                <div key={cat} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 group">
                  <span className="font-bold text-gray-700">{cat}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => moveCategory(idx, 'up')} disabled={idx === 0} className="p-2 text-gray-400 hover:text-blue-900 disabled:opacity-20"><ArrowUp size={18}/></button>
                    <button onClick={() => moveCategory(idx, 'down')} disabled={idx === navCategories.length - 1} className="p-2 text-gray-400 hover:text-blue-900 disabled:opacity-20"><ArrowDown size={18}/></button>
                    <button onClick={() => handleDeleteCategory(cat)} className="p-2 text-red-400 hover:text-red-600 ml-4"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 기사 관리 */}
        {activeTab === 'articles' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6">신규 기사 발행</h2>
              <form onSubmit={handleAddArticle} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase text-gray-400">제목</label>
                    <input type="text" required value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} className="w-full p-2.5 border rounded focus:ring-1 focus:ring-blue-900 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase text-gray-400">카테고리</label>
                    <select value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as Category})} className="w-full p-2.5 border rounded focus:ring-1 focus:ring-blue-900 outline-none">
                      {navCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 uppercase text-gray-400">메인 썸네일 URL</label>
                  <input type="text" placeholder="https://..." value={newArticle.image} onChange={e => setNewArticle({...newArticle, image: e.target.value})} className="w-full p-2.5 border rounded focus:ring-1 focus:ring-blue-900 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 uppercase text-gray-400">담당 기자</label>
                  <select value={newArticle.reporterId} onChange={e => setNewArticle({...newArticle, reporterId: e.target.value})} className="w-full p-2.5 border rounded focus:ring-1 focus:ring-blue-900 outline-none">
                    <option value="">기자 선택</option>
                    {reporters.map(r => <option key={r.id} value={r.id}>{r.name} ({r.role})</option>)}
                  </select>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold uppercase text-gray-400">본문 내용</label>
                    <button type="button" onClick={insertImageTag} className="text-[11px] bg-blue-50 text-blue-900 px-3 py-1.5 rounded-md hover:bg-blue-100 flex items-center gap-1.5 border border-blue-200 transition-colors font-bold shadow-sm">
                      <ImageIcon size={14} /> 본문 내 이미지 삽입
                    </button>
                  </div>
                  <textarea required rows={10} value={newArticle.content} onChange={e => setNewArticle({...newArticle, content: e.target.value})} className="w-full p-3 border rounded focus:ring-1 focus:ring-blue-900 outline-none font-light leading-relaxed"></textarea>
                  <div className="mt-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                    <p className="text-[11px] text-blue-800 font-bold mb-1">💡 이미지 삽입 사용법</p>
                    <p className="text-[11px] text-gray-500 leading-normal">
                      1. 위 버튼을 눌러 이미지 URL을 입력하면 본문에 [IMG:URL] 코드가 추가됩니다.<br/>
                      2. 이 코드는 기사가 발행된 후 상세페이지에서 실제 이미지로 자동 변환됩니다.
                    </p>
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-blue-900 text-white font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-black transition-all">기사 발행</button>
              </form>
            </section>

            <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
                <span>기사 배치 및 순서 관리</span>
                <span className="text-xs font-normal text-gray-400 italic">가장 위에 있는 기사가 메인에 강조 노출됩니다.</span>
              </h2>
              <div className="divide-y divide-gray-100">
                {articles.map((art, idx) => (
                  <div key={art.id} className="py-4 flex items-center gap-4 group">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-xs font-bold text-gray-500">{idx + 1}</div>
                    <div className="flex-grow">
                      <div className="font-bold text-sm text-gray-900 group-hover:text-blue-900 transition-colors truncate max-w-lg">{art.title}</div>
                      <div className="text-[10px] text-gray-400">{art.category} | {art.createdAt}</div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => moveArticle(idx, 'up')} disabled={idx === 0} className="p-2 border rounded hover:bg-blue-50 disabled:opacity-10 text-blue-900"><ArrowUp size={16}/></button>
                      <button onClick={() => moveArticle(idx, 'down')} disabled={idx === articles.length - 1} className="p-2 border rounded hover:bg-blue-50 disabled:opacity-10 text-blue-900"><ArrowDown size={16}/></button>
                      <button onClick={() => { if(confirm('기사를 삭제하시겠습니까?')) updateArticles(articles.filter(a => a.id !== art.id)) }} className="p-2 border rounded hover:bg-red-50 text-red-500 ml-2"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* 광고 관리 */}
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
               <p className="text-sm text-blue-800 font-medium">광고 영역에 맞게 이미지를 업로드해주세요.</p>
               <button onClick={() => { setEditingAd({ type: activeAdSubTab, isVisible: true }); setIsAdModalOpen(true); }} className="bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1">
                 <Plus size={16}/> 광고 추가
               </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ads.filter(a => a.type === activeAdSubTab).map(ad => (
                  <div key={ad.id} className="flex flex-col border rounded-xl overflow-hidden shadow-sm bg-gray-50 group border-gray-200">
                    <div className="aspect-[21/9] bg-gray-200 relative overflow-hidden">
                      <img src={ad.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button onClick={() => { setEditingAd(ad); setIsAdModalOpen(true); }} className="p-2 bg-white/90 rounded-full shadow hover:bg-white text-blue-600"><Edit2 size={14}/></button>
                        <button onClick={() => updateAds(ads.filter(a => a.id !== ad.id))} className="p-2 bg-white/90 rounded-full shadow hover:bg-white text-red-600"><Trash2 size={14}/></button>
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-100 text-xs">
                      <span className="text-blue-900 font-bold">Link:</span> {ad.linkUrl}
                    </div>
                  </div>
                ))}
             </div>
           </div>
        )}

        {/* 제보 내역 */}
        {activeTab === 'reports' && (
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm animate-in fade-in duration-300">
            <h2 className="text-xl font-bold mb-6">제보 내역 관리</h2>
            <div className="space-y-4">
              {reports.length > 0 ? reports.map(report => (
                <div key={report.id} className="p-5 border rounded-xl bg-white border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-gray-900">{report.title}</h3>
                    <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded">{report.submittedAt}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{report.content}</p>
                  <div className="flex flex-wrap gap-4 text-[11px] font-bold text-gray-500 uppercase tracking-tighter">
                    <span className="text-blue-900">제보자: {report.name}</span>
                    <span>연락처: {report.phone}</span>
                    <span>이메일: {report.email}</span>
                  </div>
                </div>
              )) : (
                <div className="py-24 text-center border-2 border-dashed rounded-xl text-gray-300 font-bold">수신된 제보가 없습니다.</div>
              )}
            </div>
          </div>
        )}

        {/* 모달: 기자 편집 */}
        {isReporterModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-sm p-8 rounded-2xl shadow-2xl">
              <h2 className="text-xl font-bold mb-6">{editingReporter?.id ? '기자 정보 수정' : '신규 기자 등록'}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">성함</label>
                  <input type="text" value={editingReporter?.name || ''} onChange={e => setEditingReporter({...editingReporter, name: e.target.value})} className="w-full p-2.5 border rounded outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">역할 (부서/직함)</label>
                  <input type="text" value={editingReporter?.role || ''} onChange={e => setEditingReporter({...editingReporter, role: e.target.value})} className="w-full p-2.5 border rounded outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">프로필 사진 URL</label>
                  <input type="text" value={editingReporter?.photo || ''} onChange={e => setEditingReporter({...editingReporter, photo: e.target.value})} className="w-full p-2.5 border rounded outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">공식 이메일</label>
                  <input type="text" value={editingReporter?.email || ''} onChange={e => setEditingReporter({...editingReporter, email: e.target.value})} className="w-full p-2.5 border rounded outline-none" />
                </div>
                <div className="flex gap-2 pt-4">
                  <button onClick={handleSaveReporter} className="flex-grow py-3 bg-blue-900 text-white font-bold rounded-xl shadow-md">저장하기</button>
                  <button onClick={() => setIsReporterModalOpen(false)} className="px-6 py-3 border rounded-xl font-bold">취소</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 모달: 광고 편집 */}
        {isAdModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-sm p-8 rounded-xl shadow-2xl">
              <h2 className="text-xl font-bold mb-6">광고 상세 정보</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">이미지 URL</label>
                  <input type="text" placeholder="https://..." value={editingAd?.imageUrl || ''} onChange={e => setEditingAd({...editingAd, imageUrl: e.target.value})} className="w-full p-2.5 border rounded outline-none focus:ring-1 focus:ring-blue-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">연결 링크 URL</label>
                  <input type="text" placeholder="https://..." value={editingAd?.linkUrl || ''} onChange={e => setEditingAd({...editingAd, linkUrl: e.target.value})} className="w-full p-2.5 border rounded outline-none focus:ring-1 focus:ring-blue-900" />
                </div>
                <div className="flex gap-2 pt-4">
                  <button onClick={handleSaveAd} className="flex-grow py-3 bg-blue-900 text-white font-bold rounded-lg shadow-md">저장</button>
                  <button onClick={() => setIsAdModalOpen(false)} className="px-5 py-3 border rounded-lg hover:bg-gray-50 font-bold">취소</button>
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
