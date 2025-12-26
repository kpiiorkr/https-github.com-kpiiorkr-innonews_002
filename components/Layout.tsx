
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { SidebarAd } from './Ads';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl relative">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow">
            {children}
          </div>
          <div className="hidden lg:block w-40 flex-shrink-0">
            <SidebarAd />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
