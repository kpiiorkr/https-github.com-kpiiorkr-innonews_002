
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Article, Video, AdConfig, Reporter, Report } from './types';

interface AppContextType {
  articles: Article[];
  videos: Video[];
  ads: AdConfig[];
  reporters: Reporter[];
  reports: Report[];
  isAdmin: boolean;
  setAdmin: (val: boolean) => void;
  addArticle: (article: Article) => void;
  addReport: (report: Report) => void;
  updateAds: (ads: AdConfig[]) => void;
  updateVideos: (videos: Video[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [articles, setArticles] = useState<Article[]>([
    {
      id: '1',
      title: '한국프로세스혁신협회, 차세대 디지털 전환 로드맵 발표',
      category: '기술',
      content: '한국프로세스혁신협회는 오늘 서울에서 열린 세미나에서 국내 기업들의 글로벌 경쟁력 강화를 위한 2025 디지털 전환 로드맵을 발표했습니다. 이번 로드맵은 AI와 클라우드 프로세스를 중심으로...',
      image: 'https://picsum.photos/seed/tech1/800/500',
      createdAt: '2024-05-20 09:00',
      updatedAt: '2024-05-20 14:30',
      reporterId: 'rep1'
    },
    {
      id: '2',
      title: '경영 효율성 극대화를 위한 스마트 오피스 도입 현황',
      category: '경영',
      content: '대기업들을 중심으로 불고 있는 스마트 오피스 열풍은 단순한 공간 변화를 넘어 업무 프로세스의 근본적인 혁신을 요구하고 있습니다. 최근 조사에 따르면 스마트 오피스 도입 후 업무 만족도가...',
      image: 'https://picsum.photos/seed/biz1/800/500',
      createdAt: '2024-05-19 10:20',
      updatedAt: '2024-05-19 11:00',
      reporterId: 'rep2'
    },
    {
      id: '3',
      title: '[오피니언] 이노베이션의 본질은 기술이 아닌 사람이다',
      category: '오피니언',
      content: '우리는 매일 수많은 기술 혁신 속에서 살아간다. 하지만 진정한 혁신의 중심에는 항상 그 기술을 사용하는 사람이 있어야 함을 잊지 말아야 한다...',
      image: 'https://picsum.photos/seed/opinion1/800/500',
      createdAt: '2024-05-18 08:00',
      updatedAt: '2024-05-18 08:00',
      reporterId: 'rep1'
    }
  ]);

  const [videos, setVideos] = useState<Video[]>([
    {
      id: 'v1',
      title: '이노뉴스 창간 기념 대담 - 미래의 프로세스',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailType: 'default'
    },
    {
      id: 'v2',
      title: '기술 혁신의 현장을 가다',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailType: 'text',
      thumbnailText: '혁신 현장 스케치'
    }
  ]);

  const [ads, setAds] = useState<AdConfig[]>([
    {
      id: 'ad1',
      type: 'sidebar',
      imageUrl: 'https://picsum.photos/seed/ad_side/160/600',
      linkUrl: 'https://askinno.com',
      isVisible: true
    },
    {
      id: 'ad2',
      type: 'top',
      imageUrl: 'https://picsum.photos/seed/ad_top/728/90',
      linkUrl: 'https://www.google.com',
      isVisible: true
    }
  ]);

  const [reporters] = useState<Reporter[]>([
    { id: 'rep1', name: '김이노', photo: 'https://picsum.photos/seed/p1/100/100', role: '기술과학부 전문기자' },
    { id: 'rep2', name: '이혁신', photo: 'https://picsum.photos/seed/p2/100/100', role: '경영혁신부 기자' }
  ]);

  const [reports, setReports] = useState<Report[]>([]);

  const addArticle = (article: Article) => setArticles(prev => [article, ...prev]);
  const addReport = (report: Report) => setReports(prev => [report, ...prev]);
  const updateAds = (newAds: AdConfig[]) => setAds(newAds);
  const updateVideos = (newVideos: Video[]) => setVideos(newVideos);

  return (
    <AppContext.Provider value={{
      articles,
      videos,
      ads,
      reporters,
      reports,
      isAdmin,
      setAdmin: setIsAdmin,
      addArticle,
      addReport,
      updateAds,
      updateVideos
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
