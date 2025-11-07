import { Feel, Like, Post, User } from "./database";

export type CommunityPost = Post & {
  users: Pick<User, "display_name" | "image_url">;
  feels: Array<Pick<Feel, "type">>;
  likes: Array<Partial<Pick<Like, "post_id" | "user_id">>>;
};
