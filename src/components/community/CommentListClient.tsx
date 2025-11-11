import { CommunityComment } from "@/types/community";
import { User } from "@/types/database";
import CommentListItemClient from "@/components/community/CommentListItemClient";

export default function CommentListClient({
  comments,
  profile,
  editingCommentId,
  onEdit,
}: {
  comments: CommunityComment[] | null;
  profile: User | null;
  editingCommentId: string | null;
  onEdit: (commentId: string) => void;
}) {
  if (!comments) {
    return <p>등록된 댓글이 없습니다.</p>;
  }

  const visibleComments = comments?.filter((comment) => comment.id !== editingCommentId);

  if (visibleComments.length === 0) {
    return (
      <div className="flex justify-center items-center flex-col border-t border-slate-200 mt-7 pt-7 gap-4 text-slate-400">
        <p className="font-medium">등록된 댓글이 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 mt-6">
        {visibleComments?.map((comment) => (
          <CommentListItemClient
            key={comment.id}
            comment={comment}
            profileId={profile?.id}
            onEdit={onEdit}
          />
        ))}
      </div>
    </>
  );
}
