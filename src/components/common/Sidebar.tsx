"use client";

import { useState } from "react";
import { LayoutDashboard, Users, Search, User, Bell, Check, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  // 여기는 수정 되어야할 부분 (상윤님 PR에 따라 Merge 후 작업)
  const menuItems = [
    { name: "대시보드", icon: LayoutDashboard, path: "/" },
    { name: "커뮤니티", icon: Users, path: "/community" },
    { name: "검색", icon: Search, path: "/search" },
    { name: "프로필", icon: User, path: "/profile" },
    { name: "알림", icon: Bell, path: "/notifications" },
  ];

  return (
    <div className="w-64 bg-gray-100 h-screen flex flex-col fixed left-0 top-0">
      {/* 로고 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">U</span>
          </div>
          <span className="text-xl font-bold text-black">updown</span>
        </div>
      </div>

      {/* 오늘의 감정 지수 카드 */}
      <div className="p-4">
        <div className="bg-black rounded-lg p-4 text-white">
          <h3 className="text-sm font-medium mb-2">오늘의 감정 지수</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">1,240</span>
            <div className="flex items-center gap-1 text-green-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+1.80%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 px-4 py-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isCurrentPath = pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isCurrentPath
                      ? "bg-blue-100 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 오늘의 감정 작성 버튼 */}
      <div className="p-4">
        <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
          <Check className="w-5 h-5" />
          <span>오늘의 감정 작성</span>
        </button>
      </div>

      {/* 사용자 프로필 */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <span className="text-sm font-medium text-gray-800">김민준</span>
        </div>
      </div>
    </div>
  );
}
