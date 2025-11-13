import { twMerge } from "tailwind-merge";
import ProfileImage from "../common/ProfileImage";
import Link from "next/link";
import { formatRelativeTime } from "@/utils/helpers";
import Button from "../common/Button";
import { Heart } from "lucide-react";
import ConfirmDialog from "../common/ConfirmDialog";
import { CommunityComment } from "@/types/community";
import { User } from "@/types/database";

export default function CommentChildClient({
  child,
  profile,
  onEdit,
  deleteHandler,
  setIsReplying,
}: {
  child: CommunityComment;
  profile: User | null;
  onEdit: (commentId: string) => void;
  deleteHandler: () => Promise<void>;
  setIsReplying: () => void;
}) {
  const editHandler = () => {
    onEdit(child.id);
    setIsReplying();
  };

  return (
    <li className="relative pl-16 after:w-10 after:h-3 after:absolute after:left-6 after:top-3 after:border-l after:border-b after:rounded-bl-4xl after:border-slate-200 last-of-type:before:absolute last-of-type:before:w-px last-of-type:before:h-[calc(100%-15px)] last-of-type:before:bg-white last-of-type:before:left-6 last-of-type:before:bottom-0">
      <div className="flex gap-4">
        <Link href={`/profile/${child.user_id}`}>
          <ProfileImage
            displayName={child.users.display_name}
            imageUrl={child.users.image_url}
            size="md"
          />
        </Link>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex justify-between items-baseline">
            <div className="flex items-center gap-2">
              <strong className="text-md font-semibold text-slate-800">
                {child.users.display_name}
              </strong>
              <span className="text-slate-400 text-xs">{formatRelativeTime(child.created_at)}</span>
            </div>
            {child.user_id === profile?.id && (
              <>
                <div className="flex gap-1">
                  <Button variant="edit" onClick={editHandler}>
                    수정
                  </Button>
                  <ConfirmDialog
                    title="답글 삭제"
                    description="정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                    trigger={<Button variant="delete">삭제</Button>}
                    onConfirm={deleteHandler}
                  />
                </div>
              </>
            )}
          </div>
          <p>{child.content}</p>
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
          </div>
        </div>
      </div>
    </li>
  );
}
