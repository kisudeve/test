interface Notification {
  id: string;
  type: "like" | "comment" | "follow"; // string 말고 리터럴로 명확히
  post_id: string | null;
  is_read: boolean;
  created_at: string;

  // sender_id로 JOIN된 sender는 하나의 객체임
  sender: Sender;
}

interface Sender {
  id: string;
  display_name: string;
  image_url: string | null;
}
