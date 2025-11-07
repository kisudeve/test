"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Simple inline SVG icons so we don't add deps
const Icon = {
  logo: ({ className }: { className?: string }) => (
    <div className={"flex items-center justify-center w-full " + (className || "")}>
      <Image
        src="/logo/logo.svg"
        alt="logo"
        width={224}
        height={89}
        className="object-contain"
        priority
      />
    </div>
  ),
  dashboard: ({ className }: { className?: string }) => (
    <div className={" w-6 h-6 flex items-center justify-center " + (className || "")}>
      <Image
        src="/header/dashboard.svg"
        alt="dashboard-icon"
        width={18}
        height={18}
        className="object-contain"
      />
    </div>
  ),
  community: ({ className }: { className?: string }) => (
    <div className={" w-6 h-6 flex items-center justify-center " + (className || "")}>
      <Image
        src="/header/community.svg"
        alt="community-icon"
        width={18}
        height={18}
        className="object-contain"
      />
    </div>
  ),
  search: ({ className }: { className?: string }) => (
    <div className={" w-6 h-6 flex items-center justify-center " + (className || "")}>
      <Image
        src="/header/search.svg"
        alt="search-icon"
        width={18}
        height={18}
        className="object-contain"
      />
    </div>
  ),
  profile: ({ className }: { className?: string }) => (
    <div className={" w-6 h-6 flex items-center justify-center " + (className || "")}>
      <Image
        src="/header/profile.svg"
        alt="profile-icon"
        width={18}
        height={18}
        className="object-contain"
      />
    </div>
  ),
  bell: ({ className }: { className?: string }) => (
    <div className={" w-6 h-6 flex items-center justify-center " + (className || "")}>
      <Image
        src="/header/bell.svg"
        alt="bell-icon"
        width={18}
        height={18}
        className="object-contain"
      />
    </div>
  ),
  write: ({ className }: { className?: string }) => (
    <div className={" w-6 h-6 flex items-center justify-center " + (className || "")}>
      <Image
        src="/header/write.svg"
        alt="write-icon"
        width={18}
        height={18}
        className="object-contain"
      />
    </div>
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
  userInfo?: { name: string; profileImg: string };
  // 오늘의 감정 지수 카드에 보여줄 값
  todayScore?: { value: number; changePct: number };
  className?: string;
}

// 헤더 컴포넌트
// activeKey: 현재 활성화된 메뉴 키
// userName: 사용자 이름
// todayScore: 오늘의 감정 지수 정보
export default function Header({
  activeKey = "dashboard",
  userInfo = { name: "김민준", profileImg: "" },
  todayScore = { value: 1240, changePct: 1.8 },
  className,
}: HeaderProps) {
  const pathname = usePathname();
  const computedActiveKey = React.useMemo(() => {
    const hit = NAV.find((n) => n.href === pathname);
    return hit?.key ?? activeKey;
  }, [pathname, activeKey]);
  return (
    <aside
      className={[
        "fixed top-4 left-4 rounded-2xl bg-white/85 backdrop-blur shadow-md shadow-gray-200/70",
        "w-64",
        "h-[96vh] flex flex-col p-4 gap-4",
        "font-[Paperlogy]",
        "font-semibold",
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
          <span className="font-semibold text-lg tracking-tight sm:hidden">updown</span>
        </Link>
      </div>

      {/* 오늘의 감정 지수 카드 */}
      <section>
        <div className="w-56 rounded-2xl bg-black text-white p-4 shadow-sm">
          <p className="text-[14px] text-gray-300">오늘의 감정 지수</p>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-[30px] font-extrabold tabular-nums tracking-tight">
              {todayScore.value.toLocaleString()}
            </span>
            <span
              className={`inline-flex items-center gap-2 text-[14px] font-semibold ${
                todayScore.changePct >= 0 ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {todayScore.changePct >= 0 ? "+" : ""}
              {todayScore.changePct.toFixed(2)}%
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* trending up arrow */}
                <path d="M3 17l6-6 4 4 7-7" />
                <path d="M17 8h4v4" />
              </svg>
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
                    "group flex items-center justify-between rounded-xl px-3 py-2",
                    active
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-400 transition-colors duration-200 hover:text-gray-600 hover:bg-gray-100",
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
      <div className="mt-auto flex flex-col gap-6">
        {/* CTA 버튼 */}
        <Link
          href="/write"
          className="h-12 flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#A8E0FF] to-[#C5C8FF] text-white px-4 py-4 font-semibold  hover:opacity-90 active:scale-[.99] transition"
        >
          <Icon.write />
          <span className="text-[14px]">오늘의 감정 작성</span>
        </Link>

        {/* 구분선 */}
        <hr className="border-t border-gray-200" />

        {/* 프로필 영역 */}
        <Link href="/profile">
          <div className="flex items-center gap-3 px-1 py-2 rounded-2xl transition-colors duration-200 hover:bg-gray-100">
            <div className="h-10 w-10 shrink-0 rounded-full bg-gray-300 overflow-hidden">
              {userInfo?.profileImg ? (
                <Image
                  src={userInfo.profileImg}
                  alt={`${userInfo.name} 프로필`}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[14px] font-bold text-black leading-tight">{userInfo.name}</p>
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
