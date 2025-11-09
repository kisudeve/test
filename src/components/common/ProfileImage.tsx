import { ProfileImageProps } from "@/types/community";
import { twMerge } from "tailwind-merge";

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-15 h-15",
  xl: "w-20 h-20",
};

export default function ProfileImage({
  displayName,
  imageUrl,
  size = "lg",
  className = "",
}: ProfileImageProps) {
  const initial = displayName?.charAt(0).toUpperCase();

  if (!imageUrl) {
    return (
      <div
        aria-label={`${displayName}님의 프로필 이미지`}
        role="img"
        className={twMerge(
          sizeClasses[size],
          "rounded-full bg-linear-to-br from-blue-500 to-purple-600",
          "flex items-center justify-center text-white font-bold",
          className,
        )}
      >
        {initial}
      </div>
    );
  }

  return (
    <div
      aria-label={`${displayName}님의 프로필 이미지`}
      role="img"
      className={twMerge(
        "rounded-full bg-cover bg-center bg-no-repeat",
        sizeClasses[size],
        className,
      )}
      style={{ backgroundImage: `url('${imageUrl}')` }}
    />
  );
}
