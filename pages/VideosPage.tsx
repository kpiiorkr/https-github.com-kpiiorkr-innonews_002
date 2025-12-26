
import React from 'react';
import { useApp } from '../store';

const VideosPage: React.FC = () => {
  const { videos } = useApp();

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div>
      <div className="mb-8 border-b border-gray-900 pb-2">
        <h1 className="text-3xl font-bold">영상 뉴스</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map(video => {
          const ytId = getYoutubeId(video.youtubeUrl);
          const thumbUrl = video.thumbnailType === 'image' && video.customThumbnail
            ? video.customThumbnail
            : `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;

          return (
            <div key={video.id} className="group">
              <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="block relative">
                <div className="aspect-video bg-black overflow-hidden relative">
                  {video.thumbnailType === 'text' ? (
                    <div className="w-full h-full flex items-center justify-center bg-blue-900 text-white p-6 text-center font-bold text-xl">
                      {video.thumbnailText}
                    </div>
                  ) : (
                    <img src={thumbUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  )}
                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
                <h3 className="mt-4 font-bold text-lg leading-snug group-hover:text-blue-700 transition-colors">
                  {video.title}
                </h3>
              </a>
            </div>
          );
        })}
        {videos.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400">등록된 영상이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default VideosPage;
