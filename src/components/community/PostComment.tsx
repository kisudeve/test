import Button from "@/components/common/Button";
import ProfileImage from "@/components/common/ProfileImage";
import CommentFormClient from "@/components/community/CommentFormClient";
import { formatRelativeTime } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/server";
import { Heart } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default async function PostComment({ postId }: { postId: string }) {
  const supabase = await createClient();

  const [
    { data: comments, error: commentsError },
    {
      data: { user },
      error: userError,
    },
  ] = await Promise.all([
    supabase
      .from("comments")
      .select("*, users(display_name, image_url)")
      .eq("post_id", postId)
      .order("created_at", { ascending: false }),
    supabase.auth.getUser(),
  ]);

  if (commentsError) {
    console.error(commentsError);
  }
  if (userError) {
    console.error(userError);
  }

  // 프로필 (조건부)
  let profile = null;
  if (user) {
    const { data } = await supabase.from("users").select("*").eq("id", user.id).single();
    profile = data;
  }

  return (
    <section className="m-10 p-10 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white border border-slate-200">
      <div>
        <h3 className="font-semibold text-lg">댓글 {comments?.length ?? "0"}</h3>
        {!user && <p>회원만 댓글 작성 권한이 있습니다.</p>}
        {user && (
          <>
            <div className="flex gap-3">
              <ProfileImage
                displayName={profile?.display_name}
                imageUrl={profile?.image_url}
                size="md"
              />
              <CommentFormClient postId={postId} />
            </div>
          </>
        )}
        {comments?.map((comment) => (
          <article key={comment.id}>
            <div className="flex gap-4">
              <ProfileImage
                displayName={comment.users.display_name}
                imageUrl={comment.users.image_url}
                size="md"
              />
              <div className="flex-1">
                <div className="flex justify-between items-baseline">
                  <div className="flex flex-col gap-0.5">
                    <strong className="text-md font-semibold text-slate-800">
                      {comment.users.display_name}
                    </strong>
                    <span className="text-slate-400 text-xs">
                      {formatRelativeTime(comment.created_at)}
                    </span>
                  </div>
                  {comment.user_id === profile?.id && (
                    <>
                      <div className="flex gap-1">
                        <Button variant="edit">수정</Button>
                        <Button variant="delete">삭제</Button>
                      </div>
                    </>
                  )}
                </div>
                <p>{comment.content}</p>
                <div className="flex gap-2">
                  <Button>
                    <Heart
                      size={18}
                      className={twMerge(
                        "transition-transform active:scale-125 stroke-slate-300 fill-slate-300",
                      )}
                    />
                    0
                  </Button>
                  <Button>답글 1</Button>
                  <Button>답글 달기</Button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
