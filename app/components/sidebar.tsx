"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from "../lib/utils"

const Sidebar: React.FC = () => {

  const [activeItem, setActiveItem] = useState<string>("")

  const navigationItems = [
    {
      name: "Spark",
      href: "/fyre",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      description: "Spark Token",
    },
    {
      name: "Axis",
      href: "/mana",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      description: "Axis Token",
    },
    {
      name: "Prism",
      href: "/shld",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      description: "Prism Token",
    },
  ]

  return (
    <div className="w-72 h-screen bg-sidebar border-r border-sidebar-border fixed top-0 left-0 z-20 flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-sidebar-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-sidebar-foreground">Victory Exchange</h2>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setActiveItem(item.name)}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-sidebar-accent",
                "border border-transparent hover:border-sidebar-border",
                activeItem === item.name && "bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                  "bg-sidebar-accent group-hover:bg-sidebar-primary/10",
                  activeItem === item.name && "bg-sidebar-primary-foreground/20",
                )}
              >
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{item.name}</div>
                <div className="text-xs text-muted-foreground group-hover:text-sidebar-foreground/70">
                  {item.description}
                </div>
              </div>
              <svg
                className={cn(
                  "w-4 h-4 transition-transform opacity-0 group-hover:opacity-100",
                  activeItem === item.name && "opacity-100",
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
