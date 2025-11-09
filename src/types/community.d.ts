import { Feel, Like, Post, User } from "./database";

type CommunityPost = Post & {
  users: Pick<User, "display_name" | "image_url">;
  feels: Array<Pick<Feel, "type">>;
  likes: Array<Partial<Pick<Like, "post_id" | "user_id">>>;
};

type FeelType = "up" | "down" | "hold";

type FeelBadgeProps = {
  type: FeelType;
  className?: string;
  showIcon?: boolean; // 아이콘 표시 여부
  size?: "sm" | "md" | "lg"; // 크기 옵션
};

type ProfileImageProps = {
  displayName?: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};
