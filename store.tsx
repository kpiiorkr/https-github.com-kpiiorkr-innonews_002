
import React, { createContext, useContext, useState } from 'react';
import { Article, Video, AdConfig, Reporter, Report } from './types';

interface AppContextType {
  articles: Article[];
  videos: Video[];
  ads: AdConfig[];
  reporters: Reporter[];
  reports: Report[];
  navCategories: string[];
  isAdmin: boolean;
  adminPassword: string;
  setAdmin: (val: boolean) => void;
  updateAdminPassword: (newPw: string) => void;
  updateNavCategories: (newCats: string[]) => void;
  addArticle: (article: Article) => void;
  editArticle: (updatedArticle: Article) => void; // 기사 수정 기능 추가
  updateArticles: (articles: Article[]) => void; 
  addReport: (report: Report) => void;
  updateAds: (ads: AdConfig[]) => void;
  updateVideos: (videos: Video[]) => void;
  addVideo: (video: Video) => void;
  deleteVideo: (id: string) => void;
  updateReporters: (reporters: Reporter[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('pw');
  const [navCategories, setNavCategories] = useState(['오피니언', '최신기사', '기술', '경영', '사회', '문화']);
  
  const [articles, setArticles] = useState<Article[]>([
    {
      id: '1',
      title: '한국프로세스혁신협회, 차세대 디지털 전환 로드맵 발표',
      category: '기술',
      content: '한국프로세스혁신협회는 오늘 서울에서 열린 세미나에서 국내 기업들의 글로벌 경쟁력 강화를 위한 2025 디지털 전환 로드맵을 발표했습니다.\n\n[IMG:https://picsum.photos/seed/inner1/800/400]\n\n이번 로드맵은 AI와 클라우드 프로세스를 중심으로 국내 제조 및 서비스 산업 전반의 효율성을 개선하는 데 초점을 맞추고 있습니다.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
      createdAt: '2025. 12. 28. 오전 10:00:00',
      updatedAt: '2025. 12. 28. 오전 10:00:00',
      reporterId: 'rep1'
    },
    {
      id: '2',
      title: 'AI 시대의 경영 전략: 데이터 중심 프로세스 설계의 중요성',
      category: '경영',
      content: '데이터는 새로운 석유라고 불립니다. 하지만 정제되지 않은 데이터는 가치가 없습니다. 기업들이 AI를 도입하기 전 반드시 선행해야 할 과제는 업무 프로세스의 표준화와 가시화입니다.\n\n[IMG:https://images.unsplash.com/photo-1551288049-bbbda540d3b9?auto=format&fit=crop&q=80&w=800]\n\n이혁신 기자가 전하는 AI 시대 생존 전략 보고서입니다.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      createdAt: '2025. 12. 27. 오후 2:30:00',
      updatedAt: '2025. 12. 27. 오후 2:30:00',
      reporterId: 'rep2'
    },
    {
      id: '3',
      title: '[칼럼] 프로세스 혁신이 기업의 미래를 결정한다',
      category: '오피니언',
      content: '전 세계적으로 경기 불황이 지속되고 있는 가운데, 내부 효율성을 극대화하는 프로세스 혁신(PI)에 대한 관심이 다시 뜨거워지고 있습니다. 과거의 PI가 단순 자동화였다면 이제는 지능형 프로세스로 진화해야 합니다.',
      image: 'https://images.unsplash.com/photo-1454165833762-0265129b0031?auto=format&fit=crop&q=80&w=800',
      createdAt: '2025. 12. 26. 오전 9:00:00',
      updatedAt: '2025. 12. 26. 오전 9:00:00',
      reporterId: 'rep1'
    },
    {
      id: '4',
      title: '2025년 주목해야 할 10대 프로세스 기술 트렌드',
      category: '기술',
      content: '하이퍼오토메이션, 로우코드 플랫폼, 프로세스 마이닝... 한국프로세스혁신협회가 선정한 내년도 핵심 기술 키워드를 분석해 드립니다.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
      createdAt: '2025. 12. 25. 오후 5:15:00',
      updatedAt: '2025. 12. 25. 오후 5:15:00',
      reporterId: 'rep1'
    },
    {
      id: '5',
      title: '지역 사회 상생을 위한 디지털 격차 해소 캠페인 성료',
      category: '사회',
      content: '한국프로세스혁신협회는 지난 한 달간 소상공인들을 대상으로 한 디지털 도구 활용 교육 캠페인을 성공적으로 마쳤다고 밝혔습니다.',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800',
      createdAt: '2025. 12. 24. 오전 11:45:00',
      updatedAt: '2025. 12. 24. 오전 11:45:00',
      reporterId: 'rep2'
    },
    {
      id: '6',
      title: '문화와 기술의 만남: 예술 작품 복원 프로세스에도 AI 도입',
      category: '문화',
      content: '전통 문화유산의 복원 과정에 최신 디지털 스캐닝 기술과 프로세스 최적화 알고리즘이 적용되어 정교함이 비약적으로 향상되었습니다.',
      image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&q=80&w=800',
      createdAt: '2025. 12. 23. 오후 4:20:00',
      updatedAt: '2025. 12. 23. 오후 4:20:00',
      reporterId: 'rep2'
    },
    {
      id: '7',
      title: '신임 협회장 인터뷰 "프로세스가 바뀌어야 대한민국이 바뀝니다"',
      category: '오피니언',
      content: '협회 창립 이래 가장 역동적인 변화의 시기를 겪고 있는 지금, 새로운 수장의 비전과 철학을 직접 들어보았습니다.',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800',
      createdAt: '2025. 12. 22. 오전 10:30:00',
      updatedAt: '2025. 12. 22. 오전 10:30:00',
      reporterId: 'rep1'
    },
    {
      id: '8',
      title: '제조 현장의 스마트 팩토리 성공 사례 집중 탐구',
      category: '경영',
      content: '불량률 0%에 도전하는 중견 기업 A사의 스마트 프로세스 구축 기법을 단독 취재했습니다.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
      createdAt: '2025. 12. 21. 오후 2:00:00',
      updatedAt: '2025. 12. 21. 오후 2:00:00',
      reporterId: 'rep2'
    },
    {
      id: '9',
      title: '디지털 네이티브 세대를 위한 새로운 조직 문화 프로세스',
      category: '문화',
      content: '수직적 문화를 깨고 수평적인 소통이 흐르는 프로세스 설계는 이제 선택이 아닌 필수입니다.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
      createdAt: '2025. 12. 20. 오전 9:10:00',
      updatedAt: '2025. 12. 20. 오전 9:10:00',
      reporterId: 'rep1'
    },
    {
      id: '10',
      title: '탄소 중립 실현을 위한 친환경 비즈니스 프로세스 설계',
      category: '사회',
      content: 'ESG 경영의 실질적 이행을 위한 공급망 최적화 및 에너지 효율 프로세스 가이드북이 배포되었습니다.',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800',
      createdAt: '2025. 12. 19. 오후 3:40:00',
      updatedAt: '2025. 12. 19. 오후 3:40:00',
      reporterId: 'rep2'
    }
  ]);

  const [videos, setVideos] = useState<Video[]>([
    {
      id: 'v1',
      title: '이노뉴스 창간 기념 대담 - 미래의 프로세스',
      description: '이노뉴스 창간을 기념하여 국내 최고의 전문가들과 함께 미래 프로세스 혁신에 대해 이야기 나누었습니다.',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailType: 'default'
    },
    {
      id: 'v2',
      title: '디지털 전환, 왜 실패하는가? - 명사 초청 강연',
      description: '국내 대기업의 성공과 실패 사례를 통해 배우는 현실적인 DX 전략 영상입니다.',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailType: 'default'
    }
  ]);

  const [ads, setAds] = useState<AdConfig[]>([
    { id: 'ad-side-1', type: 'sidebar', imageUrl: 'https://picsum.photos/seed/ad1/160/600', linkUrl: 'https://askinno.com', isVisible: true },
    { id: 'ad-top-1', type: 'top', imageUrl: 'https://picsum.photos/seed/ad2/728/90', linkUrl: 'https://www.google.com', isVisible: true },
    { id: 'ad-pop-1', type: 'popup', imageUrl: 'https://i.pinimg.com/736x/23/72/7d/23727dffcc8b9ab9f954992d13c6eeb6.jpg', linkUrl: '#', isVisible: true },
    { id: 'ad-bottom-1', type: 'bottom', imageUrl: 'https://picsum.photos/seed/ad4/728/150', linkUrl: '#', isVisible: true }
  ]);

  const [reporters, setReporters] = useState<Reporter[]>([
    { id: 'rep1', name: '김이노', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', role: '기술과학부 전문기자', email: 'ino.kim@innonews.co.kr' },
    { id: 'rep2', name: '이혁신', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', role: '경영혁신부 기자', email: 'innovation@innonews.co.kr' }
  ]);

  const [reports, setReports] = useState<Report[]>([]);

  const addArticle = (article: Article) => setArticles(prev => [article, ...prev]);
  const editArticle = (updatedArticle: Article) => setArticles(prev => prev.map(a => a.id === updatedArticle.id ? updatedArticle : a));
  const updateArticles = (newArticles: Article[]) => setArticles(newArticles);
  const addReport = (report: Report) => setReports(prev => [report, ...prev]);
  const updateAds = (newAds: AdConfig[]) => setAds(newAds);
  const updateVideos = (newVideos: Video[]) => setVideos(newVideos);
  const addVideo = (video: Video) => setVideos(prev => [video, ...prev]);
  const deleteVideo = (id: string) => setVideos(prev => prev.filter(v => v.id !== id));
  const updateReporters = (newReporters: Reporter[]) => setReporters(newReporters);

  const updateAdminPassword = (newPw: string) => setAdminPassword(newPw);
  const updateNavCategories = (newCats: string[]) => setNavCategories(newCats);

  return (
    <AppContext.Provider value={{
      articles,
      videos,
      ads,
      reporters,
      reports,
      navCategories,
      isAdmin,
      adminPassword,
      setAdmin: setIsAdmin,
      updateAdminPassword,
      updateNavCategories,
      addArticle,
      editArticle,
      updateArticles,
      addReport,
      updateAds,
      updateVideos,
      addVideo,
      deleteVideo,
      updateReporters
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
