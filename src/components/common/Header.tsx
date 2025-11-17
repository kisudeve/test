"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  TrendingDown,
  User,
  Moon,
  Sun,
  LayoutDashboard,
  Users,
  Search,
  Bell,
  PenTool,
} from "lucide-react";
import type { Database } from "@/utils/supabase/supabase";

type Profile = Database["public"]["Tables"]["users"]["Row"];

const Icon = {
  logo: ({ className }: { className?: string }) => (
    <div className={"flex items-center justify-center w-full " + (className || "")}>
      <Image
        src="/logo/logo.svg"
        alt="logo"
        width={224}
        height={89}
        className="object-contain dark:invert"
        priority
      />
    </div>
  ),
  dashboard: ({ className }: { className?: string }) => (
    <LayoutDashboard className={className || "w-[18px] h-[18px]"} />
  ),
  community: ({ className }: { className?: string }) => (
    <Users className={className || "w-[18px] h-[18px]"} />
  ),
  search: ({ className }: { className?: string }) => (
    <Search className={className || "w-[18px] h-[18px]"} />
  ),
  profile: ({ className }: { className?: string }) => (
    <User className={className || "w-[18px] h-[18px]"} />
  ),
  bell: ({ className }: { className?: string }) => (
    <Bell className={className || "w-[18px] h-[18px]"} />
  ),
  write: ({ className }: { className?: string }) => (
    <PenTool className={className || "w-[18px] h-[18px]"} />
  ),
};

type NavItem = {
  key: string;
  label: string;
  href: string;
  Icon: React.FC<{ className?: string }>;
};

const NAV: NavItem[] = [
  { key: "dashboard", label: "대시보드", href: "/", Icon: Icon.dashboard },
  { key: "community", label: "커뮤니티", href: "/community", Icon: Icon.community },
  { key: "search", label: "검색", href: "/search", Icon: Icon.search },
  { key: "profile", label: "프로필", href: "/profile", Icon: Icon.profile },
  { key: "alerts", label: "알림", href: "/alerts", Icon: Icon.bell },
];

interface HeaderProps {
  // 현재 활성화된 메뉴 키 (예: 'search')
  activeKey?: string;
  // 사용자 정보 (하단 프로필 영역): 이름과 프로필 이미지
  userProfile?: { display_name: string; image_url: string };
  // 오늘의 감정 지수 카드에 보여줄 값
  todayScore?: { value: number; finalResult: number };
  initialProfile?: Profile | null;
  className?: string;
}

// 헤더 컴포넌트
// activeKey: 현재 활성화된 메뉴 키
// userName: 사용자 이름
// todayScore: 오늘의 감정 지수 정보
// initialProfile: SSR에서 가져온 초기 프로필
export default function Header({
  activeKey = "dashboard",
  todayScore = { value: 1240, finalResult: 1.8 },
  initialProfile,
  className,
}: HeaderProps) {
  const pathname = usePathname();

  // SSR 프로필을 우선 사용하고, 클라이언트 사이드에서 업데이트되면 그것을 사용
  const userProfile = initialProfile || null;

  const computedActiveKey = React.useMemo(() => {
    // 글 작성 시 Header 탭 커뮤니티 활성화
    if (pathname === "/write" || pathname.startsWith("/write/")) {
      return "community";
    }

    for (const n of NAV) {
      if (n.href === "/") {
        if (pathname === "/") return n.key;
      } else {
        if (pathname === n.href || pathname.startsWith(n.href + "/")) return n.key;
      }
    }
    return activeKey;
  }, [pathname, activeKey]);

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <aside
      className={[
        "bg-white/85 backdrop-blur shadow-sm rounded-lg",
        "w-full",
        "min-w-[180px]",
        "h-full flex flex-col p-4 gap-4",
        "shrink-0",
        "font-[Paperlogy]",
        "font-semibold",
        "dark:bg-[#101828]",
        className || "",
      ].join(" ")}
      aria-label="헤더"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-2">
        <Link href="/">
          <div className="text-black">
            <Icon.logo />
          </div>
        </Link>
      </div>

      {/* 오늘의 감정 지수 카드 */}
      <section>
        <div className="w-full rounded-2xl bg-black text-white p-4 shadow-sm dark:bg-[#141d2b]">
          <p className="text-[14px] text-gray-300">오늘의 감정 지수</p>
          <div className="mt-3 flex flex-col gap-3 max-[1215px]:flex-wrap min-[1216px]:flex-nowrap">
            <span className="text-[26px] font-extrabold tabular-nums tracking-tight max-[1215px]:text-[28px] min-[1216px]:text-[34px]">
              {todayScore.value.toLocaleString()}
            </span>
            <span
              className={`inline-flex shrink-0 items-center gap-1 rounded-lg font-semibold backdrop-blur bg-transparent px-0 py-0 text-[14px] ${
                todayScore.finalResult >= 0 ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {todayScore.finalResult >= 0 ? "+" : ""}
              {Math.abs(todayScore.finalResult).toFixed(2)}%
              {todayScore.finalResult >= 0 ? (
                <TrendingUp className="h-5 w-5 sm:h-7 sm:w-7" />
              ) : (
                <TrendingDown className="h-5 w-5 sm:h-7 sm:w-7" />
              )}
            </span>
          </div>
        </div>
      </section>

      {/* 네비게이션 */}
      <nav className="mt-2 flex-1">
        <ul className="flex flex-col gap-1">
          {NAV.map(({ key, label, href, Icon: I }) => {
            const active = key === computedActiveKey;
            return (
              <li key={key}>
                <Link
                  href={href}
                  className={[
                    "group flex items-center justify-between rounded-xl px-3 py-2 mb-2",
                    active
                      ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-200"
                      : "text-gray-400 transition-colors duration-200 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  <div className="flex items-center gap-3">
                    <I className={active ? "" : "grayscale opacity-60"} />
                    <span>{label}</span>
                  </div>
                  {active ? (
                    <Image src="/header/active-indicator.svg" alt="active" width={8} height={8} />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 하단 CTA & 프로필 */}
      <div className="mt-auto flex flex-col gap-6 dark:bg-[#101828]">
        {/* CTA 버튼 */}
        <Link
          href="/write"
          className="h-12 flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r
           from-[#A8E0FF] to-[#C5C8FF] dark:from-[#6B8FA3] dark:to-[#7A8FB8]
            text-white px-4 py-4 font-semibold hover:opacity-90 active:scale-[.99] transition"
        >
          <Icon.write />
          <span className="text-[14px]">오늘의 감정 작성</span>
        </Link>

        {/* 구분선 */}
        <hr className="border-t border-gray-200" />

        {/* 프로필 영역 & 테마 토글 */}
        <div className="flex items-center gap-3">
          <Link href="/profile" className="flex-1">
            <div className="flex items-center gap-3 px-1 py-2 rounded-2xl transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-600">
              <div className="h-10 w-10 shrink-0 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
                {userProfile?.image_url && userProfile.image_url.trim() !== "" ? (
                  <Image
                    src={userProfile.image_url}
                    alt={`${userProfile.display_name} 프로필`}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-gray-500" />
                )}
              </div>
              <div className="flex flex-col justify-center ml-2">
                <p className="text-md font-bold text-black leading-tight dark:text-gray-400">
                  {userProfile ? userProfile.display_name : "Unknown"}
                </p>
              </div>
            </div>
          </Link>
          <button
            onClick={() => setIsDark((prev) => !prev)}
            className="p-2 rounded-xl transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            aria-label="Toggle Theme"
          >
            <Sun className="h-6 w-6 hidden dark:block dark:text-gray-400" />
            <Moon className="h-6 w-6 block dark:hidden text-black" />
          </button>
        </div>
      </div>
    </aside>
  );
}
