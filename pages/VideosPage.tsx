
import React, { useState, useMemo } from 'react';
import { useApp } from '../store';
import { Video } from '../types';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';

const VideosPage: React.FC = () => {
  const { videos, isAdmin, addVideo, deleteVideo, updateVideos } = useApp();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(videos[0] || null);
  
  // Admin Editing States
  const [isAdding, setIsAdding] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Video>>({
    title: '',
    description: '',
    youtubeUrl: '',
    thumbnailType: 'default'
  });

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
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
                <label className="block text-sm font-bold mb-1">설명 (최대 3줄 권장)</label>
                <textarea 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border rounded h-24" placeholder="영상에 대한 설명을 입력하세요 (URL 자동 링크 지원)"
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

      {/* Top Player Section */}
      {selectedVideo ? (
        <div className="bg-black rounded-xl overflow-hidden shadow-lg border border-gray-200">
          <div className="aspect-video w-full bg-black">
            {currentVideoId ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=0`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">동영상을 불러올 수 없습니다.</div>
            )}
          </div>
          <div className="p-6 bg-white border-t border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">{selectedVideo.title}</h2>
            <div className="text-gray-600 leading-relaxed text-sm md:text-base line-clamp-3 whitespace-pre-wrap">
              {renderDescription(selectedVideo.description)}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed">등록된 영상이 없습니다.</div>
      )}

      {/* Bottom Video List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
        {videos.map(video => {
          const ytId = getYoutubeId(video.youtubeUrl);
          const thumbUrl = video.thumbnailType === 'image' && video.customThumbnail
            ? video.customThumbnail
            : `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;

          const isActive = selectedVideo?.id === video.id;

          return (
            <div 
              key={video.id} 
              className={`group relative cursor-pointer p-2 rounded-lg transition-all ${isActive ? 'bg-blue-50 ring-2 ring-blue-500' : 'hover:bg-gray-50'}`}
              onClick={() => setSelectedVideo(video)}
            >
              <div className="aspect-video bg-black overflow-hidden relative rounded shadow-sm">
                {video.thumbnailType === 'text' ? (
                  <div className="w-full h-full flex items-center justify-center bg-blue-900 text-white p-4 text-center font-bold text-sm">
                    {video.thumbnailText}
                  </div>
                ) : (
                  <img src={thumbUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-md">
                    <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <h3 className={`mt-3 font-bold text-sm leading-snug line-clamp-2 ${isActive ? 'text-blue-700' : 'group-hover:text-blue-700'}`}>
                {video.title}
              </h3>

              {/* Admin Overlay Actions */}
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
                        if (isActive) setSelectedVideo(videos.find(v => v.id !== video.id) || null);
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
  );
};

export default VideosPage;
