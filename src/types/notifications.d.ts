interface Notification {
  id: string;
  type: "like" | "comment" | "follow"; // string 말고 리터럴로 명확히
  post_id: string | null;
  is_read: boolean;
  created_at: string;
  sender: Sender;
  post: Post | null;
}

interface Sender {
  id: string;
  display_name: string;
  image_url: string | null;
}

interface Post {
  id: string;
  comments: Comments[] | null;
}

interface Comments {
  id: string;
  content: string;
}
