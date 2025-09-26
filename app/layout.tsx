"use client";

import './globals.css';
import { Inter } from 'next/font/google';
import Providers from "./wallet_components/evmProviders";
import Sidebar from "./components/sidebar";
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <html lang="en">
      <body className={`${inter.className} flex`}>
        <Providers>
          {/* Toggle Button */}
          <button 
            onClick={toggleSidebar}
            className="p-3 bg-blue-600 text-white fixed top-4 left-4 z-30 md:hidden"
          >
            {isSidebarVisible ? 'Hide Menu' : 'Show Menu'}
          </button>
          
          {/* Sidebar */}
          {isSidebarVisible && <Sidebar />}
          
          {/* Main Content */}
          <main className={`flex-1 p-4 bg-[#270927] min-h-screen transition-all ${isSidebarVisible ? 'ml-64' : 'ml-0'}`}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
