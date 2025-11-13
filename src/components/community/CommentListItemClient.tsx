import { formatRelativeTime } from "@/utils/helpers";
import ProfileImage from "@/components/common/ProfileImage";
import Button from "@/components/common/Button";
import { twMerge } from "tailwind-merge";
import { Heart } from "lucide-react";
import { CommunityComment } from "@/types/community";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { deleteComment } from "@/utils/actions/comment";
import Link from "next/link";

export default function CommentListItemClient({
  comment,
  profileId,
  onEdit,
}: {
  comment: CommunityComment;
  profileId: string | undefined;
  onEdit: (commentId: string) => void;
}) {
  const deleteHandler = async () => {
    await deleteComment(comment.post_id, comment.id, comment.parent_id);
  };

  return (
    <>
      <article key={comment.id}>
        <div className="flex gap-4">
          <Link href={`/profile/${comment.user_id}`}>
            <ProfileImage
              displayName={comment.users.display_name}
              imageUrl={comment.users.image_url}
              size="md"
            />
          </Link>
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between items-baseline">
              <div className="flex items-center gap-2">
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
                    <ConfirmDialog
                      title="댓글 삭제"
                      description="정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                      trigger={<Button variant="delete">삭제</Button>}
                      onConfirm={deleteHandler}
                    />
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
