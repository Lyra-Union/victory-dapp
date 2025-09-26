"use client";

import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-[#270927] text-white p-5 fixed top-0 left-0 z-20 transform transition-transform duration-300">
      <h2 className="text-2xl font-bold mb-8">Victory Exchange</h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link href="/fyre" className="text-lg hover:underline">Fyre</Link>
          </li>
          <li>
            <Link href="/mana" className="text-lg hover:underline">Mana</Link>
          </li>
          <li>
            <Link href="/shld" className="text-lg hover:underline">Shld</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
