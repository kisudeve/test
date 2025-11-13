// components/EmotionIcon.tsx
"use client";

import { DynamicIcon } from "lucide-react/dynamic";
import type { LucideProps } from "lucide-react";
import { twMerge } from "tailwind-merge";

import { emotionToIconName, type EmotionType } from "@/utils/helpers/emotionData";
import { getEmotionColor, getEmotionStroke } from "@/utils/actions/emotionUtils";
import Link from "next/link";

export function EmotionIcon({ emotion, ...props }: { emotion: EmotionType } & LucideProps) {
  const iconName = emotionToIconName[emotion];

  // lucide-react의 IconName 타입 제약으로 인한 우회
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <DynamicIcon name={iconName as any} {...props} />;
}

// 감정 아이콘과 배경색을 함께 사용하는 컴포넌트
export function EmotionBadge({
  emotion,
  className = "",
  iconSize = 20,
  children,
}: {
  emotion: EmotionType;
  className?: string;
  iconSize?: number;
  children?: React.ReactNode;
}) {
  const bgColor = getEmotionColor(emotion);
  const strokeColor = getEmotionStroke(emotion);

  return (
    <>
      <Link
        className={twMerge(
          "flex items-center justify-center w-10 h-10 rounded-xl",
          bgColor,
          strokeColor,
          className,
        )}
        href={"/"} // Todo: 감정별 검색링크
      >
        <EmotionIcon emotion={emotion} size={iconSize} />
      </Link>
      {children}
    </>
  );
}
