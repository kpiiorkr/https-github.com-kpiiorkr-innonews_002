
import React, { useMemo } from 'react';
import { useApp } from '../store';

export const SidebarAd: React.FC = () => {
  const { ads } = useApp();
  const sidebarAds = ads.filter(ad => ad.type === 'sidebar' && ad.isVisible);

  const activeAd = useMemo(() => {
    if (sidebarAds.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * sidebarAds.length);
    return sidebarAds[randomIndex];
  }, [sidebarAds.length]);

  if (!activeAd) return null;

  return (
    <div className="sticky top-24">
      <div className="w-40 h-[600px] bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 relative group">
        <a href={activeAd.linkUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
          <img 
            src={activeAd.imageUrl} 
            alt="Sidebar Advertisement" 
            className="w-full h-full object-cover group-hover:opacity-95 transition-opacity"
          />
        </a>
        <div className="absolute top-0 right-0 bg-white/80 px-1 text-[8px] text-gray-400">AD</div>
      </div>
    </div>
  );
};

export const TopAd: React.FC = () => {
  const { ads } = useApp();
  const topAds = ads.filter(ad => ad.type === 'top' && ad.isVisible);

  const activeAd = useMemo(() => {
    if (topAds.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * topAds.length);
    return topAds[randomIndex];
  }, [topAds.length]);

  if (!activeAd) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-10">
      <div className="w-full bg-gray-50 flex items-center justify-center border border-gray-100 relative group overflow-hidden">
        <a href={activeAd.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-[120px] md:h-[150px]">
          <img 
            src={activeAd.imageUrl} 
            alt="Top Advertisement" 
            className="w-full h-full object-contain md:object-cover group-hover:opacity-90 transition-opacity"
          />
        </a>
      </div>
    </div>
  );
};

export const BottomAd: React.FC = () => {
  const { ads } = useApp();
  const bottomAds = ads.filter(ad => ad.type === 'bottom' && ad.isVisible);

  const activeAd = useMemo(() => {
    if (bottomAds.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * bottomAds.length);
    return bottomAds[randomIndex];
  }, [bottomAds.length]);

  if (!activeAd) return null;

  return (
    <div className="mt-12 mb-12 clear-both block w-full">
      <div className="max-w-4xl mx-auto">
        <div className="w-full bg-gray-50 flex items-center justify-center border border-gray-100 relative group overflow-hidden">
          <a href={activeAd.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-[120px] md:h-[150px]">
            <img 
              src={activeAd.imageUrl} 
              alt="Bottom Advertisement" 
              className="w-full h-full object-contain md:object-cover group-hover:opacity-90 transition-opacity"
            />
          </a>
        </div>
      </div>
    </div>
  );
};
