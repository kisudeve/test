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
