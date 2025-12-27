
import React, { useState, useMemo } from 'react';
import { useApp } from '../store';
import { Video } from '../types';
import { Plus, Trash2, Edit2, X, Check, PlayCircle } from 'lucide-react';

const VideosPage: React.FC = () => {
  const { videos, isAdmin, addVideo, deleteVideo, updateVideos } = useApp();
  // 1. 처음에는 목록만 보이도록 초기값을 null로 설정
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  // Admin Editing States
  const [isAdding, setIsAdding] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Video>>({
    title: '',
    description: '',
    youtubeUrl: '',
    thumbnailType: 'default'
  });

  // 2. 유튜브 ID 추출 로직 강화 (오류 153 방지 및 다양한 URL 대응)
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const renderDescription = (text: string = '') => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{part}</a>;
      }
      return part;
    });
  };

  const currentVideoId = useMemo(() => selectedVideo ? getYoutubeId(selectedVideo.youtubeUrl) : null, [selectedVideo]);

  const handleManagementAction = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  const handleSave = () => {
    if (!formData.title || !formData.youtubeUrl) return alert('제목과 URL은 필수입니다.');
    
    if (editingVideoId) {
      const updated = videos.map(v => v.id === editingVideoId ? { ...v, ...formData } as Video : v);
      updateVideos(updated);
      if (selectedVideo?.id === editingVideoId) setSelectedVideo({ ...selectedVideo, ...formData } as Video);
      setEditingVideoId(null);
    } else {
      const newVid: Video = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title || '',
        description: formData.description || '',
        youtubeUrl: formData.youtubeUrl || '',
        thumbnailType: 'default',
        ...formData
      };
      addVideo(newVid);
      setIsAdding(false);
    }
    setFormData({ title: '', description: '', youtubeUrl: '', thumbnailType: 'default' });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-gray-900 pb-2">
        <h1 className="text-3xl font-bold">영상 뉴스</h1>
        {isAdmin && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-3 py-1 bg-blue-900 text-white text-sm rounded hover:bg-blue-800"
          >
            <Plus size={16} /> 영상 추가
          </button>
        )}
      </div>

      {/* Admin Add/Edit Overlay Form */}
      {(isAdding || editingVideoId) && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">{editingVideoId ? '영상 수정' : '새 영상 등록'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">제목</label>
                <input 
                  type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 border rounded" placeholder="영상 제목 입력"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">유튜브 URL</label>
                <input 
                  type="text" value={formData.youtubeUrl} onChange={e => setFormData({...formData, youtubeUrl: e.target.value})}
                  className="w-full p-2 border rounded" placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">설명 (최대 5줄)</label>
                <textarea 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border rounded h-32" placeholder="영상에 대한 설명을 입력하세요 (URL 자동 링크 지원)"
                ></textarea>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="flex-grow py-2 bg-blue-900 text-white font-bold rounded flex items-center justify-center gap-1">
                  <Check size={18} /> 저장하기
                </button>
                <button onClick={() => { setIsAdding(false); setEditingVideoId(null); }} className="px-4 py-2 border rounded flex items-center justify-center">
                  <X size={18} /> 취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 영상을 클릭했을 때만 상단에 플레이어 노출 */}
      {selectedVideo && (
        <div className="bg-black rounded-xl overflow-hidden shadow-lg border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="aspect-video w-full bg-black">
            {currentVideoId ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentVideoId}?rel=0`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white p-10 text-center">
                동영상을 불러올 수 없습니다.<br/>유튜브 주소를 확인해주세요.
              </div>
            )}
          </div>
          <div className="p-6 bg-white border-t border-gray-100 relative">
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
              title="플레이어 닫기"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 pr-10">{selectedVideo.title}</h2>
            {/* 최대 5줄까지 보이며 내용에 따라 높이 조절 */}
            <div className="text-gray-600 leading-relaxed text-sm md:text-base line-clamp-5 whitespace-pre-wrap">
              {renderDescription(selectedVideo.description)}
            </div>
          </div>
        </div>
      )}

      {/* 하단 영상 리스트 */}
      <div>
        {!selectedVideo && (
           <div className="bg-blue-50 p-6 rounded-lg mb-8 text-center border border-blue-100">
             <PlayCircle size={48} className="mx-auto text-blue-900 mb-3 opacity-20" />
             <p className="text-blue-900 font-medium">아래 목록에서 시청하실 영상을 선택해주세요.</p>
           </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
          {videos.map(video => {
            const ytId = getYoutubeId(video.youtubeUrl);
            const thumbUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;

            const isActive = selectedVideo?.id === video.id;

            return (
              <div 
                key={video.id} 
                className={`group relative cursor-pointer p-2 rounded-lg transition-all ${isActive ? 'bg-blue-50 ring-2 ring-blue-500 shadow-md' : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'}`}
                onClick={() => {
                  setSelectedVideo(video);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="aspect-video bg-black overflow-hidden relative rounded shadow-sm">
                  <img src={thumbUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-md">
                      <div className="w-0 h-0 border-t-6 border-t-transparent border-l-10 border-l-white border-b-6 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
                <h3 className={`mt-3 font-bold text-sm leading-snug line-clamp-2 ${isActive ? 'text-blue-700' : 'group-hover:text-blue-700'}`}>
                  {video.title}
                </h3>

                {/* 관리자 직접 관리 버튼 */}
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => handleManagementAction(e, () => {
                        setEditingVideoId(video.id);
                        setFormData({ ...video });
                      })}
                      className="p-1.5 bg-white text-blue-600 rounded shadow hover:bg-blue-50"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={(e) => handleManagementAction(e, () => {
                        if (confirm('이 영상을 삭제하시겠습니까?')) {
                          deleteVideo(video.id);
                          if (isActive) setSelectedVideo(null);
                        }
                      })}
                      className="p-1.5 bg-white text-red-600 rounded shadow hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {videos.length === 0 && (
        <div className="py-20 text-center text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed">등록된 영상이 없습니다.</div>
      )}
    </div>
  );
};

export default VideosPage;
