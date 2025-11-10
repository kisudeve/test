"use client";

import { CommunityComment } from "@/types/community";
import CommentFormClient from "./CommentFormClient";
import CommentListClient from "./CommentListClient";
import { User } from "@/types/database";
import { useEffect, useState } from "react";

export default function PostCommentClient({
  postId,
  initialComments,
  profile,
}: {
  postId: string;
  initialComments: CommunityComment[] | null;
  profile: User | null;
}) {
  const [comments, setComments] = useState<CommunityComment[] | null>(initialComments);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const editingComment = comments?.find((comment) => comment.id === editingCommentId)?.content;

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  return (
    <div>
      <h3 className="font-semibold text-xl mb-6">댓글 {comments?.length}</h3>
      <CommentFormClient
        profile={profile}
        postId={postId}
        editingCommentId={editingCommentId}
        editingComment={editingComment || ""}
        cancelEditing={() => setEditingCommentId(null)}
      />
      <CommentListClient
        comments={initialComments}
        profile={profile}
        editingCommentId={editingCommentId}
        onEdit={(commentId) => setEditingCommentId(commentId)}
      />
    </div>
  );
}
