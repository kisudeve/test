export type FeelType = "UP" | "DOWN" | "HOLD";

export type User = {
  display_name: string;
  image_url?: string | null;
};

export type CommunityPost = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  comments_count: number;
  likes_count: number;
  likes: { user_id: string }[];
  users: User;
  feels: { type: FeelType }[];
  tags?: string[];
};

export type SearchUser = {
  id: string;
  display_name: string;
  image_url?: string | null;
  bio?: string | null;
};

export type SearchTag = {
  content: string;
  // 태그 사용 횟수 등을 붙이고 싶으면
  // count?: number;
};
