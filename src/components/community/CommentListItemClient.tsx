import { formatRelativeTime } from "@/utils/helpers";
import ProfileImage from "@/components/common/ProfileImage";
import Button from "@/components/common/Button";
import { twMerge } from "tailwind-merge";
import { Heart } from "lucide-react";
import { CommunityComment } from "@/types/community";
import { deleteComment } from "@/utils/actions/comment";

export default function CommentListItemClient({
  comment,
  profileId,
  onEdit,
}: {
  comment: CommunityComment;
  profileId: string | undefined;
  onEdit: (commentId: string) => void;
}) {
  const handleDelete = () => {
    deleteComment(comment.post_id, comment.id, comment.user_id);
  };

  return (
    <>
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
              {comment.user_id === profileId && (
                <>
                  <div className="flex gap-1">
                    <Button variant="edit" onClick={() => onEdit(comment.id)}>
                      수정
                    </Button>
                    <Button variant="delete" onClick={handleDelete}>
                      삭제
                    </Button>
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
              {profileId && <Button>답글 달기</Button>}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
