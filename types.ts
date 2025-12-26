
export type Category = '오피니언' | '최신기사' | '기술' | '경영' | '사회' | '문화';

export interface Reporter {
  id: string;
  name: string;
  photo: string;
  role: string;
}

export interface Article {
  id: string;
  title: string;
  category: Category;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  reporterId: string;
}

export interface Video {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnailType: 'default' | 'image' | 'text';
  customThumbnail?: string;
  thumbnailText?: string;
}

export interface AdConfig {
  id: string;
  type: 'sidebar' | 'top';
  imageUrl: string;
  linkUrl: string;
  width?: string;
  height?: string;
  isVisible: boolean;
}

export interface Report {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  content: string;
  fileName?: string;
  submittedAt: string;
}
