"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, TrendingDown, User, Menu, X } from "lucide-react";
import type { Database } from "@/utils/supabase/supabase";
import { twMerge } from "tailwind-merge";
import { useBreakpoint } from "@/hooks/useBreakPoint";
import Button from "./Button";
type Profile = Database["public"]["Tables"]["users"]["Row"];

const Icon = {
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

  const [visible, setVisible] = useState(false);
  const { isMobile, isXl } = useBreakpoint();

  // SSR 프로필을 우선 사용하고, 클라이언트 사이드에서 업데이트되면 그것을 사용
  const userProfile = initialProfile || null;

  const computedActiveKey = React.useMemo(() => {
    for (const n of NAV) {
      if (n.href === "/") {
        if (pathname === "/") return n.key;
      } else {
        if (pathname === n.href || pathname.startsWith(n.href + "/")) return n.key;
      }
    }
    return activeKey;
  }, [pathname, activeKey]);

  // 헤더 렌더링
  const headerHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    setVisible(!visible);
    if (visible) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  };

  // 링크 클릭 시 메뉴 닫기
  const handleLinkClick = () => {
    if (visible) {
      setVisible(false);
      document.body.style.overflow = "auto";
    }
  };

  return (
    <>
      {/* 모바일 헤더 - CSS로 반응형 처리 */}
      <header
        className={twMerge(
          "fixed top-0 left-0 w-full h-18 bg-white/85 backdrop-blur-2xl shadow-sm flex justify-center items-center z-61",
          "xl:hidden", // 데스크탑에서 숨김
          visible && "bg-white",
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className={twMerge("flex items-center justify-center")}
          onClick={handleLinkClick}
        >
          <Image
            src="/logo/logo.svg"
            alt="logo"
            width={98}
            height={39}
            className="object-contain"
            priority
          />
        </Link>
        <Button className="absolute left-6 text-black" onClick={headerHandler}>
          {visible ? <X /> : <Menu />}
        </Button>
      </header>
      <div
        className={twMerge(
          isXl
            ? "pl-4 py-6 sticky top-0 bottom-6 h-dvh w-full min-w-64 max-w-64"
            : "fixed top-0 right-0 bottom-0 left-0 -z-60",
          !isXl && visible && "bg-slate-900/30 backdrop-blur-xs z-60",
          className,
        )}
        onClick={headerHandler}
      >
        <aside
          className={twMerge(
            "h-full flex-col p-4 gap-4 shadow-sm",
            "shrink-0",
            "font-semibold",
            isXl && "flex rounded-lg bg-white/85 backdrop-blur", // 반응형 작업
            !isXl && (visible ? "flex" : "hidden"),
            !isXl && "bg-white w-4/5 min-w-2 max-w-200 pt-25",
            isMobile && "w-full min-w-auto max-w-auto",
          )}
          aria-label="헤더"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Logo - 데스크톱에서만 보이기 */}
          <Link
            href="/"
            className={twMerge("hidden xl:flex items-center justify-center h-[89px]")}
            onClick={handleLinkClick}
          >
            <Image
              src="/logo/logo.svg"
              alt="logo"
              width={144}
              height={57}
              className="object-contain"
              priority
            />
          </Link>

          {/* 오늘의 감정 지수 카드 */}
          <section>
            <div className="w-full rounded-2xl bg-black text-white p-4 shadow-sm">
              <p className="text-[14px] text-gray-300">오늘의 감정 지수</p>
              <div className="mt-3 flex gap-y-0.5 gap-x-3 max-[1215px]:flex-wrap min-[1216px]:flex-nowrap items-end justify-between">
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
                        "group flex items-center justify-between rounded-xl px-3 py-2",
                        active
                          ? "bg-gray-200 text-gray-900"
                          : "text-gray-400 transition-colors duration-200 hover:text-gray-600 hover:bg-gray-100",
                      ].join(" ")}
                      aria-current={active ? "page" : undefined}
                      onClick={handleLinkClick}
                    >
                      <div className="flex items-center gap-3">
                        <I className={active ? "" : "grayscale opacity-60"} />
                        <span>{label}</span>
                      </div>
                      {active ? (
                        <Image
                          src="/header/active-indicator.svg"
                          alt="active"
                          width={8}
                          height={8}
                        />
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
              onClick={handleLinkClick}
            >
              <Icon.write />
              <span className="text-[14px]">오늘의 감정 작성</span>
            </Link>

            {/* 구분선 */}
            <hr className="border-t border-gray-200" />

            {/* 프로필 영역 */}
            <Link href="/profile" onClick={handleLinkClick}>
              <div className="flex items-center gap-3 px-1 py-2 rounded-2xl transition-colors duration-200 hover:bg-gray-100">
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
                <div className="flex flex-col justify-center">
                  <p className="text-[14px] font-bold text-black leading-tight">
                    {userProfile ? userProfile.display_name : "Unknown"}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
