import { Comment, Feel, Like, Post, User } from "@/types/database";

export type CommunityPost = Post & {
  users: Pick<User, "display_name" | "image_url">;
  feels: Array<Pick<Feel, "type">>;
  likes: Array<Pick<Like, "post_id" | "user_id">>;
  hashtags: Array<{ content: string }>;
};

export type CommunityComment = Comment & {
  users: Pick<User, "display_name" | "image_url">;
};

export type FeelType = "up" | "down" | "hold";

export type FeelBadgeProps = {
  type: FeelType;
  className?: string;
  showIcon?: boolean; // 아이콘 표시 여부
  size?: "sm" | "md" | "lg"; // 크기 옵션
};

export type ProfileImageProps = {
  displayName?: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};
