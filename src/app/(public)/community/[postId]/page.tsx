import PostComment from "@/components/community/PostComment";
import PostDetail from "@/components/community/PostDetail";
import PostCommentSkeleton from "@/components/skeleton/PostCommentSkeleton";
import PostDetailSkeleton from "@/components/skeleton/PostDetailSkeleton";
import { Suspense } from "react";

export default async function Page({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;

  return (
    <>
      <Suspense fallback={<PostDetailSkeleton />}>
        <PostDetail postId={postId} />
      </Suspense>
      <Suspense fallback={<PostCommentSkeleton />}>
        <PostComment postId={postId} />
      </Suspense>
    </>
  );
}
