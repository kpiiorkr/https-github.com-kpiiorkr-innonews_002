
import React from 'react';
import { useApp } from '../store';

export const SidebarAd: React.FC = () => {
  const { ads } = useApp();
  const sidebarAd = ads.find(ad => ad.type === 'sidebar');

  if (!sidebarAd || !sidebarAd.isVisible) return null;

  return (
    <div className="sticky top-24 w-40 h-[600px] bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
      <a href={sidebarAd.linkUrl} target="_blank" rel="noopener noreferrer">
        <img 
          src={sidebarAd.imageUrl} 
          alt="Advertisement" 
          className="w-full h-full object-cover"
        />
      </a>
      <div className="absolute top-0 right-0 bg-white/80 px-1 text-[8px] text-gray-400">AD</div>
    </div>
  );
};

export const TopAd: React.FC = () => {
  const { ads } = useApp();
  const topAd = ads.find(ad => ad.type === 'top');

  if (!topAd || !topAd.isVisible) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 bg-gray-100 flex items-center justify-center border border-gray-200 relative">
      <a href={topAd.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-[90px]">
        <img 
          src={topAd.imageUrl} 
          alt="Banner Advertisement" 
          className="w-full h-full object-cover"
        />
      </a>
      <div className="absolute top-0 right-0 bg-white/80 px-1 text-[8px] text-gray-400">AD</div>
    </div>
  );
};
